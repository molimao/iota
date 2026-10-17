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

class TrainingResumeTests(unittest.TestCase):
    def test_official_preference_preserves_other_settings(self):
        import json
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder)
            path=root/'Library/Application Support/IOTA Train at Home/preferences.json'
            path.parent.mkdir(parents=True)
            prefs={'autoStartTrainingOnStartup':False,'trainingPriority':'balanced','launchAtLogin':False,'scheduleEnabled':False}
            path.write_text(json.dumps(prefs))
            with patch.object(agent.Path,'home',return_value=root):
                agent.enable_training_on_launch()
            expected={**prefs,'autoStartTrainingOnStartup':True}
            self.assertEqual(json.loads(path.read_text()),expected)
            self.assertEqual(path.stat().st_mode & 0o777,0o600)
    def test_invalid_preferences_are_never_overwritten(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder)
            path=root/'Library/Application Support/IOTA Train at Home/preferences.json'
            path.parent.mkdir(parents=True);path.write_text('broken')
            with patch.object(agent.Path,'home',return_value=root):
                with self.assertRaises(ValueError):agent.enable_training_on_launch()
            self.assertEqual(path.read_text(),'broken')
    def test_symlink_preferences_are_rejected(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);target=root/'target';target.write_text('{}')
            path=root/'Library/Application Support/IOTA Train at Home/preferences.json'
            path.parent.mkdir(parents=True);path.symlink_to(target)
            with patch.object(agent.Path,'home',return_value=root):
                with self.assertRaises(ValueError):agent.enable_training_on_launch()
            self.assertEqual(target.read_text(),'{}')
    def test_recovery_waits_for_worker_not_just_gui(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);(root/'iota_local_start.py').write_text('')
            rows=[[],[(1,0,0,agent.EXEC)],[(1,0,0,agent.EXEC),(2,0,0,agent.WORKER)]]
            with patch.object(agent,'APP',root),patch.object(agent,'ROOT',root),patch.object(agent.Path,'home',return_value=root),patch.object(agent,'processes',side_effect=rows),patch.object(agent,'enable_training_on_launch') as enable,patch.object(agent.subprocess,'run'),patch.object(agent.time,'sleep') as sleep:
                agent.control('start',resume_training=True)
                enable.assert_called_once();sleep.assert_called_once_with(0.5)
    def test_gui_only_recovery_is_failure(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);(root/'iota_local_start.py').write_text('')
            with patch.object(agent,'APP',root),patch.object(agent,'ROOT',root),patch.object(agent.Path,'home',return_value=root),patch.object(agent,'processes',return_value=[]),patch.object(agent,'enable_training_on_launch'),patch.object(agent.subprocess,'run'),patch.object(agent.time,'monotonic',side_effect=[0,0,61]),patch.object(agent.time,'sleep'):
                with self.assertRaisesRegex(ValueError,'training did not start'):
                    agent.control('start',resume_training=True)
    def test_running_gui_never_counts_as_successful_training_resume(self):
        with tempfile.TemporaryDirectory() as folder:
            with patch.object(agent,'APP',Path(folder)),patch.object(agent,'processes',return_value=[(1,0,0,agent.EXEC)]):
                with self.assertRaises(ValueError):agent.control('start',resume_training=True)
