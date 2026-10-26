# 5-Minute Interview Demo / 五分钟面试展示脚本

## 0:00–0:35 — The business problem / 商业问题

> “I built GlobalGTM AI because market-entry work often mixes live facts, assumptions and AI-generated narrative. The product turns a product-market brief into a reviewable 90-day decision memo. It is designed for cross-border KA/BD work, where being honest about evidence is as important as producing a recommendation.”

中文参考：

> “我做 GlobalGTM AI，是因为市场进入分析经常把实时事实、业务假设和 AI 生成内容混在一起。这个产品把产品—市场问题转化为可审核的 90 天决策报告。对出海 KA/BD 来说，明确证据边界和给出建议同样重要。”

## 0:35–1:15 — Frame the decision / 定义问题

Open **Market brief**. Point to product, Malaysia, target price, hybrid channel and 90-day objective.

> “I avoided a blank chatbot. The workflow first forces a falsifiable decision: product, market, price, channel, timebox and constraint. Invalid inputs cannot reach the AI step.”

## 1:15–2:00 — Evidence, not hallucination / 证据优先

Open **Market research** and refresh public data.

> “The macro context comes from the World Bank API. Every live card carries the observation year and direct query URL. If the source fails, the app shows unavailable — it never inserts a plausible number. Hypotheses stay visibly separate from facts.”

Then show the source register and mention planned UN Comtrade/WTO connectors.

## 2:00–2:45 — Commercial judgment / 商业判断

Open **Competitor map**, then **Unit economics**.

> “The competitor table is intentionally marked as illustrative. In a real project, each row needs seller, variant, currency, date and evidence reference. The economics engine is deterministic code, not an LLM. I can change duty or marketplace fees and immediately see contribution margin and break-even.”

Change marketplace fee from 9% to 12% to show the margin trade-off.

## 2:45–3:35 — Action plan / 落地路径

Open **Entry strategy**.

> “The recommendation is sequenced to maximize learning before commitment: first close compliance and evidence gaps, then validate two marketplace bundles, then decide whether a distributor earns scale rights. Each phase has a gate, and I added explicit stop rules.”

## 3:35–4:25 — AI architecture and governance / AI 架构与治理

Open **Decision memo**.

> “AI is optional. Without a key the full example works. With a key, the server sends only the brief and verified evidence to the Responses API, requests strict structured output, and keeps the key off the client. Arithmetic remains deterministic. The final export is locked until a human confirms review.”

Select the human review checkbox.

## 4:25–5:00 — What I would build next / 下一步

> “Next I would add UN Comtrade as a typed adapter, capture evidence snapshots, and build a 30-case evaluation set covering contradictory evidence, stale sources and negative-margin scenarios. The key product principle stays the same: a visible evidence gap is better than a confident hallucination.”

## Likely follow-up questions / 常见追问

**Why World Bank data if it does not prove category demand?**  
It is macro context only. The UI and documentation explicitly say it is not TAM. Category demand requires trade, marketplace and customer evidence.

**Why not use multiple autonomous agents?**  
Deterministic validation and math are safer in code. AI is used only where synthesis adds value, and a human owns approval.

**How would you make this production-ready?**  
Add authentication, shared evidence storage, immutable report snapshots, rate limits, source adapters, role-based review and monitored evaluation.

**What does this show about you as a KA/BD candidate?**  
Structured problem framing, commercial math, channel sequencing, negotiation guardrails, evidence discipline and the ability to turn AI into a controlled business workflow.
