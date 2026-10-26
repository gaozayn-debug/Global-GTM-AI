# GlobalGTM AI

> Evidence-first AI copilot for cross-border market-entry decisions. 证据优先的出海市场进入决策助手。

GlobalGTM AI turns a product, target market and commercial assumptions into an auditable 90-day go-to-market recommendation. It is designed as a portfolio project for KA/BD, international e-commerce and management-trainee interviews — not as a production financial-advice system.

## What is included

- Six polished SaaS views: market brief, research, competitor matrix, unit economics, entry strategy and decision memo.
- A zero-key example mode that remains fully navigable.
- Live World Bank indicators with source URL, observation year and explicit failure states.
- Optional server-side OpenAI Responses API integration using Structured Outputs.
- Human approval gate before a decision memo can be exported.
- Bilingual UI, responsive layout and local draft persistence.
- 20+ automated tests for calculations, validation and evidence boundaries.
- Bilingual product, architecture, data, evaluation, deployment and interview documentation.

## Quick start

Requirements: Node.js 20.9+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The complete example workflow works without an API key. To enable AI review, add your own server-side `OPENAI_API_KEY` and an `OPENAI_MODEL` available to your account.

## Verification

```bash
npm test
npm run typecheck
npm run build
```

## Data integrity contract

| Label | Meaning |
| --- | --- |
| `EXAMPLE / 示例` | Illustrative portfolio content; never a current market fact |
| `LIVE / 实时` | Returned from the linked public API with an observation year |
| `PROPOSED / 建议` | A strategy hypothesis awaiting human review |
| `AI-ASSISTED` | Model-generated output constrained to supplied evidence |

No market-size number, tariff, competitor price or test result is silently invented. When a live source fails, the interface shows “unavailable” rather than substituting a plausible number.

## Architecture at a glance

```text
Browser (Next.js / React)
  ├─ editable commercial brief + local draft
  ├─ deterministic unit-economics engine
  └─ human-review gate
        │
        ├─ GET /api/market-data ── World Bank Indicators API
        └─ POST /api/analyze ───── OpenAI Responses API (optional)
                                      key remains server-side
```

## Documentation

- [Product requirements / 中英双语 PRD](docs/PRD.md)
- [User stories and acceptance criteria](docs/USER-STORIES.md)
- [Technical architecture and agent workflow](docs/ARCHITECTURE.md)
- [Trusted data sources and citation policy](docs/DATA-SOURCES.md)
- [Evaluation plan and 25+ test cases](docs/EVALUATION.md)
- [Executed test results](docs/TEST-RESULTS.md)
- [Deployment and GitHub guide](docs/DEPLOYMENT.md)
- [5-minute interview demo script](docs/INTERVIEW-DEMO.md)

## Important limitations

The competitor matrix, entry plan and cost assumptions ship as a clearly labelled example. They are not verified Malaysia market research. Tariffs, compliance, marketplace fees and tax treatment require qualified human verification before any business decision.

## Verified MVP status

On 2026-10-27 the project passed 32/32 automated tests, TypeScript checking, a Next.js production build and a production dependency audit with zero known vulnerabilities. See the executed-results document for scope and limits.

## License

MIT — see [LICENSE](LICENSE).
