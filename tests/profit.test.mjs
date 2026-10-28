import { test } from "node:test";
import assert from "node:assert/strict";
import {
  defaults as d,
  calculate as c,
  validate,
  encodeProject,
  decodeProject,
  csvCell,
  diagnostic,
} from "../public/profit/engine.mjs";
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} != ${b}`);
test("independent hand calculation", () => {
  const r = c({
    ...d,
    price: 100,
    discount: 0,
    returns: 0,
    tax: 0,
    fee: 10,
    adRate: 5,
    cost: 20,
    freight: 0,
    fx: 1,
    fulfilment: 5,
    cac: 10,
    fixed: 100,
    units: 10,
  });
  near(r.net, 100);
  near(r.contribution, 50);
  near(r.total, 400);
  assert.equal(r.breakUnits, 2);
  near(r.breakPrice, 35 / 0.85);
});
for (const [k, v] of [
  ["price", -1],
  ["fx", 0],
  ["cost", NaN],
  ["units", Infinity],
  ["units", 1.2],
  ["discount", 100],
  ["returns", 100],
  ["fee", 100],
  ["adRate", 100],
  ["target", 100],
  ["tax", 101],
  ["cac", -1],
])
  test("reject " + k + " " + v, () => assert.throws(() => c({ ...d, [k]: v })));
test("same currency requires fx=1", () =>
  assert.throws(() => c({ ...d, currency: "CNY" })));
test("zero sales loses fixed budget", () =>
  near(c({ ...d, units: 0 }).total, -d.fixed));
test("zero price no margin", () =>
  assert.equal(c({ ...d, price: 0 }).margin, null));
test("negative contribution cannot break even", () =>
  assert.equal(c({ ...d, cac: 10000 }).breakUnits, null));
test("impossible fee structure no finite price", () =>
  assert.equal(c({ ...d, returns: 90, fee: 80 }).breakPrice, null));
test("impossible target no finite solution", () =>
  assert.equal(c({ ...d, target: 99 }).targetPrice, null));
test("price solved hits zero contribution", () => {
  const r = c(d);
  near(c({ ...d, price: r.breakPrice }).contribution, 0);
});
test("target solved hits requested margin", () =>
  near(c({ ...d, price: c(d).targetPrice }).margin, d.target));
test("CAC ceiling hits zero", () =>
  near(c({ ...d, cac: c(d).maxCac }).contribution, 0));
test("fx translates sourcing only", () => near(c({ ...d, fx: 2 }).landed, 126));
test("higher advertising lowers profit", () =>
  assert.ok(c({ ...d, cac: 30 }).contribution < c(d).contribution));
test("refund affects revenue and handling", () => {
  const a = c({ ...d, returns: 0 }),
    b = c({ ...d, returns: 10 });
  near(a.net - b.net, (a.paid * 0.1) / 1.06);
  near(b.returnLoss, 1.2);
});
test("discount ceiling hits zero", () =>
  near(c({ ...d, discount: c(d).discountLimit }).contribution, 0));
test("save/load roundtrip", () =>
  assert.deepEqual(decodeProject(encodeProject(d)), d));
test("bad JSON rejected", () => assert.throws(() => decodeProject("{")));
test("old schema rejected", () =>
  assert.throws(() => decodeProject('{"version":1}')));
test("missing values rejected", () =>
  assert.throws(() => decodeProject('{"version":2,"project":{}}')));
test("CSV quoting", () => assert.equal(csvCell('a,"b'), '"a,""b"'));
test("CSV spreadsheet injection neutralized", () =>
  assert.equal(csvCell("=1+2"), '"\'=1+2"'));
test("loss diagnostic pauses", () =>
  assert.match(
    diagnostic({ ...d, cac: 9999 }, c({ ...d, cac: 9999 }))[0],
    /暂停/,
  ));
test("product name reflected", () =>
  assert.match(diagnostic({ ...d, name: "洗发水" }, c(d))[0], /洗发水/));
