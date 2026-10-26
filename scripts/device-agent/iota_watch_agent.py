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
import tempfile
import math
import uuid
import stat
import shlex
from concurrent.futures import ThreadPoolExecutor
import urllib.error
import urllib.parse
import urllib.request

VERSION = '1.0.13'
ROOT = Path.home() / 'Library/Application Support/IOTA Watch Agent'
CONFIG = ROOT / 'config.json'
STATE = ROOT / 'state.json'
LABEL = 'site.iotahome.device-agent'
PLIST = Path.home() / 'Library/LaunchAgents' / (LABEL + '.plist')
APP = next((p for p in [Path('/Applications/IOTA Train at Home.app'), Path.home() / 'Applications/IOTA Train at Home.app'] if p.is_dir()), Path('/Applications/IOTA Train at Home.app'))
EXEC = str(APP / 'Contents/MacOS/IOTA Train at Home')
WORKER = str(APP / 'Contents/Frameworks/iota-cli/main_pool')
# TAH replaces the worker process title with this exact string. Observation may
# treat it as a training root only with installed GUI or worker ancestry.
TRAINING_TITLE = 'main_pool:ai.macrocosmos.iota.tah.worker'


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


def parse_process_table(text):
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
    return rows


def trusted_training_roots(rows):
    """Training root identities for observation.

    An exact installed worker path is a root. The exact renamed title is a root
    only when walking parents reaches that path or the installed GUI. Generic
    helper names, CPU, and a GUI TRAINING label are not evidence. Cycles stop.
    """
    path_workers = {pid for pid, row in rows.items() if row[3] == WORKER}
    apps = {pid for pid, row in rows.items() if row[3] == EXEC}
    roots = []
    for pid, row in rows.items():
        if row[3] == WORKER:
            roots.append(pid)
            continue
        if row[3] != TRAINING_TITLE:
            continue
        parent, seen = row[0], {pid}
        while parent in rows and parent not in seen and len(seen) <= len(rows):
            if parent in apps or parent in path_workers:
                roots.append(pid)
                break
            seen.add(parent)
            parent = rows[parent][0]
    return roots


def training_tree(rows, roots):
    """Ancestry-selected roots plus their descendants. Name alone never adds a pid."""
    selected = set(roots)
    for _ in range(len(rows) + 1):
        children = {pid for pid, row in rows.items() if row[0] in selected and pid not in selected}
        if not children:
            break
        selected |= children
    return selected


def resources_from_rows(rows):
    selected = training_tree(rows, trusted_training_roots(rows))
    selected.discard(os.getpid())
    if not selected:
        return None, None
    return (sum(rows[pid][1] for pid in selected),
            round(sum(rows[pid][2] for pid in selected) / 1024, 1))


def load_process_table():
    text = subprocess.check_output(['/bin/ps', '-axo', 'pid=,ppid=,%cpu=,rss=,comm='], text=True, timeout=5)
    return parse_process_table(text)


def training_resources():
    """Sum the training process tree, excluding the GUI, helpers and this agent."""
    return resources_from_rows(load_process_table())


def observed_training_workers():
    """Selected training roots only, for snapshot and local status. Not control."""
    rows = load_process_table()
    return [(pid, rows[pid][1], rows[pid][2], rows[pid][3]) for pid in trusted_training_roots(rows)]


def logs():
    folder = Path.home() / 'Library/Logs/IOTA Train at Home'
    files = sorted([p for p in folder.glob('*.log') if p.is_file() and not p.is_symlink()], key=lambda p: p.stat().st_mtime)[-2:]
    lines = []
    for path in files:
        with path.open('rb') as f:
            f.seek(max(0, path.stat().st_size - 24000))
            for line in f.read(24000).decode('utf-8', errors='replace').splitlines():
                # Only training/status/error lines, never complete files or request/config dumps.
                if re.search(r'epoch|throughput|training|activation|crash|fatal|error|SIGABRT|SIGSEGV|panicked at|PoisonError|missing local CID|out of memory', line, re.I):
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



def parse_training_state(text, now, started):
    """Allowlisted fields from successful official heartbeats only.
    Official logs truncate response dictionaries: require each complete quoted value,
    never treat a run's phase alone as evidence of this miner doing work.
    """
    result = None
    phases = {'training', 'weights_uploading', 'merging_partitions'}
    statuses = {'forward', 'backward', 'idle', 'uploading_weights', 'merging_partitions', 'initializing', 'frozen', 'kicked'}
    for line in text.splitlines():
        if not re.search(r'Successfully completed request to /miner/heartbeat(?:\?[^; ]*)?; response:', line):
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
        if result and observed < result[0]:
            continue
        body = line.split('response:', 1)[1][:1000]
        phase = re.search(r"['\"]phase['\"]:\s*['\"]([a-z_]+)['\"]", body)
        status = re.search(r"['\"]status['\"]:\s*['\"]([a-z_]+)['\"]", body)
        # A newer unreadable heartbeat clears older evidence instead of preserving it.
        value = None
        if phase and status and phase[1] in phases and status[1] in statuses:
            value = {'phase': phase[1], 'status': status[1], 'observedAt': datetime.datetime.fromtimestamp(observed, datetime.timezone.utc).isoformat()}
        result = (observed, value)
    return result[1] if result else None

def local_training_status(rows):
    workers = [r for r in rows if r[3] in (WORKER, TRAINING_TITLE)]
    if not workers:
        return None, None
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
        return parse_queue(text, now, started), parse_training_state(text, now, started)
    except (OSError, ValueError, subprocess.SubprocessError):
        return None, None


def queue_status(rows):
    return local_training_status(rows)[0]


