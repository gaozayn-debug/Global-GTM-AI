"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateUnitEconomics, formatCurrency, scoreMarket, validateMarketInput } from "@/lib/market";
import { sampleCompetitors, sampleCosts, sampleInput, trustedSources } from "@/lib/demo";
import type { AnalysisRecommendation, CostInputs, LiveMetric, MarketInput } from "@/lib/types";

type View = "brief" | "research" | "competitors" | "economics" | "strategy" | "report";
type Language = "en" | "zh";

const nav: { id: View; index: string; en: string; zh: string }[] = [
  { id: "brief", index: "01", en: "Market brief", zh: "市场输入" },
  { id: "research", index: "02", en: "Market research", zh: "市场研究" },
  { id: "competitors", index: "03", en: "Competitor map", zh: "竞品矩阵" },
  { id: "economics", index: "04", en: "Unit economics", zh: "成本定价" },
  { id: "strategy", index: "05", en: "Entry strategy", zh: "进入策略" },
  { id: "report", index: "06", en: "Decision memo", zh: "分析报告" },
];

const labels = {
  en: {
    workspace: "MARKET ENTRY WORKSPACE",
    newStudy: "New analysis",
    example: "EXAMPLE",
    live: "LIVE",
    proposed: "PROPOSED",
    reviewed: "REVIEWED",
    dataNote: "Example data is never presented as a live market fact.",
    analyze: "Run AI review",
    running: "Reviewing…",
    export: "Export decision memo",
  },
  zh: {
    workspace: "市场进入工作台",
    newStudy: "新建分析",
    example: "示例",
    live: "实时",
    proposed: "建议",
    reviewed: "已审核",
    dataNote: "示例数据绝不会被包装成实时市场事实。",
    analyze: "运行 AI 审核",
    running: "分析中…",
    export: "导出决策报告",
  },
};

const hypothesisCards = [
  {
    title: "Demand trigger",
    zh: "需求触发点",
    body: "Backup power, weekend mobility and creator use cases may be stronger entry wedges than broad ‘outdoor lifestyle’ messaging.",
    bodyZh: "备用电源、周末出行和创作者场景，可能比泛化的“户外生活”定位更适合作为切入口。",
  },
  {
    title: "Channel hypothesis",
    zh: "渠道假设",
    body: "Marketplace discovery can validate conversion before a distributor receives territory or price protection.",
    bodyZh: "先用电商平台验证转化，再决定是否给予经销商区域或价格保护。",
  },
  {
    title: "Proof required",
    zh: "待验证证据",
    body: "HS classification, landed duty, local safety requirements, warranty cost and keyword-level demand remain open gates.",
    bodyZh: "HS 归类、落地关税、本地安全要求、保修成本和关键词需求仍需验证。",
  },
];

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "live" | "warn" | "good" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function PageIntro({ eyebrow, title, body, aside }: { eyebrow: string; title: string; body: string; aside?: React.ReactNode }) {
  return (
    <header className="page-intro">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{body}</p>
      </div>
      {aside && <div className="intro-aside">{aside}</div>}
    </header>
  );
}

