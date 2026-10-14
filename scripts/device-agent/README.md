# IOTA Watch Mac agent

Install only on a Mac that runs IOTA Train at Home. Python 3.9+ is required (available with Apple's Command Line Tools). This agent does not replace or modify the official app.

1. Sign in to IOTA Watch. Add this Mac's public Miner ID in My devices.
2. Open Mac management, choose that device and generate a pairing code.
3. Download/unzip this package on the matching Mac and run `install.command`. Paste the code into the hidden prompt. Codes expire in 10 minutes and work once.
4. The agent reports every 15 seconds. Enable logs or crash recovery separately on the website if wanted.

Pairing creates a device-only credential saved with permission 0600 in `~/Library/Application Support/IOTA Watch Agent/config.json`. The service saves only its SHA-256 hash. Never share this file or a pairing code. No SSH credential, wallet key, seed phrase or arbitrary terminal access is used.

Actions are limited to starting, stopping or restarting `/Applications/IOTA Train at Home.app` (or the same app in your user's Applications folder). Stopping disables crash recovery. Recovery requires an Apple TAH crash report and a 15-minute cooldown; manually quitting or simply waiting for a task does not trigger recovery. A failed connection prevents new control or recovery. Control status waits for the agent's acknowledgement; timed-out actions are not retried automatically.

CPU and memory are totals for allowlisted TAH processes, not whole-system RAM usage. Worker-running means a process exists, not proof of training contribution; use official Miner ID monitoring for that. Temperature is not collected. Application logs are opt-in: only recent training/error lines (maximum 12 KB) are sent, with redaction on the Mac and again on the server. Redaction cannot recognize every possible secret. Raw log files are never uploaded. Log excerpts older than 24 hours are hidden and cleaned during heartbeat processing.

Uninstall with:

```sh
python3 "$HOME/Library/Application Support/IOTA Watch Agent/iota_watch_agent.py" --uninstall
```

Also click Disconnect on the website to invalidate the device credential and remove server-side excerpts and pending actions. Original TAH logs and app settings are untouched.

Developers: use `--server http://127.0.0.1:8081` only for local test pairing. The normal installer uses https://iotahome.site. No remote redirects are allowed.
