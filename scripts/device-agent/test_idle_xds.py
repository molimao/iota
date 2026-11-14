import datetime
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import unittest
from unittest.mock import patch

import iota_watch_agent as agent


class IdleXdsTests(unittest.TestCase):
    def fixture(self, root):
        binary = root / 'discreted'
        binary.write_text(f'#!{sys.executable}\nimport datetime,time,sys\nfrom pathlib import Path\nPath(sys.argv[sys.argv.index("--log-file")+1]).write_text(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")+" INFO [miner] Hashrate: 152.5 H/s\\n")\ntime.sleep(120)\n')
        binary.chmod(0o700)
        wallet = root / 'wallet'
        password = root / 'password'
        wallet.write_text('encrypted fixture')
        password.write_text('local fixture secret')
        source = root / 'settings.json'
        source.write_text(json.dumps(dict(binary=str(binary), wallet=str(wallet),
                                         passwordFile=str(password), dataDir=str(root))))
        return {'idleXdsSettings': str(source)}

    def test_mac_heartbeat_identifies_its_platform_for_xds_authorization(self):
        with patch.object(agent, 'processes', return_value=[]), \
                patch.object(agent, 'training_resources', return_value=(0, 0)), \
                patch.object(agent, 'observed_training_workers', return_value=[]), \
                patch.object(agent, 'local_training_status', return_value=(None, None)):
            self.assertEqual(agent.snapshot()['platform'], 'darwin')

    def test_local_settings_and_default_off_never_start_a_miner(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(agent, 'ROOT', Path(directory)):
            root = Path(directory)
            config = self.fixture(root)
            controller = agent.IdleXdsAgent()
            self.assertEqual(controller.status(config, {}), dict(state='off', hashrate=None))
            with patch.object(agent.subprocess, 'Popen') as spawn:
                controller.apply(config, {}, None)
                spawn.assert_not_called()
            Path(json.loads(Path(config['idleXdsSettings']).read_text())['wallet']).unlink()
            self.assertEqual(controller.status(config, {})['state'], 'setup')

    def test_stops_only_owned_process_and_reports_timestamped_hashrate(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            local = agent.idle_xds_local(self.fixture(root))
            miner = agent.IdleXdsMiner(root)
            policy = dict(settings=dict(threads=2), local=local)
            with patch.object(agent.subprocess, 'check_output', return_value='/unrelated/seine\n'):
                self.assertEqual(miner.tick(policy, time.time()), 'starting')
            pid = miner.child.pid
            try:
                deadline = time.monotonic() + 3
                while agent.xds_observation(str(miner.log))['status'] != 'ok' and time.monotonic() < deadline:
                    time.sleep(.05)
                self.assertEqual(miner.tick(policy, time.time()), 'mining')
                self.assertEqual(miner.rate, 152.5)
                with patch.object(agent.subprocess, 'check_output', return_value='/local/discreted\n'):
                    second = agent.IdleXdsMiner(root)
                    self.assertEqual(second.tick(policy, time.time()), 'busy')
                    self.assertIsNone(second.child)
            finally:
                miner.stop()
            with self.assertRaises(ProcessLookupError):
                os.kill(pid, 0)
            self.assertIsNone(miner.rate)

    def test_bnt_and_xds_can_run_together(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            local = agent.idle_xds_local(self.fixture(root))
            binary = root / 'seine'
            binary.write_text(f'#!{sys.executable}\nimport time\ntime.sleep(120)\n')
            binary.chmod(0o700)
            bnt = agent.IdleBntMiner(root)
            xds = agent.IdleXdsMiner(root)
            try:
                with patch.object(agent.subprocess, 'check_output', return_value=''):
                    self.assertEqual(bnt.tick(dict(binary=str(binary), worker='test',
                        settings=dict(threads=2, address='fixture')), time.time()), 'starting')
                with patch.object(agent.subprocess, 'check_output', return_value=str(binary)):
                    self.assertEqual(xds.tick(dict(local=local, settings=dict(threads=2)), time.time()), 'starting')
                self.assertIsNone(bnt.child.poll())
                self.assertIsNone(xds.child.poll())
                xds.stop()
                self.assertIsNone(bnt.child.poll())
            finally:
                xds.stop()
                bnt.stop()

    def test_releases_both_miners_before_starting_iota(self):
        calls = []
        class Controller:
            folder = Path('/nonexistent')
            def __init__(self, name): self.name = name
            def stop(self): calls.append(self.name)
            def status(self, *_): return dict(state='mining', hashrate=1)
        command = dict(id='00000000-0000-4000-8000-000000000001', action='start',
                       expiresAt=(datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(seconds=30)).isoformat())
        with patch.object(agent, 'snapshot', return_value={}), \
                patch.object(agent, 'discover_xds_log', return_value=None), \
                patch.object(agent, 'post', return_value=dict(command=command)), \
                patch.object(agent, 'store'), \
                patch.object(agent, 'control', side_effect=lambda action: calls.append(action)):
            result = agent.step(dict(server='fixture', credential='fixture'), {},
                                idle_bnt=Controller('BNT stopped'), idle_xds=Controller('XDS stopped'))
        self.assertEqual(calls, ['XDS stopped', 'BNT stopped', 'start'])
        self.assertTrue(result['ack']['success'])

    def test_watchdog_expires_and_closing_agent_releases_xds(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(agent, "ROOT", Path(directory)):
            root = Path(directory)
            local = agent.idle_xds_local(self.fixture(root))
            folder = root / 'idle-xds'
            folder.mkdir()
            policy = dict(settings=dict(threads=2, whenQueued=True, whenPaused=True),
                          local=local, pause='manual-stop', until=time.time() + 5)
            agent.store(folder / 'policy.json', policy)
            watcher = subprocess.Popen([sys.executable, '-c', (
                f'import iota_watch_agent as a; a.ROOT=a.Path({str(root)!r}); '
                'a.idle_bnt_iota=lambda:dict(appRunning=False,workerRunning=False,queue=None,trainingState=None); '
                'a.subprocess.check_output=lambda *args,**kw:""; a.idle_bnt_watch("xds")'
            )], stdin=subprocess.PIPE, cwd=Path(__file__).parent)
            def wait_state(expected):
                deadline = time.monotonic() + 9
                while time.monotonic() < deadline:
                    if agent.read(folder / 'status.json').get('state') == expected:
                        return
                    time.sleep(.05)
                self.fail(f'No {expected} state')
            try:
                wait_state('starting')
                wait_state('off')
                policy['until'] = time.time() + 30
                agent.store(folder / 'policy.json', policy)
                wait_state('starting')
                watcher.stdin.close()
                watcher.wait(timeout=12)
                self.assertEqual(watcher.returncode, 0)
            finally:
                if watcher.poll() is None:
                    watcher.stdin.close()
                    watcher.wait(timeout=12)


if __name__ == '__main__':
    unittest.main()
