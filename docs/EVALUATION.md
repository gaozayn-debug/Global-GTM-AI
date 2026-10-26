# Evaluation Framework & Test Cases / 评估体系与测试案例

## 1. Evaluation dimensions / 评估维度

| Dimension | Weight | Passing bar | Failure example |
| --- | ---: | --- | --- |
| Groundedness / 有据可查 | 25% | All factual claims trace to supplied evidence | Invented market size or tariff |
| Commercial usefulness / 商业价值 | 20% | Clear decision, economics, gates and next actions | Generic “do more research” |
| Calculation correctness / 计算正确 | 20% | Deterministic outputs match independent calculations | Fee applied to wrong base |
| Uncertainty honesty / 不确定性 | 15% | Examples, live data, proposals and gaps remain separate | Failed API replaced with plausible number |
| Safety & governance / 安全治理 | 10% | Secret stays server-side; export needs review | Client-exposed API key |
| UX clarity / 易用性 | 10% | A first-time user can complete the flow | Hidden provenance or unusable mobile form |

Overall MVP pass: **≥ 80/100 with zero critical groundedness or secret-handling failures.**

## 2. Automated cases / 自动化测试（implemented）

| # | Case | Expected |
| ---: | --- | --- |
| 01 | Baseline cost stack | Correct duty, landed cost, contribution and margin |
| 02 | Zero duty | Duty equals zero |
| 03 | 10% duty | Duty is calculated on EXW only |
| 04 | Payment fee | Fee is calculated on retail price |
| 05 | Marketplace fee | Fee is calculated on retail price |
| 06 | Marketing rate | Spend is calculated on retail price |
| 07 | Returns reserve | Reserve is calculated on retail price |
| 08 | Zero retail price | No `NaN` or `Infinity` |
| 09 | Negative contribution | Break-even is null |
| 10 | Positive contribution | Break-even rounds up |
| 11 | Currency formatting | Valid localized currency string |
| 12 | Safe percent finite | One decimal and `%` |
| 13 | Safe percent non-finite | Returns `0.0%` |
| 14 | Clamp negative rate | Returns zero |
| 15 | Clamp >100 rate | Returns 100 |
| 16 | Clamp normal rate | Preserves value |
| 17 | Empty product | `product_required` |
| 18 | Empty category | `category_required` |
| 19 | Empty origin | `origin_required` |
| 20 | Empty target | `target_required` |
| 21 | Invalid ISO3 | `iso3_invalid` |
| 22 | Lowercase ISO3 | Invalid until normalized by UI |
| 23 | Zero price | `price_invalid` |
| 24 | Missing objective | `objective_required` |
| 25 | Valid sample brief | No validation errors |
| 26 | Weighted market score | Expected weighted value |
| 27 | Score upper bound | Never exceeds 100 |
| 28 | Score lower bound | Never below zero |
| 29 | Source register URLs | All use HTTPS |
| 30 | Source coverage | Contains World Bank, UN Comtrade, WTO and UNSD |
| 31 | Competitor provenance | Every row has evidence text |
| 32 | Target offer disclosure | Explicitly says proposed, not observed |

Run with `npm test` using Node.js's built-in test runner. Test results must be reported from the command output, never pre-filled as passing.

## 3. Manual UX cases / 人工体验测试

| # | Scenario | Pass criteria |
| ---: | --- | --- |
| M01 | Desktop first load | No layout shift that blocks interaction; example mode visible |
| M02 | Navigate all six views | Every view renders without runtime error |
| M03 | Switch language | Navigation and key instructions change; inputs persist |
| M04 | Fetch valid MYS data | Four cards show source and year or honest source error |
| M05 | Fetch invalid code | Input validation prevents normal progression / API returns 400 |
| M06 | Change EXW and fees | Contribution updates immediately |
| M07 | Remove AI config | Friendly 503 explanation; workflow still usable |
| M08 | AI success | Output matches schema and shows AI-assisted badge |
| M09 | Export before review | Button disabled |
| M10 | Review and export | Markdown downloads with disclosure and gaps |
| M11 | 375px viewport | Forms remain operable; table scrolls horizontally |
| M12 | Keyboard-only pass | Focusable controls reachable in logical order |

## 4. AI rubric / AI 输出评分规则

For each golden brief, a reviewer scores 0–2 on five checks:

1. **Evidence fidelity:** no unsupported factual claim.
2. **Decision quality:** clear GO / CONDITIONAL GO / NO-GO logic.
3. **Risk specificity:** risks are causal and testable.
4. **Actionability:** next actions name an owner/evidence/outcome.
5. **Gap honesty:** missing compliance, tariff and competitor evidence remains open.

Pass threshold: 8/10, with evidence fidelity required to score 2. A score of 0 on evidence fidelity is an automatic fail.

## 5. Production evaluation set / 生产化评估集

Create at least 30 frozen briefs across consumer electronics, FMCG, marketplace seller, distributor and retail-entry scenarios. Include adversarial cases: contradictory evidence, stale years, missing prices, zero/negative margin, prompt injection inside a source note, unsupported “market leader” claims and requests for legal conclusions. Version prompts, schemas, model IDs and human labels with every run.
