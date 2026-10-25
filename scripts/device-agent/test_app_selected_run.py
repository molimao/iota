import json
import unittest
import tempfile
from unittest import mock
from test_agent import agent

class AppSelectedRunTests(unittest.TestCase):
    def setUp(self):
        agent._APP_RUN_CACHE = {'generation': None, 'value': None, 'files': {}}

    now = 1792929000
    header = '{"constants":{"timeTickOffset":1792000000000},'
    def event(self, age=5, url=None):
        return json.dumps({'time':str((self.now-age)*1000-1792000000000),'params':{'url':url or 'https://iota-web.api.macrocosmos.ai/mainnet/phase_snapshots?run_id=4.13.7.11-tah'}})+','
    def test_current_selection_and_privacy(self):
        value=agent.parse_app_selected_run(self.header,self.event(),self.now,self.now-3600)
        self.assertEqual(value['id'],'4.13.7.11-tah')
        self.assertEqual(set(value),{'id','observedAt'})
    def test_rejects_expired_future_wrong_origin_and_ambiguous(self):
        for text in [self.event(3601),self.event(-1),self.event(url='https://evil.test/mainnet/phase_snapshots?run_id=x'),self.event(url='https://iota-web.api.macrocosmos.ai/mainnet/phase_snapshots?run_id=x&run_id=y')]:
            self.assertIsNone(agent.parse_app_selected_run(self.header,text,self.now,self.now-3600))
        self.assertIsNone(agent.parse_app_selected_run('{}','bad',self.now,self.now-3600))
    def test_latest_observation_wins(self):
        old=self.event(20).replace('7.11-tah','7.10-tah')
        self.assertEqual(agent.parse_app_selected_run(self.header,self.event()+ '\n'+old,self.now,self.now-3600)['id'],'4.13.7.11-tah')

    def test_selection_is_not_lost_after_90_seconds(self):
        value=agent.parse_app_selected_run(self.header,self.event(133),self.now,self.now-3600)
        self.assertEqual(value['id'],'4.13.7.11-tah')

    def test_reader_finds_record_outside_old_tail_and_rejects_previous_launch(self):
        with tempfile.TemporaryDirectory() as tmp:
            folder=agent.Path(tmp)/'Library/Logs/IOTA Train at Home'
            folder.mkdir(parents=True)
            file=folder/'2026-10-25-netlog.log'
            # Current selection followed by unrelated network noise, over 512 KB.
            file.write_text(self.header+'\n'+self.event(133)+'\n'+('{"unrelated":"'+ 'x'*2000 +'"},\n')*6000)
            rows=[(123,0,0,agent.EXEC)]
            with mock.patch.object(agent.Path,'home',return_value=agent.Path(tmp)),mock.patch.object(agent,'process_started',return_value=self.now-3600):
                self.assertEqual(agent.app_selected_run(rows,self.now)['id'],'4.13.7.11-tah')
            with mock.patch.object(agent.Path,'home',return_value=agent.Path(tmp)),mock.patch.object(agent,'process_started',return_value=self.now-30):
                self.assertIsNone(agent.app_selected_run(rows,self.now))
            self.assertIsNone(agent.app_selected_run([],self.now))

    def test_incremental_read_updates_selection_and_reassembles_partial_event(self):
        with tempfile.TemporaryDirectory() as tmp:
            folder=agent.Path(tmp)/'Library/Logs/IOTA Train at Home';folder.mkdir(parents=True)
            file=folder/'2026-10-25-netlog.log'
            file.write_text(self.header+'\n'+self.event(133)+'\n')
            rows=[(123,0,0,agent.EXEC)]
            with mock.patch.object(agent.Path,'home',return_value=agent.Path(tmp)),mock.patch.object(agent,'process_started',return_value=self.now-7200):
                first=agent.app_selected_run(rows,self.now)
                self.assertEqual(first['id'],'4.13.7.11-tah')
                # Old selection survives lack of new chart polling.
                self.assertEqual(agent.app_selected_run(rows,self.now+400),first)
                next_event=self.event(1).replace('7.11-tah','7.12-tah')
                with file.open('a') as h: h.write(next_event[:30])
                self.assertEqual(agent.app_selected_run(rows,self.now),first)
                with file.open('a') as h: h.write(next_event[30:]+'\n')
                self.assertEqual(agent.app_selected_run(rows,self.now)['id'],'4.13.7.12-tah')
                # Same log must not survive a new GUI launch.
                with mock.patch.object(agent,'process_started',return_value=self.now):
                    self.assertIsNone(agent.app_selected_run([(456,0,0,agent.EXEC)],self.now))
