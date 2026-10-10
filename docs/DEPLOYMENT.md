# 部署指南

当前官网由 Lovable 发布，默认构建目标为 Cloudflare Workers。首次独立部署需要自己的 Supabase 和 Cloudflare 账号；Google 登录还需要适配认证接入。仅复制源码并发布不能自动获得完整账号功能。

## 1. 安装并准备配置

使用 Node.js 24 LTS，在终端执行：

```sh
git clone https://github.com/molimao/iota.git
cd iota
npm ci
cp .env.example .env.local
```

打开自己的 Supabase 项目，复制项目 URL 和 **publishable key** 到 `.env.local`。`VITE_` 字段和对应的不带前缀字段填写相同的值：

| 内容                 | 对应字段                                                    |
| -------------------- | ----------------------------------------------------------- |
| 项目 URL             | `VITE_SUPABASE_URL`、`SUPABASE_URL`                         |
| 公开 publishable key | `VITE_SUPABASE_PUBLISHABLE_KEY`、`SUPABASE_PUBLISHABLE_KEY` |
| 项目 ID              | `VITE_SUPABASE_PROJECT_ID`、`SUPABASE_PROJECT_ID`           |

仓库 `.env` 是现有官网的公开客户端配置。独立部署时应使用自己的项目，避免连接到官网数据库。`.env.local` 已被 Git 忽略；不要把私密 key 填入 `VITE_` 字段。

