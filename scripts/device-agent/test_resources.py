import unittest
from unittest.mock import patch
from test_agent import agent

class ResourceTests(unittest.TestCase):
    def collect(self, text):
        with patch.object(agent.subprocess, 'check_output', return_value=text), patch.object(agent.os, 'getpid', return_value=99):
            return agent.training_resources()

    def test_training_tree_excludes_gui_agent_and_other_apps(self):
        text = f'''10 1 10 102400 {agent.EXEC}
11 10 20 102400 /Applications/IOTA Train at Home.app/Contents/Frameworks/Helper
12 10 1 1024 main_pool:ai.macrocosmos.iota.tah.worker
13 12 2 2048 main_pool:ai.macrocosmos.iota.tah.worker
14 13 300 3072 {agent.WORKER}
15 14 100 4096 /usr/bin/python3
99 1 50 999999 /usr/bin/python3
20 1 80 999999 main_pool:ai.macrocosmos.iota.tah.worker
'''
        self.assertEqual(self.collect(text), (403, 10))

    def test_no_worker_is_unknown_not_gui_usage(self):
        self.assertEqual(self.collect(f'10 1 0.8 338944 {agent.EXEC}'), (None, None))

    def test_direct_worker_root_and_idle_values(self):
        self.assertEqual(self.collect(f'14 1 0 1024 {agent.WORKER}'), (0, 1))

    def test_malformed_and_parent_cycle_do_not_hang(self):
        self.assertEqual(self.collect('broken\n4 5 0 1 main_pool:ai.macrocosmos.iota.tah.worker\n5 4 0 1 python'), (None, None))
