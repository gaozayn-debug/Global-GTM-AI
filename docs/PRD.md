# GlobalGTM AI V2 / 出海利润实验室

## 产品目标 / Goal
让求职展示的访客在 30 秒内回答：这款产品在给定成本、价格和渠道假设下，是否值得小规模试销？
Help visitors test whether a product's unit economics justify a small pilot within 30 seconds.

GTM 决定卖给谁、在哪卖、定什么价、怎样获客，再通过试销判断能否扩大。
GTM connects customer, channel, pricing and acquisition choices with a measured pilot.

## 主要用户 / Users
出海销售、渠道 BD、快消管培、零基础业务人员及招聘评审。Cross-border sales, channel BD, FMCG trainees and hiring reviewers.

## MVP
一键消费电子/快消虚构演示；自有产品输入；显式跨币种汇率；售价、折扣、退款、税、平台费、广告、物流、启动预算、销量与目标贡献利润率；实时确定性计算；渠道对比；行动建议；TXT/CSV/JSON 导出；草稿恢复及项目重新载入。
Fictional demos, editable economics, explicit FX, live deterministic calculations, alternative-channel comparison, actionable thresholds, report/data/project exports and project reload.

## 验收 / Acceptance
输入变化必须改变相关结果；无有效输入不得展示旧结论；亏损不推荐扩大；无限解显示不可解；同币种汇率强制 1，跨币种切换要求重新填汇率。刷新恢复有效草稿。导入错误应可读，不能破坏当前项目。数据经 textContent 渲染避免 HTML 注入。
Results respond to input; invalid inputs clear stale conclusions; losses block scaling advice; infeasible thresholds have no finite solution; FX must be explicit; valid drafts survive reload; failed imports preserve the current project.

## 不在本版 / Out of scope
无真实需求预测、实时费率、竞品抓取、批量 SKU 导入、生成式 AI 诊断、用户云账户、云端项目同步。本版主流程无需 API key，托管后无需用户电脑运行。
No demand forecasts, live fees, competitor scraping, batch SKU import, generative AI diagnosis, accounts or cloud project sync. The hosted workflow runs without an API key or the owner's computer.

## 成功衡量 / Measurement
后续需真实用户验证：30 秒内首次结果完成率、参数修改率、报告下载率、访谈能否正确解释 CAC 上限。当前不声称已获得这些指标。
Future usability metrics: first result within 30 seconds, parameter edits, report downloads and correct interpretation of the CAC ceiling. No user-study results are claimed.
