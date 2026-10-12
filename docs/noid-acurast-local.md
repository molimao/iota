# NOID and Acurast — local candidate, 2026-10-12

No production deploy, production database migration, user account lookup, secret creation or configuration change.

## Coverage

- NOID means Parano1d (https://parano1d.org/), not IOTA or another similarly named project. Validate the canonical bech32m o1 public payout address and checksum. Reads ONLY Parano1d Pool (https://www.parano1d-pool.fun/miner?a=ADDRESS), with fixed host, encoded address, no redirects, 12-second deadline and 1 MB cap. Its public miner page is HTML, not a documented stable JSON API; parse bounded named fields, never render or execute upstream HTML. Page format changes fail unavailable. API/network failure never becomes zero.
- Pool address scope: measured hashrate, owed NOID, total payouts, rolling last-24-hour payouts and last-seen activity. Last seen <=20 minutes means address activity, not every worker online. Pool payout totals and unpaid balances are excluded from device calendar-day totals and reports. Other pools and solo nodes are not covered. No operator/wallet keys, remote node control, transfers or miner installs.
- Acurast mainnet uses the official JSON-RPC getAccounts (account_id, is_processor=true, limit=1). Official source: https://github.com/Acurast/acurast-indexer. Supports checksummed SS58 and canonical 32-byte public key. Normalize new saved Processor identifiers to hex; deduplicate identical keys across representations. Register/type classification only; not heartbeat/uptime, today’s rewards, stake rewards or balances. ACU mainnet is not Canary cACU. Do not imply the two tokens or networks are interchangeable.

## Real source evidence

- Read the NOID pool's publicly listed address, not a site user's identifier. The served page contained all supported metrics and last-seen values. Current sample capture remains only under /tmp/noid-miner.html. Review UI uses separate, explicitly labelled simulated values; they never enter real readings or history.
- Acurast official indexer read-only probe returned HTTP 502 on the initial attempt and retry. Adapter parsing, error handling and endpoint selection are simulated/tested against its official source schema, but real Acurast retrieval remains unverified. This upstream availability limitation must be disclosed before release.

## Integration

12-project menu; direct monitor routes; per-device project bindings; 5 Free / 50 Pro quota per project; source boundaries in five languages; two distinct address/payout help articles; canonical/hreflang metadata, XML sitemap and llms files updated. Existing multi-project articles retain their original ten subjects, rather than falsely claiming new coverage. Review samples local-only.

The unapplied migration 20261012213000_noid_acurast.sql extends watch_bindings project constraint and current list/mutation functions. Existing account serialization, project quotas, ownership checks, credential-table grants and all device records remain intact. It introduces no public credential storage or sending tasks. Authenticated server validators check full address checksums before database mutation; SQL enforces bounded canonical forms independently.

Validation: 266 passed, 3 existing skipped checks; TypeScript and production build pass. Browser reviewed NOID Chinese and Acurast Korean sample views. Actual production source delivery and account mutation are not claimed tested.
