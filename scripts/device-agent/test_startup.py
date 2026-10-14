import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from test_agent import agent

class StartupTests(unittest.TestCase):
    def test_running_app_is_not_launched_again(self):
        with tempfile.TemporaryDirectory() as folder:
            with patch.object(agent, 'APP', Path(folder)), patch.object(agent, 'processes', return_value=[(1,0,0,agent.EXEC)]), patch.object(agent.subprocess, 'run') as run:
                agent.control('start')
                run.assert_not_called()

    def test_uses_bundled_optimizer_and_checks_app(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder)
            helper=root/'iota_local_start.py'; helper.write_text('')
            with patch.object(agent, 'APP', root), patch.object(agent, 'ROOT', root), patch.object(agent.Path, 'home', return_value=root), patch.object(agent,'processes',side_effect=[[],[(1,0,0,agent.EXEC)]]), patch.object(agent.subprocess,'run') as run:
                agent.control('start')
                self.assertEqual(run.call_args.args[0], [agent.sys.executable,str(helper)])
                self.assertTrue(run.call_args.kwargs['check'])

    def test_existing_local_tools_launcher_is_reused(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder)
            helper=root/'Library/Application Support/IOTA Local Guardian/iota_local_start.py'
            helper.parent.mkdir(parents=True); helper.write_text('')
            with patch.object(agent, 'APP', root), patch.object(agent.Path,'home',return_value=root), patch.object(agent,'processes',side_effect=[[],[(1,0,0,agent.EXEC)]]), patch.object(agent.subprocess,'run') as run:
                agent.control('start')
                self.assertEqual(run.call_args.args[0][1],str(helper))

    def test_failed_optimizer_never_falls_back(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder); (root/'iota_local_start.py').write_text('')
            with patch.object(agent,'APP',root), patch.object(agent,'ROOT',root), patch.object(agent.Path,'home',return_value=root), patch.object(agent,'processes',return_value=[]), patch.object(agent.subprocess,'run',side_effect=agent.subprocess.CalledProcessError(1,'optimizer')) as run:
                with self.assertRaises(agent.subprocess.CalledProcessError): agent.control('start')
                self.assertEqual(run.call_count,1)