def process_started(pid, now):
    elapsed = subprocess.check_output(['/bin/ps', '-p', str(pid), '-o', 'etime='], text=True, timeout=5).strip()
    days, clock = elapsed.split('-', 1) if '-' in elapsed else ('0', elapsed)
    seconds = 0
    for part in clock.split(':'):
        seconds = seconds * 60 + int(part)
    return now - (int(days) * 86400 + seconds)


def log_crash_evidence(text, started, now):
    """Only explicit process termination, never a warning, idle or Rust thread panic alone."""
    crash, progress = None, None
    for line in text.splitlines():
        stamp = re.match(r'\[(\d{4}-\d\d-\d\d \d\d:\d\d:\d\d\.\d+)\]', line)
        if not stamp:
            continue
        try:
            at = datetime.datetime.strptime(stamp[1], '%Y-%m-%d %H:%M:%S.%f').timestamp()
        except ValueError:
            continue
        if not started <= at <= now:
            continue
        # Actual training activity, not GUI TRAINING labels or resource-monitor logs.
        if re.search(r'Successfully completed request to /miner/(?:heartbeat(?:[?; ])|register/status/)|(?:FORWARD|BACKWARD) (?:pass|complete)|Starting (?:FORWARD|BACKWARD) pass', line):
            progress = max(progress or at, at)
        if re.search(r'(?:Training (?:process )?|Miner (?:process )?)(?:exited|terminated).*?(?:code[=: ]+(?:null|None|[1-9]\d*|-\d+)|SIG(?:ABRT|SEGV|BUS|ILL|KILL))', line, re.I):
            crash = max(crash or at, at)
    return crash, progress


def diagnostic_crash_at(text, started, now):
    """macOS .ips has a metadata JSON line followed by the report JSON. Local only."""
    try:
        decoder = json.JSONDecoder()
        meta, end = decoder.raw_decode(text.lstrip())
        rest = text.lstrip()[end:].lstrip()
        report = decoder.raw_decode(rest)[0] if rest else meta
        if not isinstance(report, dict) or report.get('procPath') != WORKER:
            return None
        if report.get('exception', {}).get('signal') not in ('SIGABRT', 'SIGSEGV', 'SIGBUS', 'SIGILL', 'SIGKILL'):
            return None
        stamp = report.get('captureTime') or meta.get('timestamp')
        at = datetime.datetime.fromisoformat(stamp.replace('Z', '+00:00')).timestamp()
        return at if started <= at <= now else None
    except (ValueError, TypeError, AttributeError):
        return None


def crashed_training(rows, now=None, workers=None):
    """A surviving executable is not proof of a live training engine.
    Scope crash evidence to this worker generation and cancel it on subsequent real activity.
    Missing/unreadable evidence alone never triggers recovery.
    """
    now = time.time() if now is None else now
    apps = [r for r in rows if r[3] == EXEC]
    if not apps:
        return False
    try:
        started = min(process_started(r[0], now) for r in apps)
        # A long-lived GUI can launch several worker generations. An exit from
        # an earlier generation must not mark its replacement as crashed. Use
        # the oldest trusted root, never a younger child left after a crash.
        roots = workers if workers is not None else [r for r in rows if r[3] == WORKER]
        roots = [r for r in roots if r[3] in (WORKER, TRAINING_TITLE)]
        if roots:
            try:
                launches = [process_started(r[0], now) for r in roots]
                if all(0 <= at <= now for at in launches):
                    started = max(started, min(launches))
            except (OSError, ValueError, TypeError, subprocess.SubprocessError):
                # Uncertain worker ages cannot erase otherwise valid crash
                # evidence; retain the existing GUI launch boundary.
                pass
        crash, progress = None, None
        folder = Path.home() / 'Library/Logs/IOTA Train at Home'
        for pattern in ('*main.log', '*cli.log'):
            files = sorted([p for p in folder.glob(pattern) if p.is_file() and not p.is_symlink()], key=lambda p: p.stat().st_mtime)[-2:]
            for path in files:
                with path.open('rb') as f:
                    f.seek(max(0, path.stat().st_size - 256000))
                    c, alive = log_crash_evidence(f.read(256000).decode('utf-8', errors='replace'), started, now)
                if c is not None:
                    crash = max(crash or c, c)
                if alive is not None:
                    progress = max(progress or alive, alive)
        reports = Path.home() / 'Library/Logs/DiagnosticReports'
        files = sorted([p for p in reports.glob('main_pool*.ips') if p.is_file() and not p.is_symlink()], key=lambda p: p.stat().st_mtime)[-4:]
        for path in files:
            if path.stat().st_size > 2000000:
                continue
            c = diagnostic_crash_at(path.read_text(errors='replace'), started, now)
            if c is not None:
                crash = max(crash or c, c)
        return crash is not None and (progress is None or progress <= crash)
    except (OSError, ValueError, subprocess.SubprocessError):
        return False


def parse_app_selected_run(header, text, now, started):
    """Read only the run selected for the desktop's Global Overview.
    Never return raw network events, URLs, headers or wallet identifiers.
    """
    try:
        constants = json.loads(header.rstrip().rstrip(',') + '}')['constants']
        offset = float(constants['timeTickOffset'])
    except (ValueError, KeyError, TypeError):
        return None
    latest = None
    for line in text.splitlines():
        if 'phase_snapshots' not in line:
            continue
        try:
            event = json.loads(line.rstrip().rstrip(','))
            params = event.get('params', {})
            url = urllib.parse.urlsplit(params.get('url', ''))
            if url.scheme != 'https' or url.netloc != 'iota-web.api.macrocosmos.ai' or url.path != '/mainnet/phase_snapshots':
                continue
            ids = urllib.parse.parse_qs(url.query).get('run_id', [])
            observed = (offset + float(event['time'])) / 1000
            if len(ids) != 1 or not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]{0,63}', ids[0]) or not started <= observed <= now:
                continue
            if latest is None or observed > latest[0]:
                latest = (observed, ids[0])
        except (ValueError, KeyError, TypeError, AttributeError):
            continue
    return {'id': latest[1], 'observedAt': datetime.datetime.fromtimestamp(latest[0], datetime.timezone.utc).isoformat()} if latest else None


