"""Isolated end-to-end update exercise; never installs or controls the real IOTA app."""
import hashlib
import http.server
import io
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import threading
import time
import uuid
import zipfile

SOURCE = Path(__file__).resolve().parent

def iota_pids():
    rows = subprocess.check_output(['/bin/ps', '-axo', 'pid=,comm='], text=True).splitlines()
    return sorted(line.strip().split(None, 1)[0] for line in rows if '/IOTA Train at Home.app/Contents/' in line)


def main():
    before = iota_pids()
    results = []
    with tempfile.TemporaryDirectory(prefix='iota-update-check-') as folder:
        root = Path(folder)
        state = {'command': None, 'sent': False, 'ack': None, 'versions': [], 'manifest': {}, 'archive': b'', 'logsReceived': False}
        class Handler(http.server.BaseHTTPRequestHandler):
            def log_message(self, *args): pass
            def do_GET(self):
                data = json.dumps(state['manifest']).encode() if self.path.endswith('.json') else state['archive']
                self.send_response(200); self.send_header('Content-Length', str(len(data))); self.end_headers(); self.wfile.write(data)
            def do_POST(self):
                body = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
                if self.headers.get('Authorization') != 'Bearer ' + 'T'*43:
                    self.send_error(401); return
                state['versions'].append(body['snapshot']['version'])
                state['logsReceived'] |= 'logs' in body['snapshot']
                if body.get('ack'): state['ack'] = body['ack']
                command = None
                if state['command'] and not state['sent']:
                    command = state['command']; state['sent'] = True
                data = json.dumps({'command': command, 'logsEnabled': False, 'recoveryEnabled': False}).encode()
                self.send_response(200); self.send_header('Content-Length', str(len(data))); self.end_headers(); self.wfile.write(data)
        server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        base = 'http://127.0.0.1:' + str(server.server_port)
        source = (SOURCE/'iota_watch_agent.py').read_text()
        # Test copies use temporary paths and loopback endpoints. Release files stay unchanged.
        source = source.replace("ROOT = Path.home() / 'Library/Application Support/IOTA Watch Agent'", "ROOT = Path(__file__).resolve().parent")
        updater = (SOURCE/'agent_updater.py').read_text().replace("BASE = 'https://iotahome.site/downloads/'", 'BASE = '+repr(base+'/downloads/'))
        (root/'agent_updater.py').write_text(updater)
        for name in ('iota_local_start.py', 'iota_local_relay.py'): shutil.copyfile(SOURCE/name, root/name)
        (root/'iota_watch_agent.py').write_text(source)
        config = {'server': base, 'credential': 'T'*43}
        (root/'config.json').write_text(json.dumps(config))
        process = subprocess.Popen([sys.executable, str(root/'agent_updater.py')], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        def wait_for(predicate, seconds=90):
            deadline = time.monotonic()+seconds
            while time.monotonic()<deadline:
                if predicate(): return
                time.sleep(.2)
            raise RuntimeError('test deadline exceeded')
        def send_update(version, broken=False, corrupt=False):
            candidate = source.replace("VERSION = '1.0.3'", 'VERSION = '+repr(version))
            if broken: candidate = candidate.replace('elif args.run:', 'elif args.run:\n        raise SystemExit(9)')
            blob = io.BytesIO()
            with zipfile.ZipFile(blob, 'w', zipfile.ZIP_DEFLATED) as archive:
                for name in ('iota_watch_agent.py', 'iota_local_start.py', 'iota_local_relay.py'):
                    archive.writestr('iota-watch-agent/'+name, candidate if name=='iota_watch_agent.py' else (SOURCE/name).read_text())
            state['archive'] = blob.getvalue()
            state['manifest'] = {'version':version,'bytes':len(state['archive']),'sha256': '0'*64 if corrupt else hashlib.sha256(state['archive']).hexdigest()}
            command_id = str(uuid.uuid4())
            import datetime
            state['ack'] = None; state['sent'] = False
            state['command'] = {'id':command_id,'action':'update','expiresAt':(datetime.datetime.now(datetime.timezone.utc)+datetime.timedelta(minutes=2)).isoformat()}
            wait_for(lambda: state['ack'] and state['ack']['id']==command_id)
            return state['ack']['success']
        try:
            wait_for(lambda: bool(state['versions']))
            results.append({'check':'new_agent_heartbeat', 'passed':send_update('1.0.3') and '1.0.3' in state['versions']})
            results.append({'check':'crashing_update_rolls_back', 'passed':not send_update('1.0.4',broken=True) and state['versions'][-1]=='1.0.3'})
            results.append({'check':'bad_checksum_rejected', 'passed':not send_update('1.0.4',corrupt=True)})
            results.append({'check':'pairing_preserved','passed':json.loads((root/'config.json').read_text())==config})
            results.append({'check':'no_raw_logs_sent','passed':not state['logsReceived']})
        finally:
            process.terminate(); process.wait(timeout=10)
            server.shutdown(); server.server_close()
    after = iota_pids()
    results.append({'check':'iota_processes_unchanged','passed':before==after,'processCount':len(before)})
    report={'checks':results,'allPassed':all(x['passed'] for x in results),'scope':'isolated real agent processes and loopback HTTP; no production pairing or release-channel test'}
    (SOURCE/'update-test-result.json').write_text(json.dumps(report,indent=2)+'\n')
    for row in results: print(('PASS ' if row['passed'] else 'FAIL ')+row['check'])
    return 0 if report['allPassed'] else 1

if __name__=='__main__':
    raise SystemExit(main())
