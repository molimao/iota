"""Fixed-host updates and a stable supervisor. Never controls the IOTA application."""
import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
import urllib.request
import zipfile

ROOT = Path(__file__).resolve().parent
FILES = ('iota_watch_agent.py', 'iota_local_start.py', 'iota_local_relay.py')
BASE = 'https://iotahome.site/downloads/'
HEALTH_TIMEOUT = 75


def read(path):
    try:
        return json.loads(path.read_text())
    except (OSError, ValueError):
        return {}


def write(path, data):
    temp = path.with_suffix('.tmp')
    with temp.open('w') as f:
        json.dump(data, f)
    temp.chmod(0o600)
    temp.replace(path)


def version(value):
    import re
    if not isinstance(value, str) or not re.fullmatch(r'\d{1,4}\.\d{1,4}\.\d{1,4}', value):
        raise ValueError('invalid version')
    return tuple(map(int, value.split('.')))


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        raise ValueError('update redirect rejected')


def download(name, limit):
    request = urllib.request.Request(BASE + name, headers={'User-Agent': 'IOTA-Watch-Agent-Updater/1.0.3'})
    with urllib.request.build_opener(NoRedirect()).open(request, timeout=15) as response:
        data = response.read(limit + 1)
    if len(data) > limit:
        raise ValueError('update too large')
    return data


def prepare(current, command_id):
    try:
        return prepare_checked(current, command_id)
    except (KeyError, TypeError, zipfile.BadZipFile, UnicodeError, SyntaxError) as exc:
        raise ValueError('invalid update package') from exc


def prepare_checked(current, command_id):
    manifest = json.loads(download('iota-watch-agent-latest.json', 4096))
    target = manifest['version']
    if version(target) <= version(current):
        return False
    size = manifest['bytes']
    if not isinstance(size, int) or not 0 < size <= 2000000:
        raise ValueError('invalid size')
    data = download('iota-watch-agent-' + target + '.zip', size)
    if len(data) != size or hashlib.sha256(data).hexdigest() != manifest['sha256']:
        raise ValueError('update checksum mismatch')
    stage = ROOT / 'update-stage'
    stage.mkdir(mode=0o700, exist_ok=True)
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        for name in FILES:
            entries = [i for i in archive.infolist() if i.filename == 'iota-watch-agent/' + name]
            if len(entries) != 1 or entries[0].file_size > 500000 or (entries[0].external_attr >> 16) & 0o170000 == 0o120000:
                raise ValueError('invalid update entry')
            content = archive.read(entries[0])
            compile(content, name, 'exec')
            (stage / name).write_bytes(content)
            (stage / name).chmod(0o600)
    # The supervisor stays installed; candidates must support its health protocol.
    shutil.copyfile(ROOT / 'agent_updater.py', stage / 'agent_updater.py')
    probe = subprocess.run([sys.executable, str(stage / FILES[0]), '--self-test'],
                           check=True, capture_output=True, text=True, timeout=10)
    if probe.stdout.strip() != target:
        raise ValueError('candidate version mismatch')
    write(ROOT / 'update-request.json', {'id': command_id, 'version': target, 'phase': 'ready'})
    return True


def rollback(request):
    for name in FILES:
        backup = ROOT / 'update-backup' / name
        if request.get('phase') == 'installed' and backup.is_file():
            shutil.copyfile(backup, ROOT / name)
            (ROOT / name).chmod(0o600)
    state = read(ROOT / 'state.json')
    state['ack'] = {'id': request['id'], 'success': False}
    write(ROOT / 'state.json', state)
    (ROOT / 'update-request.json').unlink(missing_ok=True)
    (ROOT / 'update-health.json').unlink(missing_ok=True)


def apply(request):
    backup = ROOT / 'update-backup'
    backup.mkdir(mode=0o700, exist_ok=True)
    for name in FILES:
        shutil.copyfile(ROOT / name, backup / name)
        (backup / name).chmod(0o600)
    request['phase'] = 'installed'
    write(ROOT / 'update-request.json', request)
    (ROOT / 'update-health.json').unlink(missing_ok=True)
    for name in FILES:
        os.replace(ROOT / 'update-stage' / name, ROOT / name)


def supervise():
    import fcntl
    import signal
    def stop(signum, frame):
        raise SystemExit(0)
    signal.signal(signal.SIGTERM, stop)
    lock = (ROOT / 'supervisor.lock').open('w')
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        return
    request = read(ROOT / 'update-request.json')
    if request.get('phase') == 'installed':
        rollback(request)  # Interrupted update: restore before launching anything.
    while True:
        request = read(ROOT / 'update-request.json')
        if request.get('phase') == 'ready':
            try:
                apply(request)
            except (OSError, ValueError):
                rollback(request)
        child = subprocess.Popen([sys.executable, str(ROOT / FILES[0]), '--run'])
        started = time.monotonic()
        try:
            while child.poll() is None:
                request = read(ROOT / 'update-request.json')
                if request.get('phase') == 'installed':
                    health = read(ROOT / 'update-health.json')
                    if health.get('id') == request['id'] and health.get('version') == request['version']:
                        (ROOT / 'update-request.json').unlink(missing_ok=True)
                    elif time.monotonic() - started > HEALTH_TIMEOUT:
                        child.terminate()
                        try:
                            child.wait(timeout=5)
                        except subprocess.TimeoutExpired:
                            child.kill(); child.wait()
                        rollback(request)
                        break
                time.sleep(1)
        finally:
            if child.poll() is None:
                child.terminate()
                try:
                    child.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    child.kill(); child.wait()
        request = read(ROOT / 'update-request.json')
        if request.get('phase') == 'installed':
            rollback(request)
        time.sleep(2)


if __name__ == '__main__':
    supervise()
