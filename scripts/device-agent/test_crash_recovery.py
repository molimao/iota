import datetime
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from test_agent import agent

class CrashRecoveryTests(unittest.TestCase):
    now = datetime.datetime(2026, 10, 17, 12).timestamp()
    crash = '[2026-10-17 11:59:00.000] Training process exited with code=null, signal=SIGABRT'
    progress = "[2026-10-17 11:59:30.000] Successfully completed request to /miner/heartbeat; response: {'phase': 'training', 'status': 'idle'}"

    def report(self, path=None, signal='SIGABRT', at=None):
        return json.dumps({'timestamp': datetime.datetime.fromtimestamp(at or self.now-60).astimezone().isoformat()})+'\n'+json.dumps({'procPath': path or agent.WORKER, 'exception': {'signal': signal}})

    def test_explicit_exit_not_panic_warning_idle_or_gui_label(self):
        self.assertEqual(agent.log_crash_evidence(self.crash, self.now-120, self.now), (self.now-60, None))
        for text in ['thread panicked: PoisonError missing local CID state for path=0', 'GPU memory high', 'TRAINING', "status: 'idle'", 'Training process exited with code=0, signal=null']:
            line='[2026-10-17 11:59:00.000] '+text
            self.assertEqual(agent.log_crash_evidence(line,self.now-120,self.now),(None,None))

    def test_old_and_future_exits_rejected_and_order_independent(self):
        for start, now in [(self.now-30,self.now),(self.now-120,self.now-90)]:
            self.assertEqual(agent.log_crash_evidence(self.crash,start,now),(None,None))
        c,p=agent.log_crash_evidence(self.progress+'\n'+self.crash,self.now-120,self.now)
        self.assertGreater(p,c)

    def test_macos_report_strict_application_path_signal_and_launch_window(self):
        self.assertEqual(agent.diagnostic_crash_at(self.report(),self.now-120,self.now),self.now-60)
        for text in [self.report('/tmp/other/main_pool'),self.report(signal='SIGTERM'),'{}','malformed',self.report(at=self.now+60)]:
            self.assertIsNone(agent.diagnostic_crash_at(text,self.now-120,self.now))
        self.assertIsNone(agent.diagnostic_crash_at(self.report(),self.now-30,self.now))

    def test_surviving_process_is_not_healthy_after_confirmed_crash(self):
        with tempfile.TemporaryDirectory(dir='/private/tmp') as folder:
            home=Path(folder);logs=home/'Library/Logs/IOTA Train at Home';logs.mkdir(parents=True)
            path=logs/'2026-10-17-main.log';path.write_text(self.crash)
            rows=[(1,0,0,agent.EXEC),(2,0,0,agent.WORKER)]
            with patch.object(agent.Path,'home',return_value=home),patch.object(agent,'process_started',return_value=self.now-120):
                self.assertTrue(agent.crashed_training(rows,self.now))
                path.write_text(self.crash+'\n'+self.progress)
                self.assertFalse(agent.crashed_training(rows,self.now))
                path.write_text(self.crash+'\n'+self.progress.replace('/miner/heartbeat', '/miner/register/status/example').replace("'phase': 'training', 'status': 'idle'", "'status': 'queued', 'position': 123"))
                self.assertFalse(agent.crashed_training(rows,self.now))
                path.write_text('')
                reports=home/'Library/Logs/DiagnosticReports';reports.mkdir()
                (reports/'main_pool-test.ips').write_text(self.report())
                self.assertTrue(agent.crashed_training(rows,self.now))
                with patch.object(agent,'process_started',return_value=self.now-30):
                    self.assertFalse(agent.crashed_training(rows,self.now))

    def test_missing_evidence_and_unreadable_logs_do_not_invent_a_crash(self):
        with patch.object(agent,'process_started',side_effect=OSError('unavailable')):
            self.assertFalse(agent.crashed_training([(1,0,0,agent.EXEC)],self.now))
        self.assertFalse(agent.crashed_training([],self.now))

    def test_snapshot_clears_stale_training_after_crash_even_with_residual_worker(self):
        with patch.object(agent,'processes',return_value=[(1,0,0,agent.EXEC),(2,0,0,agent.WORKER)]),patch.object(agent,'training_resources',return_value=(0,42)),patch.object(agent,'local_training_status',return_value=({'position':5},None)),patch.object(agent,'crashed_training',return_value=True):
            snap=agent.snapshot()
            self.assertTrue(snap['appRunning']);self.assertFalse(snap['workerRunning'])
            self.assertIsNone(snap['queue']);self.assertNotIn('logs',snap)

    def test_confirmed_crash_recovers_but_respects_grace_disabled_and_cooldown(self):
        with tempfile.TemporaryDirectory(dir='/private/tmp') as folder:
            with patch.object(agent,'ROOT',Path(folder)),patch.object(agent,'STATE',Path(folder)/'state.json'),patch.object(agent,'snapshot',return_value={'appRunning':True,'workerRunning':False}),patch.object(agent,'post',return_value={'recoveryEnabled':True}),patch.object(agent,'control') as control:
                state={}
                for at in [1000,1119]:agent.step({'server':'https://iotahome.site','credential':'fake'},state,at)
                control.assert_not_called()
                agent.step({'server':'https://iotahome.site','credential':'fake'},state,1120)
                control.assert_called_once_with('restart',resume_training=True)
                agent.step({'server':'https://iotahome.site','credential':'fake'},state,1240)
                self.assertEqual(control.call_count,1)
                with patch.object(agent,'post',return_value={'recoveryEnabled':False}):
                    agent.step({'server':'https://iotahome.site','credential':'fake'},state,3000)
                self.assertEqual(control.call_count,1)

    def test_stubborn_allowlisted_residual_is_killed_only_after_term_timeout(self):
        rows=[(123,0,0,agent.WORKER)]
        with patch.object(agent.Path,'is_dir',return_value=True),patch.object(agent,'processes',side_effect=[rows]*6+[[],[]]),patch.object(agent.time,'monotonic',side_effect=[0,9,10]),patch.object(agent.os,'kill') as kill:
            agent.control('stop')
            self.assertEqual(kill.call_args_list, [unittest.mock.call(123,agent.signal.SIGTERM),unittest.mock.call(123,agent.signal.SIGKILL)])

    def test_missing_gui_with_orphan_worker_is_cleaned_before_restart(self):
        with tempfile.TemporaryDirectory(dir='/private/tmp') as folder:
            with patch.object(agent,'ROOT',Path(folder)),patch.object(agent,'STATE',Path(folder)/'state.json'),patch.object(agent,'snapshot',return_value={'appRunning':False,'workerRunning':True}),patch.object(agent,'post',return_value={'recoveryEnabled':True}),patch.object(agent,'control') as control:
                agent.step({'server':'https://iotahome.site','credential':'fake'},{'trainingMissingSince':1000},1120)
                control.assert_called_once_with('restart',resume_training=True)

if __name__=='__main__':unittest.main()
