"""Exercise installation on isolated paths; launchctl and pairing are simulated."""
import contextlib
import importlib.util
import plistlib
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('agent', Path(__file__).with_name('iota_watch_agent.py'))
agent = importlib.util.module_from_spec(spec)
spec.loader.exec_module(agent)

class InstallTests(unittest.TestCase):
    def setUp(self):
        self.stack = contextlib.ExitStack()
        self.addCleanup(self.stack.close)
        self.root = Path(self.stack.enter_context(tempfile.TemporaryDirectory()))
        self.app = self.root / 'IOTA Train at Home.app'
        self.app.mkdir()
        self.config = self.root / 'agent/config.json'
        self.state = self.root / 'agent/state.json'
        self.plist = self.root / 'LaunchAgents/test.plist'
        for name, value in [('ROOT', self.config.parent), ('CONFIG', self.config), ('STATE', self.state), ('PLIST', self.plist), ('APP', self.app)]:
            self.stack.enter_context(patch.object(agent, name, value))
        self.stack.enter_context(patch.object(agent.sys, 'platform', 'darwin'))
        self.stack.enter_context(patch.object(agent.getpass, 'getpass', return_value='P'*43))
        self.post = self.stack.enter_context(patch.object(agent, 'post', return_value={'credential': 'C'*43}))
        self.run = self.stack.enter_context(patch.object(agent.subprocess, 'run'))

    def test_install_permissions_autostart_and_clean_pairing_state(self):
        agent.store(self.state, {'logsEnabled': True, 'ack': {'id': 'old'}})
        agent.install('https://iotahome.site')
        self.assertEqual(agent.read(self.state), {})
        self.assertEqual(agent.read(self.config)['credential'], 'C'*43)
        self.assertEqual(self.config.stat().st_mode & 0o777, 0o600)
        self.assertEqual(self.config.parent.stat().st_mode & 0o777, 0o700)
        plist = plistlib.loads(self.plist.read_bytes())
        self.assertTrue(plist['RunAtLoad'])
        self.assertTrue(plist['KeepAlive'])
        self.assertEqual(plist['ProgramArguments'][-1], '--run')
        self.assertNotIn('C'*43, self.plist.read_text())
        self.assertEqual([c.args[0][1] for c in self.run.call_args_list], ['bootout', 'bootstrap'])
        agent.uninstall()
        self.assertFalse(self.config.exists())
        self.assertFalse(self.plist.exists())
        self.assertTrue(self.app.exists())

    def test_bad_pairing_keeps_existing_installation(self):
        agent.store(self.config, {'credential': 'existing'})
        self.post.return_value = {'credential': 'invalid'}
        with self.assertRaises(ValueError): agent.install('https://iotahome.site')
        self.assertEqual(agent.read(self.config)['credential'], 'existing')
        self.run.assert_not_called()

    def test_missing_official_app_does_not_consume_pair_code(self):
        self.app.rmdir()
        with self.assertRaises(ValueError): agent.install('https://iotahome.site')
        self.post.assert_not_called()
        self.run.assert_not_called()

if __name__ == '__main__': unittest.main()
