import os
from pathlib import Path
import socket
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parent
APP_CANDIDATES = [Path('/Applications/IOTA Train at Home.app'), Path.home() / 'Applications/IOTA Train at Home.app']
APP_BUNDLE = next((path for path in APP_CANDIDATES if path.exists()), None)
if APP_BUNDLE is None:
    sys.exit('找不到官方 IOTA 应用。请先把 IOTA Train at Home.app 放进“应用程序”文件夹。')
APP = str(APP_BUNDLE / 'Contents/MacOS/IOTA Train at Home')
RELAY = ROOT / 'iota_local_relay.py'
running = subprocess.check_output(['ps', '-axo', 'command='], text=True).splitlines()
if APP in running:
    print('IOTA 已在运行，不启动重复实例。需要切换到优化启动时，请先从 IOTA 菜单退出，再运行此启动器。')
    sys.exit(0)

pid_file = ROOT / 'iota-relay.pid'
existing = False
try:
    pid = int(pid_file.read_text())
    command = subprocess.check_output(['ps', '-p', str(pid), '-o', 'command='], text=True)
    trusted_paths = [str(RELAY)]
    legacy = ROOT / 'legacy-relay-path.txt'
    if legacy.exists():
        trusted_paths.append(legacy.read_text().strip())
    existing = any(path in command for path in trusted_paths)
except (OSError, ValueError, subprocess.CalledProcessError):
    pass
if not existing:
    with socket.socket() as probe:
        try:
            probe.bind(('127.0.0.1', 18010))
        except OSError:
            sys.exit('本地端口 18010 被其他程序占用；未启动 IOTA。')
    log = open(ROOT / 'iota-relay.log', 'ab')
    relay = subprocess.Popen([sys.executable, str(RELAY)], stdin=subprocess.DEVNULL,
                             stdout=log, stderr=log, start_new_session=True)
    pid_file.write_text(str(relay.pid))
    deadline = time.monotonic() + 5
    while True:
        if relay.poll() is not None:
            sys.exit('本地等待服务启动失败；未启动 IOTA。')
        try:
            with socket.create_connection(('127.0.0.1', 18010), timeout=.3):
                break
        except OSError:
            if time.monotonic() > deadline:
                sys.exit('本地等待服务未就绪；未启动 IOTA。')
            time.sleep(.1)

env = os.environ.copy()
env['MACROCOSMOS_WS_URL'] = 'ws://127.0.0.1:18010/ws'
# Preserve default compute settings: the thread-limit experiment did not fix startup.
for key in ('OMP_NUM_THREADS', 'OPENBLAS_NUM_THREADS', 'MKL_NUM_THREADS',
            'VECLIB_MAXIMUM_THREADS', 'TOKENIZERS_PARALLELISM'):
    env.pop(key, None)
log = open(ROOT / 'iota-local-optimized-launch.log', 'ab')
app = subprocess.Popen([APP], env=env, stdin=subprocess.DEVNULL,
                       stdout=log, stderr=log, start_new_session=True)
print('已启动官方 IOTA，本地控制连接将等待真实矿工就绪。')