_APP_RUN_CACHE = {'generation': None, 'value': None, 'files': {}}


def app_selected_run(rows=None, now=None):
    """Keep observed selection within the same GUI launch, not chart poll age.
    Initial search is limited to 64 MiB/file; subsequent reads only scan additions.
    No raw network event, URL or log text is stored in the cache or uploaded.
    """
    global _APP_RUN_CACHE
    now = time.time() if now is None else now
    try:
        rows = processes() if rows is None else rows
        gui = [r for r in rows if r[3] == EXEC]
        generation = tuple(sorted(r[0] for r in gui))
        if not gui:
            _APP_RUN_CACHE = {'generation': None, 'value': None, 'files': {}}
            return None
        started = min(process_started(r[0], now) for r in gui)
        if not 0 < started <= now:
            return None
        if _APP_RUN_CACHE['generation'] != generation:
            _APP_RUN_CACHE = {'generation': generation, 'value': None, 'files': {}}
        folder = Path.home() / 'Library/Logs/IOTA Train at Home'
        files = sorted((p for p in folder.glob('*netlog.log') if p.is_file() and not p.is_symlink()), key=lambda p: p.stat().st_mtime)[-2:]
        if not files:
            return None
        latest = _APP_RUN_CACHE['value']
        positions = {}
        for path in files:
            stat = path.stat()
            key = (str(path), stat.st_ino)
            previous = _APP_RUN_CACHE['files'].get(key)
            # A truncated file invalidates the previous selection as well.
            if previous is not None and stat.st_size < previous:
                latest = None
                previous = None
            with path.open('rb') as f:
                header = f.readline(262144).decode('utf-8', errors='replace')
                head_end = f.tell()
                end = stat.st_size
                lower = max(head_end, end - 64 * 1024 * 1024, previous or 0)
                # A larger gap could hide a newer selection: do not retain old cache.
                if previous is not None and previous < lower:
                    latest = None
                suffix = b''
                while end > lower:
                    begin = max(lower, end - 512000)
                    f.seek(begin)
                    chunk = f.read(end - begin) + suffix
                    split = chunk.find(b'\n')
                    complete = chunk[split + 1:] if begin > head_end and begin != previous and split >= 0 else chunk
                    value = parse_app_selected_run(header, complete.decode('utf-8', errors='replace'), now, started)
                    if value:
                        if latest is None or value['observedAt'] > latest['observedAt']:
                            latest = value
                        break
                    suffix = chunk[:split + 1] if split >= 0 else chunk
                    end = begin
                # Re-read the final partial line next time, including events appended mid-write.
                f.seek(max(head_end, stat.st_size - 512000))
                final = f.read(stat.st_size - f.tell())
                last_newline = final.rfind(b'\n')
                positions[key] = stat.st_size - len(final) + last_newline + 1 if last_newline >= 0 else max(head_end, stat.st_size - len(final))
        if latest:
            at = datetime.datetime.fromisoformat(latest['observedAt']).timestamp()
            if not started <= at <= now:
                latest = None
        _APP_RUN_CACHE = {'generation': generation, 'value': latest, 'files': positions}
        return latest
    except (OSError, ValueError, subprocess.SubprocessError):
        # No readable observation is safer than claiming an old selection after an error.
        _APP_RUN_CACHE = {'generation': None, 'value': None, 'files': {}}
        return None


def snapshot(include_logs=False):
    rows = processes()
    cpu, memory = training_resources()
    # Include renamed roots even when exact-path descendants also exist: the
    # oldest root establishes the current generation's launch boundary.
    workers = observed_training_workers()
    payload = {'appRunning': any(r[3] == EXEC for r in rows), 'workerRunning': bool(workers),
               'appCpu': cpu,
               'processMemoryMb': memory,
               'load': os.getloadavg()[0], 'version': VERSION, 'recovery': 'idle'}
    payload['queue'], payload['trainingState'] = local_training_status(workers)
    payload['appSelectedRun'] = app_selected_run(rows) if payload['appRunning'] else None
    if payload['workerRunning'] and crashed_training(rows, workers=workers):
        payload['workerRunning'] = False
        payload['queue'], payload['trainingState'] = None, None
    if include_logs:
        try:
            payload['logs'] = logs()
        except OSError:
            payload['logs'] = ''
    return payload


