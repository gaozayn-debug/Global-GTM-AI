import type { CostInputs, MarketInput } from "./types";

export const sampleInput: MarketInput = {
  product: "Portable Power Station 512Wh",
  category: "Consumer energy / 户外储能",
  originCountry: "China",
  targetCountry: "Malaysia",
  targetCountryCode: "MYS",
  currency: "USD",
  targetRetailPrice: 499,
  objective: "Validate a 90-day marketplace-first launch with a local distributor option.",
  channel: "hybrid",
};

export const sampleCosts: CostInputs = {
  exWorks: 212,
  freight: 18,
  dutyRate: 5,
  paymentRate: 2.9,
  marketplaceRate: 9,
  marketingRate: 12,
  returnsRate: 3,
  localOps: 11,
  retailPrice: 499,
};

export const sampleCompetitors = [
  {
    name: "EcoFlow RIVER 2 Max",
    price: "$469–549",
    power: "512Wh / 500W",
    channel: "Marketplace + DTC",
    strength: "Brand trust, fast charging",
    gap: "Premium price",
    evidence: "Illustrative desk-research placeholder",
  },
  {
    name: "BLUETTI AC70",
    price: "$549–649",
    power: "768Wh / 1000W",
    channel: "Marketplace + reseller",
    strength: "Higher output",
    gap: "Heavier form factor",
    evidence: "Illustrative desk-research placeholder",
  },
  {
    name: "Jackery Explorer 500",
    price: "$399–499",
    power: "518Wh / 500W",
    channel: "Retail + marketplace",
    strength: "Simple proposition",
    gap: "Legacy charging speed",
    evidence: "Illustrative desk-research placeholder",
  },
  {
    name: "Target offer",
    price: "$499",
    power: "512Wh / 700W",
    channel: "Shopee + distributor",
    strength: "Local warranty + value",
    gap: "New market entrant",
    evidence: "Proposed positioning — not observed data",
  },
];

export const trustedSources = [
  {
    name: "World Bank Indicators API",
    use: "Population, GDP per capita, internet usage, urbanization",
    access: "Live in MVP; no API key required",
    url: "https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation",
  },
  {
    name: "UN Comtrade",
    use: "Category import value, partner share, trade trend",
    access: "Planned connector; account and limits may apply",
    url: "https://comtradeplus.un.org/",
  },
  {
    name: "WTO Tariff Download Facility",
    use: "MFN applied and bound tariff checks by HS6",
    access: "Manual evidence review in MVP",
    url: "https://www.wto.org/english/tratop_e/tariffs_e/database_explanation_e.htm",
  },
  {
    name: "UNSD HS 2022 Classification",
    use: "HS-code definition and version control",
    access: "Reference taxonomy",
    url: "https://unstats.un.org/unsd/classifications/Econ",
  },
];
