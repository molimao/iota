#!/usr/bin/env python3
"""Install only the Linux monitoring service for the current user."""
import os
from pathlib import Path
import shutil
import subprocess
import sys

if sys.platform != 'linux':
    raise SystemExit('Linux only')
root = Path.home() / '.local/state/iota-watch-linux'
if not (root / 'config.json').is_file():
    raise SystemExit('Pair linux_gpu_agent.py first.')
source = Path(__file__).resolve().with_name('linux_gpu_agent.py')
target = root / 'linux_gpu_agent.py'
shutil.copyfile(source, target)
os.chmod(target, 0o600)
# systemd has its own quoting/specifier syntax, not shell syntax.
def quote(value):
    return '"' + str(value).replace('\\', '\\\\').replace('"', '\\"').replace('%', '%%') + '"'
unit = Path.home() / '.config/systemd/user/iota-watch-linux.service'
unit.parent.mkdir(parents=True, exist_ok=True)
unit.write_text('[Unit]\nDescription=IOTA Watch Linux read-only monitor\n\n[Service]\nExecStart=' + quote(sys.executable) + ' ' + quote(target) + ' run\nRestart=on-failure\nRestartSec=15\nUMask=0077\nNoNewPrivileges=true\n\n[Install]\nWantedBy=default.target\n')
subprocess.run(['systemctl', '--user', 'daemon-reload'], check=True)
subprocess.run(['systemctl', '--user', 'enable', '--now', 'iota-watch-linux.service'], check=True)
print('Monitor enabled for this user session. Miner processes unchanged.')
