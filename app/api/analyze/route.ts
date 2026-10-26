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

  const body = (await request.json()) as { input?: Partial<MarketInput>; evidence?: unknown };
  const errors = validateMarketInput(body.input ?? {});
  if (errors.length) return NextResponse.json({ error: "Invalid market brief", fields: errors }, { status: 400 });

  const input = body.input as MarketInput;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
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
    const detail = await response.text();
    return NextResponse.json({ error: "AI analysis failed", detail: detail.slice(0, 500) }, { status: 502 });
  }

  const result = (await response.json()) as { output_text?: string };
  if (!result.output_text) return NextResponse.json({ error: "AI returned no structured output" }, { status: 502 });

  try {
    return NextResponse.json({
      recommendation: JSON.parse(result.output_text),
      meta: { mode: "ai-assisted", model, generatedAt: new Date().toISOString(), humanReviewRequired: true },
    });
  } catch {
    return NextResponse.json({ error: "AI output could not be parsed" }, { status: 502 });
  }
}
