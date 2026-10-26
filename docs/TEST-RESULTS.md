# Actual test results / 实际测试

Executed in the Work cloud container on 2026-10-27 (Asia/Shanghai).

- `npm test`: 72 passed, 0 failed. 32 are legacy regression tests; 34 are new V2 profit model/codec tests; 6 test REST output parsing with fixtures.
- `npm run typecheck`: passed.
- `npm run build`: passed for Next.js 16.4.3, React 19.3.1, TypeScript 7.0.2.
- A failing discount-threshold test exposed a missing discount factor; corrected and reran all new model checks successfully.

## Browser acceptance / 浏览器
Actual cloud Chrome interactions against the managed preview:
1. Initial electronic scenario rendered all metrics: contribution 30.58 MYR, break-even 99 orders.
2. Price changed 129 → 50: contribution −27.68 MYR, total −11,303.77 MYR, pause decision.
3. Browser reload restored price 50 rather than overwriting with defaults.
4. FMCG scenario changed product, market, FX, costs and results: 0.09 PHP contribution and overall loss at 200 orders.
5. Changing currency to USD cleared FX, cleared stale results and disabled downloads.
6. Alternative channel fee changed to 30%: contribution changed to 2.52 MYR and recommendation changed to current channel.
7. JSON export produced an actual browser download.
8. Exported JSON reimported after price modification: restored 129, positive results and alternative fee 30%.

9. TXT report and CSV detail exports both produced actual downloaded nonempty files; CSV contained model metrics.

## Limits
Mobile CSS exists but no real-device usability test. No live OpenAI request, current exchange-rate retrieval, platform-rate verification, real demand study or paid test has been completed. Pure model tests do not establish business success.
