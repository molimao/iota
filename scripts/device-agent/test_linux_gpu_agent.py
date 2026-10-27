import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
import linux_gpu_agent as a

class LinuxTest(unittest.TestCase):
    def test_gpu_na_and_bounds(self):
        rows=a.gpu_rows('0, RTX 4060, 25, 202, 8188, 56, 5.36\n1, GPU, [N/A], 20, 1000, N/A, N/A', 1000)
        self.assertEqual(len(rows),2)
        self.assertEqual(rows[0]['utilization'],25)
        self.assertIsNone(rows[1]['utilization'])
        self.assertIsNone(a.number('nan',100))
        self.assertIsNone(a.number('-1',100))
    def test_post_identifies_agent(self):
        from unittest.mock import MagicMock
        response=MagicMock()
        response.__enter__.return_value.read.return_value=b'{}'
        opener=MagicMock();opener.open.return_value=response
        with patch.object(a.urllib.request,'build_opener',return_value=opener):
            a.post('heartbeat',{'snapshot':{}},'test-credential')
        request=opener.open.call_args.args[0]
        self.assertEqual(request.get_header('User-agent'),'IOTA-Watch-Agent/'+a.VERSION)
        self.assertEqual(request.get_header('Accept'),'application/json')
        self.assertEqual(request.full_url,'https://iotahome.site/api/device-agent/heartbeat')

    def test_install_from_existing_agent_directory(self):
        import runpy, shutil
        with tempfile.TemporaryDirectory() as d:
            root=Path(d)/'.local/state/iota-watch-linux';root.mkdir(parents=True)
            (root/'config.json').write_text('{}')
            (root/'linux_gpu_agent.py').write_text('# test monitor')
            installer=root/'install_linux.py'
            shutil.copyfile(Path(__file__).with_name('install_linux.py'),installer)
            with patch.object(Path,'home',return_value=Path(d)),patch('sys.platform','linux'),patch('subprocess.run') as run:
                runpy.run_path(str(installer),run_name='__main__')
            self.assertEqual(run.call_count,2)
            self.assertEqual(run.call_args.args[0],['systemctl','--user','enable','--now','iota-watch-linux.service'])
            self.assertIn('NoNewPrivileges=true',(Path(d)/'.config/systemd/user/iota-watch-linux.service').read_text())

    def test_queue(self):
        x=a.parse_line('QUEUE_PROBE status= queued position= 2846 run= None confirm= False',1000)
        self.assertEqual(x['queue']['position'],2846)
        self.assertIsNone(x['trainingState'])
        self.assertIsNone(a.parse_line('QUEUE_PROBE status= registered position= None run= 4.13.7.11 confirm= False',1000)['queue'])
    def test_training_requires_explicit_event(self):
        self.assertIsNone(a.parse_line('GPU utilization 100%',1000))
        self.assertIsNone(a.parse_line('2026-10-27 10:00:00 P2P communication started',1000))
        self.assertEqual(a.parse_line('2026-10-27 10:00:00 FORWARD complete | layer=0',1000)['trainingState']['status'],'forward')
    def test_stale_queue_not_refreshed(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'log';p.write_text('QUEUE_PROBE status= queued position= 12 run= None\n')
            now=p.stat().st_mtime;state={}
            self.assertEqual(a.read_evidence(p,state,now)['queue']['position'],12)
            self.assertNotIn('queue',a.read_evidence(p,state,now+301))
            with p.open('a') as f:f.write('unrelated log\n')
            self.assertNotIn('queue',a.read_evidence(p,state,now+302))
    def test_old_queue_followed_by_other_log_unknown(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'log';p.write_text('QUEUE_PROBE status= queued position= 12 run= None\nnoise\n')
            self.assertNotIn('queue',a.read_evidence(p,{},p.stat().st_mtime))
    def test_partial_line_waits(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'log';p.write_text('QUEUE_PROBE status= queued position= 12 run= None')
            s={};now=p.stat().st_mtime
            self.assertNotIn('queue',a.read_evidence(p,s,now))
            with p.open('a') as f:f.write('\n')
            self.assertEqual(a.read_evidence(p,s,now+1)['queue']['position'],12)
    def test_reused_pid_no_training(self):
        with patch.object(a,'proc',return_value={'start':'different'}),patch.object(a,'gpus',return_value=[]):
            s=a.snapshot({'pid':1,'generation':'original','log':'/missing'}, {})
            self.assertFalse(s['workerRunning'])
            self.assertNotIn('queue',s)
    def test_restart_follows_identity_and_clears_old_evidence(self):
        from unittest.mock import MagicMock
        identity={'exe':'python','cwd':'iota','commandHash':'hash'}
        state={'identity':identity,'sample':{'at':1,'ticks':999},'evidence':{'queue':{}},'cursor':{'offset':999}}
        fresh={'start':'new','started':200,'ticks':10,'memory':20}
        def process(pid):
            if pid==1: raise ProcessLookupError()
            return fresh
        candidate=MagicMock();candidate.name='2'
        with patch.object(a,'proc',side_effect=process),patch.object(a,'process_identity',return_value=identity),patch.object(a.Path,'iterdir',return_value=iter([candidate])):
            self.assertEqual(a.resolve_process({'pid':1,'generation':'old','log':'log'},state),fresh)
        self.assertEqual(state['target'],{'pid':2,'generation':'new'})
        for key in ('sample','evidence','cursor'):self.assertNotIn(key,state)

    def test_ambiguous_or_other_miner_not_adopted(self):
        from unittest.mock import MagicMock
        identity={'commandHash':'iota'}
        for count,other in ((2,False),(1,True)):
            candidates=[]
            for pid in range(2,2+count):
                p=MagicMock();p.name=str(pid);candidates.append(p)
            def process(pid):
                if pid==1:raise ProcessLookupError()
                return {'start':'new'}
            state={'identity':identity}
            with patch.object(a,'proc',side_effect=process),patch.object(a,'process_identity',return_value={'commandHash':'bnt'} if other else identity),patch.object(a.Path,'iterdir',return_value=iter(candidates)):
                self.assertIsNone(a.resolve_process({'pid':1,'generation':'old','log':'log'},state))
            self.assertNotIn('target',state)

    def test_forked_children_do_not_make_root_ambiguous(self):
        from unittest.mock import MagicMock
        identity={'commandHash':'iota'}
        candidates=[]
        for pid in (2,3):
            p=MagicMock();p.name=str(pid);candidates.append(p)
        def process(pid):
            if pid==1:raise ProcessLookupError()
            return {'start':str(pid),'parent':1 if pid==2 else 2}
        state={'identity':identity}
        with patch.object(a,'proc',side_effect=process),patch.object(a,'process_identity',return_value=identity),patch.object(a.Path,'iterdir',return_value=iter(candidates)):
            self.assertIsNotNone(a.resolve_process({'pid':1,'generation':'old','log':'log'},state))
        self.assertEqual(state['target']['pid'],2)

    def test_orphaned_old_worker_is_not_a_restart(self):
        from unittest.mock import MagicMock
        p=MagicMock();p.name='2'
        def process(pid):
            if pid==1:raise ProcessLookupError()
            return {'start':'2','started':10,'parent':1}
        state={'identity':{'commandHash':'iota'},'lastAlive':100}
        with patch.object(a,'proc',side_effect=process),patch.object(a.Path,'iterdir',return_value=iter([p])):
            self.assertIsNone(a.resolve_process({'pid':1,'generation':'old','log':'log'},state))

    def test_existing_config_learns_identity(self):
        state={};identity={'commandHash':'iota'}
        with patch.object(a,'proc',return_value={'start':'same'}),patch.object(a,'process_identity',return_value=identity):
            self.assertIsNotNone(a.resolve_process({'pid':1,'generation':'same','log':'log'},state))
        self.assertEqual(state['identity'],identity)
        self.assertEqual(state['target']['pid'],1)

    def test_persisted_new_target_survives_monitor_restart(self):
        state={'target':{'pid':2,'generation':'new'},'identity':{'commandHash':'iota'}}
        with patch.object(a,'proc',return_value={'start':'new'}) as proc,patch.object(a,'process_identity',return_value=state['identity']):
            self.assertIsNotNone(a.resolve_process({'pid':1,'generation':'old','log':'log'},state))
        proc.assert_called_once_with(2)

    def test_exit_clears_samples(self):
        state={'sample':{'at':1,'ticks':999},'cursor':{'offset':99},'evidence':{'queue':{}}}
        with patch.object(a,'resolve_process',return_value=None),patch.object(a,'gpus',return_value=[]):
            self.assertFalse(a.snapshot({},state,100)['workerRunning'])
        self.assertEqual(state,{})

    def test_no_gpu_tool(self):
        with patch.object(a.subprocess,'run',side_effect=FileNotFoundError):
            self.assertEqual(a.gpus(1),[])

if __name__=='__main__':unittest.main()
