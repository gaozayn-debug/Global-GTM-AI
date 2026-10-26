import { parseRecommendation } from "@/lib/ai-response";
import { NextRequest, NextResponse } from "next/server";
import { validateMarketInput } from "@/lib/market";
import type { MarketInput } from "@/lib/types";

const schema = {
  type: "object",
  properties: {
    decision: { type: "string", enum: ["GO", "CONDITIONAL GO", "NO-GO"] },
    confidence: { type: "number", minimum: 0, maximum: 100 },
    executiveSummary: { type: "string" },
    keyRisks: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
    nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
    evidenceGaps: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
  },
  required: ["decision", "confidence", "executiveSummary", "keyRisks", "nextActions", "evidenceGaps"],
  additionalProperties: false,
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  if (!apiKey || !model) {
    return NextResponse.json(
      { error: "AI mode is not configured. Add OPENAI_API_KEY and OPENAI_MODEL on the server." },
      { status: 503 },
    );
  }

  let raw: unknown;
  try { raw = await request.json(); } catch { return NextResponse.json({error:"Invalid JSON"},{status:400}); }
  if(!raw || typeof raw!=="object") return NextResponse.json({error:"Invalid body"},{status:400});
  const body = raw as { input?: Partial<MarketInput>; evidence?: unknown };
  const errors = validateMarketInput(body.input ?? {});
  if (errors.length) return NextResponse.json({ error: "Invalid market brief", fields: errors }, { status: 400 });

  const input = body.input as MarketInput;
  try {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    signal: AbortSignal.timeout(20000),
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      store: false,
      instructions:
        "You are a cautious cross-border GTM analyst. Use only the evidence supplied. Never invent market sizes, prices, tariffs, or competitor facts. State evidence gaps. Recommendations require human approval.",
      input: `Market brief:\n${JSON.stringify(input)}\n\nVerified evidence:\n${JSON.stringify(body.evidence ?? [])}`,
      text: {
        format: { type: "json_schema", name: "gtm_recommendation", strict: true, schema },
      },
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "AI analysis failed" }, { status: 502 });
  }

  const result: unknown = await response.json();

  try {
    return NextResponse.json({
      recommendation: parseRecommendation(result),
      meta: { mode: "ai-assisted", model, generatedAt: new Date().toISOString(), humanReviewRequired: true },
    });
  } catch {
    return NextResponse.json({ error: "AI output could not be parsed" }, { status: 502 });
  }
  } catch { return NextResponse.json({error:"AI unavailable or timed out"},{status:502}); }
}