def xmrig_observation(config, now=None):
    """Opt-in, read-only loopback API. Binding is explicitly selected, not guessed.

    Only summary metrics leave the computer; pool URLs, wallet addresses, worker
    hostnames, credentials and configuration responses are never uploaded.
    """
    options = config.get('xmrig')
    if not isinstance(options, dict):
        return None
    try:
        binding = str(uuid.UUID(options.get('bindingId', '')))
        port = options.get('port')
        if type(port) is not int or not 1024 <= port <= 65535:
            return None
    except (ValueError, TypeError, AttributeError):
        return None
    observed = datetime.datetime.fromtimestamp(time.time() if now is None else now, datetime.timezone.utc).isoformat()
    result = {'project': 'xmr', 'software': 'xmrig', 'bindingId': binding,
              'observedAt': observed, 'status': 'unavailable', 'hashrate10s': None,
              'hashrate60s': None, 'accepted': None, 'rejected': None, 'uptime': None}

    def number(value, integer=False):
        if type(value) not in (int, float) or not math.isfinite(value) or value < 0 or value > 1e15:
            return None
        return int(value) if integer and value == int(value) else None if integer else value

    try:
        headers = {'Accept': 'application/json'}
        token = options.get('accessToken')
        if token:
            if not isinstance(token, str) or len(token) > 256 or any(ord(c) < 33 or ord(c) > 126 for c in token):
                return result
            headers['Authorization'] = 'Bearer ' + token
        request = urllib.request.Request('http://127.0.0.1:%d/1/summary' % port,
                                         headers=headers, method='GET')
        # Ignore system proxies and reject redirects before forwarding credentials.
        opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect())
        with opener.open(request, timeout=1) as response:
            raw = response.read(32769)
        if len(raw) > 32768:
            return result
        data = json.loads(raw)
        if not isinstance(data, dict) or not str(data.get('ua', '')).startswith('XMRig/'):
            return result
        rates = data.get('hashrate', {}).get('total', [])
        shares = data.get('results', {})
        if not isinstance(rates, list) or not isinstance(shares, dict):
            return result
        good, total = number(shares.get('shares_good'), True), number(shares.get('shares_total'), True)
        result.update(status='ok', hashrate10s=number(rates[0]) if rates else None,
                      hashrate60s=number(rates[1]) if len(rates) > 1 else None,
                      accepted=good, rejected=total-good if good is not None and total is not None and total >= good else None,
                      uptime=number(data.get('uptime'), True))
    except urllib.error.HTTPError as error:
        result['status'] = 'unauthorized' if error.code in (401, 403) else 'unavailable'
    except (OSError, ValueError, TypeError, AttributeError, IndexError):
        pass
    return result


def _local_json(port, path, token=None):
    """Fixed loopback routes, bounded reads, no redirects or system proxies."""
    if type(port) is not int or not 1024 <= port <= 65535:
        raise ValueError('invalid local port')
    headers = {'Accept': 'application/json'}
    if token:
        if not isinstance(token, str) or len(token) > 256 or any(not 33 <= ord(c) <= 126 for c in token):
            raise ValueError('invalid local authorization')
        headers['Authorization'] = 'Bearer ' + token
    request = urllib.request.Request('http://127.0.0.1:%d%s' % (port, path), headers=headers, method='GET')
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect())
    with opener.open(request, timeout=1) as response:
        raw = response.read(32769)
    if len(raw) > 32768:
        raise ValueError('summary too large')
    value = json.loads(raw)
    if not isinstance(value, dict):
        raise ValueError('invalid summary')
    return value


def _metric_number(value, integer=False):
    if type(value) not in (int, float) or not math.isfinite(value) or not 0 <= value <= 1e15:
        return None
    return int(value) if integer and value == int(value) else None if integer else value


def _miner_log(path):
    if not isinstance(path, str) or len(path) > 4096 or not Path(path).is_absolute() or Path(path).suffix != '.log':
        raise ValueError('invalid log path')
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    with os.fdopen(fd, 'rb') as stream:
        info = os.fstat(stream.fileno())
        if not stat.S_ISREG(info.st_mode) or info.st_uid != os.getuid() or info.st_size > 1000000000:
            raise ValueError('invalid log file')
        stream.seek(max(0, info.st_size-32768))
        text = stream.read(32768).decode('utf-8', errors='replace')
    return info, re.sub(r'\x1b\[[0-?]*[ -/]*[@-~]', '', text)


