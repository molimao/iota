# IOTA 矿工之家

Build and prepare to publish a production Simplified Chinese IOTA Train at Home multi-device monitoring dashboard, migrating an existing localhost tool. Name: IOTA 我的设备. User explicitly wants deployment to Lovable and LOCAL browser caching of public Miner IDs/hotkeys. Use Lovable standard stack and implement full working experience, not a mock. No account, paid tier, device count cap, private keys, wallet connection or seed phrase. Do not prepopulate any real users/addresses. No fake metrics.

Visual: clean light background #f3f5f9, white device cards, ink #172338, blue #245bdb, concise Chinese. Top prominently displays 今日总收益 and 累计总收益 in IOTA (alpha, subnet token, NOT TAO or fiat), then counts 有贡献 / 等待任务 / 需检查 / 待确认. Device grid cards: name, understandable status and explanation, today's and total earnings, fetched time, details button. Add device dialog with label and Miner ID; rename, copy ID, remove confirmation. Details sheet tabs 运行情况 / 训练记录 / 收益记录. Addresses, raw layer index, coldkey, run tucked in collapsed technical details. All-runs capacity collapsed advanced section. Responsive and legible, no technical wall of text.

PERSISTENCE: localStorage versioned key iota-watchlist-v1 for {hotkey,label,addedAt} list with schema validation, duplicate prevention, storage errors shown. Unlimited product limit. Validate SS58 generic network42 address incl checksum with suitable reputable JS utility. Browser device-local only, not shared DB. Show clear note local to browser, clearing browser data removes list. Add local JSON import/export (public IDs/names only) so existing localhost list can migrate. Never embed real addresses in source or URL. Initial empty state Add device; no demo seed. Client telemetry cache timestamped under separate key; bound size, never label cached data fresh. No need for database/auth.

DATA: Verified official base https://iota-web.api.macrocosmos.ai/mainnet. Implement server-side constrained read-only proxy using Lovable backend (or edge function only if necessary), avoiding browser CORS. Do not use localhost/127.0.0.1 proxy in hosted code. Only fixed allowlisted endpoints; validate hotkeys/runIds/period; prevent arbitrary URL SSRF. No credentials currently required. Shared TTL, singleflight, max3 concurrency, timeout20s, exponential failure backoff. Page polls5s; miners cache60s, runs300s, occupancy120s, contributions/rewards300s. Manual refresh button bypasses normal TTL with15s cooldown, displays progress and failures, retains previous data. If upstream Cloudflare blocks cloud traffic report it truthfully, do not fabricate success.

GET endpoints + exact observed JSON:
/runs => {runs:[{run_id,name,state:'active',metadata:{description,n_splits,model_name}}]}
/miners?run_id=... => {miners:[{timestamp (Unix seconds),layer (zero-based),hotkey,coldkey,activation_count,throughput,is_active,registration_time,run_id,location_name,location_country}]}
Discover devices by fetching all current active runs and matching exact hotkey. Dedup same hotkey across run lists using most recent timestamp. Unknown/incomplete coverage is NOT missing or offline.
/progress?run_id => {activation_count,total_activations,token_count,total_tokens,loss}
/v1/runs_occupancy => {run_ids:[],max_miners:[],active_miners:[],slots_remaining:[]} (capacity occupancy not proof of active compute).
/v1/epoch_miner_scores/runs/{run}/hotkeys/{hotkey}/metrics?period=week => {epochs:[],token_counts:[],act_contribution_percs:[],activation_ranks:[],num_hotkeys_in_epochs:[],timestamps:[]}
same prefix /throughput?period=week => {epochs:[],throughputs:[],timestamps:[]}
same prefix /cumulative_tokens?period=week => {epochs:[],token_counts_cumulative:[],timestamps:[]}
/v1/entitlements/totals/hotkey/{hotkey} => {total_amount_earned,total_amount_paid,total_amount_pending,total_amount_frozen,minimum_payout_amount}
/v1/entitlements/history/hotkey/{hotkey} => {alpha_amounts:[],timestamps:[],statuses:[]}

EARNINGS correct semantics: query rewards for EVERY saved hotkey, even if absent from active run lists. Per-device cumulative = total_amount_earned. TODAY = sum alpha_amounts where history timestamp falls today from 00:00 Asia/Hong_Kong (UTC+8), timestamp <= now and status in ['pending','settled'] (matches official client filtering). Exclude frozen/other. This is official reward accounting date, not real-time estimated earnings or payout day. Use fixed precision arithmetic, preserve up to8 decimals. No double count paid + earned. Display unit IOTA and note alpha. Totals aggregate saved unique devices only; if some missing show known partial sum with x/y coverage and 部分, never silently zero unknown. Successful empty arrays =>0; malformed arrays/errors =>unknown. Recompute day after midnight. Cached earnings older15min/error flagged not included as current totals. Full coverage empty watchlist can show0 or empty guidance.

