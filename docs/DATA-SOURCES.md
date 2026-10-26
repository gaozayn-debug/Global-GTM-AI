# Data and assumptions / 数据来源

V2 所有数字来自用户输入或清楚标注的虚构演示。汇率、平台费、税率、竞品与需求均不声称实时或已验证。本版不显示竞品或宏观背景卡片。
All V2 figures are user inputs or explicitly fictional demo assumptions. No live FX, platform fees, taxes, competitors or demand data are claimed.

需要用户自行收集 / Evidence to collect:
- 供应商正式报价与币种 / dated supplier quote and currency.
- 物流与当地履约合同 / freight and fulfilment quotations.
- 目标平台卖家中心与费用合同 / seller fee schedules and contract.
- 当地税务与产品合规确认 / local tax and compliance review.
- 小规模订单真实成交、退款及广告消耗 / actual pilot order/refund/ad records.

## 模型 / Model
D = listPrice × (1 − discount). N = D × (1 − refundRate) / (1 + taxRate).
L = (purchaseCost + freight) × FX. B = L + fulfilment + refundRate × returnHandling.
C = N − B − D × platformFee − fixedCAC − D × adRate.
Margin = C / N. Total = C × orders − startupBudget.
K = (1 − discount) × [(1 − refundRate)/(1 + taxRate) − platformFee − adRate].
Break-even list price = (B + fixedCAC)/K if K > 0.
Target price = (B + fixedCAC)/[K − targetMargin × (1 − discount) × (1 − refundRate)/(1 + taxRate)] if denominator > 0.
Maximum fixed CAC = N − B − D × (platformFee + adRate).
Break-even orders = ceil(startupBudget / C), only if C > 0.
Maximum discount = 1 − (B + fixedCAC) / {listPrice × [(1 − refundRate)/(1 + taxRate) − platformFee − adRate]}.

每单一件；退货不计库存残值；进货和履约成本按每笔下单计。平台费/广告按折后含税价不退还。税为简化含价销售税，不是普适 VAT/关税模型。关税须用户自行并入成本。正贡献不是需求证据。
One item per order, no recovered inventory value, fees/ads not refunded. Simplified inclusive sales tax is not a universal VAT/duties model. Positive economics do not establish demand.
