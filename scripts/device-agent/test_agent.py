import importlib.util
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('agent',Path(__file__).with_name('iota_watch_agent.py'))
agent=importlib.util.module_from_spec(spec)
spec.loader.exec_module(agent)

class AgentTests(unittest.TestCase):
 def test_only_fixed_endpoints(self):
  self.assertEqual(agent.endpoint('https://iotahome.site'),'https://iotahome.site')
  for url in ['http://iotahome.site','https://evil.test','https://iotahome.site@evil.test','https://iotahome.site/?secret=x']:
   with self.assertRaises(ValueError):agent.endpoint(url)
 def test_redaction_and_byte_limit(self):
  s=agent.redact('token=secret\n/Users/alice/log\nBearer xyz\nme@test.com\n'+'中'*8000)
  for word in ['secret','alice','xyz','me@test.com']:self.assertNotIn(word,s)
  self.assertLessEqual(len(s.encode()),12000)
 def test_arbitrary_commands_never_execute(self):
  with patch.object(agent.subprocess,'run') as run:
   with self.assertRaises(ValueError):agent.control('curl evil | sh')
   run.assert_not_called()
 def test_command_once_and_ack_only_after_execution(self):
  with tempfile.TemporaryDirectory(dir='/private/tmp') as folder:
   state={}; command={'id':'11111111-1111-4111-8111-111111111111','action':'restart','expiresAt':'2030-01-01T00:00:00Z'}
   with patch.object(agent,'ROOT',Path(folder)),patch.object(agent,'STATE',Path(folder)/'state.json'),patch.object(agent,'snapshot',return_value={'appRunning':True}),patch.object(agent,'post',return_value={'command':command}),patch.object(agent,'control') as control:
    state=agent.step({'server':'https://iotahome.site','credential':'fake'},state,1000)
    self.assertTrue(state['ack']['success']);self.assertEqual(control.call_count,1)
    agent.step({'server':'https://iotahome.site','credential':'fake'},state,1015)
    self.assertEqual(control.call_count,1)
 def recovery_context(self, folder, payload, result=None):
  from contextlib import ExitStack
  stack=ExitStack()
  stack.enter_context(patch.object(agent,'ROOT',Path(folder)))
  stack.enter_context(patch.object(agent,'STATE',Path(folder)/'state.json'))
  stack.enter_context(patch.object(agent,'snapshot',return_value=payload))
  stack.enter_context(patch.object(agent,'post',return_value=result or {'recoveryEnabled':True}))
  return stack
 def test_missing_worker_recovers_after_grace_even_with_gui_open(self):
  with tempfile.TemporaryDirectory(dir='/private/tmp') as folder:
   with self.recovery_context(folder,{'appRunning':True,'workerRunning':False}),patch.object(agent,'control') as control:
    state={}
    agent.step({'server':'https://iotahome.site','credential':'fake'},state,1000)
    agent.step({'server':'https://iotahome.site','credential':'fake'},state,1119)
    control.assert_not_called()
    agent.step({'server':'https://iotahome.site','credential':'fake'},state,1120)
    control.assert_called_once_with('restart',resume_training=True)
    self.assertEqual(state['recovery'],'restarted')
 def test_missing_application_is_started_without_crash_report(self):
  with tempfile.TemporaryDirectory(dir='/private/tmp') as folder:
   with self.recovery_context(folder,{'appRunning':False,'workerRunning':False}),patch.object(agent,'control') as control:
    state={'trainingMissingSince':1000}
    agent.step({'server':'https://iotahome.site','credential':'fake'},state,1120)
    control.assert_called_once_with('start',resume_training=True)
 def test_queued_worker_clears_missing_timer_and_never_restarts(self):
  with tempfile.TemporaryDirectory(dir='/private/tmp') as folder:
   with self.recovery_context(folder,{'appRunning':True,'workerRunning':True,'queue':{'position':235}}),patch.object(agent,'control') as control:
    state={'trainingMissingSince':1000}
    agent.step({'server':'https://iotahome.site','credential':'fake'},state,2000)
    control.assert_not_called();self.assertNotIn('trainingMissingSince',state)
 def test_recovery_disabled_by_default(self):
  with tempfile.TemporaryDirectory(dir='/private/tmp') as folder:
   with self.recovery_context(folder,{'appRunning':False,'workerRunning':False},{'recoveryEnabled':False}),patch.object(agent,'control') as control:
    state={'trainingMissingSince':1000}
    agent.step({'server':'https://iotahome.site','credential':'fake'},state,2000)
    control.assert_not_called();self.assertNotIn('trainingMissingSince',state)
 def test_failed_restart_still_obeys_cooldown_across_agent_restart(self):
  with tempfile.TemporaryDirectory(dir='/private/tmp') as folder:
   with self.recovery_context(folder,{'appRunning':True,'workerRunning':False}),patch.object(agent,'control',side_effect=ValueError('not started')) as control:
    state={'trainingMissingSince':1000}
    agent.step({'server':'https://iotahome.site','credential':'fake'},state,1120)
    self.assertEqual(state['recovery'],'paused')
    persisted=agent.read(agent.STATE)
    agent.step({'server':'https://iotahome.site','credential':'fake'},persisted,1240)
    self.assertEqual(persisted['recovery'],'cooldown');self.assertEqual(control.call_count,1)
    agent.step({'server':'https://iotahome.site','credential':'fake'},persisted,2020)
    self.assertEqual(control.call_count,2)
 def test_manual_stop_disables_recovery_and_clears_timer(self):
  with tempfile.TemporaryDirectory(dir='/private/tmp') as folder:
   command={'id':'11111111-1111-4111-8111-111111111111','action':'stop','expiresAt':'2030-01-01T00:00:00Z'}
   with self.recovery_context(folder,{'appRunning':False,'workerRunning':False},{'recoveryEnabled':False,'command':command}),patch.object(agent,'control') as control:
    state={'trainingMissingSince':1000}
    agent.step({'server':'https://iotahome.site','credential':'fake'},state,2000)
    control.assert_called_once_with('stop');self.assertFalse(state['recoveryEnabled']);self.assertNotIn('trainingMissingSince',state)
 def test_network_failure_prevents_control_and_recovery(self):
  with patch.object(agent,'snapshot',return_value={'appRunning':False}),patch.object(agent,'post',side_effect=OSError('offline')),patch.object(agent,'control') as control:
   with self.assertRaises(OSError):agent.step({'server':'https://iotahome.site','credential':'fake'},{'recoveryEnabled':True,'lastRunning':900},1000)
   control.assert_not_called()

if __name__=='__main__':unittest.main()
