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
 def test_crash_recovery_requires_report_and_respects_cooldown(self):
  with tempfile.TemporaryDirectory(dir='/private/tmp') as folder:
   with patch.object(agent,'ROOT',Path(folder)),patch.object(agent,'STATE',Path(folder)/'state.json'),patch.object(agent,'snapshot',return_value={'appRunning':False}),patch.object(agent,'post',return_value={'recoveryEnabled':True}),patch.object(agent,'crashed_since',return_value=False),patch.object(agent,'control') as control:
    agent.step({'server':'https://iotahome.site','credential':'fake'},{'lastRunning':900},1000);control.assert_not_called()
   with patch.object(agent,'ROOT',Path(folder)),patch.object(agent,'STATE',Path(folder)/'state.json'),patch.object(agent,'snapshot',return_value={'appRunning':False}),patch.object(agent,'post',return_value={'recoveryEnabled':True}),patch.object(agent,'crashed_since',return_value=True),patch.object(agent,'control') as control:
    agent.step({'server':'https://iotahome.site','credential':'fake'},{'lastRunning':900,'lastRestart':950},1000);control.assert_not_called()
    agent.step({'server':'https://iotahome.site','credential':'fake'},{'lastRunning':900,'lastRestart':0},1000);control.assert_called_once_with('start')
 def test_network_failure_prevents_control_and_recovery(self):
  with patch.object(agent,'snapshot',return_value={'appRunning':False}),patch.object(agent,'post',side_effect=OSError('offline')),patch.object(agent,'control') as control:
   with self.assertRaises(OSError):agent.step({'server':'https://iotahome.site','credential':'fake'},{'recoveryEnabled':True,'lastRunning':900},1000)
   control.assert_not_called()

if __name__=='__main__':unittest.main()