def local_miner_observation(options, now=None):
    """Explicit project bindings; observations never grant control permission."""
    if not isinstance(options, dict):
        return None
    software = options.get('software')
    if not isinstance(software, str):
        return None
    project = {'xmrig': 'xmr', 'seine': 'bnt', 'pearl-metal': 'prl', 'noid-mac': 'noid'}.get(software)
    if project is None or options.get('project') != project:
        return None
    try:
        binding = str(uuid.UUID(options.get('bindingId', '')))
    except (ValueError, TypeError, AttributeError):
        return None
    now = time.time() if now is None else now
    if software == 'xmrig':
        return xmrig_observation({'xmrig': options}, now)
    result = {'bindingId': binding, 'project': project, 'software': software,
              'observedAt': datetime.datetime.fromtimestamp(now, datetime.timezone.utc).isoformat(),
              'status': 'unavailable', 'hashrate10s': None, 'hashrate60s': None,
              'accepted': None, 'rejected': None, 'uptime': None,
              'rateUnit': 'tiles/s' if software == 'pearl-metal' else 'H/s',
              'rateWindow': '60s' if software == 'pearl-metal' else 'session', 'counterUnit': 'shares' if software == 'pearl-metal' else 'blocks'}
    try:
        if software == 'noid-mac':
            roots = [Path('/Applications/NOID Miner.app'), Path.home()/'Applications/NOID Miner.app']
            trusted = {str(root/'Contents/Resources/miner/bin'/name) for root in roots for name in ('noid-cpu','noid-metal')}
            rows = subprocess.check_output(['/bin/ps','-axo','pid=,%cpu=,rss=,comm='],text=True,timeout=2)
            cpu, rss, count = 0.0, 0, 0
            for line in rows.splitlines():
                parts = line.strip().split(None,3)
                if len(parts) == 4 and parts[3] in trusted:
                    c, r = _metric_number(float(parts[1])), _metric_number(int(parts[2]),True)
                    if c is not None and r is not None:
                        cpu += c
                        rss += r
                        count += 1
            result.update(status='process' if count else 'stopped',appCpu=min(cpu,10000),processMemoryMb=min(round(rss/1024,1),1e6))
            return result
        if software == 'seine' and options.get('logPath'):
            info, text = _miner_log(options['logPath'])
            # This launcher profile uses YYYYMMDD-HHMMSS.log per session.
            # An unanchored elapsed-only log cannot provide a live timestamp.
            origin = datetime.datetime.strptime(Path(options['logPath']).stem, '%Y%m%d-%H%M%S').astimezone().timestamp()
            matches = list(re.finditer(r'^\s*(\d+(?:\.\d+)?)s\s+INFO\s+STATS\s+elapsed=\d+(?:\.\d+)?s hashes=\d+ rate=(\d+(?:\.\d+)?) (K|M|G)?H/s[^\n]*?\baccepted=(\d+)', text, re.M))
            if not matches:
                return result
            match = matches[-1]
            stamp = origin+float(match.group(1))
            result['observedAt'] = datetime.datetime.fromtimestamp(stamp, datetime.timezone.utc).isoformat()
            if -5 <= now-stamp < 60 and -5 <= now-info.st_mtime < 60:
                result.update(status='ok', counterUnit='shares',
                              hashrateSession=_metric_number(float(match.group(2))*{None:1,'K':1e3,'M':1e6,'G':1e9}[match.group(3)]),
                              accepted=_metric_number(int(match.group(4)), True))
            return result
        if software == 'seine':
            port, token = options.get('port'), options.get('accessToken')
            health = _local_json(port, '/v1/health', token)
            data = _local_json(port, '/v1/runtime/state', token)
            if health.get('status') != 'ok' or type(data.get('running')) is not bool or data.get('lifecycle') not in ('idle', 'starting', 'running', 'stopping', 'error'):
                return result
            result['status'] = 'ok' if data['running'] else 'stopped'
            metrics = data.get('metrics', {})
            result['accepted'] = _metric_number(metrics.get('accepted_blocks'), True)
            # Pending/deferred submissions are not rejected blocks.
            started = _metric_number(health.get('started_unix_ms'))
            clock = _metric_number(health.get('now_unix_ms'))
            recent = data.get('recent_logs', [])
            if started is not None and clock is not None and isinstance(recent, list):
                for entry in reversed(recent[-128:]):
                    if not isinstance(entry, dict):
                        continue
                    elapsed, message = _metric_number(entry.get('elapsed_secs')), entry.get('message')
                    if elapsed is None or not isinstance(message, str) or len(message) > 4096:
                        continue
                    age = (clock-started)/1000-elapsed
                    match = re.search(r'\brate=(\d+(?:\.\d+)?) (K|M|G)?H/s\b', message)
                    if match and -5 <= age < 60 and data['running']:
                        result['hashrateSession'] = _metric_number(float(match.group(1))*{'K': 1e3, 'M': 1e6, 'G': 1e9, None: 1}[match.group(2)])
                        break
        else:
            info, text = _miner_log(options.get('logPath'))
            pattern = re.compile(r'^\[(\d\d:\d\d:\d\d)\] (\d+(?:\.\d+)?)M tiles/s \(60s\) \| [^\n]{0,80}?shares (\d+) acc / (\d+) rej[^\n]*$', re.M)
            matches = list(pattern.finditer(text))
            if not matches:
                return result
            match = matches[-1]
            local = datetime.datetime.fromtimestamp(info.st_mtime).astimezone()
            parts = [int(n) for n in match.group(1).split(':')]
            stamp = local.replace(hour=parts[0], minute=parts[1], second=parts[2], microsecond=0)
            if stamp.timestamp() > info.st_mtime+5:
                stamp -= datetime.timedelta(days=1)
            result['observedAt'] = stamp.astimezone(datetime.timezone.utc).isoformat()
            if -5 <= now-stamp.timestamp() < 60 and -5 <= now-info.st_mtime < 60:
                result.update(status='ok', hashrate60s=_metric_number(float(match.group(2))*1e6),
                              accepted=_metric_number(int(match.group(3)), True), rejected=_metric_number(int(match.group(4)), True))
            if re.search(r'stopped by user|session: shares|connection lost|WATCHDOG:', text[match.end():]):
                result.update(status='unavailable', hashrate60s=None)
    except urllib.error.HTTPError as error:
        result['status'] = 'unauthorized' if error.code in (401, 403) else 'unavailable'
    except (OSError, ValueError, TypeError, AttributeError, OverflowError, subprocess.SubprocessError):
        pass
    return result


def local_miner_observations(config, now=None):
    options = config.get('miners', [])
    if not isinstance(options, list):
        options = []
    options = options[:8]
    if not options and isinstance(config.get('xmrig'), dict):
        options = [dict(config['xmrig'], software='xmrig', project='xmr')]
    valid, bindings, sources = [], set(), set()
    for item in options:
        if not isinstance(item, dict):
            continue
        source = ('process','noid-mac') if item.get('software') == 'noid-mac' else ('log', item.get('logPath')) if item.get('logPath') else ('port', item.get('port'))
        binding = item.get('bindingId')
        if not isinstance(binding, str) or not isinstance(source[1], (str, int)) or binding in bindings or source in sources:
            continue
        bindings.add(binding)
        sources.add(source)
        valid.append(item)
    with ThreadPoolExecutor(max_workers=4) as executor:
        return [value for value in executor.map(lambda v: local_miner_observation(v, now), valid) if value is not None]


def enable_training_on_launch():
    """Use the official app preference; never patch app code or wallet data.

    Kept enabled so every recovery launch actually starts training. This does
    not enable launch-at-login, and is explained beside the recovery option.
    """
    path = Path.home() / 'Library/Application Support/IOTA Train at Home/preferences.json'
    if path.is_symlink() or not path.is_file() or path.stat().st_size > 1000000:
        raise ValueError('official preferences unavailable')
    prefs = json.loads(path.read_text())
    if not isinstance(prefs, dict):
        raise ValueError('invalid official preferences')
    if prefs.get('autoStartTrainingOnStartup') is True:
        return
    prefs['autoStartTrainingOnStartup'] = True
    # Only called after TAH has stopped, avoiding concurrent app writes.
    fd, temp = tempfile.mkstemp(prefix='.iota-recovery-', dir=str(path.parent))
    try:
        with os.fdopen(fd, 'w') as stream:
            json.dump(prefs, stream)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temp, path)
    finally:
        if os.path.exists(temp):
            os.unlink(temp)


