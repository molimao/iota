# Official earnings history backfill — production data verified

## Scope

Queue all active accounts with saved project identifiers, Free and Pro alike. The final frozen cohort contains 35 accounts, 97 bindings, 33 IOTA accounts and 89 distinct IOTA identifiers. One device was added during preparation; its additional official query received explicit approval before execution. Anonymous browser-only inventories cannot be discovered by the server; the identifiers must be saved to an account.

The queue freezes the bindings and a window within the latest 90 calendar days, ending two Beijing calendar days before execution. Yesterday remains reserved for the existing daily collector. The writer inserts missing dates only and never replaces an existing account report, device report or its USD valuation.

IOTA reads each resource once, validates aligned amount/timestamp/status arrays and bins the returned events by Beijing day. Pending and settled amounts use the existing eight-decimal accounting rule; frozen and forfeit amounts are excluded. Unknown statuses remain unknown. The endpoint has no completeness marker, so reconstructed IOTA days are marked partial. Dates without returned events remain gaps, not invented zero-income days.

Quantus uses bounded historical daily queries after the earliest fully covered index day. Vast.ai uses the existing owner-authenticated historical day reader in batches of three days, with unchanged credential expiry and scope. These two adapters have fixture coverage; this cohort has neither project. XID, Nosana, Gonka and Akash have no supported historical daily ledger in the integration. fly.ai, Golem and io.net expose incompatible monthly, rolling or UTC periods. Such resources are recorded as unsupported/different-period and do not create fictitious archived amounts.

Historical IOTA/Quantus USD prices are unavailable. Imported native amounts remain unpriced instead of using today's exchange rate. The chart automatically chooses a visibly labeled native project when it has more historical coverage than USD, and selects 90 days if a 30-day window would hide the available trend. Explicit user selections remain unchanged. Account/shared-wallet amounts remain separately labeled and are excluded from physical-device totals.

## Protections and validation

- Separate private RLS queue; service-role worker; authenticated owner-only status. Reuses the approved report-only cron authentication, without a new secret.
- Four bounded steps per request and a 20-second loop budget; at most three historical daily reads per private/date-window step. Frozen cursors, leases, idempotent enqueue and source-level deduplication protect retries.
- Binding removal/deletion blocks stale writes. Invalid dates, unknown devices and malformed batches roll back atomically. Four failed attempts pause a job; the protected `retry` action retains progress.
- Existing snapshots, valuations, consent, subscriptions, quotas and alerts are preserved. This handler does not send email.
- Database tests verify both Free/Pro eligibility, direct-access denial, owner isolation, stale leases, rollback, binding removal and retained history during retries. Unit tests verify time boundaries, gap semantics, exact native amounts, unknown statuses, missing historical prices and provider coverage.
- The explicitly authorized owner account was validated against five official IOTA responses, preparing 28 observed account-days from 2026-09-08 through 2026-10-10; 16 days have positive native rewards. Preparation was local and performed no production writes.
- All 89 official queries succeeded. Global real-data preparation passed before writes; private cohort/source/preparation files stay under `/private/tmp`, mode 0600, outside Git.
- Production verification on 2026-10-12: 35 jobs done, zero pending/failed; 515 new account-day rows across 31 accounts, covering observed dates between 2026-07-17 and 2026-10-09. Four accounts had no importable observed days. Existing 35 account/device snapshot hashes all matched. No reconstructed row contains a fabricated USD subtotal. The authorized owner received 27 new days. The existing daily collector continued independently during the import.

## Approved production sequence

On 2026-10-12 the user authorized publication after the global backfill completes. Official API transmission approvals were obtained for the initial 88 identifiers and the one subsequently added identifier. Steps 1–4 below are complete and verified; publication follows this verification.

1. Fetch the approved official histories into private local staging. Validate native amounts, device ownership mappings, source coverage and the frozen date range. Export prepared rows only to private files outside Git.
2. Apply the migration transaction and record its version in the migration registry. Existing history is untouched by the migration.
3. Enqueue saved accounts through the service-only worker. Claim each job, match its frozen bindings/range to the validated preparation, and use the worker's progress and write actions to insert missing dates. Preserve lease, retry and validation checks. No email is sent.
4. Compare existing account/device snapshot hashes against the minimal baseline, inspect inserted days and per-device records, and review the latest job for each cohort account. Unsupported sources are not a successful daily-income import.
5. After successful backfill verification, commit and publish server/client together. Exclude all private staging and unrelated operational documents. Preserve `PRO_TOOLS_ENABLED=true` and existing sending/cron configuration; verify live owner-only reads, chart behavior and protected route authentication.

For future protected batches, `/api/history/backfill` accepts `{"enqueue":true}` and source failures can be retried with `{"retry":true}`. If pending jobs require the deployed worker, install `supabase/manual/history_backfill_jobs.sql`; its temporary minute job removes itself when no pending jobs remain. Existing daily/Pro schedules remain active. Do not install an empty queue schedule after this one-off import.

Pause this operation with `cron.unschedule('watch-history-backfill')`. Do not disable the shared Pro flag or interrupt daily reports. Any production rollback requires its own approval.

Sources: the official IOTA history endpoint already used by the monitor; [Quantus indexer documentation](https://docs.quantus.com/reference/tools-and-community/); the existing Vast.ai historical-day adapter. API-observed data does not prove historical ownership or complete records outside the returned/covered period.
