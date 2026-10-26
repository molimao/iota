import importlib.util
import datetime
import json
from pathlib import Path
import tempfile
import time
import unittest
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('discovery_agent',Path(__file__).with_name('iota_watch_agent.py'))
agent=importlib.util.module_from_spec(spec);spec.loader.exec_module(agent)
BINDING={'id':'11111111-1111-4111-8111-111111111111','project':'bnt','identifier':'sample-public-payout','worker':'worker-A'}

class DiscoveryTests(unittest.TestCase):
    def test_bnt_wallet_aggregate_never_authorizes_discovery_or_cached_readings(self):
        wallet=dict(BINDING,worker='')
        self.assertEqual(agent._binding_manifest([wallet]),[])
        with patch.object(agent.subprocess,'check_output') as ps:
            self.assertEqual(agent.discover_local_miners([wallet]),[])
            ps.assert_not_called()
        miner={'project':'bnt','software':'seine','bindingId':BINDING['id'],'port':9977}
        state={'bindingManifest':[wallet],'permissionsUntil':1090,'discoveredMiners':[miner]}
        self.assertEqual(agent.effective_miner_config({'miners':[miner]},state,1000)['miners'],[])
    def test_manifest_never_accepts_commands_paths_or_unbounded_records(self):
        self.assertEqual(agent._binding_manifest([dict(BINDING,logPath='/private/file')]),[])
        self.assertEqual(agent._binding_manifest([BINDING]*9),[])
        self.assertEqual(agent._binding_manifest([dict(BINDING,id='bad')]),[])
        self.assertEqual(agent._binding_manifest([BINDING]),[BINDING])

    def test_existing_bnt_launcher_is_matched_by_exact_wallet_worker_and_generation(self):
        now=time.time();origin=datetime.datetime.fromtimestamp(now-100).replace(microsecond=0)
        with tempfile.TemporaryDirectory() as folder:
            logs=Path(folder)/'logs';logs.mkdir()
            logfile=logs/(origin.strftime('%Y%m%d-%H%M%S')+'.log')
            logfile.write_text('wallet sample-public-payout worker worker-A\n95.0s INFO STATS elapsed=95.0s hashes=300 rate=2.815 H/s templates=1 submitted=8 stale=0 accepted=4 deferred=4 dropped=0\n')
            def output(args,**kwargs):
                if args[0]=='/usr/sbin/lsof':return 'p42\nfcwd\nn'+folder+'\nf1\nn->pipe\n'
                if 'etime=' in args:return '01:40'
                return '42 ./bin/seine\n43 unrelated-miner\n'
            with patch.object(agent.subprocess,'check_output',side_effect=output):
                configured=agent.discover_local_miners([BINDING])
                self.assertEqual(len(configured),1)
                self.assertEqual(configured[0]['bindingId'],BINDING['id'])
                reading=agent.local_miner_observation(configured[0],now)
                self.assertEqual(reading['hashrateSession'],2.815)
                self.assertNotIn('sample-public-payout',json.dumps(reading))
                self.assertNotIn(folder,json.dumps(reading))
                self.assertEqual(agent.discover_local_miners([dict(BINDING,identifier='other-wallet')]),[])
                self.assertEqual(agent.discover_local_miners([dict(BINDING,worker='worker-B')]),[])
                self.assertEqual(agent.discover_local_miners([BINDING,dict(BINDING,id='22222222-2222-4222-8222-222222222222')]),[])

    def test_removed_or_expired_manifest_disables_cached_and_explicit_binding(self):
        miner={'software':'seine','project':'bnt','bindingId':BINDING['id'],'port':9977}
        config={'miners':[miner]}
        state={'bindingManifest':[BINDING],'permissionsUntil':1090,'discoveredMiners':[miner]}
        self.assertEqual(len(agent.effective_miner_config(config,state,1000)['miners']),2)
        self.assertEqual(agent.effective_miner_config(config,state,1091)['miners'],[])
        self.assertEqual(agent.effective_miner_config(config,dict(state,bindingManifest=[]),1000)['miners'],[])

    def test_noid_matches_only_the_installed_apps_public_payout(self):
        noid=dict(BINDING,project='noid',identifier='o1publicpayout',worker='')
        with patch.object(agent,'_noid_payout_identity',return_value='o1publicpayout'),patch.object(agent.subprocess,'check_output') as ps:
            result=agent.discover_local_miners([noid])
            self.assertEqual(result,[{'project':'noid','software':'noid-mac','bindingId':noid['id']}])
            self.assertEqual(agent.discover_local_miners([dict(noid,identifier='other-wallet')]),[])
            self.assertEqual(agent.discover_local_miners([noid,dict(noid,id='22222222-2222-4222-8222-222222222222')]),[])
            ps.assert_not_called()

    def test_prl_uses_latest_connection_identity_not_old_wallet_in_same_log(self):
        prl=dict(BINDING,project='prl',identifier='new-payout',worker='worker-A')
        with tempfile.TemporaryDirectory() as folder:
            logfile=Path(folder)/'mining.log'
            logfile.write_text('[12:00:00] connecting to luckypool at example:3360 as old-payout.worker-A\n[12:01:00] connecting to luckypool at example:3360 as new-payout.worker-A\n')
            def output(args,**kwargs):
                if args[0]=='/usr/sbin/lsof':return 'p42\nfcwd\nn'+folder+'\nf1\nn'+str(logfile)+'\n'
                if 'args=' in args:return 'python3 -m pearl_metal_miner.miner'
                return '42 /usr/bin/python3\n'
            with patch.object(agent.subprocess,'check_output',side_effect=output):
                self.assertEqual(len(agent.discover_local_miners([prl])),1)
                self.assertEqual(agent.discover_local_miners([dict(prl,identifier='old-payout')]),[])
                self.assertEqual(agent.discover_local_miners([dict(prl,worker='worker-B')]),[])

    def test_prl_ignores_unrelated_python_command(self):
        prl=dict(BINDING,project='prl')
        with patch.object(agent.subprocess,'check_output',side_effect=['42 /usr/bin/python3\n','python3 unrelated.py']):
            self.assertEqual(agent.discover_local_miners([prl]),[])

    def test_xmrig_uses_explicit_running_user_and_api_port_without_probing_other_ports(self):
        xmr=dict(BINDING,project='xmr',identifier='xmr-public-payout',worker='worker-A')
        def scan(command):
            with patch.object(agent.subprocess,'check_output',side_effect=['42 /usr/bin/xmrig\n',command]):
                return agent.discover_local_miners([xmr])
        self.assertEqual(scan('xmrig -u xmr-public-payout.worker-A --http-port=18088'),[{'project':'xmr','software':'xmrig','bindingId':BINDING['id'],'port':18088}])
        self.assertEqual(scan('xmrig -u other-wallet.worker-A --http-port=18088'),[])
        self.assertEqual(scan('xmrig -u xmr-public-payout.worker-A'),[])
        self.assertEqual(scan('xmrig -u xmr-public-payout.worker-A --http-port=18088 --http-access-token private'),[])

    def test_read_only_manifest_is_saved_after_heartbeat_and_discovery_failure_is_isolated(self):
        with patch.object(agent,'snapshot',return_value={'appRunning':True,'workerRunning':True}),patch.object(agent,'post',return_value={'bindings':[BINDING]} ) as post,patch.object(agent,'discover_local_miners',side_effect=OSError('unavailable')):
            state=agent.step({'server':'https://iotahome.site','credential':'test'}, {},1000)
        self.assertEqual(state['bindingManifest'],[BINDING])
        self.assertEqual(state['discoveredMiners'],[])
        self.assertEqual(state['permissionsUntil'],1090)
        self.assertIs(post.call_args.args[2]['requestBindings'],True)

if __name__=='__main__':unittest.main()
