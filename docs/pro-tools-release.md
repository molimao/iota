# Earnings tools and Pro notifications — approved release, 2026-10-11

- Free on the left, Pro on the right; equal width and height. USD 2.99/month and 16.99/year unchanged.
- Opt-in status alerts: IOTA non-participation / no longer in a fully read roster, Akash and Golem explicit offline signals. Requires a healthy baseline, three fresh bad observations spanning at least 20 minutes. API failures reset the bad interval and never imply offline. One mail per incident, maximum five alert mails/user/Beijing day. Other projects have no reliable device connectivity signal and are excluded.
- Private daily account snapshots independent of daily-mail opt-in, retained for 90 days. Same project/resource is deduplicated, native balances summed exactly. Unsupported historical periods, unavailable reads and unpriced assets remain unknown. Daily emails use the saved snapshot when available to match charts, monthly summaries and exports.
- 7/30/90-day charts; project selection shows native earnings, all projects shows only known USD estimates. Gaps remain gaps. Previous-calendar-month summaries include observed-day coverage. Optional previous-month mail on the 1st at 09:30 Beijing, only after the last daily snapshot is available; no historical backfill is promised.
- CSV import/review for new machines, explicit same-machine keys or existing-device UUIDs; bulk rename/hardware edits. Server RPC enforces ownership, Pro, project quotas and an atomic transaction. Up to 100 rows; idempotent request UUID; up to five saved batches/minute. Does not auto-merge names or wallets, no bulk deletion.
- Free owner-only CSV exports for devices and daily project earnings. UTF-8 BOM, RFC quoting, formula-prefix neutralization, missing amounts empty, separate native/USD coverage. No credentials in exports.
- Five UI/email languages. Existing daily-email consent remains independent. Alerts and monthly mail default off and use only verified login emails. Frozen notification payloads, provider idempotency, leases and send-time consent/expiry/recipient checks; scanner-safe GET unsubscribe and POST-only cancellation.

## Production steps (do not run before current user confirmation)

1. Review/commit the local UI and Pro tools files; exclude private operational JSON/Markdown and `.env.*.local`.
2. Apply `supabase/migrations/20261011120000_pro_tools.sql`.
3. Deploy server and client together. Set server-only `PRO_TOOLS_ENABLED=true`. Keep existing Resend sending-only configuration and report-only cron credential; no new browser/public secret.
4. Apply `supabase/manual/pro_tools_jobs.sql` to schedule the bounded dispatcher every minute. The worker deduplicates 10-minute alert sampling and one historical daily capture after 08:00. Keep the existing daily report jobs.
5. Verify real Pro status, bulk transaction, downloads, saved preferences, snapshot capture, unsubscribe and provider delivery with a consenting test recipient. All current send tests are mocked; no real mail sent for this release candidate.
6. Inspect task backlog/failed tasks, age of history, provider delivery, daily caps, period/coverage labels, Free-account rejection of paid mutations and expired subscription behavior.

Stop new processing reversibly with `PRO_TOOLS_ENABLED=false` and unschedule `watch-pro-tools`. Existing history and fleet records remain intact. These settings and the migration are not applied during local development.

## Limits

Only IOTA, Quantus and Vast.ai currently support the requested historical Beijing earnings window. XID/MMM, Nosana, Gonka and Akash have no supported daily historical reward ledger; fly.ai/Golem/io.net expose incompatible monthly/rolling/UTC periods. Reports explicitly mark these reasons and never estimate unknown project earnings as zero. Private Vast.ai real-account testing remains pending an account; fixtures exercise its parser. Upstream outages can delay or leave gaps; stored reports are immutable and their collection/valuation timestamps are exported.

## Local validation

- 221 checks passed, two existing live integration checks skipped; TypeScript and production build passed.
- Real PostgreSQL-compatible tests cover ownership, Pro enforcement, atomic bulk rollback, 50/project quota, idempotent retries, continuous alert observations, expired/stolen leases, mail consent and recipient changes, monthly queue timing and 90-day cleanup.
- Local browser flows verified bulk rename, CSV preview and one machine with two project links. QQ Browser downloaded the earnings CSV; 90 data rows, consistent 13-column UTF-8 CSV.
- Five-language phone-width layouts inspected; no page-level horizontal overflow. Mail delivery remains mocked for this release candidate.

CSV exports and charts are Free; automated email, alerts and bulk editing require Pro. The earnings chart opens by default for signed-in users and appears above device filtering and cards. Pointer/touch inspection and keyboard date selection expose daily values without filling missing dates or summing different native currencies.

## Per-device history

Each device card has a collapsed earnings chart with project and 7/30/90-day controls and owner-only CSV export. The collector saves per-device reports beside the fleet report, using the original binding ownership at collection time. Account/project ledgers and resources shared across tracked machines are excluded from the device total and remain available in a labeled account view. No old fleet report is split or redistributed to populate a device chart. The migration includes a private device snapshot column and owner-checked RPC. Retention remains 90 days.

## Free export scope

Inventory, daily earnings, monthly summary and per-device CSV exports are available without Pro. Inventory can be exported from anonymous browser storage; financial history requires sign-in and can only read the requester’s records through `watch_export_history_read`. Automated emails and bulk mutations retain Pro checks. Daily snapshots cover registered accounts with saved bindings, giving Free accounts history and export data, with the same 90-day retention. No automatic mail is created for Free users. Empty selected periods show a no-history message instead of downloading a header-only earnings file. Apply this migration with the release.

## Latest entitlement update

Account and per-device earnings charts, history and all CSV exports are Free. Only owner-authentication remains on history reads; no subscription gate. Free features have no Free/Pro badges in the toolbar or device cards. Only batch editing and mail/alert settings retain Pro labeling and server paid checks. History opens by default for signed-in users and the preview; anonymous users are asked to sign in when requesting history. The pricing cards list charts and CSV under Free, and mail/alerts/bulk under Pro. The owner explicitly approved this release on 2026-10-11.

## Layout verification

480 page/language/viewport checks and 25 interactive states covered all five languages, core pages, ten project monitors, all 32 guides, all three blog posts, dialogs and tools. Auxiliary links use compact inline layout with adjacent icons. The 320px header keeps sign-in and view navigation separate, and its menu stays inside the header bounds. Homepage title segments balance their own lines. Both pricing cards have equal widths and heights in all five languages. Low-height dialogs remain scrollable. No remaining page-level overflow was observed in these local checks.
