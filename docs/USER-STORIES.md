# User Stories & Acceptance Criteria / 用户故事与验收标准

## Epic A — Define the decision / 定义决策

### US-01 — Create a market brief

**As a** KA/BD analyst, **I want** to enter a product, origin, target market, price, channel and objective, **so that** the analysis answers a specific commercial question.  
**作为** KA/BD 分析者，**我希望**输入产品、来源地、目标市场、价格、渠道和目标，**从而**让分析回答明确的商业问题。

Acceptance criteria:

- Empty product, category, origin, target, objective or non-positive price blocks progression.
- Country code must be exactly three uppercase letters.
- A valid brief enables “Continue to research” and AI review.

### US-02 — Preserve my draft

- Changes persist in browser local storage.
- Refreshing the page restores a valid saved brief.
- Corrupted storage is removed without crashing.

### US-03 — Work bilingually

- EN/中 switch is available on every view.
- Changing language does not reset the brief, costs or evidence.

## Epic B — Assemble evidence / 组织证据

### US-04 — Fetch public market context

- A valid ISO3 code is sent to the server route.
- Latest non-empty World Bank observations are returned for four indicators.
- Each live metric shows source, observation year and a direct query URL.

### US-05 — See honest source failures

- Network or upstream errors display an explicit unavailable state.
- No example number silently fills a failed live metric.
- The rest of the workflow remains usable.

### US-06 — Distinguish facts from hypotheses

- Live metrics use a `LIVE` badge.
- qualitative launch ideas use a `HYPOTHESIS` badge.
- competitor demo values use an `EXAMPLE` badge and evidence note.

### US-07 — Register trustworthy sources

- The research page lists official source owner, use and access mode.
- External links open the official source, not a search-result page.

## Epic C — Model commercial viability / 商业可行性建模

### US-08 — Compare competitors

- Matrix captures offer, price, specification, channel, edge and watch-out.
- Proposed target offer is visually separate from observed competitor rows.
- The interface explains the minimum evidence metadata required.

### US-09 — Edit cost assumptions

- EXW, freight, duty, payment, marketplace, marketing, returns and local operations are editable.
- Retail price comes from the market brief.
- Results update without a page reload.

### US-10 — Understand contribution margin

- UI displays landed cost, variable cost, contribution and contribution margin.
- Break-even is shown only when contribution is positive.
- A zero retail price does not produce `Infinity` or `NaN`.

## Epic D — Decide and govern / 决策与治理

### US-11 — Review a gated entry plan

- Strategy contains three phases: 0–30, 31–60 and 61–90 days.
- Each phase has a decision gate.
- Stop rules are visible and measurable.

### US-12 — Run optional AI review

- Without server configuration, the route returns a clear 503 and the example workflow stays usable.
- With configuration, the key remains server-side and the response must match the defined JSON Schema.
- The AI instruction forbids inventing market sizes, prices, tariffs or competitor facts.

### US-13 — Inspect the decision memo

- Memo includes decision, confidence, economics, risks and evidence gaps.
- It discloses whether live data or only examples were used.
- AI-assisted content is visibly labelled.

### US-14 — Approve before export

- Export is disabled by default.
- Selecting human review enables export.
- Exported Markdown states that human review occurred and lists evidence gaps.

### US-15 — Use on smaller screens

- Content does not overflow the viewport except intentionally scrollable tables.
- Mobile navigation remains accessible.
- Form fields and buttons remain operable at 375px width.
