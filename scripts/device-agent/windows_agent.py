"""IOTA Watch's read-only Windows monitor for BNT, Pearl and Discrete."""
import argparse
from collections import Counter
import ctypes
from ctypes import wintypes
import datetime as dt
import getpass
import json
import os
from pathlib import Path
import re
import shutil
import stat
import subprocess
import sys
import time
import tomllib
import urllib.error
import urllib.request

from xds_observation import ANSI, parse_xds

VERSION = '1.0.0'
ROOT = Path(os.environ.get('LOCALAPPDATA', Path.home())) / 'IOTA Watch Agent'
CONFIG = ROOT / 'config.json'
RUN_KEY = r'Software\Microsoft\Windows\CurrentVersion\Run'
NAME = 'IOTA Watch Agent'
MINERS = ('seine.exe', 'onezerominer.exe', 'prlminer.exe', 'redpearl-miner.exe', 'discreted.exe')
TOKEN = re.compile(r'[A-Za-z0-9_-]{43}')
PRL_STATS = re.compile(r'redPeaRL [^|]+\|\s*(\d+(?:\.\d+)?)\s*([KMGT]?)H/s\s*\|[^|]*\|\s*A (\d+) R (\d+)')
SCALE = {'': 1, 'K': 1e3, 'M': 1e6, 'G': 1e9, 'T': 1e12}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def request_json(url, headers, data=None, *, local=False):
    req = urllib.request.Request(url, data, headers)
    handlers = [NoRedirect()]
    if local:
        handlers.append(urllib.request.ProxyHandler({}))
    with urllib.request.build_opener(*handlers).open(req, timeout=2 if local else 12) as response:
        raw = response.read(32769)
    if len(raw) > 32768:
        raise ValueError('response too large')
    return json.loads(raw)


def post(path, payload, credential=None):
    headers = {'Content-Type': 'application/json', 'Accept': 'application/json',
               'User-Agent': 'IOTA-Watch-Agent/' + VERSION}
    if credential:
        headers['Authorization'] = 'Bearer ' + credential
    return request_json('https://iotahome.site/api/device-agent/' + path, headers, json.dumps(payload).encode())


def process_args(command):
    split = ctypes.windll.shell32.CommandLineToArgvW
    split.argtypes = [wintypes.LPCWSTR, ctypes.POINTER(ctypes.c_int)]
    split.restype = ctypes.POINTER(wintypes.LPWSTR)
    count = ctypes.c_int()
    args = split(command, ctypes.byref(count))
    if not args:
        return []
    free = ctypes.windll.kernel32.LocalFree
    free.argtypes = [wintypes.HLOCAL]
    free.restype = wintypes.HLOCAL
    try:
        return args[1:count.value]
    finally:
        free(ctypes.cast(args, wintypes.HLOCAL))


def processes():
    filter_by_name = ' OR '.join("Name='" + name + "'" for name in MINERS)
    script = f"""
    [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
    $session = [System.Diagnostics.Process]::GetCurrentProcess().SessionId
    $rows = @(Get-CimInstance Win32_Process -Filter "{filter_by_name}" -ErrorAction Stop |
      Where-Object {{ $_.SessionId -eq $session -and $_.ExecutablePath -and $_.CommandLine }} |
      Select-Object Name, ExecutablePath, CommandLine,
        @{{Name='Started'; Expression={{ $_.CreationDate.ToUniversalTime().ToString('o') }}}})
    ConvertTo-Json -InputObject $rows -Compress
    """
    powershell = Path(os.environ['SystemRoot']) / 'System32/WindowsPowerShell/v1.0/powershell.exe'
    raw = subprocess.check_output([str(powershell), '-NoProfile', '-NonInteractive', '-Command', script],
                                  encoding='utf-8', timeout=6, creationflags=subprocess.CREATE_NO_WINDOW)
    return [dict(name=row['Name'].lower(), exe=Path(row['ExecutablePath']), args=process_args(row['CommandLine']),
                 started=dt.datetime.fromisoformat(row['Started']).timestamp()) for row in json.loads(raw)]


