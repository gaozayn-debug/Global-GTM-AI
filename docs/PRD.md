# GlobalGTM AI — Product Requirements Document / 产品需求文档

**Version / 版本:** 0.1 MVP  
**Status / 状态:** Implemented MVP / 第一版已实现  
**Primary user / 核心用户:** Cross-border KA/BD analyst, category manager, management trainee / 出海 KA、BD、品类经理与管培生  
**North-star task / 核心任务:** Turn an ambiguous market-entry question into an evidence-backed, reviewable decision memo in under 20 minutes. / 在 20 分钟内，将模糊的市场进入问题转化为有证据、可审核的决策报告。

## 1. Problem / 问题

**EN.** Junior commercial teams often start market-entry work in disconnected spreadsheets, browser tabs and generic chat tools. Assumptions become indistinguishable from facts, unit economics are hard to audit, and an attractive AI narrative can outrun its evidence.

**中文。** 初级商业团队经常在分散的表格、网页标签和通用聊天工具中开展市场进入分析。假设与事实容易混在一起，利润模型难以复核，AI 生成的漂亮叙事也可能超过证据本身。

## 2. Product thesis / 产品假设

**EN.** A structured workflow that visibly separates live facts, examples, hypotheses and proposals will produce more defensible decisions than a free-form chatbot. AI should synthesize verified evidence, not manufacture missing research.

**中文。** 相比自由对话机器人，明确区分实时事实、示例、假设和建议的结构化工作流，更能产出经得起追问的商业判断。AI 的职责是综合已核实的证据，而不是补写不存在的调研。

## 3. Goals and non-goals / 目标与非目标

### Goals / 目标

1. Capture a falsifiable market-entry brief. / 收集可证伪的市场进入问题。
2. Retrieve source-linked public macro indicators. / 获取带来源链接的公开宏观指标。
3. Structure competitor observations and evidence gaps. / 结构化竞品观察和证据缺口。
4. Calculate inspectable unit economics. / 计算可检查的单品经济模型。
5. Recommend a gated 90-day entry sequence. / 给出带决策门槛的 90 天进入路径。
6. Require human review before export. / 报告导出前必须人工审核。
7. Work without an API key in example mode. / 在无 API 密钥时仍可完整演示。

### Non-goals / 非目标

- Autonomous purchasing, pricing or distributor contracting. / 不自动采购、定价或签约经销商。
- Legal, tax, customs or safety certification advice. / 不提供法律、税务、海关或安全认证意见。
- Claiming real-time market size from model knowledge. / 不从模型记忆中声称实时市场规模。
- Scraping protected marketplaces or bypassing access controls. / 不抓取受保护平台，不绕过访问限制。
- Multi-tenant authentication, billing and production data warehouse in MVP. / MVP 不实现多租户、计费和生产级数仓。

## 4. Personas and jobs-to-be-done / 用户与任务

| Persona / 用户 | Job / 要完成的任务 | Pain / 痛点 | Success / 成功标准 |
| --- | --- | --- | --- |
| KA/BD candidate | Explain a market-entry recommendation in an interview | Generic frameworks lack numbers and evidence | A 5-minute story with trade-offs and audit trail |
| Category analyst | Screen a new product-market pair | Research is scattered | One reviewable decision memo |
| Manager | Challenge assumptions before approving a pilot | AI output hides uncertainty | Visible evidence gates and stop rules |
| Future data operator | Add reliable connectors | Sources have different freshness and limits | Typed source adapter with provenance |

## 5. Core journey / 核心流程

1. **Market brief / 市场输入:** Product, origin, target country, price, channel and decision objective.
2. **Research / 市场研究:** Load public indicators; separate live observations from hypotheses.
3. **Competitors / 竞品矩阵:** Compare offer, price, capacity, channel, edge and gap; each row carries evidence status.
4. **Economics / 成本定价:** Edit EXW, freight, duty, fees, launch marketing, returns and local operations.
5. **Strategy / 进入策略:** Review 0–30, 31–60 and 61–90 day phases with gates and stop rules.
6. **Decision memo / 分析报告:** See conditional decision, confidence, risks and open evidence; approve before export.

## 6. Functional requirements / 功能需求

