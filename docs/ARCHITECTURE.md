# Architecture / 技术架构

Next.js 16 / React 19 / TypeScript 7 wrapper embeds the standalone profit application from `public/profit/index.html` in a titled full-height iframe. This keeps the exact application portable to static hosting without server dependencies. Both hosting routes use the same HTML, CSS, browser controller and pure ES module calculation engine.

`engine.mjs`: validation, deterministic calculation, diagnostic rules, versioned project codec, CSV escaping and report. `app.mjs`: input binding, live recalculation, read-before-write localStorage draft restoration, browser downloads and file import. User text renders through textContent. No external runtime assets or network requests are needed for the core workflow.

旧 market/demo 模块保留供旧测试与历史比较，第二版页面不再使用其固定竞品或打分。宏观 API 保留但主流程不依赖它。
Legacy modules are retained for historical regression only; V2 does not display their competitors or scores.

## AI/tool 与人工审核
主工作流：用户数据 → 校验 → 公式计算 → 条件诊断 → 人工核实需求、税与合同 → 小规模试销。不是多 Agent 系统，也未进行模型训练。
Core workflow is deterministic and reviewed by a human, not an autonomous multi-agent system.

Legacy `/api/analyze` now parses Responses REST nested message content, validates local shape and handles refusal/incomplete/timeout/invalid JSON. It remains disconnected from V2. No live paid model request has been verified. Its legacy confidence field is not a calibrated probability and is never shown in V2. Static hosting does not expose these server endpoints; Vercel/Next hosting does.