def option(args, *names):
    for index, arg in enumerate(args):
        key, equals, value = arg.partition('=')
        if key in names:
            return value if equals else args[index + 1] if index + 1 < len(args) else None
    return None


def iso(stamp):
    return dt.datetime.fromtimestamp(stamp, dt.timezone.utc).isoformat()


def metric(value, integer=False):
    if type(value) in (float, int) and 0 <= value <= 1e15:
        if not integer or int(value) == value:
            return int(value) if integer else value
    return None


def fresh(stamp, started, now, limit=60):
    return started - 1 <= stamp <= now + 5 and now - stamp < limit


def log_tail(path):
    if not path.is_absolute() or str(path).startswith('\\\\') or path.suffix.lower() != '.log':
        raise ValueError('Select a local .log file.')
    if not stat.S_ISREG(path.stat().st_mode):
        raise ValueError('Select a regular log file.')
    with path.open('rb') as stream:
        info = os.fstat(stream.fileno())
        stream.seek(max(0, info.st_size - 32768))
        raw = stream.read(32768)
    if info.st_size > 32768:
        raw = raw.partition(b'\n')[2]
    return ANSI.sub('', raw[:raw.rfind(b'\n')+1].decode('utf-8', 'replace')), info.st_mtime


def identity(wallet, worker):
    if not isinstance(wallet, str) or not wallet or (worker is not None and not isinstance(worker, str)):
        return None
    if '.' in wallet:
        wallet, _, suffix = wallet.partition('.')
        return (wallet, suffix) if not worker or worker == suffix else None
    return (wallet, worker) if worker else None


def seine_source(process, now):
    args = process['args']
    if option(args, '--mode') == 'daemon' or option(args, '--proxy-listen'):
        return None, {}
    data_dir = process['exe'].parent / (option(args, '--data-dir') or 'seine-data')
    wallet = option(args, '--address', '-u', '--user')
    worker = option(args, '--pool-worker', '--worker')
    payout = identity(wallet, worker)
    if not payout and not (wallet and '.' in wallet):
        try:
            config = json.loads((data_dir / 'seine.config.json').read_text(encoding='utf-8'))
            if config.get('mode') != 'daemon':
                payout = identity(wallet or config.get('address'), worker or config.get('pool_worker'))
        except (OSError, ValueError, AttributeError):
            pass
    bind = option(args, '--api-bind')
    if not bind and not {'--api-server', '--service'}.intersection(args):
        return payout, {}
    match = re.fullmatch(r'(?:127\.0\.0\.1|localhost):(\d{1,5})', bind or '127.0.0.1:9977')
    if not match or not 1024 <= int(match[1]) <= 65535:
        return payout, {}
    cookie = data_dir / 'control-api.cookie'
    token = option(args, '--api-token')
    try:
        if not token:
            with cookie.open(encoding='utf-8') as stream:
                token = stream.read(257).strip()
    except OSError:
        return payout, {}
    if not re.fullmatch(r'[!-~]{1,256}', token):
        return payout, {}
    headers = {'Authorization': 'Bearer ' + token, 'Accept': 'application/json'}
    base = 'http://127.0.0.1:' + match[1]
    try:
        config = request_json(base + '/v1/runtime/config/effective', headers, local=True)['config']
        active = identity(config.get('mining_address'), config.get('pool_worker'))
        stats = request_json(base + '/v1/miner/stats', headers, local=True)
        if stats['running'] is False:
            return active, dict(status='stopped')
        mining = stats.get('mining')
        if stats['running'] is not True or not mining:
            return active, {}
        stamp = mining['updated_at_unix_ms'] / 1000
        rate = metric(mining.get('average_hashrate_hps'))
        if rate is None or not fresh(stamp, process['started'], now):
            return active, {}
        return active, dict(status='ok', observedAt=iso(stamp), rateWindow='session', hashrateSession=rate,
                            accepted=metric(mining.get('accepted'), True),
                            rejected=metric(mining.get('rejected'), True))
    except (OSError, ValueError, KeyError, TypeError, AttributeError):
        return payout, {}


