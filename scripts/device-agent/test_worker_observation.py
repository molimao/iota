import datetime
import unittest
from unittest.mock import patch
from test_agent import agent

TITLE = 'main_pool:ai.macrocosmos.iota.tah.worker'


def table(*lines):
    return '\n'.join(lines) + '\n'


class WorkerObservationTests(unittest.TestCase):
    def roots(self, text):
        return agent.trusted_training_roots(agent.parse_process_table(text))

    def test_renamed_worker_under_gui_is_recognized_at_zero_cpu(self):
        text = table(
            f'10 1 0 1024 {agent.EXEC}',
            f'12 10 0 2048 {TITLE}',
        )
        self.assertEqual(self.roots(text), [12])

    def test_same_title_orphan_is_not_a_worker(self):
        text = table(
            f'10 1 0 1024 {agent.EXEC}',
            f'20 1 90 999999 {TITLE}',
        )
        self.assertEqual(self.roots(text), [])

    def test_unrelated_gui_helper_is_not_a_worker(self):
        text = table(
            f'10 1 0 1024 {agent.EXEC}',
            '11 10 95 4096 /Applications/IOTA Train at Home.app/Contents/Frameworks/Helper',
            '16 10 40 512 worker',
            '17 11 10 256 main_pool',
        )
        self.assertEqual(self.roots(text), [])

    def test_original_worker_path_is_still_recognized(self):
        text = table(f'14 1 0 1024 {agent.WORKER}')
        self.assertEqual(self.roots(text), [14])

    def test_fixed_worker_snapshot_does_not_consult_the_host_again(self):
        rows = [(1, 0, 0, agent.EXEC), (14, 0, 1024, agent.WORKER)]
        with patch.object(agent, 'processes', return_value=rows), \
             patch.object(agent, 'training_resources', return_value=(0, 1)), \
             patch.object(agent, 'observed_training_workers', side_effect=AssertionError('unexpected host read')), \
             patch.object(agent, 'local_training_status', return_value=(None, None)), \
             patch.object(agent, 'crashed_training', return_value=False):
            self.assertTrue(agent.snapshot()['workerRunning'])

    def test_renamed_descendant_requires_verified_ancestry_and_cycles_stop(self):
        text = table(
            f'10 1 0 1 {agent.EXEC}',
            '11 10 5 1 /bin/helper',
            f'12 11 0 1 {TITLE}',
            '4 5 0 1 ' + TITLE,
            '5 4 0 1 python',
        )
        self.assertEqual(self.roots(text), [12])

    def test_snapshot_uses_renamed_worker_pid_for_queue_and_state(self):
        observed = table(
            f'10 1 1 1024 {agent.EXEC}',
            f'12 10 0 76800 {TITLE}',
        )
        fixed = f'10 0.1 1024 {agent.EXEC}\n'
        stamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S.000')
        log = (
            f"[{stamp}] Successfully completed request to /miner/register/status/; response: {{'status': 'queued', 'position': 7}}\n"
            f"[{stamp}] Successfully completed request to /miner/heartbeat; response: {{'phase': 'training', 'status': 'forward'}}\n"
        )
        calls = []

        def check_output(cmd, *args, **kwargs):
            calls.append(list(cmd))
            if list(cmd[:2]) == ['/bin/ps', '-p']:
                return '00:05'
            if list(cmd[:2]) == ['/bin/ps', '-axo'] and 'ppid=' in cmd[2]:
                return observed
            if list(cmd[:2]) == ['/bin/ps', '-axo']:
                return fixed
            raise AssertionError(cmd)

        with patch.object(agent.subprocess, 'check_output', side_effect=check_output), \
             patch.object(agent, 'crashed_training', return_value=False), \
             patch.object(agent.Path, 'home', return_value=agent.Path('/private/tmp/iota-no-such-home')):
            # logs are absent; PID selection is still observable from ps -p
            snap = agent.snapshot()
        self.assertTrue(snap['workerRunning'])
        self.assertTrue(snap['appRunning'])
        self.assertIn(['/bin/ps', '-p', '12', '-o', 'etime='], calls)
        self.assertIsNone(snap['queue'])
        self.assertIsNone(snap['trainingState'])
        # A readable official log for that same PID supplies queue and state.
        with patch.object(agent.subprocess, 'check_output', side_effect=check_output), \
             patch.object(agent, 'crashed_training', return_value=False), \
             patch.object(agent.Path, 'home') as home:
            import tempfile
            from pathlib import Path
            with tempfile.TemporaryDirectory(dir='/private/tmp') as folder:
                home.return_value = Path(folder)
                logs = Path(folder) / 'Library/Logs/IOTA Train at Home'
                logs.mkdir(parents=True)
                (logs / 'tah-cli.log').write_text(log)
                calls.clear()
                snap = agent.snapshot()
        self.assertTrue(snap['workerRunning'])
        self.assertEqual(snap['queue']['position'], 7)
        self.assertEqual(snap['trainingState']['phase'], 'training')
        self.assertEqual(snap['trainingState']['status'], 'forward')
        self.assertIn(['/bin/ps', '-p', '12', '-o', 'etime='], calls)

    def test_confirmed_crash_still_overrides_observed_worker(self):
        with patch.object(agent, 'processes', return_value=[(1, 0, 0, agent.EXEC)]), \
             patch.object(agent, 'training_resources', return_value=(0, 75)), \
             patch.object(agent, 'observed_training_workers', return_value=[(12, 0, 76800, TITLE)]), \
             patch.object(agent, 'local_training_status', return_value=({'position': 7}, {'phase': 'training', 'status': 'forward'})), \
             patch.object(agent, 'crashed_training', return_value=True) as crashed:
            snap = agent.snapshot()
        crashed.assert_called_once()
        rows = crashed.call_args[0][0]
        self.assertIn(agent.EXEC, [row[3] for row in rows])
        self.assertTrue(snap['appRunning'])
        self.assertFalse(snap['workerRunning'])
        self.assertIsNone(snap['queue'])
        self.assertIsNone(snap['trainingState'])
