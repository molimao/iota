#!/usr/bin/env python3
"""Read-only Linux IOTA monitor. Never starts/stops miners or changes GPU settings."""
import argparse
import csv
import datetime as dt
import getpass
import json
import math
import os
from pathlib import Path
import re
import subprocess
import time
import urllib.request

VERSION = '1.0.14'
ROOT = Path.home() / '.local/state/iota-watch-linux'
ANSI = re.compile(r'\x1b\[[0-9;]*m')


def iso(stamp):
    return dt.datetime.fromtimestamp(stamp, dt.timezone.utc).isoformat()


def number(value, limit):
    try:
        n = float(value)
        return n if math.isfinite(n) and 0 <= n <= limit else None
    except (ValueError, TypeError):
        return None


def gpu_rows(text, observed):
    result = []
    for row in csv.reader(text.splitlines()):
        if len(row) != 7 or len(result) >= 16:
            continue
        index = number(row[0], 1024)
        if index is None or not index.is_integer():
            continue
        result.append(dict(index=int(index), name=row[1].strip()[:120],
            utilization=number(row[2], 100), memoryUsedMb=number(row[3], 1e7),
            memoryTotalMb=number(row[4], 1e7), temperature=number(row[5], 150),
            powerWatts=number(row[6], 10000), observedAt=iso(observed)))
    return result


def gpus(now):
    try:
        p = subprocess.run(['nvidia-smi', '--query-gpu=index,name,utilization.gpu,memory.used,memory.total,temperature.gpu,power.draw',
            '--format=csv,noheader,nounits'], capture_output=True, text=True, timeout=4)
        return gpu_rows(p.stdout, now) if p.returncode == 0 else []
    except (OSError, subprocess.TimeoutExpired):
        return []


def proc(pid):
    """Generation and resource counters, never process arguments or environment."""
    p = Path('/proc') / str(pid)
    text = (p / 'stat').read_text()
    fields = text[text.rfind(')') + 2:].split()
    if fields[0] in ('Z', 'X'):
        raise ProcessLookupError('process exited')
    boot = next(int(x.split()[1]) for x in Path('/proc/stat').read_text().splitlines() if x.startswith('btime '))
    return dict(start=fields[19], started=boot + int(fields[19]) / os.sysconf('SC_CLK_TCK'), ticks=int(fields[11]) + int(fields[12]),
                memory=int(fields[21]) * os.sysconf('SC_PAGE_SIZE') / 1048576)


def parse_line(line, stamp):
    """Only explicit queue callbacks / completed training events are evidence."""
    line = ANSI.sub('', line)
    q = re.search(r'^QUEUE_PROBE status=\s*(\w+) position=\s*(\S+) run=\s*(\S+)', line)
    if q:
        status, position, run = q.groups()
        queue = None
        if status == 'queued' and position.isdigit() and 0 < int(position) <= 10000000:
            queue = dict(position=int(position), observedAt=iso(stamp))
        selected = dict(id=run, observedAt=iso(stamp)) if re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]{0,63}', run) and run != 'None' else None
        return dict(queue=queue, trainingState=None, appSelectedRun=selected)
    # Training lines have their own timestamp; never refresh old evidence from file mtime.
    date = re.match(r'\[?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)?)', line)
    if not date:
        return None
    try:
        stamp = dt.datetime.fromisoformat(date[1]).timestamp()
    except ValueError:
        return None
    status = 'forward' if 'FORWARD complete' in line else 'backward' if 'BACKWARD complete' in line else None
    if status:
        return dict(queue=None, trainingState=dict(phase='training', status=status, observedAt=iso(stamp)))
    if 'Resetting miner entire state' in line or 'Attempting to join registration waitlist' in line:
        return dict(queue=None, trainingState=None, appSelectedRun=None)
    return None


def read_evidence(path, state, now):
    """Persist cursor, so an unchanged old callback cannot become a fresh queue."""
    p = Path(path)
    stat = p.stat()
    key = f'{stat.st_dev}:{stat.st_ino}'
    old = state.get('cursor', {})
    initial = old.get('file') != key or old.get('offset', 0) > stat.st_size
    offset = max(0, stat.st_size - 65536) if initial else old.get('offset', 0)
    if initial:
        state['evidence'] = {}
    with p.open('rb') as f:
        f.seek(offset)
        raw = f.read(65536)
    # Only complete lines. Retain partial line for the next read.
    end = raw.rfind(b'\n') + 1
    lines = raw[:end].decode('utf-8', 'replace').splitlines()
    if initial and offset:
        lines = lines[1:]
    for i, line in enumerate(lines):
        # On first read only the final complete line may inherit mtime. Earlier
        # untimestamped callbacks have no trustworthy event time.
        if initial and line.startswith('QUEUE_PROBE') and (i != len(lines)-1 or offset+end != stat.st_size):
            continue
        event = parse_line(line, stat.st_mtime if initial else now)
        if event is not None:
            state.setdefault('evidence', {}).update(event)
    state['cursor'] = dict(file=key, offset=offset + end)
    out = {}
    for field, value in state.get('evidence', {}).items():
        if value and -0.001 <= now - dt.datetime.fromisoformat(value['observedAt']).timestamp() <= 300:
            out[field] = value
    return out


