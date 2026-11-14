import base64
import json
from pathlib import Path
import tempfile
import subprocess
import unittest
from unittest.mock import patch

import iota_watch_agent as agent


class XdsWalletTransportTests(unittest.TestCase):
    def test_recipient_bound_encryption_and_authentication(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            with patch.object(agent, 'ROOT', root / 'sender'):
                _, public = agent.xds_transport_key()
                value = dict(wallet=base64.b64encode(b'encrypted wallet fixture').decode(),
                             password='private fixture password', address='disc1fixture')
                packet = agent.xds_seal(public, 'wallet:device-one', value)
                self.assertNotIn(value['password'], json.dumps(packet))
                self.assertEqual(agent.xds_open('wallet:device-one', packet), value)
                with self.assertRaises(ValueError):
                    agent.xds_open('wallet:device-two', packet)
                changed = {**packet, 'tag': base64.b64encode(bytes(32)).decode()}
                with self.assertRaises(ValueError):
                    agent.xds_open('wallet:device-one', changed)
            with patch.object(agent, 'ROOT', root / 'other-device'):
                with self.assertRaises(subprocess.CalledProcessError):
                    agent.xds_open('wallet:device-one', packet)

    def test_wallet_setup_can_finish_before_a_mining_lease_exists(self):
        import sys
        with tempfile.TemporaryDirectory() as directory, patch.object(agent, 'ROOT', Path(directory)):
            controller = agent.IdleXdsAgent()
            child = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(60)'], start_new_session=True)
            controller.setup = child
            try:
                controller.apply({}, {}, None)
                self.assertIsNone(child.poll())
                self.assertIsNone(controller.watch)
            finally:
                controller.stop()
            self.assertIsNotNone(child.poll())

    def test_receiver_preserves_wallet_and_password_permissions(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(agent, 'ROOT', Path(directory)):
            value = dict(wallet=base64.b64encode(b'encrypted wallet').decode(), password='local password', address='disc1fixture')
            wallet_id = '00000000-0000-4000-8000-000000000001'
            cli = Path(directory) / 'cli'
            cli.mkdir()
            agent.receive_xds_wallet(wallet_id, value, cli)
            folder = Path(directory) / 'idle-xds/wallets' / wallet_id
            self.assertEqual((folder / 'miner.wallet').read_bytes(), b'encrypted wallet')
            self.assertEqual((folder / 'password').stat().st_mode & 0o777, 0o600)
            self.assertEqual((folder / 'miner.wallet').stat().st_mode & 0o777, 0o600)
            agent.receive_xds_wallet(wallet_id, value, cli)
            with self.assertRaises(ValueError):
                agent.receive_xds_wallet(wallet_id, {**value,'address':'disc1different'}, cli)


if __name__ == '__main__':
    unittest.main()