Supabase 明确允许 publishable key 出现在浏览器和源码中；它的访问范围受数据库权限和行级访问策略约束。`sb_secret_`、service role key、OAuth secret 和用户会话属于私密凭据，只读监控不需要 Supabase 管理密钥。可选的订阅功能需要在服务器配置 SUPABASE_SERVICE_ROLE_KEY，以写入经过 Stripe 签名校验的订阅状态；不得填入浏览器字段或提交到 Git。参见 [官方 API key 说明](https://supabase.com/docs/guides/getting-started/api-keys)。

## 2. 初始化自己的数据库

在自己的 Supabase 项目 SQL Editor 中，按顺序执行：

1. [`20260912082005_6a930f9e-e1ba-4207-ab6f-856139f2ec92.sql`](../supabase/migrations/20260912082005_6a930f9e-e1ba-4207-ab6f-856139f2ec92.sql)
2. [`20260912082034_0786a71f-0274-4846-892c-612b08ee7db7.sql`](../supabase/migrations/20260912082034_0786a71f-0274-4846-892c-612b08ee7db7.sql)

这两份迁移建立账号设备表，启用用户只能访问自己设备的行级策略；新的设备与订阅迁移另行规定每个项目的配额。请在新项目中执行一次；已有表的项目应通过迁移工具管理版本。

免费版每个项目 5 台、Pro 每个项目 50 台；设备聚合视角不另设总配额。未登录时保存在浏览器，登录后保存到账号。新功能还需执行 20261005130000_fleet_and_billing.sql 并配置 Stripe 服务端参数，必须先完成沙盒验证并获得当次生产发布确认；该迁移尚未在生产执行。

## 3. 本地检查与登录接入

```sh
npm run dev
```

打开 **http://localhost:8080/zh/app**，检查设备添加和全网页面。官方训练 API 不需要额外申请密钥；官方限流可能使页面显示旧数据或暂时缺失。

**独立部署的登录接入仍需开发配置。** 当前 [`use-auth.ts`](../src/hooks/use-auth.ts) 调用 Lovable Cloud OAuth。使用自己的 Supabase 项目时，需要配置 Google provider、授权回调和本站跳转地址，再将登录调用适配为自己的认证流程。只在 Supabase 开启 Google provider 不会自动替换 Lovable 登录。原官网继续使用原有 Lovable 接入。

## 4. 构建并发布到自己的 Cloudflare Workers

本应用含服务端 API 代理和页面渲染，需要部署服务端与静态资源。仅上传 `.output/public` 无法运行完整应用。

先确认 `.env.local` 已配置为自己的项目，然后执行：

```sh
npm run build
```

当前默认构建生成 `.output/server/wrangler.json`、服务端入口与 `.output/public`。生成的配置包含静态资源绑定。发布时指定自己的 Worker 名称：

```sh
npx wrangler login
npx wrangler deploy --config .output/server/wrangler.json --name my-iota-watch
```

将 `my-iota-watch` 替换为自己账号中要创建的名称。在 Cloudflare 的该 Worker 设置中配置服务端 `SUPABASE_URL`、`SUPABASE_PUBLISHABLE_KEY` 和 `SUPABASE_PROJECT_ID`。每次发布都保持这些配置；`VITE_` 值在构建时写入浏览器资源，修改后需要重新构建。

发布成功后使用 Cloudflare 返回的地址测试。绑定自己的域名时，还需修改 [`src/lib/site.ts`](../src/lib/site.ts) 中的 `CANONICAL_HOST`，并更新 sitemap、robots 与 llms 文件中的官网地址。Google 登录的跳转允许列表也要包含新域名。

发布流程依据 [Nitro Cloudflare 部署文档](https://nitro.build/deploy/providers/cloudflare)。仓库构建产物已检查；首次在自己的 Cloudflare / Supabase 账号部署时，仍需验证登录回调、数据库策略和线上配置。

## 5. 验证结果与常见问题

- **页面能打开但登录失败**：核对 Google provider、回调地址，以及是否已替换 Lovable OAuth 接入。
- **登录后不能保存设备**：检查两份迁移是否都已执行，用户是否已登录，以及数据库行级策略是否保留。
- **改了配置但仍连接旧项目**：重启本地开发服务；线上实例重新构建并发布，核对 Worker 的运行时变量。
- **构建成功但线上 API 不通**：确认发布了服务端入口和静态资源绑定，而不是只上传静态目录。
- **数据显示暂时缺失**：先查看页面的来源、读取时间和错误提示；上游拒绝请求并不代表本站部署失败。
- **新域名的 SEO 仍指向官网**：核对 `CANONICAL_HOST` 与生成的抓取文件，配置运行时来源地址不能替代全部 SEO 域名设置。

部署完成后验证：中英文页面可访问、全网数据有读取时间、未登录设备刷新后仍保留；适配登录后，确认登录用户能保存设备并且退出后看不到账号设备。

## 6. 可选 Stripe 订阅

新订阅价格为 US$2.99/月或 US$16.99/年，一份 Pro 订阅将各项目额度分别提高到 50 台；免费额度各项目 5 台，设备聚合视角不设总量配额。

1. 在自己的 Stripe 沙盒创建同一产品下的月付和年付价格（USD 299/月、1699/年），数量固定为 1。
2. 配置客户门户：允许到期取消；禁用修改订阅数量。将门户配置 ID 填入服务端 `STRIPE_PORTAL_CONFIGURATION_ID`。
3. 在服务器配置 `.env.example` 的 Stripe 字段，以及 `SUPABASE_SERVICE_ROLE_KEY`。密钥只保存在未跟踪的 `.env.local` 或部署平台 Secrets 中。
4. 注册服务器通知地址 `https://你的域名/api/stripe/webhook`，监听 `checkout.session.completed`、`checkout.session.async_payment_succeeded`、`customer.subscription.created/updated/deleted/paused/resumed`、`invoice.paid` 和 `invoice.payment_failed`。将该通知端点的签名密钥存入 `STRIPE_WEBHOOK_SECRET`。
5. 在沙盒中完成登录账号 → 结账 → 签名通知投递 → 各项目 50 台的验证，以及取消后的到期权益验证。只打开成功返回页不代表权益已到账。
6. 正式收款前，由经营者完成 Stripe 商户激活。正式环境需要单独的产品价格、门户配置、API 密钥和通知端点；沙盒 ID 不能复用。设置 `STRIPE_MODE=live`、`STRIPE_LIVE_ENABLED=true`，并获得当次生产发布确认后再上线配置。

通知会重新向 Stripe 读取订阅状态；客户端不能直接写入付费额度。签名校验、账号关联和数据库事务失败时不授予新权益。

服务器可使用受限正式密钥。所需权限为 Accounts、Products、Prices、Subscriptions、Events **读取**，Customers、Checkout Sessions、Customer Portal、Webhook Endpoints / Event Destinations **写入**；无需授予退款或提现权限。只能将私密字段写入服务器 Secrets，不得使用 `VITE_` 前缀，也不得放进聊天或公开配置。

官网的正式目录核对记录位于 `docs/stripe-live-catalog.json`，仅记录公开对象 ID 和实际验证状态。维护者将正式密钥放在被 Git 忽略、权限为 0600 的 `.env.production.local` 后，可执行 `node scripts/stripe-live-config.mjs inspect` 核对商户收款状态与两个价格。`prepare --apply` 会创建本站客户门户及通知端点，并把签名密钥保存到同一私密文件；它不创建客户、订阅或付款。此命令属于正式配置操作，执行前仍需获得当次授权。将生成的服务端字段填入托管后台 Secrets 后，才能继续迁移和发布，并验证线上通知交付。

本仓库此次验证：真实沙盒年付 Checkout 成功，已支付金额为 US$16.90；测试订阅设置到期取消后仍保持有效。真实 Stripe 事件经本地签名重放到临时 PostgreSQL，验证了每项目额度 5→50 与取消后的本期权益。此验证未向生产数据库写入数据，尚未验证托管网站的真实登录与通知投递。

复测沙盒（只允许测试密钥，不接受正式密钥）：

```sh
node scripts/stripe-sandbox.mjs prepare
# 打开本机临时状态文件中的 Checkout 地址，以 Stripe 官方虚拟测试卡完成付款
node scripts/stripe-sandbox.mjs verify
node scripts/stripe-sandbox.mjs cancel-test
STRIPE_SANDBOX_CHECK=1 npx vitest run src/lib/billing-sandbox.live.test.ts
```

`prepare` 会创建一个虚拟测试客户、结账会话及测试门户配置。临时状态保存在本机 `/private/tmp/iota-stripe-sandbox.json`，不要提交或公开其中的会话链接。`cancel-test` 只会将该测试订阅设为本期结束时取消。默认测试套件跳过需访问 Stripe 的检查。

接口和虚拟卡说明参见 [Stripe 沙盒测试](https://docs.stripe.com/testing)、[签名通知](https://docs.stripe.com/webhooks) 与 [客户门户](https://docs.stripe.com/customer-management/activate-no-code-customer-portal)。


## Optional io.net / Vast.ai connections

Apply `20261006190000_compute_projects.sql` after the fleet/billing migration, then `20261006200000_platform_connections.sql`. These migrations extend project quotas and create a server-only encrypted credential table. They preserve existing device records. Production changes require the owner's release approval.

Set `WATCH_CONNECTION_ENCRYPTION_KEY` in the **server secret store**, using an independently generated 32-byte base64 key (`openssl rand -base64 32`). Do not put this value in `VITE_*`, source control, or client configuration. Missing configuration disables account connections; public Akash/Golem lookups do not require this secret. Losing or rotating this key requires users to disconnect and reconnect their platform accounts.

Users connect their own io.net Explorer access token or Vast.ai API key while signed in. For Vast.ai use only `machine_read` and `billing_read`. Credential ciphertext is bound to the owner and project with AES-GCM and expires for use after seven days. The browser cannot read the credential table. Disconnect deletes the stored credential and clears that user's server cache; revoke the key at the platform to revoke it everywhere. The integration makes fixed-origin GET requests only and returns a reduced device/reward response, excluding profile, tax, and address fields.

Validate with `npx vitest run`, `npx tsc --noEmit`, and `npm run build`. Local `/zh/review?platform=vast` (also `ionet`, `akash`, `golem`) uses clearly labelled samples; the review route is disabled in production. io.net/Vast.ai currently have contract-level mocked verification, not real-account acceptance testing. Before presenting them as fully verified, test a consenting provider account, token expiry, disconnect, reward periods, and partial permissions. Golem Stats connectivity must be checked from the deployment environment; an upstream failure must remain unavailable, never zero.

## 价格调整（2026-10-06，已发布）

新订阅使用 US$2.99/月、US$16.99/年的新 Stripe Price ID。当前 `stripe-live-catalog.json` 与 `stripe-test-catalog.json` 保留已验证的旧价格记录，不能直接改写金额并继续使用旧 ID。

获得当次生产配置与发布确认后，为同一产品创建两个新价格，更新服务器 `STRIPE_PRICE_MONTHLY`、`STRIPE_PRICE_ANNUAL`，并将旧月付、年付 Price ID 填入 `STRIPE_LEGACY_PRICE_IDS`。旧订阅继续原价续费和 Pro 权益；旧 ID 只用于订阅验证，新结账只选择新价格。同步更新目录核验记录并发布页面与服务器，避免展示价和结账价不同。

`node scripts/stripe-price-change.mjs inspect` 只检查旧商户目录；`apply` 会创建新价格并将待切换的公开 ID 写入 `docs/stripe-price-change.json`，不会修改现有客户、订阅或价格。正式配置操作仍需当次确认；随后将该文件中的配置保存到托管服务端，再核验新价格结账金额。

## 项目接入申请

执行 `20261006213000_project_requests.sql` 后，登录用户可通过底部入口提交项目名称、公开 HTTPS 官网链接和需求说明。每天按香港时间 00:00 重置，每个账号限一条；唯一约束与数据库自身日期执行限频，客户端不能直接写表。重复发送同一请求编号和内容会得到原成功状态，不另计一次。

申请保存至 `watch_project_requests`，只允许本人读取，经营者可在后台查看全部申请。没有公开申请列表，也不会自动访问用户填写的链接。上线前须完成本次数据库迁移与发布确认；未迁移时接口返回不可用，不会虚报提交成功。

## Pro 每日收益邮件（待确认发布）

订阅默认关闭，仅有效 Pro 和已验证的登录邮箱可开启。首次从次日开始发送，北京时间每日 09:30 汇总前一自然日。IOTA 使用 pending/settled 记账日期，Quantus 使用主网区块奖励的半开时间区间，Vast.ai 使用所选历史北京时间自然日。其他来源未提供日收益或期间不同的记录不混入日收益；缺失数据与缺失价格保持未知。

当前实现使用适合定时摘要的 Resend 发送接口；尚未启用生产。Lovable 的内置 App emails 项目指引不支持这个定时摘要场景，项目所有者已于 2026-10-10 确认继续 Resend 配置与联调。这不包含生产发布、生产 DNS 修改或开启每日发送。不要把该实现改写为伪造的单次交易来绕过平台规则。

先完成 Resend 登录、准备发件域名验证记录和仅发送权限的凭据；新增凭据与连接授权须在执行时获得确认。使用所有者授权的收件地址进行本地示例邮件测试，并核对服务商投递日志。Lovable 连接器与当前直接 API 适配器的凭据来源不同，不能仅凭连接器已连接就宣称应用已配置；采用网关适配时还须验证幂等请求头、退订头和错误重试行为。

2026-10-10 已完成发送配置与真实测试：`reports.iotahome.site` 域名 Verified，单域 Sending access 密钥已存入服务端 Secrets，本机副本被 Git 忽略；一封明确标记为演示数据的所有者测试日报显示 Delivered。当前采用直接 Resend API 适配器，未连接工作区网关。`DAILY_REPORTS_ENABLED` 仍为 `false`。只读检查显示 Vault 已安装，`pg_cron`、`pg_net` 可用但尚未安装，日报表未创建，未创建定时任务。网站代码与数据库发布仍需本次明确确认。

确认本次发布后，按顺序处理：

1. 在 Lovable 连接发送服务，并验证独立发件域名，例如 `reports.iotahome.site`。不要复用已委派给 Lovable 内置邮件的发件子域，也不要更换整个网站的域名服务器。
2. 将 `RESEND_API_KEY`、`DAILY_REPORTS_FROM` 配置为服务端密钥。先保持 `DAILY_REPORTS_ENABLED=false`。密钥不得带 `VITE_` 前缀或提交到 Git。
3. 应用 `20261010180000_daily_reports.sql`，现有用户、设备和 Stripe 记录不会被修改。新偏好、报表队列仅开放所需 RPC；快照仅保留 7 天。
4. 部署已验证的代码。在配置正确后，用所有者授权的一个真实邮箱验证一封日报；测试预览的示例地址不能用于真实发送。检查单次接收、HTML/文本、退订和收件结果。
5. 当前服务端 `LOVABLE_CRON_SECRET` 与 Vault 中 `watch_daily_reports_cron` 的值必须一致。安全配置该密钥后执行 `supabase/manual/daily_reports_jobs.sql`。SQL 中只存 Vault 引用，不存明文密钥。
6. 最后开启 `DAILY_REPORTS_ENABLED=true`，核对 Cloud Jobs 的准备/恢复任务和 09:30 UTC+8 发送任务。准备每次仅处理有限读取；到了发送时刻未完成的来源显示部分数据，不用旧的今日余额填充昨日收益。

每个用户每天只有一个持久任务，模板与接收地址在首次发送前冻结。重试使用相同 provider idempotency key；发送前再次验证订阅、Pro、邮箱及退订状态。Google 邮箱变更须重新开启。GET 退订页仅展示确认，避免邮件安全扫描器自动退订；POST 支持明确确认及邮件客户端 one-click 请求。邮件接受不等于已送达；运营者应检查发送服务日志中的投递或退信结果。
