import datetime
import unittest
from test_agent import agent

class TrainingStateTests(unittest.TestCase):
    now = datetime.datetime(2026, 10, 17, 12).timestamp()
    line = "[2026-10-17 11:59:00.000] Successfully completed request to /miner/heartbeat; response: {'phase': 'training', 'status': 'idle'}"

    def test_only_allowlisted_successful_current_worker_evidence(self):
        result = agent.parse_training_state(self.line, self.now, self.now-120)
        self.assertEqual(result['status'], 'idle')
        self.assertEqual(set(result), {'phase', 'status', 'observedAt'})
        for line, now, started in [
            (self.line.replace('Successfully completed', 'Error completing'), self.now, self.now-120),
            (self.line.replace('/miner/heartbeat', '/miner/heartbeat_bad'), self.now, self.now-120),
            (self.line.replace('idle', 'unrecognized'), self.now, self.now-120),
            (self.line, self.now+301, self.now-120),
            (self.line, self.now-61, self.now-120),
            (self.line, self.now, self.now-30),
        ]:
            self.assertIsNone(agent.parse_training_state(line, now, started))

    def test_later_unknown_clears_earlier_and_file_order_cannot_restore_it(self):
        later = self.line.replace('11:59:00', '11:59:30').replace("'idle'", "'future_status'")
        self.assertIsNone(agent.parse_training_state(later+'\n'+self.line, self.now, self.now-120))
        truncated = self.line.replace("'idle'}", "'id")
        self.assertIsNone(agent.parse_training_state(truncated, self.now, self.now-120))

    def test_phase_and_status_are_independent_and_no_secrets_leave_parser(self):
        line=self.line.replace('training', 'weights_uploading').replace('idle', 'initializing')
        self.assertEqual(agent.parse_training_state(line, self.now, self.now-120)['status'], 'initializing')
        value=agent.parse_training_state(self.line[:-1]+", 'secret': 'private'}", self.now, self.now-120)
        self.assertNotIn('secret', str(value))
        self.assertEqual(agent.local_training_status([]), (None,None))
