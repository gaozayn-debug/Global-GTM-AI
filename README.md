# GlobalGTM AI V2 · 出海利润实验室

**这款产品出海卖，究竟赚不赚钱？** 输入成本、定价和渠道假设，得到真实可复算的贡献利润、CAC 上限、保本价与预算回本订单数。

Test cross-border unit economics before committing a pilot budget. Chinese-first with bilingual fields/metrics and an English quick guide.

## 30 秒体验
1. 点击消费电子或快消演示（所有示例参数均为虚构假设）。
2. 改标价、采购成本、汇率、退款或 CAC；结果立即改变。
3. 比较自定义渠道，下载 TXT 报告、明细 CSV 或 JSON 项目。

消费电子默认每单贡献约 30.58 MYR，99 单覆盖 3000 MYR 固定预算。标价改为 50 MYR，每单亏损约 27.68 MYR，建议暂停上架。正利润仅代表假设下经济可行，不代表市场需求。

## Run / Test
```sh
npm ci
npm test
npm run typecheck
npm run build
```
Next root embeds the same standalone app in `public/profit/`. Publish that folder for serverless static hosting; no key, external requests or owner's computer needed. Local dev is optional via `npm run dev`.

## What is real
Pure deterministic equations, live edits, input validation, FX translation, two-channel comparison, downloads, JSON import and browser-local draft recovery. No dummy action buttons, static competitors or fabricated confidence scores in V2.

## Boundaries
No demand forecasting, live marketplace rates, live currency feed, batch SKU import, cloud project sync or generative AI in the main flow. Report guidance currently Chinese; metrics/fields bilingual. Simplified tax/refund model is documented on page and in [data/model notes](docs/DATA-SOURCES.md). Legacy APIs and tests remain for regression; the AI parser is fixed but no live model request has been verified.

[PRD](docs/PRD.md) · [Acceptance](docs/USER-STORIES.md) · [Architecture](docs/ARCHITECTURE.md) · [Evaluation](docs/EVALUATION.md) · [Test results](docs/TEST-RESULTS.md) · [Deployment](docs/DEPLOYMENT.md) · [Interview](docs/INTERVIEW-DEMO.md)
