#!/usr/bin/env python3
"""Local IOTA monitor. Only sanitized status is saved; wallet keys/tokens are never read."""
import argparse
import datetime as dt
import fcntl
import json
import os
from pathlib import Path
import re
import signal
import subprocess
import time
import urllib.request
from zoneinfo import ZoneInfo

SOURCE_ROOT = Path(__file__).resolve().parent
INSTALLED_ROOT = Path.home() / 'Library/Application Support/IOTA Local Guardian'
ROOT = INSTALLED_ROOT if (INSTALLED_ROOT / 'iota_guardian.py').exists() else SOURCE_ROOT
LOGS = Path.home() / 'Library/Logs/IOTA Train at Home'
APP_BUNDLE = next((path for path in (Path('/Applications/IOTA Train at Home.app'),
                 Path.home() / 'Applications/IOTA Train at Home.app') if path.exists()),
                 Path('/Applications/IOTA Train at Home.app'))
APP = str(APP_BUNDLE / 'Contents/MacOS/IOTA Train at Home')
WORKER = str(APP_BUNDLE / 'Contents/Frameworks/iota-cli/main_pool')
START = ROOT / 'iota_local_start.py' if (ROOT / 'iota_local_start.py').exists() else ROOT.parent / 'work/iota_local_start.py'
STATE = ROOT / 'IOTA状态.json'
EVENTS = ROOT / 'IOTA守护日志.log'
TZ = ZoneInfo('Asia/Hong_Kong')
INTERVAL = 30
GRACE = 300
COOLDOWN = 900
LABEL = 'com.local.iota.guardian'
STAMP = re.compile(r'^\[(\d{4}-\d\d-\d\d \d\d:\d\d:\d\d\.\d+)\]')


def timestamp(text):
    # Electron writes timestamps in the machine's local timezone.
    return dt.datetime.strptime(text, '%Y-%m-%d %H:%M:%S.%f').astimezone().timestamp()


def clock_string(epoch):
    return dt.datetime.fromtimestamp(epoch, TZ).isoformat(timespec='seconds')


def read_state():
    try:
        return json.loads(STATE.read_text())
    except (OSError, ValueError):
        return {}


def save_state(state):
    temporary = STATE.with_suffix('.tmp')
    temporary.write_text(json.dumps(state, ensure_ascii=False, indent=2) + '\n')
    temporary.chmod(0o600)
    temporary.replace(STATE)


def event(message):
    if EVENTS.exists() and EVENTS.stat().st_size > 2 * 1024 * 1024:
        EVENTS.replace(EVENTS.with_suffix('.previous.log'))
    with EVENTS.open('a') as f:
        f.write(f'[{clock_string(time.time())}] {message}\n')
    EVENTS.chmod(0o600)


def processes():
    out = subprocess.check_output(['ps', '-axo', 'pid=,ppid=,command='], text=True)
    rows = {}
    for line in out.splitlines():
        pieces = line.strip().split(None, 2)
        if len(pieces) == 3:
            rows[int(pieces[0])] = (int(pieces[1]), pieces[2])
    return rows


def log_records():
    records = []
    for kind in ('main', 'cli'):
        files = sorted(LOGS.glob(f'*-{kind}*.log'), key=lambda f: f.stat().st_mtime)[-3:]
        for file in files:
            with file.open('rb') as f:
                f.seek(max(0, file.stat().st_size - 512 * 1024))
                for line in f.read().decode('utf-8', errors='replace').splitlines():
                    match = STAMP.match(line)
                    if match:
                        records.append((timestamp(match[1]), line))
    return sorted(records, key=lambda row: row[0])


