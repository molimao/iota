import datetime as dt
from pathlib import Path
import tempfile
import unittest

from xds_observation import observe_xds


class DiscreteObservationTest(unittest.TestCase):
    def test_uses_miner_speed_and_original_sample_time(self):
        with tempfile.TemporaryDirectory() as root:
            log = Path(root) / 'discreted.log'
            log.write_text(
                '2026-Nov-09 10:00:00.123456 INFO    [miner] Hashrate: 127.50 H/s\n'
                '2026-Nov-09 10:02:00.000000 INFO    [node] est. network hashrate: 99999 H/s\n'
                '2026-Nov-09 10:02:03.000000 INFO    [miner] Hashrate: 12.00 H/s'
            )
            result = observe_xds(str(log))
            self.assertEqual(result['status'], 'ok')
            self.assertEqual(result['hashrateHps'], 127.5)
            self.assertEqual(dt.datetime.fromisoformat(result['observedAt']).astimezone().isoformat()[:19],
                             '2026-11-09T10:00:00')

    def test_stop_and_new_session_do_not_reuse_old_speed(self):
        with tempfile.TemporaryDirectory() as root:
            log = Path(root) / 'discreted.log'
            log.write_text(
                '2026-Nov-09 10:00:00 INFO    [miner] Hashrate: 127.50 H/s\n'
                '2026-Nov-09 10:00:30 INFO    [miner] Mining has been stopped, 0 finished\n'
            )
            self.assertEqual(observe_xds(str(log))['status'], 'stopped')
            with log.open('a') as f:
                f.write('2026-Nov-09 10:01:00 INFO    [miner] Mining has started with 8 threads, good luck!\n')
            self.assertEqual(observe_xds(str(log)), {'status': 'unavailable', 'observedAt': None, 'hashrateHps': None})

    def test_mac_collector_and_discovery_work_without_an_extra_update_file(self):
        import os
        import subprocess
        from unittest.mock import patch
        import iota_watch_agent as agent

        with tempfile.TemporaryDirectory() as root:
            log = Path(root) / 'custom.log'
            log.write_text('2026-Nov-09 10:00:00.123456 INFO    [miner] Hashrate: 127.50 H/s\n')
            console = Path(root) / 'node.log'
            console.write_text('Hashrate: 999 H/s\n')
            rows = f'{os.getuid()} 123 /opt/Discrete/discreted\n{os.getuid()} 456 /bin/other\n'
            files = subprocess.CompletedProcess([], 0, stdout=f'p123\nn{log}\nn{console}\n', stderr='')
            with patch.object(agent.subprocess, 'check_output', return_value=rows), patch.object(agent.subprocess, 'run', return_value=files):
                self.assertEqual(agent.discover_xds_log(), str(log))
            self.assertEqual(agent.xds_observation(str(log)), observe_xds(str(log)))

    def test_linux_discovers_same_user_daemon_log_without_manual_configuration(self):
        from linux_gpu_agent import discover_xds_log

        with tempfile.TemporaryDirectory() as root:
            root = Path(root)
            process = root / 'proc' / '123'
            descriptors = process / 'fd'
            descriptors.mkdir(parents=True)
            (process / 'comm').write_text('discreted\n')
            (descriptors / '3').symlink_to(root / 'data.mdb')
            (descriptors / '4').symlink_to(root / 'discreted.log')
            self.assertEqual(discover_xds_log(root / 'proc'), str(root / 'discreted.log'))
