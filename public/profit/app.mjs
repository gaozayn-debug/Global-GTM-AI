import {
  defaults,
  calculate,
  diagnostic,
  validate,
  encodeProject,
  decodeProject,
  csvCell,
  report,
} from "./engine.mjs";
const $ = (id) => document.getElementById(id);
let p = { ...defaults },
  restored = false;
try {
  const raw = localStorage.getItem("globalgtm-v2");
  if (raw) {
    p = decodeProject(raw);
    restored = true;
  }
} catch {
  $("status").textContent = "保存的草稿无效，已加载演示。";
}
const groups = [
  [
    "产品 / Product",
    [
      ["name", "产品名称 / Product"],
      ["market", "目标市场 / Market"],
      ["currency", "销售币种 / Sell currency"],
      ["costCurrency", "采购币种 / Cost currency"],
      ["fx", "1 采购币 = ? 销售币 / FX"],
    ],
  ],
  [
    "定价与采购 / Price & sourcing",
    [
      ["price", "含税标价 / List price"],
      ["discount", "折扣 % / Discount"],
      ["cost", "进货成本 · 采购币 / COGS"],
      ["freight", "头程运费 · 采购币 / Freight"],
      ["fulfilment", "本地履约 · 销售币 / Fulfilment"],
    ],
  ],
  [
    "每单费用 / Variable costs",
    [
      ["tax", "含价销售税 % / Tax"],
      ["fee", "平台费 % / Platform"],
      ["returns", "退款率 % / Refunds"],
      ["returnCost", "退货额外成本 / Return handling"],
      ["cac", "固定 CAC / Ad cost per order"],
      ["adRate", "另加广告比例 % / Ad rate"],
    ],
  ],
  [
    "试销计划 / Pilot",
    [
      ["fixed", "固定启动预算 / Fixed budget"],
      ["units", "计划订单数 / Orders"],
      ["target", "目标贡献利润率 % / Margin"],
    ],
  ],
];
const currencies = [
  "MYR",
  "USD",
  "CNY",
  "PHP",
  "THB",
  "SGD",
  "IDR",
  "EUR",
  "GBP",
  "HKD",
];
for (const [title, fields] of groups) {
  const group = document.createElement("div");
  group.className = "group";
  group.textContent = title;
  $("fields").append(group);
  const grid = document.createElement("div");
  grid.className = "fieldgrid";
  for (const [k, label] of fields) {
    const el = document.createElement("label");
    el.textContent = label;
    const input = document.createElement(
      k.includes("Currency") || k === "currency" ? "select" : "input",
    );
    input.id = k;
    if (input.tagName === "SELECT") {
      for (const code of currencies) {
        const o = document.createElement("option");
        o.value = o.textContent = code;
        input.append(o);
      }
    } else {
      input.type = typeof defaults[k] === "number" ? "number" : "text";
      if (input.type === "number") {
        input.min = 0;
        input.step = k === "units" ? "1" : "any";
      } else input.maxLength = 120;
    }
    input.value = p[k];
    input.addEventListener("input", () => {
      p[k] =
        typeof defaults[k] === "number"
          ? input.value === ""
            ? NaN
            : Number(input.value)
          : input.value;
      if (k === "currency" || k === "costCurrency") {
        p.fx = p.currency === p.costCurrency ? 1 : NaN;
        $("fx").value = Number.isFinite(p.fx) ? 1 : "";
      }
      $("scenario").textContent = "自定义输入 · 请核实所有成本与费率";
      render();
    });
    el.append(input);
    grid.append(el);
  }
  $("fields").append(grid);
}
function money(n) {
  return n === null
    ? "无有限解"
    : Number.isFinite(n)
      ? n.toLocaleString("zh-CN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "—";
}
function cell(label, value, hint = "") {
  const e = document.createElement("div");
  e.className = "metric";
  const small = document.createElement("small");
  small.textContent = label;
  const strong = document.createElement("strong");
  strong.textContent = value;
  const span = document.createElement("span");
  span.textContent = hint;
  e.append(small, strong, span);
  return e;
}
function table(rows) {
  const t = document.createElement("table");
  for (const row of rows) {
    const tr = document.createElement("tr");
    for (const value of row) {
      const td = document.createElement("td");
      td.textContent = value;
      tr.append(td);
    }
    t.append(tr);
  }
  return t;
}
function render() {
  const errors = validate(p);
  $("error").textContent = errors.join("；");
  for (const id of ["output", "channels", "diagnosis"]) $(id).replaceChildren();
  for (const id of ["report", "csv", "save"])
    $(id).disabled = errors.length > 0;
  if (errors.length) return;
  const r = calculate(p),
    unit = p.currency;
  const verdict = document.createElement("div");
  verdict.className = "verdict" + (r.contribution <= 0 ? " bad" : "");
  const h = document.createElement("h2");
  h.textContent =
    r.contribution <= 0
      ? "先别上架：每单没有正贡献 / Pause"
      : r.total < 0
        ? "单笔盈利，整体尚未回本 / Pilot carefully"
        : "经济账可行，下一步验证需求 / Test demand";
  const sub = document.createElement("p");
  sub.textContent = `${p.name} → ${p.market} · ${p.units} 单预期损益 ${money(r.total)} ${unit}`;
  verdict.append(h, sub);
  $("output").append(verdict);
  const metrics = document.createElement("div");
  metrics.className = "metrics";
  for (const args of [
    ["每单贡献 / Contribution", money(r.contribution), unit],
    [
      "贡献利润率 / Margin",
      r.margin === null ? "无净收入" : money(r.margin) + "%",
      "贡献 ÷ 净收入",
    ],
    ["保本标价 / Break-even", money(r.breakPrice), unit],
    ["目标利润标价 / Target price", money(r.targetPrice), `目标 ${p.target}%`],
    ["固定 CAC 上限 / Max CAC", money(r.maxCac), unit],
    [
      "回本订单 / Break-even orders",
      r.breakUnits === null ? "无法回本" : String(r.breakUnits),
      "按当前单笔贡献",
    ],
  ])
    metrics.append(cell(...args));
  $("output").append(metrics);
  const panel = document.createElement("section");
  panel.className = "panel";
  const title = document.createElement("div");
  title.className = "sectiontitle";
  title.textContent = "02 / 每一单的钱去了哪里 · " + unit;
  panel.append(
    title,
    table([
      ["折后含税成交额", money(r.paid)],
      ["退款冲回后净收入（不含简化销售税）", money(r.net)],
      ["进货 + 头程（已按汇率转换）", "− " + money(r.landed)],
      ["本地履约", "− " + money(p.fulfilment)],
      ["平台费用", "− " + money(r.platform)],
      ["预期退货额外处理", "− " + money(r.returnLoss)],
      ["广告（固定 CAC + 成交比例）", "− " + money(r.ads)],
      ["每单贡献", money(r.contribution)],
      ["启动固定支出", "− " + money(p.fixed)],
      ["给定销量整体损益", money(r.total)],
    ]),
  );
  const threshold = document.createElement("div");
  threshold.className = "threshold";
  threshold.textContent =
    r.discountLimit === null
      ? "当前费用结构无有限保本价。"
      : r.discountLimit < 0
        ? `当前标价即使不打折仍不足以保本，需提高至至少 ${money(r.breakPrice)} ${unit}。`
        : `标价不变时，折扣超过 ${money(r.discountLimit)}% 就会亏损。固定 CAC 超过 ${money(r.maxCac)} ${unit} 就会亏损。`;
  panel.append(threshold);
  $("output").append(panel);
  for (const line of diagnostic(p, r)) {
    const el = document.createElement("p");
    el.textContent = line;
    $("diagnosis").append(el);
  }
  const fee = Number($("channelFee").value),
    cac = Number($("channelCac").value);
  if (
    $("channelFee").value === "" ||
    $("channelCac").value === "" ||
    fee < 0 ||
    fee >= 100 ||
    cac < 0 ||
    !Number.isFinite(cac)
  )
    $("channels").textContent = "请填写有效渠道费用：平台费 0–99%，CAC 非负。";
  else {
    const alt = calculate({ ...p, fee, cac });
    $("channels").append(
      table([
        ["渠道", "每单贡献", "整体损益"],
        ["当前渠道", money(r.contribution), money(r.total)],
        [$("channelName").value, money(alt.contribution), money(alt.total)],
      ]),
    );
    const rec = document.createElement("p");
    rec.className = "note";
    rec.textContent =
      alt.contribution <= 0 && r.contribution <= 0
        ? "两个渠道均亏损，请先调整成本或定价。"
        : `按费用假设，${alt.contribution > r.contribution ? $("channelName").value : "当前渠道"}贡献更高；转化率、销量和履约服务尚未比较。`;
    $("channels").append(rec);
  }
  try {
    localStorage.setItem("globalgtm-v2", encodeProject(p));
  } catch {
    $("status").textContent = "浏览器无法保存草稿，请下载 JSON。";
  }
}
function preset(next, custom = false) {
  p = { ...next };
  $("channelName").value = p.channel?.name ?? "备选渠道";
  $("channelFee").value = p.channel?.fee ?? 6;
  $("channelCac").value = p.channel?.cac ?? 24;
  for (const k of Object.keys(defaults)) $(k).value = p[k];
  $("scenario").textContent = custom
    ? "自定义项目 · 请替换价格与成本假设"
    : "虚构演示假设 · 费率与汇率均非实时行情";
  render();
}
$("electronics").onclick = () => preset(defaults);
$("fmcg").onclick = () =>
  preset({
    ...defaults,
    name: "植物洗发水 400ml",
    market: "菲律宾",
    currency: "PHP",
    fx: 7.8,
    price: 299,
    cost: 12,
    freight: 4,
    fulfilment: 30,
    cac: 65,
    fixed: 12000,
    units: 200,
  });
$("own").onclick = () => {
  preset({ ...defaults, name: "我的产品", market: "目标市场" }, true);
  $("name").focus();
  $("name").scrollIntoView({ behavior: "smooth", block: "center" });
};
if (p.channel) {
  $("channelName").value = p.channel.name;
  $("channelFee").value = p.channel.fee;
  $("channelCac").value = p.channel.cac;
}
for (const id of ["channelName", "channelFee", "channelCac"])
  $(id).addEventListener("input", () => {
    p.channel = {
      name: $("channelName").value,
      fee: $("channelFee").value,
      cac: $("channelCac").value,
    };
    render();
  });
function download(name, content, type) {
  const url = URL.createObjectURL(new Blob(["\ufeff", content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $("status").textContent = "已生成下载：" + name;
}
$("save").onclick = () =>
  download("globalgtm-project.json", encodeProject(p), "application/json");
$("report").onclick = () =>
  download("globalgtm-report.txt", report(p, calculate(p)), "text/plain");
$("csv").onclick = () =>
  download(
    "globalgtm-details.csv",
    [
      ["metric", "value", "currency"],
      ...Object.entries(calculate(p)).map(([k, v]) => [
        k,
        v ?? "no finite solution",
        ["margin", "discountLimit"].includes(k) ? "%" : k === "breakUnits" ? "orders" : p.currency,
      ]),
    ]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n"),
    "text/csv",
  );
$("load").onclick = () => $("file").click();
$("file").onchange = async () => {
  try {
    const f = $("file").files[0];
    if (!f) return;
    if (f.size > 100000) throw Error("文件过大（上限 100KB）");
    preset(decodeProject((await f.text()).replace(/^\uFEFF/, "")), true);
    $("status").textContent = "项目已成功载入。";
  } catch (e) {
    $("status").textContent = "载入失败：" + e.message;
  } finally {
    $("file").value = "";
  }
};
$("language").onclick = () => {
  $("englishGuide").hidden = !$("englishGuide").hidden;
  $("englishGuide").open = true;
  if (!$("englishGuide").hidden)
    $("englishGuide").scrollIntoView({ behavior: "smooth", block: "center" });
};
if (restored) {
  $("scenario").textContent = "已恢复你的草稿 / Draft restored";
  $("status").textContent = "已恢复上次保存的有效输入。";
}
render();
