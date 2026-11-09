import datetime
import hashlib
import io
import os
from pathlib import Path
import subprocess
import sys
import tarfile
import tempfile
import time
import unittest
from unittest.mock import patch
from types import SimpleNamespace

import iota_watch_agent as agent


class IdleBntTests(unittest.TestCase):
    def setUp(self):
        self.now = time.time()
        self.queue = {'position': 101, 'observedAt': self.stamp(-10)}
        self.options = {'whenQueued': True, 'whenPaused': True}

    def stamp(self, offset):
        return datetime.datetime.fromtimestamp(self.now + offset, datetime.timezone.utc).isoformat()

    def reason(self, queue, training=None, paused=False, active=True):
        return agent.idle_bnt_reason(self.options, paused, {
            'appRunning': active, 'workerRunning': active,
            'queue': queue, 'trainingState': training,
        }, self.now)

    def test_training_queue_and_manual_pause_are_separate(self):
        self.assertEqual(self.reason(self.queue), 'ready')
        self.assertEqual(self.reason({**self.queue, 'position': 100}), 'priority')
        self.assertEqual(self.reason({**self.queue, 'observedAt': self.stamp(-121)}), 'priority')
        self.assertEqual(self.reason(self.queue, {'observedAt': self.stamp(-5)}), 'priority')
        self.assertEqual(self.reason(None, active=False), 'waiting')
        self.assertEqual(self.reason(None, active=False, paused=True), 'ready')
        self.assertEqual(self.reason(None, paused=True), 'priority')

    def test_installs_only_a_checksum_verified_release(self):
        binary = b'#!/bin/sh\n[ "$1" = "--version" ]\n'
        package = io.BytesIO()
        with tarfile.open(fileobj=package, mode='w:gz') as archive:
            entry = tarfile.TarInfo('./seine')
            entry.size = len(binary)
            archive.addfile(entry, io.BytesIO(binary))
        data = package.getvalue()
        target = {os.uname().machine: ('fixture', len(data), hashlib.sha256(data).hexdigest())}
        with tempfile.TemporaryDirectory() as directory, \
                patch.object(agent, 'ROOT', Path(directory)), \
                patch.object(agent.sys, 'platform', 'darwin'), \
                patch.object(agent, 'SEINE_MAC_RELEASE', target):
            candidate = agent.managed_idle_bnt_binary()
            for response in (data[:-1] + bytes([data[-1] ^ 1]), data):
                opener = SimpleNamespace(open=lambda *_args, **_kwargs: io.BytesIO(response))
                with patch.object(agent.urllib.request, 'build_opener', return_value=opener):
                    if response != data:
                        with self.assertRaisesRegex(ValueError, 'checksum mismatch'):
                            agent.install_idle_bnt()
                        self.assertFalse(candidate.exists())
                    else:
                        agent.install_idle_bnt()
            self.assertEqual(candidate.read_bytes(), binary)
            self.assertEqual(candidate.stat().st_mode & 0o777, 0o700)

    def test_waits_for_an_enabled_lease_and_cancels_install_when_disabled(self):
        with tempfile.TemporaryDirectory() as directory, \
                patch.object(agent, 'ROOT', Path(directory)), \
                patch.object(agent.subprocess, 'Popen') as spawn:
            controller = agent.IdleBntAgent()
            self.assertEqual(controller.status({}, {})['state'], 'install_needed')
            controller.apply({}, {}, None)
            spawn.assert_not_called()
            lease = {'settings': {}, 'worker': 'fixture', 'seconds': 45}
            child = spawn.return_value
            child.poll.return_value = None
            controller.apply({}, {}, lease)
            self.assertEqual(spawn.call_args.args[0][-1], '--install-idle-bnt')
            self.assertEqual(controller.status({}, {})['state'], 'installing')
            controller.apply({}, {}, None)
            child.terminate.assert_called_once()
            self.assertEqual(controller.status({}, {})['state'], 'install_needed')
            controller.apply({}, {}, lease)
            child.poll.return_value = 1
            self.assertEqual(controller.status({}, {})['state'], 'install_error')
            controller.apply({}, {}, lease)
            self.assertEqual(spawn.call_count, 2)

    def test_stop_terminates_only_the_owned_process(self):
        with tempfile.TemporaryDirectory() as directory:
            miner = agent.IdleBntMiner(Path(directory))
            owned = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(60)'])
            unrelated = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(60)'])
            miner.child = owned
            try:
                miner.stop()
                self.assertIsNotNone(owned.poll())
                self.assertIsNone(unrelated.poll())
            finally:
                miner.stop()
                unrelated.terminate()
                unrelated.wait(timeout=3)

    def test_stop_waits_for_watchdog_before_starting_iota(self):
        calls = []
        class Watch:
            def stop(self):
                calls.append('BNT stopped')
            def status(self, *_):
                return {'state': 'mining', 'hashrate': 1}
        command = {'id': '00000000-0000-4000-8000-000000000001', 'action': 'start', 'expiresAt': self.stamp(30)}
        with patch.object(agent, 'snapshot', return_value={}), \
                patch.object(agent, 'discover_xds_log', return_value=None), \
                patch.object(agent, 'post', return_value={'command': command}), \
                patch.object(agent, 'store'), \
                patch.object(agent, 'control', side_effect=lambda action: calls.append(action)):
            result = agent.step({'server': 'fixture', 'credential': 'fixture'}, {}, self.now, Watch())
        self.assertEqual(calls, ['BNT stopped', 'start'])
        self.assertTrue(result['ack']['success'])

    def test_watchdog_releases_its_miner_on_expiry_and_on_agent_exit(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            folder = root / 'idle-bnt'
            folder.mkdir()
            binary = root / 'seine'
            pid_path = root / 'pid'
            binary.write_text(
                f'#!{sys.executable}\nimport os,sys,time\nfrom pathlib import Path\n'
                'assert sys.argv[sys.argv.index("--threads") + 1] == "4"\n'
                'assert "--disable-cpu-autotune-threads" in sys.argv\n'
                'assert "--allow-oversubscribe" in sys.argv\n'
                f'Path({str(pid_path)!r}).write_text(str(os.getpid()))\n'
                'print("STATS elapsed=1.0s hashes=4 rate=4.0 H/s", flush=True)\n'
                'time.sleep(60)\n'
            )
            binary.chmod(0o700)
            policy = {
                'binary': str(binary), 'worker': 'iota-00000000', 'until': time.monotonic() + 30,
                'pause': 'fixture',
                'settings': {'address': 'fixture', 'threads': 4,
                             'whenQueued': True, 'whenPaused': True},
            }
            def write_policy(until):
                with patch.object(agent, 'ROOT', root):
                    agent.store(folder / 'policy.json', {**policy, 'until': until})
            def wait_for_pid():
                deadline = time.monotonic() + 7
                while time.monotonic() < deadline:
                    status = agent.read(folder / 'status.json')
                    if pid_path.exists() and status.get('state') == 'mining':
                        self.assertEqual(status['hashrate'], 4.0)
                        return int(pid_path.read_text())
                    time.sleep(.1)
                self.fail('The configured four-thread miner did not report hashrate')
            write_policy(time.monotonic() + 30)
            watcher = subprocess.Popen([sys.executable, '-c', (
                f'import iota_watch_agent as a; a.ROOT=a.Path({str(root)!r}); '
                'a.idle_bnt_iota=lambda:dict(appRunning=False,workerRunning=False,queue=None,trainingState=None); '
                'check=a.subprocess.check_output; '
                'a.subprocess.check_output=lambda cmd,**kw: "" if cmd==["/bin/ps","-axo","comm="] else check(cmd,**kw); '
                'a.idle_bnt_watch()'
            )], cwd=Path(agent.__file__).parent, stdin=subprocess.PIPE)
            try:
                first_pid = wait_for_pid()
                write_policy(0)
                deadline = time.monotonic() + 7
                while time.monotonic() < deadline:
                    try:
                        os.kill(first_pid, 0)
                    except ProcessLookupError:
                        break
                    time.sleep(.1)
                with self.assertRaises(ProcessLookupError):
                    os.kill(first_pid, 0)
                pid_path.unlink()
                write_policy(time.monotonic() + 30)
                pid = wait_for_pid()
            finally:
                watcher.stdin.close()
                watcher.wait(timeout=12)
            with self.assertRaises(ProcessLookupError):
                os.kill(pid, 0)
