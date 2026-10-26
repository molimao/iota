import datetime
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import time
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('multi_agent', Path(__file__).with_name('iota_watch_agent.py'))
agent = importlib.util.module_from_spec(spec)
spec.loader.exec_module(agent)
BINDING = '11111111-1111-4111-8111-111111111111'
BNT = {'software': 'seine', 'project': 'bnt', 'bindingId': BINDING, 'port': 9977}


class MultiMinerTests(unittest.TestCase):
    def seine(self, running=True, age=5):
        health = {'status': 'ok', 'started_unix_ms': 100000, 'now_unix_ms': 200000}
        data = {'running': running, 'lifecycle': 'running' if running else 'idle',
                'effective_config': {'token': 'never-upload', 'mining_address': 'private-wallet'},
                'metrics': {'accepted_blocks': 4, 'submitted_blocks': 8},
                'recent_logs': [{'elapsed_secs': 100-age, 'tag': 'STATS',
                                 'message': 'elapsed=95.0s hashes=300 rate=1.500 KH/s templates=1 submitted=8 stale=0 accepted=4 deferred=4 dropped=0'}]}
        with patch.object(agent, '_local_json', side_effect=[health, data]) as api:
            result = agent.local_miner_observation(BNT, 200)
        return result, api

    def test_seine_session_rate_and_blocks_are_not_pending_or_rejected_shares(self):
        result, api = self.seine()
        self.assertEqual(result['hashrateSession'], 1500)
        self.assertIsNone(result['hashrate60s'])
        self.assertEqual(result['rateWindow'], 'session')
        self.assertEqual(result['accepted'], 4)
        self.assertIsNone(result['rejected'])
        self.assertEqual(result['counterUnit'], 'blocks')
        self.assertEqual([c.args[1] for c in api.call_args_list], ['/v1/health', '/v1/runtime/state'])
        self.assertNotIn('private-wallet', json.dumps(result))
        self.assertNotIn('never-upload', json.dumps(result))

    def test_stopped_and_old_rate_never_show_old_hashrate_as_live(self):
        for running, age in [(False, 5), (True, 70)]:
            result, _ = self.seine(running, age)
            self.assertIsNone(result.get('hashrateSession'))
        self.assertEqual(self.seine(False)[0]['status'], 'stopped')

    def pearl(self, age=0, suffix=''):
        now = time.time()
        stamp = datetime.datetime.fromtimestamp(now-age).strftime('%H:%M:%S')
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'mining.log'
            path.write_text('[%s] 1.075M tiles/s (60s) | 1.032M/s session | shares 2 acc / 1 rej | up 0:00:30\n%s' % (stamp, suffix))
            options = {'software': 'pearl-metal', 'project': 'prl', 'bindingId': BINDING, 'logPath': str(path)}
            result = agent.local_miner_observation(options, now)
        return result

    def test_pearl_reads_only_rate_and_counters_without_converting_tiles_to_hashes(self):
        value = self.pearl()
        self.assertEqual(value['status'], 'ok')
        self.assertEqual(value['hashrate60s'], 1075000)
        self.assertEqual(value['rateUnit'], 'tiles/s')
        self.assertEqual((value['accepted'], value['rejected']), (2, 1))
        self.assertNotIn('logPath', value)

    def test_touched_old_log_and_stop_after_rate_do_not_claim_mining(self):
        for value in [self.pearl(120), self.pearl(suffix='[12:00:00] session: shares 2 accepted, 1 rejected\n')]:
            self.assertNotEqual(value['status'], 'ok')
            self.assertIsNone(value['hashrate60s'])

    def test_explicit_log_only_no_wallet_or_symlink_reads(self):
        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder)/'wallet.json'
            target.write_text('secret-wallet')
            link = Path(folder)/'mining.log'
            link.symlink_to(target)
            for filename in [target, link]:
                value = agent.local_miner_observation({'software':'pearl-metal', 'project':'prl', 'bindingId': BINDING, 'logPath':str(filename)})
                self.assertEqual(value['status'], 'unavailable')
                self.assertNotIn('secret-wallet', json.dumps(value))

    def test_multi_adapter_isolation_limits_and_duplicate_source_prevention(self):
        options = [dict(BNT), dict(BNT), dict(BNT, bindingId='22222222-2222-4222-8222-222222222222'),
                   {'software': [], 'project': 'bnt', 'bindingId':'33333333-3333-4333-8333-333333333333','port':9979},
                   {'software': 'xmrig', 'project':'xmr', 'bindingId':'44444444-4444-4444-8444-444444444444','port':18088}]
        with patch.object(agent, '_local_json', side_effect=OSError('offline')), patch.object(agent, 'xmrig_observation', return_value={'project':'xmr','status':'ok'}) as xmr:
            results = agent.local_miner_observations({'miners':options}, 1000)
        self.assertEqual(len(results), 2)
        self.assertEqual(results[0]['status'], 'unavailable')
        self.assertEqual(results[1]['project'], 'xmr')
        xmr.assert_called_once()

    def test_bnt_existing_launcher_log_works_without_starting_an_api(self):
        now=time.time()
        origin=datetime.datetime.fromtimestamp(now-100).replace(microsecond=0)
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/(origin.strftime('%Y%m%d-%H%M%S')+'.log')
            path.write_text('95.0s INFO STATS elapsed=95.0s hashes=300 rate=2.815 H/s templates=1 submitted=8 stale=0 accepted=4 deferred=4 dropped=0\n')
            with patch.object(agent,'_local_json') as api:
                value=agent.local_miner_observation(dict(BNT,logPath=str(path)),now)
                api.assert_not_called()
            self.assertEqual(value['hashrateSession'],2.815)
            self.assertEqual(value['counterUnit'],'shares')
            self.assertIsNone(value['rejected'])
            path.write_text('5.0s INFO STATS elapsed=5.0s hashes=3 rate=2.800 H/s templates=1 submitted=8 stale=0 accepted=4\n')
            value=agent.local_miner_observation(dict(BNT,logPath=str(path)),now)
            self.assertEqual(value['status'],'unavailable')

    def test_local_setup_keeps_iota_credentials_and_existing_other_miner(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder)
            cfg=root/'config.json'
            cfg.write_text(json.dumps({'server':'https://iotahome.site','credential':'private-pairing',
                                       'xmrig':{'bindingId':BINDING,'port':18088}}))
            other='22222222-2222-4222-8222-222222222222'
            with patch.object(agent,'ROOT',root),patch.object(agent,'CONFIG',cfg):
                agent.configure_miner('seine',other,9977)
                result=json.loads(cfg.read_text())
                self.assertEqual(result['credential'],'private-pairing')
                self.assertEqual([x['software'] for x in result['miners']],['xmrig','seine'])
                self.assertEqual(cfg.stat().st_mode & 0o777,0o600)
                with self.assertRaises(ValueError):agent.configure_miner('seine','33333333-3333-4333-8333-333333333333',18088)

    def test_noid_counts_only_installed_compute_binaries_not_agent_or_gui(self):
        rows='1 2.0 1024 /Applications/NOID Miner.app/Contents/Resources/miner/bin/noid-cpu\n2 5.0 2048 /Applications/NOID Miner.app/Contents/Resources/miner/bin/noid-metal\n3 99 999999 /tmp/noid-metal\n4 80 999999 /Applications/NOID Miner.app/Contents/MacOS/NOIDMiner\n'
        with patch.object(agent.subprocess,'check_output',return_value=rows):
            value=agent.local_miner_observation({'software':'noid-mac','project':'noid','bindingId':BINDING},1000)
        self.assertEqual(value['status'],'process')
        self.assertEqual(value['appCpu'],7)
        self.assertEqual(value['processMemoryMb'],3)
        self.assertIsNone(value['hashrate10s'])
        self.assertIsNone(value['accepted'])
        with patch.object(agent.subprocess,'check_output',side_effect=agent.subprocess.TimeoutExpired('ps',2)):
            value=agent.local_miner_observation({'software':'noid-mac','project':'noid','bindingId':BINDING},1000)
        self.assertEqual(value['status'],'unavailable')


if __name__ == '__main__':
    unittest.main()