def parse_logs(records, previous):
    starts = [t for t, line in records if '[iota-cli runIotaCli] Connecting to CHANNEL' in line]
    started = max(starts, default=previous.get('session_started_at', 0))
    result = {'session_started_at': started, 'last_activity_at': started,
              'queue_position': None, 'queue_updated_at': None,
              'queue_status': None, 'training_state': None, 'training_at': None,
              'exit_code': None, 'exited_at': None, 'quit_at': None,
              'warning': None, 'fatal': False}
    # Carry evidence across daily log rotation only for the same miner session.
    if started == previous.get('session_started_at'):
        for key in result:
            if key != 'session_started_at' and key in previous:
                result[key] = previous[key]
    for t, line in records:
        if t < started:
            continue
        if '[AutoUpdater]' not in line:
            result['last_activity_at'] = max(result['last_activity_at'], t)
        if 'Successfully completed request to /miner/register' in line and 'response:' in line:
            payload = line.split('response:', 1)[1]
            status = re.search(r"['\"]status['\"]\s*:\s*['\"]([^'\"]+)", payload)
            position = re.search(r"['\"]position['\"]\s*:\s*(\d+)", payload)
            if status:
                result['queue_status'] = status[1]
                result['queue_position'] = int(position[1]) if position else None
                result['queue_updated_at'] = t
        state = re.search(r"training.state accepted \{ state: '([^']+)'", line)
        if state:
            result['training_state'] = state[1]
            if state[1] in ('training', 'training_tick'):
                result['training_at'] = t
            elif state[1] in ('resetting', 'waiting_training'):
                result['training_at'] = None
        if 'Starting FORWARD pass' in line or 'after training forward pass' in line:
            result['training_at'] = t
        exited = re.search(r'miner process exited code=(\d+|null) signal=(\S+)', line)
        if exited:
            result['exit_code'] = int(exited[1]) if exited[1].isdigit() else -1
            result['exited_at'] = t
        if '[iota-cli registerQuitHandler] Closing IOTA Cli' in line:
            result['quit_at'] = t
        if 'No handler for register.queue_state' in line:
            result['warning'] = '客户端不支持显示队列事件；守护脚本直接从官方响应读取位置'
        if 'Miner control host gating failed' in line or 'Failed to execute script' in line:
            result['fatal'] = True
    return result


def health():
    # Explicitly bypass proxy settings for the loopback control service.
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    try:
        with opener.open('http://127.0.0.1:8010/health', timeout=3) as response:
            data = json.loads(response.read(65536))
        return data if isinstance(data, dict) else None
    except (OSError, ValueError):
        return None


def classify(evidence, app_pid, miner_alive, control, now):
    started = evidence['session_started_at']
    if not started and not miner_alive:
        return 'paused', '尚未启动过矿工；先打开 IOTA 并点击 Start training', False
    if evidence['quit_at'] and not app_pid:
        return 'paused', '应用正常退出，保留手动停止意图', False
    if evidence['exited_at'] and evidence['exit_code'] == 0 and not miner_alive:
        return 'paused', '矿工正常停止，等待手动启动或原有定时安排', False
    if app_pid and now - started < GRACE:
        connected = bool(control and control.get('connected') and control.get('expectedHostPid') == app_pid)
        if not connected:
            return 'starting', '矿工启动中，五分钟宽限期内不重启', False
    if not app_pid:
        return 'abnormal', 'IOTA 主程序不在运行', True
    if not miner_alive:
        return 'abnormal', '矿工进程已退出', True
    if not control or not control.get('ok'):
        return 'abnormal', '本地矿工控制服务不可访问', True
    if control.get('expectedHostPid') != app_pid or not control.get('connected'):
        return 'abnormal', '矿工与桌面程序的控制连接断开', True
    if evidence['queue_status'] == 'queued':
        position = evidence['queue_position']
        stale = now - (evidence['queue_updated_at'] or 0) > 900
        text = f'官方排队第 {position} 位' if position is not None else '等待官方分配训练任务'
        return 'queued', text + ('；位置超过十五分钟未更新，暂不重启以免丢失队列' if stale else ''), False
    if evidence['training_at'] and now - evidence['training_at'] < 300:
        return 'training', '最近五分钟有实际训练活动', False
    if now - evidence['last_activity_at'] > 1800:
        return 'abnormal', '矿工三十分钟没有任何活动，且未处于排队状态', True
    return 'waiting', '控制连接正常，等待注册、模型准备或训练任务', False


def decision(state, now):
    if state['bad_checks'] < 3:
        return None
    history = [t for t in state.get('restart_history', []) if now - t < 3600]
    if len(history) >= 3:
        return '小时重启上限已达三次，等待退避恢复'
    if now - state.get('last_restart_at', 0) < COOLDOWN:
        return '重启后十五分钟退避期内'
    return 'restart'


