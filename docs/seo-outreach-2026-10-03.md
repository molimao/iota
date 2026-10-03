# SEO / GEO 与资源目录提交记录 — 2026-10-03

## 已执行的外部更新

| 渠道              | 操作                                                                                                                               | 可核验结果                                                     | 当前状态                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------- |
| GitHub 项目 About | 将过时的 bilingual 介绍改为五语言，注明 IOTA Train at Home、XID / MMM、Quantus QTC 三个独立监控入口；保留官网地址并补充相关 topics | <https://github.com/molimao/iota>                              | 已更新并读回核对；未推送代码                  |
| Awesome Bittensor | 按贡献说明，通过 Issue 推荐到 Useful Tools and Platforms；披露维护者自行提交，说明 SN9 监控用途和只读边界                          | <https://github.com/learnbittensor/awesome-bittensor/issues/3> | 公开 OPEN，等待维护者审核；尚未进入目录主清单 |
| Awesome DePIN     | 按 README 接受 Issue 的方式，推荐到 Analytics；聚焦 Train at Home 分布式训练，不将 XID / Quantus PoW 描述为 DePIN                  | <https://github.com/iotexproject/awesome-depin/issues/92>      | 公开 OPEN，等待维护者审核；尚未进入目录主清单 |

以上只证明提交成功，不代表目录采纳、搜索引擎收录、排名提升或流量增长。没有购买外链、建立无关目录账号或批量投放。

## 本轮本地官网改动

- 修正 FAQ 仍称仅监控 IOTA 的过时介绍。五种语言直接使用对应语言的新项目问答，明确项目、公开标识、奖励口径与同步范围。
- 说明 IOTA SS58 Miner ID、XID xpa1r 主网收益地址、Quantus Wormhole Address 的区别；说明 Quantus 出块奖励索引不等于矿池个人转账账本。
- 为旧 IOTA 专属问题加上 IOTA 标记，避免用户或答案提取工具将 IOTA 的刷新频率、设备限制和收益单位用于其他项目。
- FAQ 标题包含三个项目，页面增加 XID / MMM 安装、Quantus 主网同步和项目比较教程入口。
- FAQ 结构化答案与实际可见的 16 条问答共用同一份内容；五语言共 80 条答案。标准链接、语言标签与修改日期保持一致。
- 首页应用实体关联三个独立项目及公开 MIT 许可证。既有 GitHub 身份链接保留。
- 网站地图更新 FAQ 的实际修改日期；机器可读完整文本增加五语言公开 FAQ，与可见内容保持一致。
- README 更新五语言、三个项目的范围及教程链接。

这些代码、README 和抓取文件修改尚未推送或部署。每次生产发布仍需用户针对本次改动确认。

## 搜索意图与对应页面

这是关键词意图映射，不是已验证的搜索量或排名报告。五语言落地内容使用对应语言，项目缩写、公开地址与币种保持准确。

| 项目      | 关键词 / 用户问题                                                  | 已有落地页                                                             |
| --------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| IOTA      | IOTA Train at Home monitor、SN9 status、Miner ID vs payout address | `/en/learn/iota-miner-id-vs-payout-address`、`/en/learn/find-miner-id` |
| XID / MMM | xCoin MMM Mac mainnet mining、xpa1r payout address                 | `/en/learn/xid-mmm-mainnet-setup`                                      |
| XID / MMM | MMM worker hashrate、accepted shares、worker not visible           | `/en/learn/xid-worker-hashrate-shares`                                 |
| XID / MMM | XID immature balance、mining rewards maturity                      | `/en/learn/xid-rewards-balance-maturity`                               |
| Quantus   | Quantus QTC Mac mining、mainnet node sync                          | `/en/learn/quantus-mainnet-mining-mac`                                 |
| Quantus   | Quantus Wormhole mining reward address                             | `/en/learn/quantus-wormhole-rewards`                                   |
| Quantus   | Quantus mining no rewards、pool payment vs block reward            | `/en/learn/quantus-mining-no-rewards`                                  |
| 项目比较  | IOTA vs XID MMM vs Quantus、training vs mining on Mac              | `/en/learn/iota-xid-quantus-compared`                                  |

本轮 FAQ 补齐身份、地址、同步和收益范围，支持上述已发布教程的发现与正确理解。没有把上轮已发布的文章计为本轮新增文章。

## 验证

- 分支：main；初始工作区干净，未创建分支或 worktree。
- 生产公开页面审计完成于 2026-10-03 12:08:47 UTC（香港时间 20:08:47）：网站地图 175 个 URL，全部 HTTP 200，标题、描述、标准链接、六个语言关联链接及可解析的结构化数据均通过；同语言标题没有重复，未发现意外 noindex。
- 从这些页面提取出的 11 个额外站内目标均返回 HTTP 200，包括五语言 app / account 和状态脚本下载；私人视图仍排除于网站地图。
- 五语言本地 FAQ 实际 HTML 检查通过：80 条结构化答案、标准链接与项目教程入口一致。
- TypeScript 检查和构建通过；67 项测试通过，1 项需要显式启用的上游在线测试跳过。
- 相关文件 ESLint 无错误；pages.tsx 已存在的组件热刷新导出警告仍为 1 条。
- IndexNow 本轮只读检查：175 个 URL，公开所有权验证文件有效。上一轮在 2026-10-03 11:43:47 UTC 已提交并获 HTTP 200，本轮未重复提交尚未修改的生产 URL。

## 待补充信息的渠道

- Google Search Console：已打开该站点网站地图的登录入口，当前浏览器未登录。需要用户完成登录后才能操作其站点属性；尚未声称 Google 提交成功。
- SoMuch 免费目录：需要联系邮箱并发送验证邮件，已向用户询问可用于该目录的邮箱；尚未提交。提交后也需区分邮件验证与编辑审核。

## 未采用的渠道与边界

- DEV Resources 的贡献说明要求面向开发者构建软件的资源，本站主要面向挖矿 / 训练设备运营者，未强行归类。
- OpenSourceAlternative.to 要求对应真实的专有软件替代品，尚未找到适合本站的对照，不虚构竞争产品。
- OpenHub 的账号政策明确禁止为广告、外链生成或 SEO 创建账号，因此未注册。
- Open Source Software Directory 采用联系维护者的邮箱提交方式，本轮没有可用的邮件发送连接，也未宣称已发邮件。
- 没有把 llms.txt 当作 Google 排名因素，也不承诺 FAQ 富结果或 AI 答案引用。机器可读资料用于保持事实一致，可见正文、可抓取内链和官方来源仍是内容基础。

## 发布后步骤

得到本次明确发布确认后，再提交 / 推送 main 并发布官网；检查五语言 FAQ 与抓取文件的生产版本，再提交实际发生变更的生产 URL。目录审核结果与 Search Console 收录数据需以后取得真实结果再记录，不提前填充。
