import datetime
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from test_agent import agent


class ReportingTests(unittest.TestCase):
    now = datetime.datetime(2026, 11, 14, 12).timestamp()

    def line(self, message, seconds=-30):
        stamp = datetime.datetime.fromtimestamp(self.now + seconds).strftime('%Y-%m-%d %H:%M:%S.%f')
        return '[' + stamp + '] ' + message

    def reason(self, text, started=None):
        return agent.parse_agent_reason(text, self.now, started or self.now-200)

    def test_specific_causes_are_structured_without_log_content(self):
        cases = {
            'Error registering miner: private': 'registration_failed',
            'EntityNotRegisteredError private': 'registration_expired',
            'kicked during active work private': 'kicked',
            'Resetting miner entire state!': 'resetting',
            '/miner/heartbeat NameResolutionError private': 'api_dns',
            '/miner/heartbeat ReadTimeout private': 'api_unreachable',
            "Successfully completed request to /miner/register; response: {'status': 'confirmed'}": 'registration_pending',
        }
        for message, code in cases.items():
            value = self.reason(self.line(message))
            self.assertEqual(value['code'], code)
            self.assertEqual(set(value), {'code', 'observedAt'})
            self.assertNotIn('private', str(value))

    def test_new_success_clears_old_failure_and_old_generations_are_ignored(self):
        failure = self.line('Error registering miner: failed', -60)
        success = self.line("Successfully completed request to /miner/heartbeat; response: {'status': 'queued'}")
        self.assertIsNone(self.reason(success+'\n'+failure))
        self.assertIsNone(self.reason(failure, self.now-40))
        self.assertIsNone(self.reason(self.line('Error registering miner: old', -301)))
        self.assertIsNone(self.reason(self.line('Error registering miner: future', 1)))

    def test_repeated_resets_require_three_recent_events(self):
        text = '\n'.join(self.line('Resetting miner entire state!', offset) for offset in [-110,-80,-20])
        self.assertEqual(self.reason(text)['code'], 'reset_loop')
        text = self.line('Resetting miner entire state!', -180)+'\n'+self.line('Resetting miner entire state!', -20)
        self.assertEqual(self.reason(text)['code'], 'resetting')

    def test_idle_probe_skips_collection_and_active_probe_wakes_it(self):
        config = {'server': 'https://iotahome.site', 'credential': 'fake'}
        with patch.object(agent, 'post', return_value={'active': False}) as post:
            self.assertFalse(agent.reporting_due(config, {'reportInterval':60}, 1060, 1010))
            post.assert_called_once_with(config['server'], '/api/device-agent/probe', {}, 'fake')
            self.assertTrue(agent.reporting_due(config, {}, 1060, 1060))
            self.assertEqual(post.call_count, 1)
        with patch.object(agent, 'post', return_value={'active': True}):
            self.assertTrue(agent.reporting_due(config, {}, 1060, 1010))
        with patch.object(agent, 'post', return_value=[]):
            self.assertFalse(agent.reporting_due(config, {'reportInterval':60}, 1060, 1010))
            self.assertTrue(agent.reporting_due(config, {'reportInterval':60}, 1060, 1020))

    def test_automation_keeps_fast_lease_renewal(self):
        for response, expected in [({'interval':60},60), ({'interval':10},10), ({'interval':999},15),
                                   ({'interval':60,'idleBnt':{'lease':True}},10),
                                   ({'interval':60,'idleXds':{'lease':True}},10),
                                   ({'interval':60,'recoveryEnabled':True},10)]:
            with tempfile.TemporaryDirectory(dir='/private/tmp') as folder:
                with patch.object(agent,'ROOT',Path(folder)), patch.object(agent,'STATE',Path(folder)/'state.json'), patch.object(agent,'snapshot',return_value={}), patch.object(agent,'post',return_value=response) as post:
                    state=agent.step({'server':'https://iotahome.site','credential':'fake'}, {}, 1000)
                    self.assertEqual(state['reportInterval'],expected)
                    self.assertTrue(post.call_args.args[2]['adaptive'])
