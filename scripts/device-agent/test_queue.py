import datetime
import unittest
from test_agent import agent

class QueueTests(unittest.TestCase):
    def test_official_position_and_expiry(self):
        now = datetime.datetime(2026, 10, 14, 12).timestamp()
        line = "[2026-10-14 11:59:00.000] Successfully completed request to /miner/register/status/example; response: {'status': 'queued', 'position': 85, 'poll_afte"
        self.assertEqual(agent.parse_queue(line, now, now-120)['position'], 85)
        self.assertIsNone(agent.parse_queue(line, now+301, now-120))
        self.assertIsNone(agent.parse_queue(line, now, now-30))
        self.assertIsNone(agent.parse_queue(line.replace('queued', 'admitted'), now, now-120))
        self.assertIsNone(agent.parse_queue(line.replace("85", "null"), now, now-120))
        self.assertIsNone(agent.parse_queue(line.replace('11:59', '12:01'), now, now-120))
    def test_later_response_clears_queue(self):
        now = datetime.datetime(2026, 10, 14, 12).timestamp()
        line = "[2026-10-14 11:59:00.000] /miner/register/status/example; response: {'status': 'queued', 'position': 10}"
        admitted = line.replace('11:59:00', '11:59:30').replace('queued', 'admitted')
        self.assertIsNone(agent.parse_queue(line+'\n'+admitted, now, now-120))
    def test_no_worker_does_not_read_logs(self):
        self.assertIsNone(agent.queue_status([]))