export function Dashboard() {
  const [active, setActive] = useState<View>("brief");
  const [language, setLanguage] = useState<Language>("en");
  const [input, setInput] = useState<MarketInput>(sampleInput);
  const [costs, setCosts] = useState<CostInputs>(sampleCosts);
  const [metrics, setMetrics] = useState<LiveMetric[]>([]);
  const [dataStatus, setDataStatus] = useState<"idle" | "loading" | "live" | "error">("idle");
  const [dataError, setDataError] = useState("");
  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [aiError, setAiError] = useState("");
  const [recommendation, setRecommendation] = useState<AnalysisRecommendation | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const t = labels[language];

  useEffect(() => {
    const saved = window.localStorage.getItem("globalgtm-brief-v1");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { input?: MarketInput; costs?: CostInputs };
      if (parsed.input) setInput(parsed.input);
      if (parsed.costs) setCosts(parsed.costs);
    } catch {
      window.localStorage.removeItem("globalgtm-brief-v1");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("globalgtm-brief-v1", JSON.stringify({ input, costs }));
  }, [input, costs]);

  const economics = useMemo(() => calculateUnitEconomics({ ...costs, retailPrice: input.targetRetailPrice }), [costs, input.targetRetailPrice]);
  const validationErrors = useMemo(() => validateMarketInput(input), [input]);
  const readiness = useMemo(
    () =>
      scoreMarket({
        demand: metrics.length === 4 ? 7 : 5,
        competition: 6,
        margin: Math.max(0, Math.min(10, economics.contributionMargin / 4)),
        execution: 7,
        evidence: metrics.length === 4 ? 7 : 4,
      }),
    [economics.contributionMargin, metrics.length],
  );

  async function fetchMarketData() {
    setDataStatus("loading");
    setDataError("");
    try {
      const response = await fetch(`/api/market-data?country=${input.targetCountryCode}`);
      const body = (await response.json()) as { metrics?: LiveMetric[]; error?: string };
      if (!response.ok || !body.metrics) throw new Error(body.error ?? "Unable to fetch market data");
      setMetrics(body.metrics);
      setDataStatus("live");
    } catch (error) {
      setMetrics([]);
      setDataStatus("error");
      setDataError(error instanceof Error ? error.message : "Unable to fetch market data");
    }
  }

  async function runAiReview() {
    setAiStatus("loading");
    setAiError("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, evidence: metrics }),
      });
      const body = (await response.json()) as { recommendation?: AnalysisRecommendation; error?: string };
      if (!response.ok || !body.recommendation) throw new Error(body.error ?? "AI review failed");
      setRecommendation(body.recommendation);
      setAiStatus("done");
      setActive("report");
    } catch (error) {
      setAiStatus("error");
      setAiError(error instanceof Error ? error.message : "AI review failed");
    }
  }

  function updateInput<K extends keyof MarketInput>(key: K, value: MarketInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
    setReviewed(false);
  }

  function updateCost<K extends keyof CostInputs>(key: K, value: CostInputs[K]) {
    setCosts((current) => ({ ...current, [key]: Number.isFinite(value) ? value : 0 }));
    setReviewed(false);
  }

  function resetStudy() {
    setInput(sampleInput);
    setCosts(sampleCosts);
    setMetrics([]);
    setRecommendation(null);
    setReviewed(false);
    setDataStatus("idle");
    setActive("brief");
  }

  function exportMemo() {
    if (!reviewed) return;
    const decision = recommendation?.decision ?? "CONDITIONAL GO";
    const content = [
      "# GlobalGTM AI — Market Entry Decision Memo",
      "",
      `- Product: ${input.product}`,
      `- Market: ${input.targetCountry}`,
      `- Decision: ${decision}`,
      `- Contribution margin: ${economics.contributionMargin}%`,
      `- Evidence mode: ${metrics.length ? "World Bank live indicators + reviewed example assumptions" : "Example assumptions only"}`,
      `- Human reviewed: Yes`,
      "",
      "## Recommendation",
      recommendation?.executiveSummary ?? "Run a gated 90-day marketplace validation before granting distributor exclusivity.",
      "",
      "## Mandatory evidence gaps",
      ...(recommendation?.evidenceGaps ?? ["Verify HS code and duty", "Validate local compliance", "Replace illustrative competitor prices with timestamped observations"]).map((item) => `- ${item}`),
      "",
      "Generated by GlobalGTM AI. Human review is required before business use.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `globalgtm-${input.targetCountryCode.toLowerCase()}-memo.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const views: Record<View, React.ReactNode> = {
    brief: (
      <>
        <PageIntro
          eyebrow="01 / MARKET BRIEF"
          title={language === "en" ? "Frame the commercial decision." : "先定义要做的商业决策。"}
          body={language === "en" ? "A useful GTM analysis starts with a falsifiable brief — not a blank chat box." : "有价值的 GTM 分析，应从可证伪的商业问题开始，而不是一个空白聊天框。"}
          aside={<Badge tone="warn">{t.example} · Portable energy → Malaysia</Badge>}
        />
        <section className="form-shell">
          <div className="section-heading">
            <div><span className="step-chip">A</span><h2>{language === "en" ? "Product & market" : "产品与市场"}</h2></div>
            <p>{language === "en" ? "Required fields are validated before AI mode can run." : "只有必填项通过校验后，才可运行 AI 模式。"}</p>
          </div>
          <div className="form-grid">
            <Field label={language === "en" ? "Product" : "产品"}>
              <input value={input.product} onChange={(e) => updateInput("product", e.target.value)} />
            </Field>
            <Field label={language === "en" ? "Category" : "品类"}>
              <input value={input.category} onChange={(e) => updateInput("category", e.target.value)} />
            </Field>
            <Field label={language === "en" ? "Origin market" : "原产市场"}>
              <input value={input.originCountry} onChange={(e) => updateInput("originCountry", e.target.value)} />
            </Field>
            <Field label={language === "en" ? "Target market" : "目标市场"}>
              <div className="compound-input">
                <input value={input.targetCountry} onChange={(e) => updateInput("targetCountry", e.target.value)} />
                <input aria-label="ISO3 country code" value={input.targetCountryCode} maxLength={3} onChange={(e) => updateInput("targetCountryCode", e.target.value.toUpperCase())} />
              </div>
            </Field>
            <Field label={language === "en" ? "Target retail price" : "目标零售价"}>
              <div className="compound-input price-input">
                <select value={input.currency} onChange={(e) => updateInput("currency", e.target.value as MarketInput["currency"])}>
                  {(["USD", "CNY", "MYR", "SGD", "EUR"] as const).map((currency) => <option key={currency}>{currency}</option>)}
                </select>
                <input type="number" min="1" value={input.targetRetailPrice} onChange={(e) => updateInput("targetRetailPrice", Number(e.target.value))} />
              </div>
            </Field>
            <Field label={language === "en" ? "Entry channel" : "进入渠道"}>
              <select value={input.channel} onChange={(e) => updateInput("channel", e.target.value as MarketInput["channel"])}>
                <option value="marketplace">Marketplace / 平台电商</option>
                <option value="distributor">Distributor / 经销商</option>
                <option value="retail">Retail / 线下零售</option>
                <option value="hybrid">Hybrid / 混合</option>
              </select>
            </Field>
            <Field label={language === "en" ? "Decision objective" : "决策目标"} hint={language === "en" ? "Write the decision, timebox and constraint." : "写清决策、周期和约束。"}>
              <textarea rows={4} value={input.objective} onChange={(e) => updateInput("objective", e.target.value)} />
            </Field>
          </div>
          <div className="form-footer">
            <div className="validation-status">
              <span className={validationErrors.length ? "status-dot status-warn" : "status-dot status-good"} />
              {validationErrors.length ? `${validationErrors.length} fields need attention` : "Brief ready for analysis"}
            </div>
            <button className="button primary" disabled={validationErrors.length > 0} onClick={() => setActive("research")}>
              {language === "en" ? "Continue to research" : "继续市场研究"} <span>→</span>
            </button>
          </div>
        </section>
      </>
    ),
    research: (
      <>
        <PageIntro
          eyebrow="02 / MARKET RESEARCH"
          title={language === "en" ? "Build an evidence ledger." : "建立可追溯的证据账本。"}
          body={language === "en" ? "Facts, hypotheses and missing evidence stay visibly separate throughout the decision." : "事实、假设和证据缺口在整个决策流程中始终分开。"}
          aside={<button className="button secondary" onClick={fetchMarketData} disabled={dataStatus === "loading"}>{dataStatus === "loading" ? "Fetching…" : "↻ Refresh public data"}</button>}
        />
        <section className="metric-grid">
          {metrics.length ? metrics.map((metric) => (
            <article className="metric-card" key={metric.id}>
              <div className="metric-top"><span>{metric.label}</span><Badge tone="live">{t.live}</Badge></div>
              <strong>{metric.id === "SP.POP.TOTL" ? `${(metric.value / 1_000_000).toFixed(1)}M` : metric.id === "NY.GDP.PCAP.CD" ? formatCurrency(metric.value) : `${metric.value.toFixed(1)}%`}</strong>
              <a href={metric.sourceUrl} target="_blank" rel="noreferrer">World Bank · {metric.year} ↗</a>
            </article>
          )) : ["Population", "GDP per capita", "Internet users", "Urban population"].map((label) => (
            <article className="metric-card empty" key={label}>
              <div className="metric-top"><span>{label}</span><Badge>{dataStatus === "error" ? "UNAVAILABLE" : "NOT LOADED"}</Badge></div>
              <strong>—</strong>
              <small>No number substituted</small>
            </article>
          ))}
        </section>
        {dataStatus === "error" && <div className="notice error"><strong>Live source unavailable.</strong> {dataError}</div>}
        <section className="hypothesis-grid">
          {hypothesisCards.map((item, index) => (
            <article className="hypothesis-card" key={item.title}>
              <div className="card-kicker"><span>H{index + 1}</span><Badge tone="warn">HYPOTHESIS</Badge></div>
              <h3>{language === "en" ? item.title : item.zh}</h3>
              <p>{language === "en" ? item.body : item.bodyZh}</p>
              <button className="text-button">{language === "en" ? "Add evidence" : "补充证据"} +</button>
            </article>
          ))}
        </section>
        <section className="sources-section">
          <div className="section-title-row"><div><p className="eyebrow">SOURCE REGISTER</p><h2>{language === "en" ? "Trusted data plan" : "可信数据计划"}</h2></div><span>{trustedSources.length} sources</span></div>
          <div className="source-list">
            {trustedSources.map((source, index) => (
              <a href={source.url} target="_blank" rel="noreferrer" className="source-row" key={source.name}>
                <span className="source-index">0{index + 1}</span><strong>{source.name}</strong><span>{source.use}</span><small>{source.access}</small><b>↗</b>
              </a>
            ))}
          </div>
        </section>
      </>
    ),
    competitors: (
      <>
        <PageIntro eyebrow="03 / COMPETITOR MAP" title={language === "en" ? "Compare the offer, not just the logo." : "比较产品价值，而不只是罗列品牌。"} body={language === "en" ? "This illustrative matrix demonstrates the workflow. Every row must be replaced with timestamped observations before a real decision." : "该示例矩阵用于展示工作流。真实决策前，每一行都必须替换为带时间戳的观测证据。"} aside={<Badge tone="warn">{t.example} · Not live pricing</Badge>} />
        <section className="matrix-card">
          <div className="matrix-toolbar"><div><strong>Portable power · 500–800Wh</strong><span>4 offers · Malaysia launch frame</span></div><button className="button secondary">+ Add competitor</button></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Offer</th><th>Observed price</th><th>Capacity / output</th><th>Channel</th><th>Defensible edge</th><th>Watch-out</th></tr></thead>
              <tbody>
                {sampleCompetitors.map((item, index) => (
                  <tr key={item.name} className={index === sampleCompetitors.length - 1 ? "target-row" : ""}>
                    <td><strong>{item.name}</strong><small>{item.evidence}</small></td><td>{item.price}</td><td>{item.power}</td><td>{item.channel}</td><td>{item.strength}</td><td>{item.gap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="matrix-note"><span>!</span><p><strong>Evidence rule</strong> — A URL alone is not enough. Capture market, seller, variant, currency, date and screenshot/reference ID.</p></div>
        </section>
        <section className="positioning-strip">
          <div><p className="eyebrow">POSITIONING DRAFT</p><h2>“Dependable power, locally backed.”</h2></div>
          <p>{language === "en" ? "Lead with local warranty clarity and useful power-per-dollar. Do not claim category leadership without verified share data." : "以本地保修清晰度和单位价格功率为核心。未核实份额数据前，不得声称品类领先。"}</p>
          <Badge tone="warn">{t.proposed}</Badge>
        </section>
      </>
    ),
    economics: (
      <>
        <PageIntro eyebrow="04 / UNIT ECONOMICS" title={language === "en" ? "Make margin assumptions inspectable." : "让利润假设可检查、可推翻。"} body={language === "en" ? "Every percentage is editable. The model separates landed cost, channel fees and growth spend." : "每个百分比都可以修改，模型将落地成本、渠道费用和增长投入分别计算。"} aside={<Badge tone="warn">{t.example} · Assumptions</Badge>} />
        <div className="economics-layout">
          <section className="cost-form">
            <div className="section-title-row"><div><p className="eyebrow">ASSUMPTIONS</p><h2>Per-unit inputs</h2></div><span>{input.currency}</span></div>
            <div className="cost-grid">
              {([
                ["exWorks", "EXW product cost", "$"], ["freight", "Freight + insurance", "$"], ["dutyRate", "Import duty", "%"], ["paymentRate", "Payment fee", "%"], ["marketplaceRate", "Marketplace fee", "%"], ["marketingRate", "Launch marketing", "%"], ["returnsRate", "Returns reserve", "%"], ["localOps", "Local ops / unit", "$"],
              ] as [keyof CostInputs, string, string][]).map(([key, label, unit]) => (
                <label className="cost-row" key={key}><span>{label}</span><div><i>{unit}</i><input type="number" min="0" step="0.1" value={costs[key]} onChange={(e) => updateCost(key, Number(e.target.value))} /></div></label>
              ))}
            </div>
          </section>
          <section className="economics-result">
            <div className="result-hero"><p>Contribution / unit</p><strong>{formatCurrency(economics.contribution, input.currency)}</strong><span className={economics.contributionMargin >= 20 ? "positive" : "negative"}>{economics.contributionMargin}% margin</span></div>
            <div className="waterfall">
              <div><span>Retail price</span><i style={{ width: "100%" }} /><b>{formatCurrency(input.targetRetailPrice, input.currency)}</b></div>
              <div><span>Landed cost</span><i className="cost-bar" style={{ width: `${Math.min(100, economics.landedCost / input.targetRetailPrice * 100)}%` }} /><b>−{formatCurrency(economics.landedCost, input.currency)}</b></div>
              <div><span>Channel + growth</span><i className="fee-bar" style={{ width: `${Math.min(100, (economics.variableCost - economics.landedCost) / input.targetRetailPrice * 100)}%` }} /><b>−{formatCurrency(economics.variableCost - economics.landedCost, input.currency)}</b></div>
              <div><span>Contribution</span><i className="profit-bar" style={{ width: `${Math.max(0, economics.contributionMargin)}%` }} /><b>{formatCurrency(economics.contribution, input.currency)}</b></div>
            </div>
            <div className="result-stats"><div><span>Variable cost</span><strong>{formatCurrency(economics.variableCost, input.currency)}</strong></div><div><span>Break-even*</span><strong>{economics.breakEvenUnits ? `${economics.breakEvenUnits} units` : "Not reachable"}</strong></div></div>
            <small>*Illustrative break-even against a fixed launch budget of $10,000.</small>
          </section>
        </div>
      </>
    ),
    strategy: (
      <>
        <PageIntro eyebrow="05 / ENTRY STRATEGY" title={language === "en" ? "Sequence learning before scale." : "先验证学习，再扩大投入。"} body={language === "en" ? "A gated 90-day launch protects pricing power and keeps distributor commitments reversible." : "用带决策门槛的 90 天启动方案保护价格体系，并保持经销商承诺可逆。"} aside={<Badge tone="warn">{t.proposed} · Human approval required</Badge>} />
        <section className="strategy-grid">
          {[{n:"01",days:"DAY 0–30",title:"Prove the right to play",body:"Lock HS classification, compliance path, warranty SLA and ten timestamped competitor observations.",gate:"Gate: evidence complete"},{n:"02",days:"DAY 31–60",title:"Validate the offer",body:"Launch two marketplace bundles, three creative angles and a controlled creator seeding cohort.",gate:"Gate: CVR + margin threshold"},{n:"03",days:"DAY 61–90",title:"Choose the scale path",body:"Compare marketplace repeatability with distributor economics before exclusivity or retail expansion.",gate:"Gate: channel decision"}].map((phase) => (
            <article className="phase-card" key={phase.n}><div className="phase-top"><span>{phase.n}</span><small>{phase.days}</small></div><h3>{phase.title}</h3><p>{phase.body}</p><div className="gate">◆ {phase.gate}</div></article>
          ))}
        </section>
        <section className="channel-plan">
          <div className="section-title-row"><div><p className="eyebrow">CHANNEL DESIGN</p><h2>Marketplace-led, partner-ready</h2></div><Badge tone="good">Recommended sequence</Badge></div>
          <div className="channel-rows">
            <div><span>DISCOVER</span><strong>Shopee / search demand</strong><p>Own the learning loop, pricing and customer questions.</p><b>50%</b></div>
            <div><span>PROVE</span><strong>Creators / use-case demos</strong><p>Build proof around blackouts, road trips and mobile work.</p><b>30%</b></div>
            <div><span>SCALE</span><strong>Selective distributor</strong><p>Add offline reach after service and margin gates are met.</p><b>20%</b></div>
          </div>
        </section>
        <section className="stop-rules"><div><span>×</span><strong>Stop rules</strong></div><p>Pause scale if contribution margin falls below 18%, warranty return rate exceeds the validated limit, or compliance evidence remains unresolved.</p></section>
      </>
    ),
    report: (
      <>
        <PageIntro eyebrow="06 / DECISION MEMO" title={language === "en" ? "A recommendation with receipts." : "一份有证据、有边界的建议。"} body={language === "en" ? "The memo records what is known, what is assumed and who approved the decision." : "报告记录已知事实、假设条件和最终审核人。"} aside={<Badge tone={reviewed ? "good" : "warn"}>{reviewed ? t.reviewed : "REVIEW REQUIRED"}</Badge>} />
        <section className="report-hero">
          <div className="decision-score"><span>{recommendation?.decision ?? "CONDITIONAL GO"}</span><strong>{recommendation?.confidence ?? readiness}</strong><small>/ 100 confidence</small></div>
          <div className="decision-copy"><p className="eyebrow">EXECUTIVE RECOMMENDATION</p><h2>{input.product} → {input.targetCountry}</h2><p>{recommendation?.executiveSummary ?? "Proceed to a gated 90-day validation. Protect optionality: verify compliance and true landed cost, then use marketplace conversion and contribution margin to decide whether a distributor earns expansion rights."}</p><div className="decision-tags"><Badge tone={metrics.length ? "live" : "neutral"}>{metrics.length ? "4 LIVE INDICATORS" : "NO LIVE INDICATORS"}</Badge><Badge tone="warn">3 EXAMPLE ASSUMPTIONS</Badge><Badge>{recommendation ? "AI-ASSISTED" : "RULE-BASED"}</Badge></div></div>
        </section>
        <div className="report-grid">
          <section className="report-section"><p className="eyebrow">WHY THIS CAN WORK</p><h3>Commercial case</h3><ul className="check-list"><li>Positive illustrative contribution margin of <strong>{economics.contributionMargin}%</strong>.</li><li>Marketplace-first sequence keeps initial commitments reversible.</li><li>Local warranty clarity offers a testable differentiation angle.</li></ul></section>
          <section className="report-section"><p className="eyebrow">WHAT CAN BREAK</p><h3>Decision risks</h3><ul className="risk-list">{(recommendation?.keyRisks ?? ["HS classification or tariff assumption is wrong.", "Illustrative competitor pricing does not match live variants.", "Warranty and battery compliance costs erode margin."]).map((risk) => <li key={risk}>{risk}</li>)}</ul></section>
          <section className="report-section full"><p className="eyebrow">EVIDENCE GATES</p><h3>Must verify before spend</h3><div className="evidence-gates">{(recommendation?.evidenceGaps ?? ["Confirm HS6 code + duty with a qualified broker", "Document local electrical and battery compliance", "Capture 10 timestamped competitor observations", "Validate service SLA and reverse-logistics cost"]).map((gap, index) => <div key={gap}><span>G{index + 1}</span><p>{gap}</p><Badge>OPEN</Badge></div>)}</div></section>
        </div>
        <section className="approval-bar"><label><input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} /><span><strong>{language === "en" ? "Human review complete" : "人工审核已完成"}</strong><small>{language === "en" ? "I checked sources, assumptions and decision gates." : "我已核对来源、假设与决策门槛。"}</small></span></label><button className="button primary" disabled={!reviewed} onClick={exportMemo}>{t.export} ↓</button></section>
      </>
    ),
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">G</div><div><strong>GlobalGTM</strong><span>AI market entry copilot</span></div></div>
        <button className="new-study" onClick={resetStudy}><span>＋</span>{t.newStudy}</button>
        <p className="nav-label">{t.workspace}</p>
        <nav>{nav.map((item) => <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => setActive(item.id)}><span>{item.index}</span>{language === "en" ? item.en : item.zh}{item.id === "report" && <i>{reviewed ? "✓" : ""}</i>}</button>)}</nav>
        <div className="sidebar-status"><div><span className="pulse" /><strong>{dataStatus === "live" ? "Public data connected" : "Example mode"}</strong></div><p>{t.dataNote}</p></div>
        <div className="sidebar-foot"><a href="https://github.com/" target="_blank" rel="noreferrer">GitHub-ready ↗</a><span>v0.1 MVP</span></div>
      </aside>
      <main className="main-shell">
        <header className="topbar"><div className="breadcrumb"><span>WORKSPACE</span><b>/</b><strong>{input.targetCountry || "Untitled market"}</strong></div><div className="top-actions"><div className="language-toggle"><button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button><button className={language === "zh" ? "active" : ""} onClick={() => setLanguage("zh")}>中</button></div><button className="button ai-button" disabled={aiStatus === "loading" || validationErrors.length > 0} onClick={runAiReview}><span>✦</span>{aiStatus === "loading" ? t.running : t.analyze}</button></div></header>
        {aiStatus === "error" && <div className="global-notice"><strong>AI mode unavailable:</strong> {aiError} <span>The full example workflow still works without a key.</span><button onClick={() => setAiStatus("idle")}>×</button></div>}
        <div className="content">{views[active]}</div>
        <footer className="app-footer"><span>GlobalGTM AI · Decision support, not autonomous decision-making.</span><div><Badge tone="warn">{t.example}</Badge><Badge tone="live">{t.live}</Badge><Badge>{t.proposed}</Badge></div></footer>
      </main>
    </div>
  );
}
