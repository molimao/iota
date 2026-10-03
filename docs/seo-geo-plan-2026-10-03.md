# IOTA、XID / MMM、Quantus 内容与搜索优化

核对日期：2026-10-03。状态：本地实现，待用户审查确认后发布。

## 调研方法与定位

结合中、英、韩、日搜索结果、各项目官方文档和本站真实功能选择主题。下表为搜索意图与内容规划，不是搜索量报告；没有访问关键词付费数据库或本轮 Search Console 查询数据，不提供虚构的搜索量、难度和排名预测。

沿用 IOTA Watch / iotahome.site 品牌。IOTA 仍是首页和设备监控的主项目；XID、Quantus 在独立项目入口和教程中描述。研究发现 MMM 与其他矿工程序重名，QTC 与其他币种重名，Quantus 也指向其他软件，IOTA 还有公链与 Train at Home 的区分。因此标题和正文说明完整项目名称、网络、标识和数据范围。

## 页面与关键词意图

以下每个新页面均有简体中文、繁体中文、英文、韩文和日文版本，共新增 40 个语言 URL。每篇覆盖一个完整问题，不为拼写变体单独复制页面。

| 内页（`/语言/learn/`）          | 主要搜索意图与词组                                               | 内容重点                                                  |
| ------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| xid-mmm-mainnet-setup           | XID 挖矿教程、MMM Mac 主网设置、xCoin mining Mac                 | 确认正确 MMM 来源、主网地址与矿池配置、监控入口           |
| xid-worker-hashrate-shares      | XID Worker 算力、MMM hashrate、xCoin accepted shares             | 上报与估计算力、单位换算、份额与区块、Worker 与设备的区别 |
| xid-rewards-balance-maturity    | XID 收益查询、xCoin coinbase maturity、MMM rewards               | 浏览器余额与累计收益、奖励成熟、份额与付款的区别          |
| quantus-mainnet-mining-mac      | Quantus Mac 挖矿、QTC mainnet mining、Quantus node sync          | 节点同步、矿工版本与主网设置，链接当前官方安装说明        |
| quantus-wormhole-rewards        | Quantus 收益查询、QTC wormhole address、QTC mining rewards       | Address 与 inner hash、今日窗口、精度、累计与余额         |
| quantus-mining-no-rewards       | Quantus 没收益、QTC rewards zero、Quantus mining troubleshooting | 真零、未索引与读取失败的区别；节点同步；矿池转账覆盖限制  |
| iota-miner-id-vs-payout-address | IOTA Miner ID、Train at Home 收款地址、hotkey coldkey            | 设备标识与收款地址、多设备共用收款地址、账号清单的作用    |
| iota-xid-quantus-compared       | IOTA XID Quantus 对比、MMM 是什么、Mac mining vs training        | 训练与 PoW、三种标识和收益口径的对照表                    |

已有 `how-rewards-work` 和 `iota-rewards-in-usd` 增补五语结论与问答，保留原路径、正文与首次发布日期，更新修改日期，避免再创建同意图的竞争页面。

韩文意图示例：`XID 채굴 Mac`、`MMM 메인넷 설정`、`XID 워커 해시레이트`、`Quantus 채굴 보상 조회`、`QTC 보상 없음`、`IOTA Miner ID 보상 주소`。

日文意图示例：`XID マイニング Mac`、`MMM メインネット 設定`、`XID 報酬 成熟`、`Quantus 採掘 同期`、`QTC 報酬 確認`、`IOTA Miner ID 報酬アドレス`。

优先覆盖安装后查询、收入解读和问题排查：这些意图与本站可用监控功能直接衔接。没有实测硬件收益，不添加显卡排行榜、收益承诺或价格预测。

## 官方资料与数据边界