def pearl_source(process, now):
    args, name = process['args'], process['name']
    if name == 'onezerominer.exe':
        if option(args, '-a', '--algo') not in ('pearl', 'pearlhash'):
            return None, {}
        wallet = option(args, '-w', '--wallet')
        return identity(wallet, option(args, '--worker') or ('worker' if wallet and '.' not in wallet else None)), {}
    if name == 'prlminer.exe':
        if args and args[0] in ('bench', 'selftest', 'probe'):
            return None, {}
        wallet = option(args, '-u', '--wallet')
        return identity(wallet, option(args, '-w', '--worker') or ('rig' if wallet and '.' not in wallet else None)), {}
    folder = process['exe'].parent
    try:
        config_path = folder / 'redpearl.toml'
        with config_path.open('rb') as stream:
            config = tomllib.load(stream)
        if config_path.stat().st_mtime > process['started'] + 1:
            return None, {}
    except (OSError, ValueError):
        return None, {}
    payout = identity(option(args, '--wallet') or config.get('wallet'),
                      option(args, '--worker') or config.get('worker'))
    try:
        log_path = folder / (option(args, '--log-file') or config.get('log', {}).get('file', 'miner.log'))
        tail, stamp = log_tail(log_path)
        if fresh(stamp, process['started'], now):
            line = tail.splitlines()[-1] if tail else ''
            match = PRL_STATS.search(line)
            if match:
                rate, scale, accepted, rejected = match.groups()
                rate = metric(float(rate) * SCALE[scale])
                if rate is not None:
                    return payout, dict(status='ok', observedAt=iso(stamp), rateWindow='current',
                                        hashrateCurrent=rate, accepted=metric(int(accepted), True),
                                        rejected=metric(int(rejected), True))
    except (OSError, ValueError, TypeError, AttributeError):
        pass
    return payout, {}


def pool_observations(rows, bindings, now):
    readings = []
    for process in rows:
        name = process['name']
        if name == 'discreted.exe':
            continue
        project, software = ('bnt', 'seine') if name == 'seine.exe' else ('prl', 'pearl-windows')
        wanted = [b for b in bindings if b['project'] == project and b['worker']]
        if not wanted:
            continue
        payout, metrics = (seine_source if project == 'bnt' else pearl_source)(process, now)
        matches = [b for b in wanted if (b['identifier'], b['worker']) == payout]
        if len(matches) == 1:
            readings.append(dict(bindingId=matches[0]['id'], project=project, software=software,
                                 observedAt=iso(now), status='process', hashrate10s=None, hashrate60s=None,
                                 accepted=None, rejected=None, uptime=None, counterUnit='shares'))
            readings[-1].update(metrics)
    counts = Counter(reading['bindingId'] for reading in readings)
    return [reading for reading in readings if counts[reading['bindingId']] == 1]


def xds_reading(rows, selected, now, known=False):
    unavailable = dict(status='unavailable', observedAt=None, hashrateHps=None)
    if rows is None:
        return unavailable if selected or known else None
    miners = [row for row in rows if row['name'] == 'discreted.exe']
    if not miners:
        return dict(status='stopped', observedAt=iso(now), hashrateHps=None) if selected or known else None
    if len(miners) != 1:
        return unavailable
    miner = miners[0]
    exe = miner['exe']
    custom = selected or option(miner['args'], '--log-file')
    path = Path(custom) if custom else exe.with_suffix('.log')
    # Discrete resolves a bare log filename beside the exe, not paths with a parent.
    if custom and path.parent == Path('.'):
        path = exe.parent / path
    try:
        tail, _ = log_tail(path)
        value = parse_xds(tail)
        if value['observedAt']:
            stamp = dt.datetime.fromisoformat(value['observedAt']).timestamp()
            if fresh(stamp, miner['started'], now, limit=150):
                return value
    except (OSError, ValueError):
        pass
    return unavailable


def snapshot(rows, bindings, selected, now, xds_known=False):
    result = dict(platform='win32', monitorOnly=True, version=VERSION,
                  appRunning=False, workerRunning=False, appCpu=None, processMemoryMb=None,
                  load=None, recovery='paused', miners=pool_observations(rows or [], bindings, now))
    xds = xds_reading(rows, selected, now, xds_known)
    if xds is not None:
        result['xds'] = xds
    return result


