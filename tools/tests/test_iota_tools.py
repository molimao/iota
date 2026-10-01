"""Read-only release and guardian checks; never install or restart IOTA."""
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'tools/iota-local'
spec = importlib.util.spec_from_file_location('guardian', SOURCE / 'runtime/iota_guardian.py')
guardian = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guardian)


class GuardianChecks(unittest.TestCase):
    def setUp(self):
        self.now = 10000
        self.evidence = guardian.parse_logs([], {'session_started_at': 8000})
        self.evidence.update(last_activity_at=9990)
        self.control = {'ok': True, 'connected': True, 'expectedHostPid': 123}

    def classify(self, pid=123, alive=True):
        return guardian.classify(self.evidence, pid, alive, self.control, self.now)

    def test_stale_queue_does_not_restart(self):
        self.evidence.update(queue_status='queued', queue_position=287, queue_updated_at=8000)
        status, _, restart = self.classify()
        self.assertEqual(status, 'queued')
        self.assertFalse(restart)

    def test_normal_quit_preserves_manual_intent(self):
        self.evidence['quit_at'] = 9990
        self.assertEqual(self.classify(pid=None, alive=False)[0], 'paused')
        self.assertFalse(self.classify(pid=None, alive=False)[2])

    def test_normal_miner_stop_does_not_restart(self):
        self.evidence.update(exited_at=9990, exit_code=0)
        self.assertFalse(self.classify(alive=False)[2])

    def test_startup_grace(self):
        self.evidence['session_started_at'] = 9900
        self.control = None
        self.assertEqual(self.classify(alive=False)[0], 'starting')
        self.assertFalse(self.classify(alive=False)[2])

    def test_disconnected_control_is_local_failure(self):
        self.control['connected'] = False
        self.assertTrue(self.classify()[2])

    def test_three_checks_cooldown_and_hourly_limit(self):
        self.assertIsNone(guardian.decision({'bad_checks': 2}, self.now))
        self.assertEqual(guardian.decision({'bad_checks': 3}, self.now), 'restart')
        self.assertNotEqual(guardian.decision({'bad_checks': 3, 'last_restart_at': 9900}, self.now), 'restart')
        self.assertNotEqual(guardian.decision({'bad_checks': 3, 'restart_history': [7000, 8000, 9000]}, self.now), 'restart')

    def test_queue_log_retains_only_status_fields(self):
        records = [(9900, 'Successfully completed request to /miner/register response: {"status":"queued","position":42,"token":"fixture-token"}')]
        evidence = guardian.parse_logs(records, {})
        self.assertEqual(evidence['queue_position'], 42)
        self.assertEqual(evidence['queue_status'], 'queued')
        self.assertNotIn('fixture-token', json.dumps(evidence))


class ReleaseChecks(unittest.TestCase):
    def test_public_archive_matches_source_and_checksum(self):
        release = json.loads((ROOT / 'src/lib/local-tools-release.json').read_text())
        archive_path = ROOT / 'public/downloads' / release['filename']
        self.assertEqual(hashlib.sha256(archive_path.read_bytes()).hexdigest(), release['sha256'])
        self.assertEqual(archive_path.stat().st_size, release['bytes'])
        with zipfile.ZipFile(archive_path) as archive:
            self.assertIsNone(archive.testzip())
            self.assertEqual(len(archive.namelist()), 11)
            for info in archive.infolist():
                name = info.filename.removeprefix('IOTA本地工具/')
                self.assertNotIn('..', Path(name).parts)
                self.assertTrue(name.endswith(('.py', '.command', '.md')) or name == 'LICENSE')
                data = archive.read(info)
                self.assertEqual(data, (SOURCE / name).read_bytes())
                self.assertNotIn(b'/Users/mac/', data)
                if name.endswith('.command'):
                    self.assertEqual((info.external_attr >> 16) & 0o777, 0o755)
                if name.endswith('.py'):
                    compile(data, name, 'exec')
        self.assertEqual((ROOT / 'public/downloads/iota-status.command').read_bytes(), (SOURCE / '查看IOTA状态.command').read_bytes())

    def test_commands_are_valid_zsh(self):
        for file in SOURCE.glob('*.command'):
            subprocess.run(['/bin/zsh', '-n', str(file)], check=True)


if __name__ == '__main__':
    unittest.main()
