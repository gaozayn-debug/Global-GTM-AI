# Executed Test Results / 实际测试结果

**Execution date:** 2026-10-27  
**Environment:** Node.js 20.17.0, npm 10.8.2  
**Scope:** MVP source state included in this repository

## Automated verification

| Check | Command | Result |
| --- | --- | --- |
| Deterministic/content tests | `npm test` | **PASS — 32/32 tests, 0 failed** |
| TypeScript | `npm run typecheck` | **PASS** |
| Production build | `npm run build` | **PASS** |
| Production dependency audit | `npm audit --omit=dev` | **PASS — 0 known vulnerabilities** |

The build produced the static application page plus dynamic `/api/analyze` and `/api/market-data` routes.

## Browser QA

| Scenario | Result | Evidence observed |
| --- | --- | --- |
| Six-step navigation | PASS | All six headings rendered without runtime error |
| English/Chinese toggle | PASS | Report heading switched in both directions without state loss |
| Example disclosure | PASS | Example and proposed badges visible in relevant views |
| Failed live source | PASS | World Bank returned upstream HTTP 502 during QA; UI showed unavailable and inserted no number |
| Human review gate | PASS | Export button disabled before review and enabled after checkbox |
| Responsive small viewport | PASS | 558px browser viewport used compact top navigation and single-column cards |

## API boundary QA

- Missing OpenAI configuration returns an explicit 503; the example workflow remains available.
- Invalid market-data country codes return 400 before an external request.
- The live-source failure response contains no substituted value.

## Important interpretation

These results verify software behavior; they do **not** claim that illustrative competitor prices, cost assumptions or the Malaysia launch recommendation are current market facts. A real decision requires the evidence gates listed in `DATA-SOURCES.md`.
