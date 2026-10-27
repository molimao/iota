# Linux GPU Agent (read-only)

Requires Linux, Python 3.9+, NVIDIA driver / `nvidia-smi`. No root needed.
The monitor reads an existing IOTA miner process and its log. It does not inject
code, restart miners, change GPU settings, upload raw logs or enable recovery.
GPU metrics describe the whole GPU, including other projects.

1. Download and extract the Linux package.
2. In device management, select the existing IOTA device and generate a pairing code.
3. Find the current IOTA PID and its output log. Verify that these belong to the
   intended miner. Run (replace PID and log path):

   `python3 linux_gpu_agent.py snapshot --pid 1234 --log /path/to/miner.log`

4. Pair (the code is entered privately at the prompt):

   `python3 linux_gpu_agent.py pair --pid 1234 --log /path/to/miner.log`

5. Run `python3 linux_gpu_agent.py run` in a dedicated terminal, or install a user
   service with `python3 install_linux.py`. The installer only starts the monitor.

A pairing is bound to a PID **and process start generation**. If the miner restarts,
repeat pairing with its new PID. No PID guessing or miner restart is performed.

Queue reads the `QUEUE_PROBE status= queued position= ... run= ...` callback format
used by the verified Linux miner. Standard timestamped `FORWARD complete` and
`BACKWARD complete` lines identify recent training work. Missing/unsupported logs
show process running / unknown queue, never a guessed queue or training state.
Signals expire after five minutes; GPU reports expire after one minute.
The current miner must already emit queue callbacks; this monitor does not modify
or restart it to add logging. Future miner formats require a tested adapter.

Configuration and credentials are stored with mode 0600 under
`~/.local/state/iota-watch-linux/`. To stop monitoring:
`systemctl --user disable --now iota-watch-linux.service`.
This has no effect on the miner. Revoke the pairing on the website to revoke access.