def save_config(config):
    temp = CONFIG.with_suffix('.tmp')
    temp.write_text(json.dumps(config), encoding='utf-8')
    temp.replace(CONFIG)


def run():
    import msvcrt
    with (ROOT / 'agent.lock').open('ab') as lock:
        try:
            msvcrt.locking(lock.fileno(), msvcrt.LK_NBLCK, 1)
        except OSError:
            return
        bindings, ack, xds_known = [], None, False
        while CONFIG.exists():
            config = json.loads(CONFIG.read_text(encoding='utf-8'))
            try:
                rows = processes()
            except (OSError, ValueError, subprocess.SubprocessError):
                rows = None
            try:
                current = snapshot(rows, bindings, config.get('xdsLog'), time.time(), xds_known)
                xds_known = 'xds' in current
                response = post('heartbeat', dict(snapshot=current, requestBindings=True, ack=ack), config['credential'])
                bindings = response.get('bindings', [])
                command = response.get('command')
                ack = dict(id=command['id'], success=False) if command else None
            except (OSError, ValueError):
                pass
            time.sleep(15)


def install():
    import winreg
    pythonw = Path(sys.executable).with_name('pythonw.exe')
    if not pythonw.is_file():
        raise ValueError('Install Python for Windows from python.org first.')
    ROOT.mkdir(parents=True, exist_ok=True)
    config = json.loads(CONFIG.read_text(encoding='utf-8')) if CONFIG.exists() else {}
    if not config:
        code = getpass.getpass('IOTA Watch pairing code: ').strip()
        if not TOKEN.fullmatch(code):
            raise ValueError('Invalid pairing code.')
        credential = post('pair', dict(token=code)).get('credential', '')
        if not TOKEN.fullmatch(credential):
            raise ValueError('Invalid pairing response.')
        save_config(dict(credential=credential))
    for name in ('windows_agent.py', 'xds_observation.py'):
        source = Path(__file__).with_name(name)
        if source.resolve() != (ROOT / name).resolve():
            shutil.copyfile(source, ROOT / name)
    command = [str(pythonw), str(ROOT / 'windows_agent.py'), 'run']
    with winreg.CreateKey(winreg.HKEY_CURRENT_USER, RUN_KEY) as key:
        winreg.SetValueEx(key, NAME, 0, winreg.REG_SZ, subprocess.list2cmdline(command))
    subprocess.Popen(command, cwd=ROOT, creationflags=subprocess.DETACHED_PROCESS)
    print('Windows Agent installed. It runs when you sign in.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['install', 'run', 'configure-xds', 'check', 'uninstall'])
    parser.add_argument('log', nargs='?')
    args = parser.parse_args()
    if sys.platform != 'win32':
        parser.exit(1, 'Windows is required.\n')
    try:
        if args.action == 'install':
            install()
        elif args.action == 'run':
            run()
        elif args.action == 'check':
            config = json.loads(CONFIG.read_text(encoding='utf-8'))
            rows = processes()
            print(json.dumps(dict(processes=[row['name'] for row in rows],
                                  xds=xds_reading(rows, config.get('xdsLog'), time.time())), indent=2))
        elif args.action == 'configure-xds':
            path = Path(args.log or '')
            log_tail(path)
            config = json.loads(CONFIG.read_text(encoding='utf-8'))
            config['xdsLog'] = str(path)
            save_config(config)
            print('XDS log saved. It will be read on the next heartbeat.')
        else:
            import winreg
            with winreg.CreateKeyEx(winreg.HKEY_CURRENT_USER, RUN_KEY, 0, winreg.KEY_SET_VALUE) as key:
                try:
                    winreg.DeleteValue(key, NAME)
                except FileNotFoundError:
                    pass
            CONFIG.unlink(missing_ok=True)
            print('Windows Agent will stop within one reporting interval.')
    except urllib.error.HTTPError:
        parser.exit(1, 'Pairing failed. Create a fresh pairing code and try again.\n')
    except (OSError, ValueError, subprocess.SubprocessError):
        parser.exit(1, 'Agent setup or local reading failed. See WINDOWS.md.\n')


if __name__ == '__main__':
    main()
