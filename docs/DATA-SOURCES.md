# Trusted Data Sources & Citation Policy / 可信数据来源与引文规则

## Source register / 数据源登记

| Source | Intended use | MVP status | Authentication / limits | Citation captured |
| --- | --- | --- | --- | --- |
| [World Bank Indicators API](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation) | Population, GDP per capita, internet use, urbanization | Live connector | No API key for Indicators API | Indicator ID, value, observation year, query URL, fetch time |
| [UN Comtrade](https://comtradeplus.un.org/) | Product-level import value, partner share, trend | Planned | Account/API limits may apply | Reporter, partner, flow, HS version/code, period, value, download time |
| [WTO Tariff Download Facility](https://www.wto.org/english/tratop_e/tariffs_e/database_explanation_e.htm) | MFN applied/bound tariff checks | Manual evidence gate | Public download; interpretation required | Reporter, HS6, tariff type, year, rate, file URL |
| [UNSD HS 2022](https://unstats.un.org/unsd/classifications/Econ) | HS-code taxonomy and version | Reference | Public | HS version, code, description |
| Marketplace listing | Competitor offer and price | Manual in MVP | Platform terms apply | URL, seller, variant, currency, observed price, timestamp, screenshot/reference ID |
| Distributor interview | Margin, MOQ, service and territory constraints | Manual in MVP | Consent required | Interview date, role, structured notes, confidence |

## Data-mode definitions / 数据模式定义

### `example / 示例`

Illustrative content used to demonstrate the workflow. It may be internally coherent but is not current market research. Example competitor prices and cost assumptions must never be copied into a real proposal without verification.

### `live / 实时`

Successfully retrieved from a named external source during the session. “Live” describes the retrieval path, not the observation date. The UI therefore displays the source year separately.

### `proposed / 建议`

A product positioning, channel mix or action plan that has not yet been validated. It is a recommendation, not a fact.

### `ai-assisted / AI 辅助`

Synthesized by a model from the supplied brief and evidence. It is not automatically true and remains subject to the same citation and human-review rules.

## Citation policy / 引文规则

1. **No naked numbers.** Every external number must carry source, market, period and retrieval context.
2. **Observation date ≠ retrieval date.** Store both.
3. **No source laundering.** A model answer is not the original source.
4. **No false precision.** Round display values appropriately; retain raw values for audit.
5. **No silent imputation.** Missing live data is shown as unavailable.
6. **Separate proxy from target.** Internet usage is context, not category demand or TAM.
7. **Version classifications.** Trade queries record HS version and code.
8. **Archive decision evidence.** A production report should store an immutable evidence snapshot.

## MVP indicator definitions / 第一版指标

| ID | Indicator | Interpretation boundary |
| --- | --- | --- |
| `SP.POP.TOTL` | Population | Addressable context only; not customer count |
| `NY.GDP.PCAP.CD` | GDP per capita, current USD | Broad purchasing-power context; not category willingness-to-pay |
| `IT.NET.USER.ZS` | Individuals using the internet | Digital access context; not marketplace traffic |
| `SP.URB.TOTL.IN.ZS` | Urban population share | Distribution context; not serviceable market size |

## Before a real Malaysia launch / 真实决策前必须补齐

- Confirm the product’s HS6 classification with a qualified broker.
- Verify current duty, sales tax, origin rules and battery-related import requirements.
- Confirm marketplace fee tables and payment/returns treatment for the exact seller program.
- Capture at least ten timestamped competitor observations across variants and sellers.
- Validate warranty reserve, reverse logistics and service SLA with local partners.
- Run customer/keyword evidence and a controlled offer test before scaling.