STATUS crucial bug to avoid: miner timestamp is official statistics sample time, NOT heartbeat and NOT time our API refreshed. Never mark every device offline/stale just because timestamp>5min. Separate fetchedAt vs sampleTimestamp. No new successful API fetch>5min =>刷新中断, keep last values. is_active true & throughput>0 =>有训练贡献 (official last reported activity, not guarantee current compute); active true zero =>在线待任务; false=>暂未参与, not proof offline; not found only after all active run lists successfully fetched=>尚未找到. Cloud app CANNOT read Mac logs, so do not include fake local heartbeat or Electron error checks. Local log tool remains separate.

Validate build and key tests: persistence add/rename/remove >3 devices, duplicate/invalid ID; current successful response with old statistics timestamp stays active; failed refresh retains last data +warning; HK midnight inclusion, future/frozen excluded, no-data vs0, partial aggregate; fetch real /runs and /miners from hosted server. No marketing landing page. Return implemented files, tests/build and actual API verification outcome. Do not deploy automatically; I will call deploy after review.

This project was built with [Lovable](https://lovable.dev).

## Current data behavior

- Device status checks every 30 seconds while the page is visible. Official miner lists are cached for 60 seconds; every active run is scanned, and duplicate devices are resolved using the latest official sample. A complete successful scan can confirm that an ID is absent. An incomplete scan keeps the last record and labels it as cached.
- Rewards check every 2 minutes with a 5-minute official API cache. Today is the official accounting day in Hong Kong (UTC+8). Midnight changes the query key and clears yesterday's displayed total until today's accounting is available. Reward totals and history have separate clocks and errors, so a history failure does not erase valid lifetime rewards.
- Manual refresh bypasses normal cache expiry, with a 15-second cooldown. Requests share in-flight work and are limited to 3 upstream connections per server instance. Network requests have a 10-second timeout and a bounded 20-second queue wait. Failures retain validated data, use exponential backoff, and respect official `Retry-After` limits. The cache is bounded to 512 entries per instance.
- All official responses are validated before caching, including array alignment. Missing values remain unknown, while a successful empty response may be zero. The network page shows coverage, independent source ages and partial failures; global miner totals deduplicate IDs across runs.
- Device history supports day/week/month ranges, joins contributions, ranks, throughput and cumulative tokens by epoch, and loads the trend chart on demand. Reward details include paid, pending, frozen and minimum payout balances. USD amounts are market estimates with a source and fetch time.
- Hidden pages pause polling. Returning to the page or reconnecting triggers a data check. Statistics sample times are separate from API fetch times and are never treated as a device heartbeat.

Run the regression suite with `npx vitest run`, the type check with `npx tsc --noEmit`, and the production build with `npm run build`. Live official API checks are opt-in: `IOTA_LIVE_CHECK=1 npx vitest run src/lib/official-api.live.test.ts`. The live check selects a public ID from the official roster only in memory and does not save it to the device list or source files.

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5854fd0c-7c2c-425c-a833-b540ffe023bd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Search and AI-readable content

- Public Chinese and English pages use self-canonicals on `iotahome.site` with reciprocal language alternates. The dashboard and account pages remain `noindex,follow` in HTML and response headers; robots allows those pages to be fetched so search crawlers can see that directive. Server-function endpoints are excluded from crawling.
- Guide publication/modification dates are per article. Do not update dates just because a build runs. Guide HTML, JSON-LD, Markdown and sitemap timestamps share the same content metadata.
- `/zh/learn/<slug>.md` and `/en/learn/<slug>.md` return the complete guide with canonical HTTP links and localized absolute links. `/llms-full.txt` contains complete bilingual content. These are reading aids; they do not guarantee indexing or AI citations.
- Crawl generators are in `src/lib/crawl.ts`. Keep generated `public/sitemap.xml`, `robots.txt`, `llms.txt`, and `llms-full.txt` synchronized when editing content; regression tests detect drift. PNG sharing previews are generated from `public/og.svg`.
- Search Console verification can use `VITE_GOOGLE_SITE_VERIFICATION` or `GOOGLE_SITE_VERIFICATION`. Search indexing, query impressions and organic conversions must be measured separately from website visits and registered account counts.
