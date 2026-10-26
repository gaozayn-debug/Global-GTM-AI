import type { CostInputs, MarketInput, UnitEconomics } from "./types";

const round = (value: number, precision = 2) => {
  const factor = 10 ** precision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

export function calculateUnitEconomics(input: CostInputs): UnitEconomics {
  const duty = input.exWorks * (input.dutyRate / 100);
  const paymentFee = input.retailPrice * (input.paymentRate / 100);
  const marketplaceFee = input.retailPrice * (input.marketplaceRate / 100);
  const marketing = input.retailPrice * (input.marketingRate / 100);
  const returnsReserve = input.retailPrice * (input.returnsRate / 100);
  const landedCost = input.exWorks + input.freight + duty;
  const variableCost =
    landedCost +
    paymentFee +
    marketplaceFee +
    marketing +
    returnsReserve +
    input.localOps;
  const contribution = input.retailPrice - variableCost;
  const contributionMargin = input.retailPrice > 0 ? (contribution / input.retailPrice) * 100 : 0;

  return {
    duty: round(duty),
    paymentFee: round(paymentFee),
    marketplaceFee: round(marketplaceFee),
    marketing: round(marketing),
    returnsReserve: round(returnsReserve),
    landedCost: round(landedCost),
    variableCost: round(variableCost),
    contribution: round(contribution),
    contributionMargin: round(contributionMargin, 1),
    breakEvenUnits: contribution > 0 ? Math.ceil(10000 / contribution) : null,
  };
}

export function validateMarketInput(input: Partial<MarketInput>): string[] {
  const errors: string[] = [];
  if (!input.product?.trim()) errors.push("product_required");
  if (!input.category?.trim()) errors.push("category_required");
  if (!input.originCountry?.trim()) errors.push("origin_required");
  if (!input.targetCountry?.trim()) errors.push("target_required");
  if (!/^[A-Z]{3}$/.test(input.targetCountryCode ?? "")) errors.push("iso3_invalid");
  if (!input.targetRetailPrice || input.targetRetailPrice <= 0) errors.push("price_invalid");
  if (!input.objective?.trim()) errors.push("objective_required");
  return errors;
}

export function scoreMarket(inputs: {
  demand: number;
  competition: number;
  margin: number;
  execution: number;
  evidence: number;
}) {
  const weighted =
    inputs.demand * 0.28 +
    inputs.competition * 0.18 +
    inputs.margin * 0.24 +
    inputs.execution * 0.18 +
    inputs.evidence * 0.12;
  return Math.max(0, Math.min(100, Math.round(weighted * 10)));
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function safePercent(value: number) {
  if (!Number.isFinite(value)) return "0.0%";
  return `${round(value, 1).toFixed(1)}%`;
}

export function clampRate(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}
