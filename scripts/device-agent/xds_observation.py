"""Read the timestamped hashrate recorded by Discrete's local daemon."""
import datetime as dt
import os
from pathlib import Path
import re
import stat

EVENT = re.compile(
    r'^(\d{4}-(?:\d{2}|[A-Za-z]{3})-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d{1,6})?)'
    r'\s+(?:INFO|ERROR)\s+\[miner\]\s+'
    r'(?:Hashrate: (\d+(?:\.\d+)?) H/s|'
    r'(Mining has been stopped, \d+ finished|Failed to get_block_template_pq\(\), stopping mining)|'
    r'(Mining has started with \d+ threads, good luck!))\s*$'
)
ANSI = re.compile(r'\x1b\[[0-?]*[ -/]*[@-~]')
MONTHS = {name: f'{n:02}' for n, name in enumerate(
    'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(), 1)}


def read_log_tail(path):
    if not isinstance(path, str) or not Path(path).is_absolute() or Path(path).suffix != '.log':
        raise ValueError('An absolute Discrete .log path is required.')
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    with os.fdopen(fd, 'rb') as stream:
        info = os.fstat(stream.fileno())
        if not stat.S_ISREG(info.st_mode) or info.st_uid != os.getuid():
            raise ValueError('Select a log file owned by the Agent user.')
        stream.seek(max(0, info.st_size - 32768))
        raw = stream.read(32768)
        # The tail can start and end in the middle of a line.
        if info.st_size > 32768:
            raw = raw.partition(b'\n')[2]
        raw = raw[:raw.rfind(b'\n') + 1]
    return ANSI.sub('', raw.decode('utf-8', errors='replace'))


def observe_xds(path):
    try:
        return parse_xds(read_log_tail(path))
    except (OSError, ValueError):
        return {'status': 'unavailable', 'observedAt': None, 'hashrateHps': None}


def parse_xds(text):
    unavailable = {'status': 'unavailable', 'observedAt': None, 'hashrateHps': None}
    try:
        for line in reversed(text.splitlines()):
            match = EVENT.fullmatch(line)
            if not match:
                continue
            stamp, rate, stopped, started = match.groups()
            if started:
                return unavailable
            if stamp[5:8] in MONTHS:
                stamp = stamp[:5] + MONTHS[stamp[5:8]] + stamp[8:]
            observed = dt.datetime.fromisoformat(stamp).astimezone(dt.timezone.utc).isoformat()
            if stopped:
                return {'status': 'stopped', 'observedAt': observed, 'hashrateHps': None}
            hashrate = float(rate)
            if 0 <= hashrate <= 1e15:
                return {'status': 'ok', 'observedAt': observed, 'hashrateHps': hashrate}
            return unavailable
    except (OSError, ValueError, OverflowError):
        pass
    return unavailable