def control(action, resume_training=False):
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
            # A crashed Rust worker may ignore TERM. Revalidate each fixed executable;
            # never signal by process name or touch the agent / unrelated applications.
            for pid, _, _, _ in processes():
                if any(r[0] == pid for r in processes()):
                    try:
                        os.kill(pid, signal.SIGKILL)
                    except ProcessLookupError:
                        pass
            deadline = time.monotonic() + 2
            while processes() and time.monotonic() < deadline:
                time.sleep(0.25)
            if processes():
                raise ValueError('app did not stop')
    if action in ('start', 'restart'):
        if any(r[3] == EXEC for r in processes()):
            if resume_training:
                raise ValueError('app already running; recovery requires restart')
            return
        legacy = Path.home() / 'Library/Application Support/IOTA Local Guardian/iota_local_start.py'
        launcher = legacy if legacy.is_file() else ROOT / 'iota_local_start.py'
        if not launcher.is_file():
            raise ValueError('optimized launcher missing; reinstall the complete agent package')
        if resume_training:
            enable_training_on_launch()
        subprocess.run([sys.executable, str(launcher)], check=True, timeout=10,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        deadline = time.monotonic() + (60 if resume_training else 12)
        while time.monotonic() < deadline:
            target = WORKER if resume_training else EXEC
            if any(r[3] == target for r in processes()):
                return
            time.sleep(0.5)
        raise ValueError('training did not start' if resume_training else 'app did not start')


def _binding_manifest(value):
    """Only collection identities. The server cannot supply paths or commands."""
    if not isinstance(value, list) or len(value) > 8:
        return []
    result = []
    for item in value:
        if not isinstance(item, dict) or set(item) != {'id','project','identifier','worker'}:
            return []
        try:
            identity = str(uuid.UUID(item['id']))
        except (ValueError, TypeError, AttributeError):
            return []
        if item['project'] not in ('bnt','prl','noid','xmr') or not isinstance(item['identifier'],str) or not 1 <= len(item['identifier']) <= 200 or not isinstance(item['worker'],str) or len(item['worker']) > 80:
            return []
        if item['project'] == 'bnt' and not item['worker'].strip():
            continue  # Wallet aggregates cannot authorize one computer's data.
        result.append(dict(item,id=identity))
    return result


def _local_process_files(pid):
    raw = subprocess.check_output(['/usr/sbin/lsof','-a','-p',str(pid),'-d','cwd,1','-Fn'],text=True,timeout=1)
    current, result = None, {}
    for line in raw[:8192].splitlines():
        if line.startswith('f'):
            current = line[1:]
        elif line.startswith('n/') and current in ('cwd','1'):
            result[current] = line[1:]
    return result


def _log_identity_text(filename):
    # Read a bounded head as well as the tail: launchers print the public payout
    # identity at startup. No wallet/private-key files or raw content are sent.
    _info, tail = _miner_log(str(filename))
    fd = os.open(str(filename),os.O_RDONLY|os.O_NOFOLLOW|os.O_NONBLOCK)
    with os.fdopen(fd,'rb') as stream:
        info = os.fstat(stream.fileno())
        if not stat.S_ISREG(info.st_mode) or info.st_uid != os.getuid():
            return ''
        head = stream.read(8192).decode('utf-8',errors='replace')
    return head+'\n'+tail


def _noid_payout_identity():
    # This installed app stores its public payout in the single `wallet` key.
    # Read neither keychain nor wallet/key files; return no other preferences.
    if not any(p.is_dir() for p in (Path('/Applications/NOID Miner.app'),Path.home()/'Applications/NOID Miner.app')):
        return None
    path=Path.home()/'Library/Preferences/local.noid.metalminer.plist'
    fd=os.open(str(path),os.O_RDONLY|os.O_NOFOLLOW|os.O_NONBLOCK)
    with os.fdopen(fd,'rb') as stream:
        info=os.fstat(stream.fileno())
        if not stat.S_ISREG(info.st_mode) or info.st_uid != os.getuid() or info.st_size > 65536:
            return None
        data=plistlib.loads(stream.read(65537))
    wallet=data.get('wallet') if isinstance(data,dict) else None
    return wallet if isinstance(wallet,str) and re.fullmatch(r'o1[a-z0-9]{40,100}',wallet) else None


def discover_local_miners(manifest):
    """Match only this device's bindings against identified running miners.

    A software name or a similar Worker name is never enough to attach a wallet.
    Ambiguous sources remain unconfigured. Discovery never controls a process.
    """
    bindings = [b for b in _binding_manifest(manifest) if b['project'] != 'bnt' or b['worker'].strip()]
    if not bindings:
        return []
    deadline = time.monotonic()+2
    sources, checked = [], 0
    if any(b['project']=='noid' for b in bindings):
        try:
            payout=_noid_payout_identity()
            matches=[b for b in bindings if b['project']=='noid' and b['identifier']==payout and not b['worker']]
            if len(matches)==1:
                sources.append({'project':'noid','software':'noid-mac','bindingId':matches[0]['id']})
        except (OSError,ValueError,TypeError,plistlib.InvalidFileException):
            pass
    if not any(b['project'] in ('bnt','prl','xmr') for b in bindings):
        return sources
    rows = subprocess.check_output(['/bin/ps','-axo','pid=,comm='],text=True,timeout=1)
    ordered = sorted(rows[:262144].splitlines(), key=lambda line: not line.rstrip().endswith('seine'))
    for line in ordered:
        if time.monotonic() >= deadline:
            break
        parts = line.strip().split(None,1)
        if len(parts) != 2 or not parts[0].isdigit():
            continue
        name = Path(parts[1]).name.lower()
        if name not in ('seine','xmrig') and not name.startswith('python'):
            continue
        if name == 'seine' and not any(b['project']=='bnt' for b in bindings):
            continue
        if name.startswith('python') and not any(b['project']=='prl' for b in bindings):
            continue
        if name == 'xmrig' and not any(b['project']=='xmr' for b in bindings):
            continue
        if checked >= 8:
            break
        checked += 1
        try:
            if name == 'xmrig':
                command = subprocess.check_output(['/bin/ps','-p',parts[0],'-o','args='],text=True,timeout=1)
                if len(command)>8192:
                    continue
                argv=shlex.split(command)
                def option(names):
                    values=[]
                    for i, value in enumerate(argv):
                        if value in names and i+1<len(argv): values.append(argv[i+1])
                        elif '=' in value and value.split('=',1)[0] in names: values.append(value.split('=',1)[1])
                    return values[0] if len(values)==1 else None
                # Do not infer API ports or copy access credentials. Authenticated
                # APIs can retain their explicit private Agent configuration.
                if any(v.split('=',1)[0]=='--http-access-token' for v in argv):
                    continue
                payout=option(('-u','--user'))
                port=option(('--http-port',))
                if not payout or not port or not port.isdigit() or not 1024<=int(port)<=65535:
                    continue
                matches=[b for b in bindings if b['project']=='xmr' and (payout==b['identifier']+'.'+b['worker'] if b['worker'] else payout==b['identifier'] or payout.startswith(b['identifier']+'.'))]
                if len(matches)==1:
                    sources.append({'project':'xmr','software':'xmrig','bindingId':matches[0]['id'],'port':int(port)})
                continue
            project, software = 'bnt', 'seine'
            if name.startswith('python'):
                command = subprocess.check_output(['/bin/ps','-p',parts[0],'-o','args='],text=True,timeout=1)
                if len(command) > 8192:
                    continue
                argv = shlex.split(command)
                if not any(argv[i:i+2] == ['-m','pearl_metal_miner.miner'] for i in range(len(argv)-1)):
                    continue
                project, software = 'prl', 'pearl-metal'
            if not any(b['project'] == project for b in bindings):
                continue
            files = _local_process_files(int(parts[0]))
            candidates = []
            output = files.get('1','')
            if output.endswith('.log'):
                candidates.append(Path(output))
            cwd = files.get('cwd')
            if cwd:
                folder = Path(cwd)
                if project == 'bnt' and (folder/'logs').is_dir():
                    names = []
                    with os.scandir(folder/'logs') as entries:
                        for i, entry in enumerate(entries):
                            if i >= 256:
                                break
                            if re.fullmatch(r'\d{8}-\d{6}\.log',entry.name):
                                names.append(entry.name)
                    candidates.extend(folder/'logs'/n for n in sorted(names,reverse=True)[:1])
                elif project == 'prl':
                    candidates.extend(folder/n for n in ('mining.log','pearl.log'))
            for path in candidates[:4]:
                if time.monotonic() >= deadline:
                    break
                if project == 'bnt':
                    # A different run in the same working directory must not
                    # inherit an older wallet's log. Require this generation.
                    elapsed = subprocess.check_output(['/bin/ps','-p',parts[0],'-o','etime='],text=True,timeout=1).strip()
                    days, clock = elapsed.split('-',1) if '-' in elapsed else ('0',elapsed)
                    seconds = 0
                    for value in clock.split(':'):
                        seconds = seconds*60+int(value)
                    started = time.time()-(int(days)*86400+seconds)
                    origin = datetime.datetime.strptime(path.stem,'%Y%m%d-%H%M%S').astimezone().timestamp()
                    if abs(origin-started) > 15:
                        continue
                text = _log_identity_text(path)
                if project == 'prl':
                    connections = re.findall(r'connecting to[^\n]{0,300}?\bas (\S+)',text)
                    current = connections[-1] if connections else None
                    matches = [b for b in bindings if b['project']=='prl' and current and
                               (current==b['identifier']+'.'+b['worker'] if b['worker'] else current==b['identifier'] or current.startswith(b['identifier']+'.'))]
                else:
                    matches = [b for b in bindings if b['project'] == project and
                           re.search(r'(?<![A-Za-z0-9])'+re.escape(b['identifier'])+r'(?![A-Za-z0-9])',text) and
                           (not b['worker'] or re.search(r'(?<![A-Za-z0-9])'+re.escape(b['worker'])+r'(?![A-Za-z0-9])',text))]
                if len(matches) == 1:
                    sources.append({'project':project,'software':software,'bindingId':matches[0]['id'],'logPath':str(path)})
                    break
        except (OSError, ValueError, TypeError, subprocess.SubprocessError):
            continue
    return sources[:8]


def effective_miner_config(config, state, now):
    """Revoked/expired server associations must not stay attached via cache."""
    result = dict(config)
    if 'bindingManifest' not in state:
        return result  # Backward-compatible explicit local configuration.
    manifest = _binding_manifest(state['bindingManifest']) if state.get('permissionsUntil',0) > now else []
    allowed = {(b['id'],b['project']) for b in manifest}
    manual = result.get('miners',[])
    if not manual and isinstance(result.get('xmrig'),dict):
        manual = [dict(result['xmrig'],project='xmr',software='xmrig')]
    manual = manual if isinstance(manual,list) else []
    auto = state.get('discoveredMiners',[])
    auto = auto if isinstance(auto,list) else []
    result['miners'] = [m for m in manual+auto if isinstance(m,dict) and isinstance(m.get('bindingId'),str) and isinstance(m.get('project'),str) and (m['bindingId'],m['project']) in allowed][:8]
    result.pop('xmrig',None)
    return result


def step(config, state, now=None):
    now = time.time() if now is None else now
    payload = snapshot(state.get('logsEnabled', False) and state.get('permissionsUntil', 0) > now)
    payload['recovery'] = state.pop('recovery', 'idle')
    miners = local_miner_observations(effective_miner_config(config,state,now), now)
    if miners:
        payload['miners'] = miners
    try:
        result = post(config['server'], '/api/device-agent/heartbeat', {'snapshot': payload, 'ack': state.get('ack'), 'requestBindings':True}, config['credential'])
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
                state.pop('trainingMissingSince', None)
                if command['action'] == 'stop':
                    state['recoveryEnabled'] = False
            return state
    if not state.get('recoveryEnabled') or (payload.get('appRunning') and payload.get('workerRunning')):
        state.pop('trainingMissingSince', None)
    else:
        # A GUI may survive a worker/OOM exit. Queued workers still count as running.
        missing = state.setdefault('trainingMissingSince', now)
        if now - missing >= 120:
            if now - state.get('lastRestart', 0) < 900:
                state['recovery'] = 'cooldown'
            else:
                state['lastRestart'] = now
                state['trainingMissingSince'] = now
                store(STATE, state)
                try:
                    control('restart' if payload['appRunning'] or payload.get('workerRunning') else 'start', resume_training=True)
                    state['recovery'] = 'restarted'
                except (OSError, ValueError, subprocess.SubprocessError):
                    state['recovery'] = 'paused'
    if 'bindings' in result:
        manifest = _binding_manifest(result['bindings'])
        changed = manifest != state.get('bindingManifest')
        state['bindingManifest'] = manifest
        if changed or now-state.get('lastMinerDiscovery',0) >= 60:
            state['lastMinerDiscovery'] = now
            try:
                state['discoveredMiners'] = discover_local_miners(manifest)
            except (OSError, ValueError, TypeError, subprocess.SubprocessError):
                state['discoveredMiners'] = []
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
    saved = {'server': endpoint(server), 'credential': credential}
    if upgrading:
        # Reinstalling an existing Agent must not erase its miner observations.
        for key in ('miners','xmrig'):
            if key in existing:
                saved[key] = existing[key]
    store(CONFIG, saved)
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


def configure_miner(software, binding_id, port=None, log_path=None):
    project = {'xmrig':'xmr', 'seine':'bnt', 'pearl-metal':'prl', 'noid-mac':'noid'}.get(software)
    if not isinstance(binding_id, str):
        raise ValueError('binding UUID required')
    binding_id = str(uuid.UUID(binding_id))
    if project is None:
        raise ValueError('unsupported miner')
    if software == 'noid-mac':
        item = {'software':software,'project':project,'bindingId':binding_id}
    elif log_path:
        if software == 'xmrig':
            raise ValueError('XMRig requires its local API')
        _miner_log(log_path)  # Validate a bounded owner-owned regular file.
        item = {'software':software, 'project':project, 'bindingId':binding_id, 'logPath':log_path}
    else:
        if software == 'pearl-metal' or type(port) is not int or not 1024 <= port <= 65535:
            raise ValueError('local API port or log path required')
        item = {'software':software, 'project':project, 'bindingId':binding_id, 'port':port}
    config = read(CONFIG)
    if not config.get('credential') or not config.get('server'):
        raise ValueError('pair this Mac first')
    endpoint(config['server'])
    previous = config.get('miners', [])
    if not isinstance(previous, list):
        raise ValueError('invalid miner configuration')
    if not previous and isinstance(config.get('xmrig'), dict):
        previous = [dict(config['xmrig'],software='xmrig',project='xmr')]
    if any(not isinstance(v, dict) for v in previous):
        raise ValueError('invalid miner configuration')
    for current in previous:
        if current.get('bindingId') == binding_id and current.get('software') == software and port is not None and current.get('port') == port and current.get('accessToken'):
            item['accessToken'] = current['accessToken']
    remaining = [v for v in previous if v.get('bindingId') != binding_id]
    if len(remaining) >= 8:
        raise ValueError('maximum eight local miners per Mac')
    for other in remaining:
        if (software == 'noid-mac' and other.get('software') == software) or (log_path and other.get('logPath') == log_path) or (port is not None and other.get('port') == port):
            raise ValueError('this local source is already bound')
    config['miners'] = remaining+[item]
    config.pop('xmrig', None)
    store(CONFIG, config)
    print('Local observation configured; miner unchanged. / 采集已配置，未修改矿工。')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--self-test', action='store_true')
    parser.add_argument('--install', action='store_true')
    parser.add_argument('--uninstall', action='store_true')
    parser.add_argument('--run', action='store_true')
    parser.add_argument('--status', action='store_true')
    parser.add_argument('--configure-miner', choices=['xmrig', 'seine', 'pearl-metal', 'noid-mac'])
    parser.add_argument('--binding')
    parser.add_argument('--port', type=int)
    parser.add_argument('--log-path')
    parser.add_argument('--server', default='https://iotahome.site')
    args = parser.parse_args()
    if args.configure_miner:
        configure_miner(args.configure_miner, args.binding, args.port, args.log_path)
    elif args.self_test:
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
            # Local setup changes take effect on the next heartbeat, without
            # restarting the miner or the background service.
            config = read(CONFIG)
            endpoint(config['server'])
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