| ID | Requirement / 需求 | MVP behavior / 第一版行为 |
| --- | --- | --- |
| FR-01 | Bilingual UI / 中英切换 | User can switch EN/中 without losing state |
| FR-02 | Draft persistence / 草稿保存 | Brief and cost assumptions save to browser localStorage |
| FR-03 | Input validation / 输入校验 | Required text, positive price and ISO3 code validated |
| FR-04 | Live macro data / 实时宏观数据 | Server fetches latest non-empty World Bank observations |
| FR-05 | Honest failure / 诚实失败 | A failed source shows unavailable; no numerical fallback |
| FR-06 | Competitor matrix / 竞品矩阵 | Example rows remain labelled illustrative |
| FR-07 | Unit economics / 单品经济 | All fee assumptions editable; margin updates immediately |
| FR-08 | AI review / AI 审核 | Optional server-only key, structured JSON response, supplied evidence only |
| FR-09 | Human approval / 人工审核 | Export disabled until explicit review checkbox is selected |
| FR-10 | Export / 导出 | Download a Markdown decision memo with data-mode disclosure |
| FR-11 | Responsive design / 响应式 | Usable at desktop, tablet and mobile widths |
| FR-12 | Source register / 来源登记 | Official source link, intended use and access mode shown |

## 7. Information architecture / 信息架构

The left navigation follows the decision sequence. Each page answers one question:

| Page / 页面 | Decision question / 决策问题 |
| --- | --- |
| Market brief | What exactly are we deciding? / 到底要做什么决策？ |
| Market research | What do we know versus assume? / 哪些是事实，哪些是假设？ |
| Competitor map | Why would a buyer switch? / 买家为什么会切换？ |
| Unit economics | Can the offer make money? / 这项生意能否赚钱？ |
| Entry strategy | What is the lowest-regret sequence? / 哪条路径的后悔成本最低？ |
| Decision memo | What should happen next, under which gates? / 在哪些门槛下，下一步做什么？ |

## 8. Data and AI policy / 数据与 AI 规则

- Every number has a mode: `example`, `live` or `ai-assisted`. / 每个数字都标注数据模式。
- Live metrics include source URL and observation year. / 实时指标包含来源网址和观测年份。
- AI sees only the submitted brief and supplied evidence ledger. / AI 只能看到提交的简报和证据账本。
- The server key is never sent to the browser. / API 密钥不会发送到浏览器。
- `store: false` is used for the optional OpenAI request. / 可选 OpenAI 请求使用 `store: false`。
- AI output conforms to a JSON Schema and still requires human review. / AI 输出受 JSON Schema 约束，仍需人工审核。

## 9. Success metrics / 成功指标

| Metric / 指标 | MVP target / 目标 |
| --- | --- |
| Time to first complete memo | < 20 minutes for a prepared user |
| Source traceability | 100% of live metrics link to source and year |
| Silent fabricated fallback | 0 occurrences |
| Deterministic calculation pass rate | 100% automated tests |
| Key exposure | 0 client-side secrets |
| Export governance | 100% exports require explicit review |

## 10. Risks and mitigations / 风险与应对

| Risk / 风险 | Mitigation / 应对 |
| --- | --- |
| Macro proxy mistaken for category demand | Call it context, not TAM; add trade and marketplace evidence later |
| Stale or revised public observation | Display year and source URL |
| Wrong HS code or duty | Evidence gate; qualified customs review |
| AI overconfidence | Evidence-only prompt, structured gaps, human approval |
| Example values mistaken for facts | Persistent badges, copy and export disclosure |
| Unit economics omit tax or fixed costs | Explicit scope and editable assumptions |

## 11. Roadmap / 路线图

**MVP (implemented):** Six-page workflow, World Bank connector, example competitor matrix, economics engine, optional structured AI review, human-approved export.  
**V1.1:** UN Comtrade adapter, evidence capture form, CSV import/export, report snapshots.  
**V1.2:** Authenticated projects, reviewer comments, scenario comparison and evaluation dashboard.  
**V2:** Connectors for marketplace intelligence and CRM, role-based approval, scheduled source refresh.

## 12. Release acceptance / 发布验收

The MVP is releasable when automated tests, TypeScript checking and production build pass; the six routes are visually usable; no secret is committed; every example and live value is distinguishable; and the exported memo cannot be produced without human approval.
