# Technical Architecture & Agent Workflow / 技术架构与 Agent 工作流

## 1. System design / 系统设计

```text
┌──────────────────────────────── Browser ────────────────────────────────┐
│ Next.js React client                                                    │
│ brief → research → competitors → economics → strategy → decision memo │
│ localStorage draft · deterministic calculations · human approval       │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │ same-origin HTTPS
                  ┌─────────────┴──────────────┐
                  │ Next.js server routes      │
                  │                            │
                  │ /api/market-data           │
                  │ validate ISO3 → fetch →    │
                  │ normalize → cite           │
                  │                            │
                  │ /api/analyze               │
                  │ validate brief → call AI → │
                  │ schema parse → disclose    │
                  └───────┬───────────┬────────┘
                          │           │
           World Bank Indicators     OpenAI Responses API
           public API, no key        server-only key, optional
```

## 2. Stack rationale / 技术选型

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js + TypeScript | One deployable app, server routes protect secrets, strong hiring-market signal |
| UI | React + hand-authored CSS | Small dependency surface and clear design ownership |
| State | React state + localStorage | Sufficient for one-user MVP; no unnecessary backend |
| Data | World Bank Indicators API | Official, source-linked, keyless public context |
| AI | OpenAI Responses API + JSON Schema | Typed output and explicit refusal/error handling path |
| Tests | Node.js built-in test runner | Zero runtime dependency; fast deterministic unit/content tests |
| Hosting | Vercel | Native Next.js build and simple environment variables |

## 3. Agent/tool workflow / Agent 与工具工作流

The production-shaped design is a **supervised workflow**, not an unconstrained swarm.

```text
1. Brief Validator (deterministic)
   └─ rejects missing fields, invalid ISO3 and non-positive price

2. Source Retriever (tool)
   └─ calls allowlisted World Bank endpoints
      └─ returns value + year + source URL, or explicit unavailable

3. Economics Engine (deterministic)
   └─ calculates cost stack and contribution; never delegated to an LLM

4. Strategy Synthesizer (AI, optional)
   └─ receives only the brief and evidence ledger
      └─ returns strict decision/risk/action/gap JSON

5. Evidence Critic (policy in MVP; separate evaluator later)
   └─ asks: does every factual claim have supplied evidence?

6. Human Reviewer (mandatory)
   └─ verifies compliance, tariff, competitor observation and stop rules
      └─ explicitly unlocks export
```

### Why not make everything an agent? / 为什么不把一切都交给 Agent？

- Arithmetic is cheaper and safer as deterministic code. / 算术应由确定性代码完成，更便宜也更可靠。
- Source access is restricted to known tools and schemas. / 数据访问限定在已知工具和结构内。
- Strategic synthesis benefits from language models, but approval does not. / 战略综合适合 AI，最终批准不适合。
- A visible evidence gap is better than a plausible hallucination. / 明确的证据缺口优于“看起来合理”的幻觉。

## 4. AI request contract / AI 请求契约

- Environment variables: `OPENAI_API_KEY`, `OPENAI_MODEL`.
- API key is read only inside the server route.
- Request uses `store: false`.
- The system instruction limits the model to supplied evidence.
- Structured output fields: `decision`, `confidence`, `executiveSummary`, `keyRisks`, `nextActions`, `evidenceGaps`.
- Any missing configuration, HTTP failure, empty output or parse failure becomes an explicit non-200 response.
- The app continues in deterministic example mode after AI failure.

## 5. Security and privacy / 安全与隐私

| Threat | Control |
| --- | --- |
| Secret leak to client | No `NEXT_PUBLIC_` secret; server route only; `.env*` ignored |
| Prompt injection in retrieved data | Data connector returns typed numeric fields; model told to treat evidence as data |
| SSRF | Market data route builds URLs from validated ISO3 and fixed indicators/domain |
| Fabricated fallback | Error state returns no metric value |
| Over-authorized AI | AI cannot export, publish, price or contract; human gate owns export |
| Sensitive storage | MVP stores only local brief assumptions in browser localStorage |

## 6. Scaling path / 扩展路径

Introduce a source-adapter interface (`fetch → normalize → cite → freshness`) for Comtrade, tariffs and marketplace observations. Add a database only when projects, reviewers and snapshots require shared persistence. Queue expensive connector refreshes, cache by market/indicator/date, and store an immutable evidence snapshot with each exported report.

## 7. Key decisions / 关键决策记录

- **ADR-001:** Default to example mode so reviewers can run the portfolio without credentials.
- **ADR-002:** Use public macro indicators as context, never as category TAM.
- **ADR-003:** Keep financial calculations deterministic and covered by unit tests.
- **ADR-004:** Require explicit human review before export.
- **ADR-005:** Represent missing evidence as a first-class output, not an error to hide.
