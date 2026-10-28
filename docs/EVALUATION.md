# Evaluation / 评估

自动测试分三组：32 个旧版回归（不计作 V2 验收）、34 个利润引擎/存储编解码测试、6 个 REST AI 输出解析边界测试。
Tests separate 32 legacy regression checks, 34 profit-model/codec tests and 6 REST parsing cases.

V2 覆盖独立手算、保本反解、目标利润率、CAC 上限、折扣阈值、币种汇率、退款、无有限解、零售价/销量、负值/NaN/Infinity、项目格式及 CSV 注入。浏览器验证另行记录，不能用纯算术测试代替。
Browser results are recorded separately. Pure arithmetic checks do not substitute for browser acceptance.

商业评估尚未完成：需真实用户完成任务、需求验证和付费试销，不能声称有已校准置信度或预测准确率。
No calibrated confidence, demand prediction accuracy or real commercial validation is claimed.
