import { NextRequest, NextResponse } from "next/server";
import type { LiveMetric } from "@/lib/types";

const indicators = [
  { id: "SP.POP.TOTL", label: "Population", unit: "people" },
  { id: "NY.GDP.PCAP.CD", label: "GDP per capita", unit: "current USD" },
  { id: "IT.NET.USER.ZS", label: "Internet users", unit: "% of population" },
  { id: "SP.URB.TOTL.IN.ZS", label: "Urban population", unit: "% of population" },
] as const;

type WorldBankRow = {
  indicator: { id: string; value: string };
  date: string;
  value: number | null;
};

export async function GET(request: NextRequest) {
  const country = (request.nextUrl.searchParams.get("country") ?? "").toUpperCase();
  if (!/^[A-Z]{3}$/.test(country)) {
    return NextResponse.json({ error: "Use a three-letter ISO country code." }, { status: 400 });
  }

  try {
    const metrics = await Promise.all(
      indicators.map(async (indicator): Promise<LiveMetric> => {
        const endpoint = `https://api.worldbank.org/v2/country/${country}/indicator/${indicator.id}?format=json&mrnev=1&per_page=1`;
        const response = await fetch(endpoint, { next: { revalidate: 86400 } });
        if (!response.ok) throw new Error(`World Bank responded ${response.status}`);
        const body = (await response.json()) as [unknown, WorldBankRow[]];
        const row = body?.[1]?.find((item) => item.value !== null);
        if (!row || row.value === null) throw new Error(`No data for ${indicator.id}`);
        return {
          id: indicator.id,
          label: indicator.label,
          value: row.value,
          unit: indicator.unit,
          year: row.date,
          sourceName: "World Bank Indicators API",
          sourceUrl: endpoint,
          mode: "live",
        };
      }),
    );

    return NextResponse.json({ country, fetchedAt: new Date().toISOString(), metrics });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Live data is temporarily unavailable. No fallback number has been substituted.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
