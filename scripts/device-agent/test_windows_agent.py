import datetime as dt
import json
from pathlib import Path
import tempfile
import time
import unittest
from unittest.mock import patch

import windows_agent as agent


def process(folder, name, started, args=()):
    return dict(name=name, exe=folder / name, started=started, args=args)


def binding(project, wallet, worker, tag):
    return dict(project=project, identifier=wallet, worker=worker, id=f'00000000-0000-4000-8000-00000000000{tag}')


class WindowsAgentTest(unittest.TestCase):
    def test_three_mining_projects_share_one_read_only_snapshot(self):
        with tempfile.TemporaryDirectory() as directory:
            folder, now = Path(directory), time.time()
            (folder / 'redpearl.toml').write_text('wallet = "pearl-wallet"\nworker = "win-rig"\n')
            (folder / 'miner.log').write_text('redPeaRL 0.7.0-beta.6 | 144.6 TH/s | 144.3 avg 15m | A 70 R 1 | 288 W\n')
            log = folder / 'discreted.log'
            stamp = dt.datetime.fromtimestamp(now).strftime('%Y-%m-%d %H:%M:%S')
            log.write_text(f'{stamp} INFO [miner] Hashrate: 42.5 H/s\n')
            rows = [
                process(folder, 'seine.exe', now - 30, ['--api-bind', '127.0.0.1:9977', '--api-token', 'local-token']),
                process(folder, 'redpearl-miner.exe', now),
                process(folder, 'discreted.exe', now - 30, ['--log-file', str(log)]),
            ]
            bindings = [
                binding('bnt', 'bnt-wallet', 'win-rig', 1),
                binding('bnt', 'bnt-wallet', 'other-rig', 2),
                binding('prl', 'pearl-wallet', 'win-rig', 3),
                binding('prl', 'pearl-wallet', 'other-rig', 4),
            ]
            config = {'config': {'mining_address': 'bnt-wallet', 'pool_worker': 'win-rig'}}
            stats = {'running': True, 'mining': {'updated_at_unix_ms': int(now * 1000),
                'average_hashrate_hps': 42.1, 'accepted': 10, 'rejected': 1}}
            with patch.object(agent, 'request_json', side_effect=[config, stats]) as api:
                report = agent.snapshot(rows, bindings, None, now)
            self.assertTrue(report['monitorOnly'])
            self.assertEqual(report['platform'], 'win32')
            self.assertEqual(report['xds']['hashrateHps'], 42.5)
            self.assertEqual([m['bindingId'] for m in report['miners']], [bindings[0]['id'], bindings[2]['id']])
            self.assertEqual(report['miners'][0]['hashrateSession'], 42.1)
            self.assertEqual(report['miners'][1]['hashrateCurrent'], 144.6e12)
            self.assertEqual(report['miners'][1]['rejected'], 1)
            self.assertEqual([call.args[0] for call in api.call_args_list],
                             ['http://127.0.0.1:9977/v1/runtime/config/effective', 'http://127.0.0.1:9977/v1/miner/stats'])
            self.assertTrue(all(call.kwargs['local'] for call in api.call_args_list))
            payload = json.dumps(report)
            for private in ('pearl-wallet', 'bnt-wallet', 'local-token', directory, 'Hashrate:'):
                self.assertNotIn(private, payload)

    def test_does_not_assign_ambiguous_worker_or_read_a_non_local_api(self):
        now = time.time()
        rows = [process(Path.cwd(), 'seine.exe', now - 10,
                        ['-u', 'bnt-wallet.win-rig', '--api-bind', '10.0.0.2:9977'])]
        bindings = [binding('bnt', 'bnt-wallet', 'win-rig', 1)]
        with patch.object(agent, 'request_json') as api:
            result = agent.snapshot(rows, bindings, None, now)
            self.assertEqual(result['miners'][0]['status'], 'process')
            self.assertEqual(agent.snapshot(rows * 2, bindings, None, now)['miners'], [])
            self.assertEqual(agent.snapshot(rows, bindings + [binding('bnt', 'bnt-wallet', 'win-rig', 2)], None, now)['miners'], [])
            api.assert_not_called()

    def test_xds_stale_restart_and_process_query_failure(self):
        with tempfile.TemporaryDirectory() as directory:
            folder, now = Path(directory), time.time()
            log = folder / 'discreted.log'
            stamp = dt.datetime.fromtimestamp(now - 15).strftime('%Y-%m-%d %H:%M:%S')
            log.write_text(f'{stamp} INFO [miner] Hashrate: 41 H/s\n')
            rows = [process(folder, 'discreted.exe', now - 5)]
            self.assertEqual(agent.xds_reading(rows, str(log), now)['status'], 'unavailable')
            self.assertEqual(agent.xds_reading([], str(log), now)['status'], 'stopped')
            self.assertEqual(agent.xds_reading(None, str(log), now)['status'], 'unavailable')
            self.assertIsNone(agent.xds_reading([], None, now))
