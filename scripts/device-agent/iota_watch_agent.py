#!/usr/bin/env python3
"""Account-paired Mac agent. Only fixed TAH application actions; no shell execution."""
import argparse
import datetime
import getpass
import fcntl
import json
import os
from pathlib import Path
import plistlib
import re
import shutil
import signal
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

VERSION = '1.0.4'
ROOT = Path.home() / 'Library/Application Support/IOTA Watch Agent'
CONFIG = ROOT / 'config.json'
STATE = ROOT / 'state.json'
LABEL = 'site.iotahome.device-agent'
PLIST = Path.home() / 'Library/LaunchAgents' / (LABEL + '.plist')
APP = next((p for p in [Path('/Applications/IOTA Train at Home.app'), Path.home() / 'Applications/IOTA Train at Home.app'] if p.is_dir()), Path('/Applications/IOTA Train at Home.app'))
EXEC = str(APP / 'Contents/MacOS/IOTA Train at Home')
WORKER = str(APP / 'Contents/Frameworks/iota-cli/main_pool')


def redact(text):
    text = re.sub(r'Bearer\s+[^\s"\']+', 'Bearer [redacted]', text, flags=re.I)
    text = re.sub(r'((?:token|secret|password|authorization|api[_-]?key|seed|mnemonic|private[_-]?key)\s*[=:]\s*)[^\n]+', r'\1[redacted]', text, flags=re.I)
    text = re.sub(r'https?://[^\s"\']+', '[url]', text)
    text = re.sub(r'/Users/[^/\s]+', '/Users/[user]', text)
    text = re.sub(r'\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b', '[email]', text)
    text = re.sub(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', '[ip]', text)
    text = re.sub(r'\b[A-Za-z0-9_+/=-]{32,}\b', '[identifier]', text)
    return re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', text).encode('utf-8')[-12000:].decode('utf-8', errors='ignore')


def store(path, data):
    ROOT.mkdir(parents=True, exist_ok=True, mode=0o700)
    ROOT.chmod(0o700)
    temp = path.with_suffix('.tmp')
    fd = os.open(str(temp), os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, 'w') as f:
        json.dump(data, f)
    temp.chmod(0o600)
    temp.replace(path)


def read(path):
    try:
        return json.loads(path.read_text())
    except (OSError, ValueError):
        return {}


def endpoint(server):
    p = urllib.parse.urlsplit(server)
    if p.username or p.password or p.query or p.fragment or p.path not in ('', '/'):
        raise ValueError('invalid server')
    if not ((p.scheme == 'https' and p.hostname == 'iotahome.site' and p.port in (None, 443)) or
            (p.scheme == 'http' and p.hostname == '127.0.0.1' and p.port)):
        raise ValueError('unsupported server')
    return server.rstrip('/')


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ValueError('redirect rejected')


def post(server, path, data, credential=None):
    headers = {'Content-Type': 'application/json', 'Accept': 'application/json',
               'User-Agent': 'IOTA-Watch-Agent/' + VERSION}
    if credential:
        headers['Authorization'] = 'Bearer ' + credential
    req = urllib.request.Request(endpoint(server) + path, json.dumps(data, ensure_ascii=False).encode(), headers=headers, method='POST')
    with urllib.request.build_opener(NoRedirect()).open(req, timeout=12) as response:
        raw = response.read(20001)
        if len(raw) > 20000:
            raise ValueError('response too large')
        return json.loads(raw)


def processes():
    text = subprocess.check_output(['/bin/ps', '-axo', 'pid=,%cpu=,rss=,comm='], text=True, timeout=5)
    result = []
    for line in text.splitlines():
        parts = line.strip().split(None, 3)
        if len(parts) == 4 and parts[3] in (EXEC, WORKER):
            try:
                result.append((int(parts[0]), float(parts[1]), int(parts[2]), parts[3]))
            except ValueError:
                pass
    return result


def training_resources():
    """Sum the training process tree, excluding the GUI, helpers and this agent."""
    text = subprocess.check_output(['/bin/ps', '-axo', 'pid=,ppid=,%cpu=,rss=,comm='], text=True, timeout=5)
    rows = {}
    for line in text.splitlines():
        parts = line.strip().split(None, 4)
        if len(parts) != 5:
            continue
        try:
            pid, parent, cpu, rss = int(parts[0]), int(parts[1]), float(parts[2]), int(parts[3])
            if cpu >= 0 and rss >= 0:
                rows[pid] = (parent, cpu, rss, parts[4])
        except ValueError:
            continue
    # TAH changes its worker process title. Accept that exact title only when
    # descended from the installed application or an identified training worker.
    selected = {pid for pid, row in rows.items() if row[3] == WORKER}
    apps = {pid for pid, row in rows.items() if row[3] == EXEC}
    for pid, row in rows.items():
        if row[3] != 'main_pool:ai.macrocosmos.iota.tah.worker':
            continue
        parent, seen = row[0], {pid}
        while parent in rows and parent not in seen:
            if parent in apps or parent in selected:
                selected.add(pid)
                break
            seen.add(parent)
            parent = rows[parent][0]
    while True:
        children = {pid for pid, row in rows.items() if row[0] in selected}
        if children <= selected:
            break
        selected |= children
    selected.discard(os.getpid())
    if not selected:
        return None, None
    return (sum(rows[pid][1] for pid in selected),
            round(sum(rows[pid][2] for pid in selected) / 1024, 1))


def logs():
    folder = Path.home() / 'Library/Logs/IOTA Train at Home'
    files = sorted([p for p in folder.glob('*.log') if p.is_file() and not p.is_symlink()], key=lambda p: p.stat().st_mtime)[-2:]
    lines = []
    for path in files:
        with path.open('rb') as f:
            f.seek(max(0, path.stat().st_size - 24000))
            for line in f.read(24000).decode('utf-8', errors='replace').splitlines():
                # Only training/status/error lines, never complete files or request/config dumps.
                if re.search(r'epoch|throughput|training|activation|crash|fatal|error', line, re.I):
                    lines.append(line)
    return redact('\n'.join(lines[-40:]))


def parse_queue(text, now, started):
    """Only recent official registration responses; never transmit raw log contents."""
    result = None
    for line in text.splitlines():
        if '/miner/register/status/' not in line or 'response:' not in line:
            continue
        stamp = re.match(r'\[(\d{4}-\d\d-\d\d \d\d:\d\d:\d\d\.\d+)\]', line)
        if not stamp:
            continue
        try:
            observed = datetime.datetime.strptime(stamp[1], '%Y-%m-%d %H:%M:%S.%f').timestamp()
        except ValueError:
            continue
        if observed < started or not 0 <= now - observed <= 300:
            continue
        if result and observed < result['time']:
            continue
        status = re.search(r"['\"]status['\"]:\s*['\"]([^'\"]+)", line)
        position = re.search(r"['\"]position['\"]:\s*(\d+)", line)
        result = {'time': observed, 'position': int(position[1]) if status and status[1] == 'queued' and position else None}
    if not result or result['position'] is None or result['position'] > 10000000:
        return None
    return {'position': result['position'], 'observedAt': datetime.datetime.fromtimestamp(result['time'], datetime.timezone.utc).isoformat()}


def queue_status(rows):
    workers = [r for r in rows if r[3] == WORKER]
    if not workers:
        return None
    try:
        # macOS etime is [[days-]hours:]minutes:seconds, independent of locale.
        elapsed = subprocess.check_output(['/bin/ps', '-p', str(workers[0][0]), '-o', 'etime='], text=True, timeout=5).strip()
        days, clock = elapsed.split('-', 1) if '-' in elapsed else ('0', elapsed)
        seconds = 0
        for part in clock.split(':'):
            seconds = seconds * 60 + int(part)
        now = time.time()
        started = now - (int(days) * 86400 + seconds)
        folder = Path.home() / 'Library/Logs/IOTA Train at Home'
        files = sorted([p for p in folder.glob('*cli.log') if p.is_file() and not p.is_symlink()], key=lambda p: p.stat().st_mtime)[-2:]
        text = ''
        for path in files:
            with path.open('rb') as f:
                f.seek(max(0, path.stat().st_size - 128000))
                text += f.read(128000).decode('utf-8', errors='replace') + '\n'
        return parse_queue(text, now, started)
    except (OSError, ValueError, subprocess.SubprocessError):
        return None


def snapshot(include_logs=False):
    rows = processes()
    cpu, memory = training_resources()
    payload = {'appRunning': any(r[3] == EXEC for r in rows), 'workerRunning': any(r[3] == WORKER for r in rows),
               'appCpu': cpu,
               'processMemoryMb': memory,
               'load': os.getloadavg()[0], 'version': VERSION, 'recovery': 'idle'}
    payload['queue'] = queue_status(rows)
    if include_logs:
        try:
            payload['logs'] = logs()
        except OSError:
            payload['logs'] = ''
    return payload


def control(action):
    if action not in ('start', 'stop', 'restart'):
        raise ValueError('unsupported action')
    if not APP.is_dir():
        raise ValueError('TAH app missing')
    if action in ('stop', 'restart'):
        rows = processes()
        for pid, _, _, _ in rows:
            # Recheck the allowlisted executable immediately before signalling.
            if any(r[0] == pid for r in processes()):
                try:
                    os.kill(pid, signal.SIGTERM)
                except ProcessLookupError:
                    pass
        deadline = time.monotonic() + 8
        while processes() and time.monotonic() < deadline:
            time.sleep(0.25)
        if processes():
            raise ValueError('app did not stop')
    if action in ('start', 'restart'):
        if any(r[3] == EXEC for r in processes()):
            return
        legacy = Path.home() / 'Library/Application Support/IOTA Local Guardian/iota_local_start.py'
        launcher = legacy if legacy.is_file() else ROOT / 'iota_local_start.py'
        if not launcher.is_file():
            raise ValueError('optimized launcher missing; reinstall the complete agent package')
        subprocess.run([sys.executable, str(launcher)], check=True, timeout=10,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        deadline = time.monotonic() + 12
        while time.monotonic() < deadline:
            if any(r[3] == EXEC for r in processes()):
                return
            time.sleep(0.5)
        raise ValueError('app did not start')


def crashed_since(stamp):
    folder = Path.home() / 'Library/Logs/DiagnosticReports'
    return any(p.stat().st_mtime > stamp for p in folder.glob('IOTA Train at Home*.ips') if p.is_file())


def step(config, state, now=None):
    now = time.time() if now is None else now
    payload = snapshot(state.get('logsEnabled', False) and state.get('permissionsUntil', 0) > now)
    payload['recovery'] = state.pop('recovery', 'idle')
    try:
        result = post(config['server'], '/api/device-agent/heartbeat', {'snapshot': payload, 'ack': state.get('ack')}, config['credential'])
    except urllib.error.HTTPError as e:
        if e.code == 401:
            state['permissionsUntil'] = 0
            state['logsEnabled'] = False
            state['recoveryEnabled'] = False
        raise
    state['ack'] = None
    update = read(ROOT / 'update-request.json')
    if update.get('phase') == 'installed' and update.get('version') == VERSION:
        state['ack'] = {'id': update['id'], 'success': True}
        store(STATE, state)
        store(ROOT / 'update-health.json', {'id': update['id'], 'version': VERSION})
    state['logsEnabled'] = result.get('logsEnabled') is True
    state['recoveryEnabled'] = result.get('recoveryEnabled') is True
    state['permissionsUntil'] = now + 90
    command = result.get('command')
    if command:
        cmd_id = command.get('id', '')
        expiry = datetime.datetime.fromisoformat(command['expiresAt'].replace('Z', '+00:00')).timestamp()
        if re.fullmatch(r'[0-9a-fA-F-]{36}', cmd_id) and expiry >= now and command.get('action') in ('start', 'stop', 'restart', 'update'):
            if cmd_id not in state.get('executed', []):
                # Persist deduplication before any action; a restart of this agent cannot replay it.
                state['executed'] = (state.get('executed', []) + [cmd_id])[-32:]
                store(STATE, state)
                success = False
                try:
                    if command['action'] == 'update':
                        import agent_updater
                        if agent_updater.prepare(VERSION, cmd_id):
                            return state
                    else:
                        control(command['action'])
                    success = True
                except (OSError, ValueError, subprocess.SubprocessError):
                    pass
                state['ack'] = {'id': cmd_id, 'success': success}
                state['lastRestart'] = now
                if command['action'] == 'stop':
                    state['recoveryEnabled'] = False
            return state
    if payload['appRunning']:
        state['lastRunning'] = now
    elif state.get('recoveryEnabled') and state.get('lastRunning') and crashed_since(state['lastRunning']):
        if now - state.get('lastRestart', 0) >= 900:
            state['lastRestart'] = now
            store(STATE, state)
            try:
                control('start')
                state['recovery'] = 'restarted'
            except (OSError, ValueError, subprocess.SubprocessError):
                state['recovery'] = 'paused'
    return state


def setup_error(error):
    """Only fixed, actionable messages; never echo codes, credentials or response bodies."""
    if isinstance(error, urllib.error.HTTPError):
        if error.code == 401:
            return 'Pairing code expired or already used. Generate a new code on the website. / 配对码无效或已过期，请重新生成。'
        if error.code == 403:
            return 'Website protection blocked the request (HTTP 403). Download the latest agent. / 请求被网站防护拦截，请下载最新版代理。'
        if error.code == 429:
            return 'Too many requests. Wait a minute and retry. / 请求过多，请稍后重试。'
        return 'Pairing service returned HTTP %d. Please retry later. / 配对服务异常，请稍后重试。' % error.code
    if isinstance(error, (urllib.error.URLError, TimeoutError)):
        return 'Cannot connect securely to iotahome.site. Check network and system time, then retry. / 无法连接官网，请检查网络和系统时间。'
    if isinstance(error, subprocess.SubprocessError):
        return 'Could not start the background agent. Run the installer again. / 后台代理启动失败，请重新运行安装器。'
    messages = {
        'invalid pairing code': 'Paste the complete pairing code from the website. / 请粘贴完整配对码，再按回车。',
        'TAH app missing': 'Install IOTA Train at Home in Applications first. / 请先安装官方 IOTA 应用。',
        'incomplete package: startup helpers missing': 'Extract the entire ZIP before running install.command. / 请完整解压安装包后运行。',
        'pairing failed': 'Unexpected pairing response. Please retry with the latest agent. / 配对响应异常，请使用最新代理重试。',
    }
    if isinstance(error, ValueError):
        return messages.get(str(error), 'Invalid setup data. Download the latest agent and retry. / 安装数据异常，请重新下载安装包。')
    return 'Could not save agent files. Check file permissions and available disk space. / 无法保存代理文件，请检查权限和磁盘空间。'


def install(server):
    if sys.platform != 'darwin':
        raise ValueError('macOS required')
    if not APP.is_dir():
        raise ValueError('TAH app missing')
    endpoint(server)
    source = Path(__file__).resolve().parent
    helpers = [source / name for name in ('iota_local_start.py', 'iota_local_relay.py', 'agent_updater.py')]
    if not all(p.is_file() for p in helpers):
        raise ValueError('incomplete package: startup helpers missing')
    existing = read(CONFIG)
    upgrading = bool(re.fullmatch(r'[A-Za-z0-9_-]{43}', existing.get('credential', ''))) and existing.get('server') == endpoint(server)
    if upgrading:
        credential = existing['credential']
    else:
        token = getpass.getpass('Paste pairing code, then press Enter (input is hidden / 输入不显示): ').strip()
        if not re.fullmatch(r'[A-Za-z0-9_-]{43}', token):
            raise ValueError('invalid pairing code')
        result = post(server, '/api/device-agent/pair', {'token': token})
        credential = result.get('credential', '')
        if not re.fullmatch(r'[A-Za-z0-9_-]{43}', credential):
            raise ValueError('pairing failed')
    subprocess.run(['/bin/launchctl', 'bootout', 'gui/' + str(os.getuid()), str(PLIST)], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    store(CONFIG, {'server': endpoint(server), 'credential': credential})
    # A new pairing must not inherit log consent or queued acknowledgements.
    if not upgrading:
        store(STATE, {})
    script = ROOT / 'iota_watch_agent.py'
    if Path(__file__).resolve() != script.resolve():
        shutil.copyfile(__file__, script)
    script.chmod(0o700)
    for helper in helpers:
        target = ROOT / helper.name
        if helper.resolve() != target.resolve():
            shutil.copyfile(helper, target)
        target.chmod(0o600)
    for marker in ('update-request.json', 'update-health.json'):
        (ROOT / marker).unlink(missing_ok=True)
    PLIST.parent.mkdir(parents=True, exist_ok=True)
    with PLIST.open('wb') as f:
        plistlib.dump({'Label': LABEL, 'ProgramArguments': [sys.executable, str(ROOT / 'agent_updater.py')],
                      'RunAtLoad': True, 'KeepAlive': True,
                      'StandardOutPath': '/dev/null', 'StandardErrorPath': '/dev/null'}, f)
    PLIST.chmod(0o600)
    subprocess.run(['/bin/launchctl', 'bootstrap', 'gui/' + str(os.getuid()), str(PLIST)], check=True)
    print('Paired. Manage this Mac in IOTA Watch → My devices → Mac management.')
    print('Remove this agent: python3 "' + str(script) + '" --uninstall')


def uninstall():
    subprocess.run(['/bin/launchctl', 'bootout', 'gui/' + str(os.getuid()), str(PLIST)], check=False)
    PLIST.unlink(missing_ok=True)
    for path in [CONFIG, STATE, ROOT / 'agent.lock', ROOT / 'supervisor.lock', ROOT / 'iota_watch_agent.py', ROOT / 'agent_updater.py', ROOT / 'update-request.json', ROOT / 'update-health.json']:
        path.unlink(missing_ok=True)
    print('Removed locally. Revoke the pairing in IOTA Watch as well.')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--self-test', action='store_true')
    parser.add_argument('--install', action='store_true')
    parser.add_argument('--uninstall', action='store_true')
    parser.add_argument('--run', action='store_true')
    parser.add_argument('--status', action='store_true')
    parser.add_argument('--server', default='https://iotahome.site')
    args = parser.parse_args()
    if args.self_test:
        print(VERSION)
    elif args.install:
        install(args.server)
    elif args.uninstall:
        uninstall()
    elif args.status:
        print(json.dumps(snapshot(False)))
    elif args.run:
        ROOT.mkdir(parents=True, exist_ok=True, mode=0o700)
        lock = (ROOT / 'agent.lock').open('w')
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return
        config = read(CONFIG)
        endpoint(config['server'])
        while True:
            state = read(STATE)
            try:
                state = step(config, state)
            except (OSError, ValueError, KeyError, subprocess.SubprocessError):
                # No offline remote control/recovery. Never print credentials or raw logs.
                state['permissionsUntil'] = 0
                state['logsEnabled'] = False
                state['recoveryEnabled'] = False
            store(STATE, state)
            if read(ROOT / 'update-request.json').get('phase') == 'ready':
                return
            time.sleep(15)
    else:
        parser.print_help()


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, KeyError, subprocess.SubprocessError) as error:
        print('Agent setup failed: ' + setup_error(error), file=sys.stderr)
        sys.exit(1)
