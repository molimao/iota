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
    def test_no_gpu_tool(self):
        with patch.object(a.subprocess,'run',side_effect=FileNotFoundError):
            self.assertEqual(a.gpus(1),[])

if __name__=='__main__':unittest.main()
