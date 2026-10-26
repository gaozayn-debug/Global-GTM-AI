import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { sampleCompetitors, trustedSources } from "../lib/demo";

describe("source and example integrity", () => {
  it("29 uses HTTPS for every source", () => {
    assert.equal(trustedSources.every((source) => source.url.startsWith("https://")), true);
  });

  it("30 covers the four declared official source families", () => {
    const names = trustedSources.map((source) => source.name).join(" ");
    assert.match(names, /World Bank/);
    assert.match(names, /UN Comtrade/);
    assert.match(names, /WTO/);
    assert.match(names, /UNSD/);
  });

  it("31 gives every competitor row provenance text", () => {
    assert.equal(sampleCompetitors.every((competitor) => competitor.evidence.length > 10), true);
  });

  it("32 marks the target offer as proposed rather than observed", () => {
    const target = sampleCompetitors.find((competitor) => competitor.name === "Target offer");
    assert.match(target?.evidence.toLowerCase() ?? "", /proposed/);
    assert.match(target?.evidence.toLowerCase() ?? "", /not observed/);
  });
});
