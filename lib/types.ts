export type DataMode = "example" | "live" | "ai-assisted";

export type MarketInput = {
  product: string;
  category: string;
  originCountry: string;
  targetCountry: string;
  targetCountryCode: string;
  currency: "USD" | "CNY" | "MYR" | "SGD" | "EUR";
  targetRetailPrice: number;
  objective: string;
  channel: "marketplace" | "distributor" | "retail" | "hybrid";
};

export type CostInputs = {
  exWorks: number;
  freight: number;
  dutyRate: number;
  paymentRate: number;
  marketplaceRate: number;
  marketingRate: number;
  returnsRate: number;
  localOps: number;
  retailPrice: number;
};

export type UnitEconomics = {
  duty: number;
  paymentFee: number;
  marketplaceFee: number;
  marketing: number;
  returnsReserve: number;
  landedCost: number;
  variableCost: number;
  contribution: number;
  contributionMargin: number;
  breakEvenUnits: number | null;
};

export type LiveMetric = {
  id: string;
  label: string;
  value: number;
  unit: string;
  year: string;
  sourceName: string;
  sourceUrl: string;
  mode: "live";
};

export type AnalysisRecommendation = {
  decision: "GO" | "CONDITIONAL GO" | "NO-GO";
  confidence: number;
  executiveSummary: string;
  keyRisks: string[];
  nextActions: string[];
  evidenceGaps: string[];
};
