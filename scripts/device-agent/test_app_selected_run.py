import json
import unittest
from test_agent import agent

class AppSelectedRunTests(unittest.TestCase):
    now = 1792929000
    header = '{"constants":{"timeTickOffset":1792000000000},'
    def event(self, age=5, url=None):
        return json.dumps({'time':str((self.now-age)*1000-1792000000000),'params':{'url':url or 'https://iota-web.api.macrocosmos.ai/mainnet/phase_snapshots?run_id=4.13.7.11-tah'}})+','
    def test_current_selection_and_privacy(self):
        value=agent.parse_app_selected_run(self.header,self.event(),self.now)
        self.assertEqual(value['id'],'4.13.7.11-tah')
        self.assertEqual(set(value),{'id','observedAt'})
    def test_rejects_expired_future_wrong_origin_and_ambiguous(self):
        for text in [self.event(91),self.event(-1),self.event(url='https://evil.test/mainnet/phase_snapshots?run_id=x'),self.event(url='https://iota-web.api.macrocosmos.ai/mainnet/phase_snapshots?run_id=x&run_id=y')]:
            self.assertIsNone(agent.parse_app_selected_run(self.header,text,self.now))
        self.assertIsNone(agent.parse_app_selected_run('{}','bad',self.now))
    def test_latest_observation_wins(self):
        old=self.event(20).replace('7.11-tah','7.10-tah')
        self.assertEqual(agent.parse_app_selected_run(self.header,self.event()+ '\n'+old,self.now)['id'],'4.13.7.11-tah')
