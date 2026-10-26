import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateUnitEconomics, clampRate, formatCurrency, safePercent, scoreMarket, validateMarketInput } from "../lib/market";
import { sampleCosts, sampleInput } from "../lib/demo";

describe("calculateUnitEconomics", () => {
  it("01 calculates the baseline stack", () => {
    const result = calculateUnitEconomics(sampleCosts);
    assert.equal(result.duty, 10.6);
    assert.equal(result.landedCost, 240.6);
    assert.equal(result.variableCost, 385.83);
    assert.equal(result.contribution, 113.17);
    assert.equal(result.contributionMargin, 22.7);
  });

  it("02 supports zero duty", () => {
    assert.equal(calculateUnitEconomics({ ...sampleCosts, dutyRate: 0 }).duty, 0);
  });

  it("03 applies duty to EXW cost", () => {
    assert.equal(calculateUnitEconomics({ ...sampleCosts, dutyRate: 10 }).duty, 21.2);
  });

  it("04 applies payment fee to retail price", () => {
    assert.equal(calculateUnitEconomics({ ...sampleCosts, paymentRate: 10 }).paymentFee, 49.9);
  });

  it("05 applies marketplace fee to retail price", () => {
    assert.equal(calculateUnitEconomics({ ...sampleCosts, marketplaceRate: 10 }).marketplaceFee, 49.9);
  });

  it("06 applies marketing rate to retail price", () => {
    assert.equal(calculateUnitEconomics({ ...sampleCosts, marketingRate: 10 }).marketing, 49.9);
  });

  it("07 applies returns reserve to retail price", () => {
    assert.equal(calculateUnitEconomics({ ...sampleCosts, returnsRate: 10 }).returnsReserve, 49.9);
  });

  it("08 handles zero retail price without non-finite margin", () => {
    const result = calculateUnitEconomics({ ...sampleCosts, retailPrice: 0 });
    assert.equal(result.contributionMargin, 0);
    assert.equal(Number.isFinite(result.contributionMargin), true);
  });

  it("09 returns null break-even for negative contribution", () => {
    assert.equal(calculateUnitEconomics({ ...sampleCosts, retailPrice: 100 }).breakEvenUnits, null);
  });

  it("10 rounds positive break-even units upward", () => {
    assert.equal(calculateUnitEconomics(sampleCosts).breakEvenUnits, 89);
  });
});

describe("formatting and boundaries", () => {
  it("11 formats a currency value", () => {
    assert.match(formatCurrency(499, "USD"), /499/);
  });

  it("12 formats a finite percentage", () => {
    assert.equal(safePercent(22.94), "22.9%");
  });

  it("13 protects against non-finite percentages", () => {
    assert.equal(safePercent(Number.POSITIVE_INFINITY), "0.0%");
  });

  it("14 clamps a negative rate", () => {
    assert.equal(clampRate(-1), 0);
  });

  it("15 clamps a rate above 100", () => {
    assert.equal(clampRate(101), 100);
  });

  it("16 preserves a normal rate", () => {
    assert.equal(clampRate(12.5), 12.5);
  });
});

describe("market brief validation", () => {
  it("17 rejects an empty product", () => {
    assert.ok(validateMarketInput({ ...sampleInput, product: "" }).includes("product_required"));
  });

  it("18 rejects an empty category", () => {
    assert.ok(validateMarketInput({ ...sampleInput, category: "" }).includes("category_required"));
  });

  it("19 rejects an empty origin", () => {
    assert.ok(validateMarketInput({ ...sampleInput, originCountry: "" }).includes("origin_required"));
  });

  it("20 rejects an empty target", () => {
    assert.ok(validateMarketInput({ ...sampleInput, targetCountry: "" }).includes("target_required"));
  });

  it("21 rejects a short ISO3 code", () => {
    assert.ok(validateMarketInput({ ...sampleInput, targetCountryCode: "MY" }).includes("iso3_invalid"));
  });

  it("22 rejects a lowercase ISO3 code", () => {
    assert.ok(validateMarketInput({ ...sampleInput, targetCountryCode: "mys" }).includes("iso3_invalid"));
  });

  it("23 rejects a zero target price", () => {
    assert.ok(validateMarketInput({ ...sampleInput, targetRetailPrice: 0 }).includes("price_invalid"));
  });

  it("24 rejects a missing objective", () => {
    assert.ok(validateMarketInput({ ...sampleInput, objective: " " }).includes("objective_required"));
  });

  it("25 accepts the complete sample brief", () => {
    assert.deepEqual(validateMarketInput(sampleInput), []);
  });
});

describe("market scoring", () => {
  it("26 calculates the weighted score", () => {
    assert.equal(scoreMarket({ demand: 7, competition: 6, margin: 5, execution: 7, evidence: 4 }), 60);
  });

  it("27 caps the score at 100", () => {
    assert.equal(scoreMarket({ demand: 20, competition: 20, margin: 20, execution: 20, evidence: 20 }), 100);
  });

  it("28 floors the score at zero", () => {
    assert.equal(scoreMarket({ demand: -10, competition: -10, margin: -10, execution: -10, evidence: -10 }), 0);
  });
});