- [Macrocosmos Train at Home 用户指南](https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide)与[常见问题](https://docs.macrocosmos.ai/product-and-services/tah/faqs)：解释 Miner ID、收款与收益。本站今日收益窗口、缓存规则和账号额度以本站实现为准，并明确区分。
- [xCoin 官网](https://xcoinproject.com/)、[MMM 主网说明](https://macmetalminer.com/)与[当前 MMM 仓库](https://github.com/SystemThreat/MMM)：确认应用身份、主网地址与奖励成熟。[白皮书](https://xcoinproject.com/whitepaper) 进一步确认官网矿池为 Solo / coinbase 直接归属模式，份额不能当持续分红。资料与软件版本会变，正文不复制容易过期的安装命令和矿池端口。Worker 标签不能证明设备数量或硬件型号。
- [Quantus 挖矿与节点指南](https://docs.quantus.com/guides/mining/)与[主网浏览器](https://explorer.quantus.com/)：解释节点同步、主网与退役测试网、公开 Wormhole 地址和奖励记录。本站矿工奖励索引覆盖链上区块奖励，不能当作矿池给参与者的完整付款账本；余额、索引累计、设备在线状态也不能互相推导。
- [IOTA Watch 源码](https://github.com/molimao/iota)：本站展示口径的可核对来源。本站是独立监控工具，不冒用官方作者身份。

## SEO 和 GEO 实现

1. 五语正文、摘要和可见问答；对比页使用可读表格。项目页、指南库、博客入口和相关文章组成内部链接，教程按钮跳到对应项目监控。
2. 每页独立标题、描述、规范地址、自引用 canonical、五语 hreflang 与英文 x-default。原 IOTA 路径保持含义；不存在的文章继续返回 404。
3. Article 标注真实发布方、日期、官方引用和独立项目实体；FAQPage 仅描述页面真实展示的问答；项目页 ItemList 与可见教程一致。
4. Sitemap 扩充到 175 个公开语言 URL；私有设备和账号页继续 noindex。
5. `.md` 文本版本和 llms-full.txt 包含与页面一致的摘要、表格、正文、问答和来源；llms.txt 更新项目身份和查询覆盖范围。
6. 保留黑白样式，手机上的对比表在自己的容器内横向滚动，指南内容有快捷定位、目录和明确出处。

遵循 [Google AI 搜索指南](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide?version=published)和[AI features 文档](https://developers.google.com/search/docs/appearance/ai-features)：有用内容、可抓取正文、内部链接和标记一致性是基础，没有专门的 AI Schema 要求。Google 不使用 llms.txt 提升排名；文本文件是其他读取工具的便利入口。[FAQ 搜索展示限制](https://developers.google.com/search/blog/2023/08/howto-faq-changes)意味着本项目不承诺 FAQ 富结果。收录和 AI 引用均不保证。

## 验收与发布后观察

发布前：检查类型、测试、变更文件静态检查与生产构建；验证 40 个新 HTML 页面、五语 canonical/hreflang、问答标记和可见正文一致；确认文本版本、站点地图、404、项目链接和手机布局。

发布必须逐次获得用户明确确认，本轮不推送、不部署、不向搜索引擎提交未上线页面。用户批准并上线后，核对公开 URL，再提交更新的 sitemap / IndexNow，并在可访问的 Search Console 中观察收录、展示、查询词、点击率与对应项目入口访问。没有获准或没有账号访问时不声称已提交或已取得数据。

后续依据真实查询词补充内容和改善已有页面；每次项目规则变动重新核对官方来源，不能仅修改日期制造新鲜感。

## 本轮本地验收结果

- 65 项测试通过，1 项需要显式开启的官方接口在线测试保持跳过。
- TypeScript 检查通过，正式构建通过；变更代码静态检查没有错误，保留原有的 1 条热更新组织方式警告。
- 新增 40 个 HTML 页面与 40 个 Markdown 版本全部返回 200；逐页核对摘要、问答、规范地址和五语语言链接。站点地图包含 175 个 URL，不存在的教程返回 404。
- 375px 手机预览无正文水平溢出，对比表在自己的容器内滚动；韩文 XID 与日文 Quantus 教程跳向对应监控，浏览器没有报错。
- 顺便修复桌面页脚链接挤成逐字换行的问题；继续使用黑白样式。
