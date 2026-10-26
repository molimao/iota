import importlib.util
import json
from pathlib import Path
import unittest
import urllib.error
from unittest.mock import patch, MagicMock
spec = importlib.util.spec_from_file_location('xmrig_agent', Path(__file__).with_name('iota_watch_agent.py'))
agent = importlib.util.module_from_spec(spec)
spec.loader.exec_module(agent)
binding='11111111-1111-4111-8111-111111111111'
config={'xmrig':{'bindingId':binding,'port':18088,'accessToken':'local-secret'}}
sample={'ua':'XMRig/6.22.2','uptime':123,'worker_id':'private-hostname','pool':'private-wallet@pool',
        'hashrate':{'total':[3240.2,3200,None]},'results':{'shares_good':100,'shares_total':103}}

class XmrigTests(unittest.TestCase):
    def fetch(self, body, cfg=config):
        response=MagicMock()
        response.__enter__.return_value.read.return_value=json.dumps(body).encode()
        opener=MagicMock();opener.open.return_value=response
        with patch.object(agent.urllib.request,'build_opener',return_value=opener):
            result=agent.xmrig_observation(cfg,1000)
        return result,opener

    def test_disabled_by_default_and_invalid_configuration_never_queries(self):
        with patch.object(agent.urllib.request,'build_opener') as opener:
            for cfg in [{},{'xmrig':{}},{'xmrig':{'bindingId':binding,'port':True}},{'xmrig':{'bindingId':binding,'port':80}}]:
                self.assertIsNone(agent.xmrig_observation(cfg))
            opener.assert_not_called()

    def test_extracts_only_bound_metrics_and_never_uploads_private_strings(self):
        result,opener=self.fetch(sample)
        self.assertEqual(result['bindingId'],binding)
        self.assertEqual(result['hashrate10s'],3240.2)
        self.assertEqual(result['accepted'],100);self.assertEqual(result['rejected'],3)
        text=json.dumps(result)
        for private in ['local-secret','private-hostname','private-wallet','pool']:
            self.assertNotIn(private,text)
        request=opener.open.call_args.args[0]
        self.assertEqual(request.full_url,'http://127.0.0.1:18088/1/summary')
        self.assertEqual(request.get_method(),'GET')
        self.assertEqual(opener.open.call_args.kwargs['timeout'],1)

    def test_bad_response_is_unknown_instead_of_zero_hashrate(self):
        for body in [[],{'ua':'unrelated server'},dict(sample,hashrate=None),dict(sample,hashrate={'total':['bad',True]}),dict(sample,hashrate={'total':[float('nan'),-1]})]:
            result,_=self.fetch(body)
            self.assertIsNone(result['hashrate10s'])

    def test_authentication_failure_is_distinct_and_never_echoes_secrets(self):
        error=urllib.error.HTTPError('http://127.0.0.1:18088/1/summary',401,'private error',{},None)
        with patch.object(agent.urllib.request,'build_opener') as factory:
            factory.return_value.open.side_effect=error
            result=agent.xmrig_observation(config,1000)
        self.assertEqual(result['status'],'unauthorized')
        self.assertNotIn('private',json.dumps(result))

    def test_optional_api_failure_does_not_prevent_iota_heartbeat(self):
        with patch.object(agent,'snapshot',return_value={'appRunning':True,'workerRunning':True}),patch.object(agent.urllib.request,'build_opener') as factory,patch.object(agent,'post',return_value={}) as post:
            factory.return_value.open.side_effect=OSError('offline')
            agent.step(dict(config,server='https://iotahome.site',credential='test'),{},1000)
            post.assert_called_once()
            self.assertEqual(post.call_args.args[2]['snapshot']['miners'][0]['status'],'unavailable')

if __name__=='__main__':unittest.main()
