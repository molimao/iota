import contextlib
import hashlib
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile
import agent_updater as updater
from test_agent import agent

class UpdateTests(unittest.TestCase):
    def setUp(self):
        self.stack=contextlib.ExitStack(); self.addCleanup(self.stack.close)
        self.root=Path(self.stack.enter_context(tempfile.TemporaryDirectory()))
        self.stack.enter_context(patch.object(updater,'ROOT',self.root))
        (self.root/'agent_updater.py').write_text('# stable supervisor')
        for name in updater.FILES: (self.root/name).write_text('# old code')
        (self.root/'config.json').write_text('{"credential":"preserved"}')
        updater.write(self.root/'state.json',{'executed':['test-command']})

    def package(self, bad=False):
        buffer=io.BytesIO()
        with zipfile.ZipFile(buffer,'w') as z:
            for name in updater.FILES:
                z.writestr('iota-watch-agent/'+name, 'syntax ???' if bad else ('print("1.0.3")' if name==updater.FILES[0] else '# new helper'))
        raw=buffer.getvalue()
        manifest={'version':'1.0.3','bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()}
        return manifest,raw

    def test_valid_package_staged_and_rollback_preserves_account(self):
        manifest,raw=self.package()
        with patch.object(updater,'download',side_effect=[json.dumps(manifest).encode(),raw]):
            self.assertTrue(updater.prepare('1.0.2','test-command'))
        request=updater.read(self.root/'update-request.json')
        self.assertEqual(request['phase'],'ready')
        self.assertEqual((self.root/updater.FILES[0]).read_text(),'# old code')
        updater.apply(request)
        self.assertIn('1.0.3',(self.root/updater.FILES[0]).read_text())
        updater.rollback(request)
        self.assertEqual((self.root/updater.FILES[0]).read_text(),'# old code')
        self.assertEqual(updater.read(self.root/'config.json')['credential'],'preserved')
        self.assertFalse(updater.read(self.root/'state.json')['ack']['success'])

    def test_bad_checksum_leaves_installed_files_untouched(self):
        manifest,raw=self.package(); manifest['sha256']='0'*64
        with patch.object(updater,'download',side_effect=[json.dumps(manifest).encode(),raw]):
            with self.assertRaises(ValueError): updater.prepare('1.0.2','test-command')
        self.assertFalse((self.root/'update-request.json').exists())
        self.assertEqual((self.root/updater.FILES[0]).read_text(),'# old code')

    def test_current_or_older_version_does_not_download_archive(self):
        with patch.object(updater,'download',return_value=b'{"version":"1.0.1"}') as download:
            self.assertFalse(updater.prepare('1.0.2','test-command'))
            self.assertEqual(download.call_count,1)

    def test_candidate_probe_failure_does_not_replace_code(self):
        manifest,raw=self.package()
        with patch.object(updater,'download',side_effect=[json.dumps(manifest).encode(),raw]), patch.object(updater.subprocess,'run',side_effect=updater.subprocess.TimeoutExpired('probe',10)):
            with self.assertRaises(updater.subprocess.TimeoutExpired): updater.prepare('1.0.2','test-command')
        self.assertFalse((self.root/'update-request.json').exists())

    def test_heartbeat_success_required_for_update_health(self):
        updater.write(self.root/'update-request.json',{'phase':'installed','id':'test-command','version':agent.VERSION})
        with patch.object(agent,'ROOT',self.root), patch.object(agent,'STATE',self.root/'state.json'), patch.object(agent,'snapshot',return_value={'appRunning':True}), patch.object(agent,'post',side_effect=OSError('offline')):
            with self.assertRaises(OSError): agent.step({'server':'https://iotahome.site','credential':'test'}, {})
        self.assertFalse((self.root/'update-health.json').exists())
        with patch.object(agent,'ROOT',self.root), patch.object(agent,'STATE',self.root/'state.json'), patch.object(agent,'snapshot',return_value={'appRunning':True}), patch.object(agent,'post',return_value={}):
            result=agent.step({'server':'https://iotahome.site','credential':'test'}, {})
        self.assertTrue(result['ack']['success'])
        self.assertEqual(updater.read(self.root/'update-health.json')['version'],agent.VERSION)

    def test_redirect_is_rejected(self):
        with self.assertRaises(ValueError): updater.NoRedirect().redirect_request(None,None,None,None,None,None)

class SupervisorTests(unittest.TestCase):
    def test_failed_new_process_rolls_back_without_touching_pairing(self):
        self.exercise(False)

    def test_healthy_new_process_finishes_update(self):
        self.exercise(True)

    def test_missing_heartbeat_rolls_back(self):
        self.exercise(False, stalled=True)

    def exercise(self, healthy, stalled=False):
        import subprocess
        import sys
        import time
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder); stage=root/'update-stage'; stage.mkdir()
            for name in updater.FILES:
                (root/name).write_text('import time; time.sleep(30)' if name==updater.FILES[0] else '# old')
                (stage/name).write_text('# new')
            if healthy:
                (stage/updater.FILES[0]).write_text("from pathlib import Path\nimport json,time\nPath(__file__).with_name('update-health.json').write_text(json.dumps({'id':'test','version':'1.0.3'}))\ntime.sleep(30)\n")
            else:
                (stage/updater.FILES[0]).write_text('import time; time.sleep(30)' if stalled else 'raise SystemExit(1)')
            updater.write(root/'update-request.json',{'id':'test','version':'1.0.3','phase':'ready'})
            (root/'config.json').write_text('preserve pairing')
            code="import agent_updater as u; from pathlib import Path; u.ROOT=Path("+repr(folder)+"); u.HEALTH_TIMEOUT=.2; u.supervise()"
            proc=subprocess.Popen([sys.executable,'-c',code],cwd=str(Path(updater.__file__).parent))
            try:
                deadline=time.monotonic()+7
                while (root/'update-request.json').exists() and time.monotonic()<deadline:
                    time.sleep(.05)
                self.assertFalse((root/'update-request.json').exists())
                self.assertEqual((root/'config.json').read_text(),'preserve pairing')
                if healthy:
                    self.assertIn('update-health.json',(root/updater.FILES[0]).read_text())
                else:
                    self.assertIn('sleep(30)',(root/updater.FILES[0]).read_text())
                    self.assertEqual(updater.read(root/'state.json')['ack'],{'id':'test','success':False})
            finally:
                proc.terminate(); proc.wait(timeout=7)