def snapshot(config, state, now=None):
    now = time.time() if now is None else now
    current = None
    try:
        current = proc(config['pid'])
        if current['start'] != config['generation']:
            current = None
    except (OSError, ValueError, IndexError):
        pass
    cpu = None
    if current:
        previous = state.get('sample')
        if previous and now > previous['at'] and current['ticks'] >= previous['ticks']:
            cpu = min(10000, (current['ticks']-previous['ticks']) / os.sysconf('SC_CLK_TCK') / (now-previous['at']) * 100)
        state['sample'] = dict(at=now, ticks=current['ticks'])
    evidence = {}
    if current:
        try:
            evidence = read_evidence(config['log'], state, now)
            evidence = {k: v for k, v in evidence.items() if dt.datetime.fromisoformat(v['observedAt']).timestamp() >= current['started']}
        except OSError:
            pass
    else:
        state.pop('evidence', None)
    return dict(platform='linux', monitorOnly=True, version=VERSION,
        appRunning=bool(current), workerRunning=bool(current), appCpu=cpu,
        processMemoryMb=round(current['memory'], 2) if current else None,
        load=None, recovery='paused', gpus=gpus(now), **evidence)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def post(path, data, credential=None):
    headers = {'Content-Type': 'application/json', 'Accept': 'application/json',
               'User-Agent': 'IOTA-Watch-Agent/' + VERSION}
    if credential:
        headers['Authorization'] = 'Bearer ' + credential
    req = urllib.request.Request('https://iotahome.site/api/device-agent/' + path,
        json.dumps(data).encode(), headers)
    with urllib.request.build_opener(NoRedirect).open(req, timeout=12) as r:
        raw = r.read(20001)
        if len(raw) > 20000:
            raise ValueError('response too large')
        return json.loads(raw)


def save(name, data):
    ROOT.mkdir(mode=0o700, parents=True, exist_ok=True)
    os.chmod(ROOT, 0o700)
    temp = ROOT / (name + '.tmp')
    fd = os.open(temp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, 'w') as f:
        json.dump(data, f)
    os.chmod(temp, 0o600)
    temp.replace(ROOT / name)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('action', choices=['snapshot', 'pair', 'run'])
    ap.add_argument('--pid', type=int)
    ap.add_argument('--log')
    args = ap.parse_args()
    if args.action in ('snapshot', 'pair'):
        if not args.pid or not args.log:
            ap.error('--pid and --log are required')
        config = dict(pid=args.pid, generation=proc(args.pid)['start'], log=str(Path(args.log).resolve()))
        if args.action == 'snapshot':
            print(json.dumps(snapshot(config, {})))
            return
        token = getpass.getpass('Pairing code: ').strip()
        if not re.fullmatch(r'[A-Za-z0-9_-]{43}', token):
            raise SystemExit('Invalid pairing code')
        credential = post('pair', dict(token=token))['credential']
        if not re.fullmatch(r'[A-Za-z0-9_-]{43}', credential):
            raise SystemExit('Invalid pairing response')
        config['credential'] = credential
        save('config.json', config)
        print('Paired. Run this monitor with the run command; miners are unchanged.')
        return
    config = json.loads((ROOT / 'config.json').read_text())
    try:
        state = json.loads((ROOT / 'state.json').read_text())
    except FileNotFoundError:
        state = {}
    while True:
        payload = dict(snapshot=snapshot(config, state), ack=state.get('ack'))
        save('state.json', state)
        try:
            response = post('heartbeat', payload, config['credential'])
            state.pop('ack', None)
            # Read-only means even unexpected server commands cannot touch miners.
            command = response.get('command')
            if command:
                state['ack'] = dict(id=command['id'], success=False)
            save('state.json', state)
        except (OSError, ValueError, KeyError):
            print('Report failed; retrying in 15 seconds.', flush=True)
        time.sleep(15)


if __name__ == '__main__':
    main()
