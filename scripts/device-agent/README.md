# IOTA Watch Mac agent

Install only on a Mac that runs IOTA Train at Home. Python 3.9+ is required (available with Apple's Command Line Tools). This agent does not replace or modify the official app.

1. Sign in to IOTA Watch. Add this Mac's public Miner ID in My devices.
2. Open Mac management, choose that device and generate a pairing code.
3. Download/unzip this package on the matching Mac and run `install.command`. Paste the code into the hidden prompt. Codes expire in 10 minutes and work once.
4. The agent reports every 15 seconds. Enable logs or training recovery separately on the website if wanted.

Pairing creates a device-only credential saved with permission 0600 in `~/Library/Application Support/IOTA Watch Agent/config.json`. The service saves only its SHA-256 hash. Never share this file or a pairing code. No SSH credential, wallet key, seed phrase or arbitrary terminal access is used.

Actions are limited to starting, stopping or restarting `/Applications/IOTA Train at Home.app` (or the same app in your user's Applications folder). Stopping from the website disables automatic recovery. With agent 1.0.5+, the recovery option watches the training process, including when the GUI remains open after an OOM/worker exit. A missing worker must persist for 2 minutes before restarting TAH; attempts are limited to once per 15 minutes, even after failure. A queued worker does not trigger recovery. To quit locally without recovery, turn off this option first. Restarting does not fix insufficient memory; reduce other workloads if failures continue. A failed connection prevents new control or recovery. Control status waits for the agent's acknowledgement; timed-out actions are not retried automatically.

CPU and memory are totals for allowlisted TAH processes, not whole-system RAM usage. Worker-running means a process exists, not proof of training contribution; use official Miner ID monitoring for that. Temperature is not collected. Application logs are opt-in: only recent training/error lines (maximum 12 KB) are sent, with redaction on the Mac and again on the server. Redaction cannot recognize every possible secret. Raw log files are never uploaded. Log excerpts older than 24 hours are hidden and cleaned during heartbeat processing.

Uninstall with:

```sh
python3 "$HOME/Library/Application Support/IOTA Watch Agent/iota_watch_agent.py" --uninstall
```

Also click Disconnect on the website to invalidate the device credential and remove server-side excerpts and pending actions. Original TAH logs and app settings are untouched.

Developers: use `--server http://127.0.0.1:8081` only for local test pairing. The normal installer uses https://iotahome.site. No remote redirects are allowed.

## Optimized startup (1.0.1)

Start and Restart reuse the website's IOTA Local Tools startup relay. The relay listens only on 127.0.0.1:18010 and waits up to 180 seconds for the real miner service on port 8010, without manufacturing health responses or recording request contents. This reduces startup connection failures; it does not change official queue priority or guarantee training. Click Start training in the official app if necessary.

The package includes the two startup helpers; it does not install a second guardian. If IOTA Local Guardian is already installed, its launcher is reused to avoid competing for the relay port. Existing guardian settings are unchanged. A port conflict fails startup instead of silently falling back. An already running app is left running. The existing local guardian is separate: stop it if you want this agent to be the sole restart controller.

Uninstall leaves the startup helpers/relay in place so an active training connection is not interrupted. After quitting TAH and logging out, the remaining agent support folder may be removed. Run the new installer to upgrade an existing paired agent; credentials and settings are preserved.

## Remote updates (1.0.2+)

Install 1.0.2 once on each Mac to enable remote updates. The installer preserves existing pairing and settings. Older agents cannot update themselves. The website shows the installed version and offers Update agent when a newer release is available.

Updates download only from https://iotahome.site/downloads/ over verified HTTPS, reject redirects, verify the release SHA-256/size, extract only the three allowlisted Python files and probe the candidate version before changing installed files. This trusts the website's release channel; a checksum is not an independent publisher signature. No arbitrary update URL or shell command is accepted.

A stable local supervisor backs up the previous files and replaces only agent/startup helpers. The new agent must complete an authenticated heartbeat within 75 seconds or it is stopped and the previous files are restored. Interrupted installations roll back at supervisor startup. Pairing/configuration, official IOTA application and active local relay are left alone. The supervisor itself is updated only by the manual installer. Updates never intentionally restart TAH or the active training relay; a short monitoring gap is expected. Use the website's command result and reported version to confirm completion.

### Stopped training recovery (1.0.5)
The official app's Stop Training button stops the worker while its window remains open. With recovery enabled, this is covered by the same 2-minute grace period; disable recovery first if you want training to stay stopped, or use Stop on the website (which disables recovery). A recovery attempt restarts the app through the optimized launcher and enables the official `autoStartTrainingOnStartup` preference before launch. This preference remains enabled; launch-at-login, wallet and compute settings are not changed. Recovery is only reported successful after the worker appears, not merely when the application window opens. Queued workers count as started. If the worker does not appear within 60 seconds, the attempt fails and the 15-minute cooldown still applies. Missing or invalid official preferences cause a failure instead of overwriting settings.

## Structured phase observations (1.0.6+)

The agent reads the same bounded local CLI log tail used for queue positions. Successful `/miner/heartbeat` responses supply allowlisted cycle phase, miner status and observation time only. The phase of a layer is not proof that this Mac performed or earned work. Incomplete, unrecognized, future, pre-worker-start or older-than-five-minute evidence is omitted. Detailed phases may be unavailable on older app builds or truncated log lines. No raw log is uploaded unless the existing log option is enabled.

The website stores one structured observation per five-minute bucket for seven days and displays the latest 24 hours on demand. Gaps stay missing and cannot prove downtime. History begins after the server migration and connected heartbeats; it is not backfilled from invented observations. Disconnecting deletes device history.

Parser reference: Macrocosmos IOTA commit `ed0fecb190ab7277ebb1e76ddba920eb4dcf7543`, `shared/subnet/src/subnet/common_api_client.py`, `shared/subnet/src/subnet/miner_api_client.py`, and `shared/common/src/common/models/miner_models.py`.

## Crash leftovers and recovery (1.0.7+)

A process with the worker executable path is no longer sufficient to establish health. The agent checks bounded local TAH main/CLI log tails and up to four matching macOS `main_pool*.ips` reports. Only an explicit abnormal worker exit or a fatal macOS report for the exact installed worker path qualifies; a thread panic, high memory usage, low CPU, zero throughput or stale GUI TRAINING text does not. Evidence must belong to the current GUI launch. A later successful registration/heartbeat or forward/backward operation cancels older crash evidence, so a recovered or queued worker is left alone. Missing/unreadable evidence is not a crash.

When a confirmed exit has no subsequent real activity, the snapshot reports the training worker stopped even if same-path child processes survive. The existing opt-in, two-minute grace, fifteen-minute cooldown, manual-stop and online-authorization rules remain. If the GUI has gone but workers remain, recovery cleans those orphans before relaunching. TERM is tried first; only exact revalidated TAH executable PIDs still present after eight seconds receive KILL. No other application or the agent itself is targeted. Crash report contents and raw log contents stay local unless the existing optional log upload is separately enabled (crash reports are never uploaded).

This is crash recovery, not a general hang detector: lack of compute or lack of logs alone never restarts a miner. No remote Mac has been restarted as part of local verification.

## Automatic crash interpretation (1.0.8+)
When log uploads are enabled, fatal Rust/P2P/abort and OOM excerpts are included in the bounded, redacted upload. All accounts automatically receive an AI interpretation on the corresponding device page. Normal queueing and high memory alone do not trigger analysis. The server deduplicates incidents, limits usage to ten analyses per day, and uses the account's last selected website language. Uploaded excerpts wait at most 24 hours; completed analyses keep only findings and cited lines. No AI recommendation is executed by the agent. Turning log uploads off also cancels queued analyses.

## Renamed worker ancestry (1.0.9)

Observation treats the exact installed `main_pool` path as a training root. The exact renamed worker title counts only when walking its parents reaches that installed path or the installed TAH GUI. Generic helper names, CPU, and a GUI TRAINING label are not evidence. Remote control still uses the same executable allowlist; this release does not add or remove allowlisted targets.

## Worker-generation crash evidence (1.0.10)

An older worker's exit no longer marks its replacement as stopped while the GUI remains open. Crash evidence is scoped to the oldest currently observed trusted training root. A newer child cannot hide a crash in that generation. If a worker's start time is unavailable or invalid, the agent keeps the GUI launch boundary rather than clearing crash evidence. Remote controls and automatic recovery settings remain unchanged.

## Desktop selected run (1.0.11)

Reads a bounded tail of the official desktop netlog while the TAH app is running. Only HTTPS phase-snapshot requests to the exact official API host qualify. The agent uploads only the selected run ID and observation time, never request URLs, headers or network event contents. This is the run displayed by the app, not proof of roster membership or training contribution. Observations older than 90 seconds are omitted. Older builds without compatible netlogs keep public roster/reference information. No application preferences or training processes are modified.

## Background-window run observations (1.0.12)

A selected run is no longer discarded after 90 seconds: chart requests can stop while the desktop window is in the background. Observations must belong to the currently running TAH GUI process generation. Initial lookup scans at most the most recent 64 MiB of each of two daily netlogs, in bounded chunks; later reads consume only appended records. The cache contains only the observed ID, timestamp, process identity and read offsets. A GUI exit/relaunch, unreadable logs, or a detected logging gap clears unverified state. Partial network-event writes are reassembled on later reads. The website marks older observations and no longer inserts a network-wide reference as device evidence. A selection is still not proof of work or roster membership. These changes do not control or restart training.


### Development: opt-in XMRig observation

This source-only adapter is not included in the currently published installer.
It has fixture tests; a real miner verification and a versioned Agent package
are required before rollout. Existing paired Agents remain unchanged.

For development, an existing paired Agent may opt in through its private local
`config.json` by adding `xmrig` with an explicit `bindingId` (the XMR binding on
that exact account device) and `port` (1024–65535). If the restricted XMRig API
requires authentication, `accessToken` stays in that private local file.
Do not post credentials or the complete configuration to the website.

The adapter reads only `GET http://127.0.0.1:<port>/1/summary`, uses a one-second
timeout, disables system proxies and rejects redirects. It never changes the
miner's configuration, stops a process, opens a public port or reads its wallet.
Only the binding ID, observation time, API status, bounded hashrates, cumulative
accepted/rejected counts and uptime enter the existing device heartbeat. The
website displays these readings only for the matching XMR binding on that
device. Missing or expired readings remain unknown rather than zero. XMRig can
serve other coins, so this mapping must be chosen explicitly; it is not inferred
from the software name. An unavailable API does not interrupt IOTA heartbeats.

References: https://xmrig.com/docs/miner/config/api and the upstream
`doc/API.md` plus `doc/api/1/summary.json`.

### One Agent, multiple miners (1.0.13)

The Agent accepts up to eight explicit `miners` entries.
Each has `software`, `project` and the database `bindingId` for that exact device.
Duplicate bindings and duplicate local sources are not collected twice. The
1.0.13 package includes these collectors. Local opt-in configuration is separate from log-upload
consent: only allowlisted numeric observations leave the computer, never raw miner
logs, wallet settings, local paths or API tokens.

Supported collection profiles:

| Software | Project | Read source | Meaning |
| --- | --- | --- | --- |
| XMRig | XMR | Loopback `/1/summary` | 10s/60s H/s, accepted/rejected shares |
| Seine | BNT | Loopback `/v1/health` and `/v1/runtime/state` | Session average H/s from fresh STATS events; accepted-block counter; deferred work is not rejection |
| Seine | BNT | Explicit owner-owned `YYYYMMDD-HHMMSS.log` | Existing launcher profile; timestamp-anchored session average and accepted shares; works without restarting the miner to enable an API |
| pearl-metal-miner | PRL | Explicit owner-owned plain `.log` | 60s tiles/s, accepted/rejected shares; tiles are never converted to hashes |
| NOID Miner for Mac | NOID | Exact installed compute executable paths | Compute process presence and CPU/RSS only; no hashrate or revenue inferred from presence |

NOID compute executables are `Contents/Resources/miner/bin/noid-cpu` and
`noid-metal` under `/Applications/NOID Miner.app` or the user's `Applications`
folder. The GUI, arbitrary similarly named binaries and the Watch Agent are
excluded. NOID's public pool continues to supply hashrate and earnings. Fly.ai
and Acurast continue to use existing public provider/chain data; these profiles
do not claim a Mac Agent can control an Android processor or a hosted service.

Local source setup in an already paired Agent:

```sh
python3 iota_watch_agent.py --configure-miner seine --binding <binding-uuid> --log-path <absolute-dated-log-path>
python3 iota_watch_agent.py --configure-miner pearl-metal --binding <binding-uuid> --log-path <absolute-log-path>
python3 iota_watch_agent.py --configure-miner xmrig --binding <binding-uuid> --port 18088
python3 iota_watch_agent.py --configure-miner noid-mac --binding <binding-uuid>
```

Setup modifies only the private Agent configuration and takes effect on its next
heartbeat. It does not start/stop the miner, enable its API, edit the wallet, or
enable remote commands for these profiles. Standalone non-IOTA pairing,
real PRL/NOID running-miner verification and non-IOTA fixed operations
remain to be implemented and verified before a complete rollout.

### Card association and bounded automatic discovery

The existing project card can link its saved binding to an already paired Mac.
This moves only that binding, preserving its address, ID, pool and Worker. Other
projects and source device records are retained. The database checks both owners,
the 12-binding capacity and the unchanged per-project device quota. It does not
queue miner commands. A device credential then receives only that device's
supported binding identities, not the whole account. Browser roles cannot call
the credential lookup. These two new migrations and the server/Agent changes are
local only, not installed or deployed.

New Agents opt in to the read-only manifest in their normal heartbeat. Existing
Agents retain their wire format. Missing/invalid manifests cannot interrupt IOTA
command delivery. Removed associations and expired permissions disable cached
observations. Discovery runs at most once per minute after command handling, has
a short work budget, and does not scan ports or restart processes.

- Seine: identify the running miner and its own working directory; match the
  public payout and optional Worker in a bounded dated launcher log. Its start
  timestamp must match the current process generation. The owner's real Mac was
  read-only verified using an illustrative binding ID, with no configuration or
  production writes.
- PRL Metal: identify the exact Python module and a plain log; match the most
  recent pool connection identity, not an old wallet earlier in the same file.
  A terminal-only run with no supported log remains unconfigured.
- NOID Mac: compare only the installed app's public `wallet` preference with
  the saved binding, then observe its fixed compute executables. Public identity
  matching was verified locally; this is not a live hashrate or revenue reading.
- XMRig: require the explicitly running payout/Worker and API port flags. No
  ports are probed; authenticated APIs retain explicit private configuration.

Ambiguous identities remain unlinked. No raw command lines, paths, preferences,
wallet files or API tokens are uploaded. Upgrades preserve existing private miner
configuration. Production rollout must publish the server and migrations before
any new Agent package; the current public package remains unchanged.

Sources: Seine `docs/API.md`, `docs/schemas/runtime-state.schema.json`,
`src/miner/stats.rs`; pearl-metal-miner `README.md` and `miner.py`; the user's
NOID Miner 0.4.0 bundled usage guide and executable layout (read only, not run).

### BNT Worker association (local correction, pending release)

A saved BNT address is a wallet group, not a single computer. Each named Worker
links separately to an existing paired Mac through its Worker card. The link is
stored as an explicit wallet+Worker binding on that computer. Linking or changing
one Worker leaves the wallet record, sibling Workers and their Agents unchanged.
Account-level balance, payments and pool hashrate remain deduplicated by wallet.
The server manifest and Agent cache exclude wallet-wide BNT bindings; only an
exact Worker identity may authorize local collection. This does not install one
Agent per software process: one physical computer still uses one Agent for all
its supported projects. No miner start, stop or restart is part of association.