def terminate_iota(rows):
    # Capture only IOTA process identities. Recheck commands before signalling
    # so a recycled PID cannot affect an unrelated application.
    targets = {pid: command for pid, (_, command) in rows.items()
               if command == APP or command.startswith(WORKER)
               or command.startswith('main_pool:ai.macrocosmos.iota.tah.worker')}
    for sig, timeout in ((signal.SIGTERM, 20), (signal.SIGKILL, 3)):
        fresh = processes()
        for pid, command in targets.items():
            if fresh.get(pid, (None, None))[1] == command:
                try:
                    os.kill(pid, sig)
                except ProcessLookupError:
                    pass
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            fresh = processes()
            if not any(fresh.get(pid, (None, None))[1] == command for pid, command in targets.items()):
                return
            time.sleep(.5)
    raise RuntimeError('IOTA 进程未能退出，未启动重复实例')


def restart(rows):
    terminate_iota(rows)
    subprocess.run(['/usr/bin/python3', str(START)], check=True, timeout=30,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def poll(previous):
    now = time.time()
    rows = processes()
    app_pid = next((pid for pid, (_, cmd) in rows.items() if cmd == APP), None)
    miner_alive = any(cmd.startswith('main_pool:ai.macrocosmos.iota.tah.worker')
                      or cmd.startswith(WORKER) for _, cmd in rows.values())
    evidence = parse_logs(log_records(), previous)
    control = health()
    status, description, bad = classify(evidence, app_pid, miner_alive, control, now)
    same_session = evidence['session_started_at'] == previous.get('session_started_at')
    state = dict(previous, **evidence)
    state.update(updated_at=clock_string(now), status=status, description=description,
                 app_pid=app_pid, miner_alive=miner_alive,
                 control_connected=bool(control and control.get('connected')),
                 bad_checks=(previous.get('bad_checks', 0) + 1 if same_session else 1) if bad else 0)
    return state, rows


def display(state):
    print('更新时间：', state.get('updated_at', '尚未检查'))
    print('当前状态：', state.get('description', '未知'))
    print('控制连接：', '正常' if state.get('control_connected') else '未连接')
    if state.get('queue_updated_at'):
        print('队列更新时间：', clock_string(state['queue_updated_at']))
    if state.get('last_restart_at'):
        print('最近自动重启：', clock_string(state['last_restart_at']))
    if state.get('recovery_note'):
        print('恢复说明：', state['recovery_note'])


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--once', action='store_true', help='只检查，不重启')
    parser.add_argument('--status', action='store_true', help='显示最近的守护状态')
    args = parser.parse_args()
    if args.status:
        display(read_state())
        return
    lock = (ROOT / '.iota-guardian.lock').open('w')
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        if args.once:
            display(read_state())
            return
        raise SystemExit('守护已经运行，不创建重复实例')
    previous = read_state()
    if not args.once:
        event('守护启动：每三十秒检查；连续三次异常才重启；十五分钟退避；每小时最多三次')
    while True:
        try:
            state, rows = poll(previous)
            action = decision(state, time.time())
            state['recovery_note'] = None if action in (None, 'restart') else action
            if not args.once and action == 'restart':
                now = time.time()
                state['last_restart_at'] = now
                state['restart_history'] = [t for t in state.get('restart_history', []) if now - t < 3600] + [now]
                state['bad_checks'] = 0
                save_state(state)  # persist rate limits before attempting any mutation
                event('自动重启：' + state['description'])
                try:
                    restart(rows)
                    state['recovery_note'] = '已通过优化启动器重新启动，等待矿工就绪'
                except Exception as error:
                    state['recovery_note'] = '重启未完成：' + type(error).__name__
                    event(state['recovery_note'])
            if (state['status'], state['queue_position']) != (previous.get('status'), previous.get('queue_position')):
                event(state['description'])
            save_state(state)
            previous = state
            if args.once:
                display(state)
                return
        except Exception as error:
            # Failure to inspect is not proof of miner failure: never restart on a monitor error.
            event('监控检查失败：' + type(error).__name__ + '；本轮不执行重启')
            if args.once:
                raise
        time.sleep(INTERVAL)


if __name__ == '__main__':
    main()
