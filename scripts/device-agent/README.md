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
