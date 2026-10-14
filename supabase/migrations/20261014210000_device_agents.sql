-- Private Mac management: account-owned pairing, device-scoped credentials and a fixed command queue.
CREATE TABLE public.watch_agent_pairs (
  device_id uuid PRIMARY KEY REFERENCES public.watch_devices(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL CHECK(length(token_hash)=64),
  expires_at timestamptz NOT NULL
);
CREATE TABLE public.watch_device_agents (
  device_id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  credential_hash text UNIQUE NOT NULL CHECK(length(credential_hash)=64),
  paired_at timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz,
  snapshot jsonb NOT NULL DEFAULT '{}',
  logs_enabled boolean NOT NULL DEFAULT false,
  recovery_enabled boolean NOT NULL DEFAULT false,
  FOREIGN KEY(device_id,user_id) REFERENCES public.watch_devices(id,user_id) ON DELETE CASCADE
);
CREATE TABLE public.watch_agent_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.watch_device_agents(device_id) ON DELETE CASCADE,
  action text NOT NULL CHECK(action IN ('start','stop','restart')),
  status text NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','claimed','done','failed','expired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now()+interval '2 minutes',
  finished_at timestamptz
);
CREATE INDEX watch_agent_command_history ON public.watch_agent_commands(device_id,created_at DESC);
CREATE INDEX watch_agent_old_logs ON public.watch_device_agents(last_seen) WHERE snapshot ? 'logs';
CREATE UNIQUE INDEX watch_agent_one_command ON public.watch_agent_commands(device_id) WHERE status IN ('queued','claimed');
ALTER TABLE public.watch_agent_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_device_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_agent_commands ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_agent_pairs,public.watch_device_agents,public.watch_agent_commands FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.watch_agent_pairs,public.watch_device_agents,public.watch_agent_commands TO service_role;

CREATE FUNCTION public.watch_agent_owner(p_action text,p_device uuid DEFAULT NULL,p_payload jsonb DEFAULT '{}') RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); result jsonb;
BEGIN
  IF u IS NULL THEN RAISE EXCEPTION 'sign_in_required'; END IF;
  IF p_action='list' THEN
    UPDATE public.watch_device_agents SET snapshot=snapshot-'logs' WHERE user_id=u AND last_seen<now()-interval '24 hours' AND snapshot ? 'logs';
    DELETE FROM public.watch_agent_commands c USING public.watch_device_agents a WHERE a.device_id=c.device_id AND a.user_id=u AND c.created_at<now()-interval '7 days';
    RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('deviceId',a.device_id,'lastSeen',a.last_seen,
      'snapshot',CASE WHEN a.last_seen < now()-interval '24 hours' THEN a.snapshot-'logs' ELSE a.snapshot END,
      'logsEnabled',a.logs_enabled,'recoveryEnabled',a.recovery_enabled,
      'pending',(SELECT jsonb_build_object('id',c.id,'action',c.action,'status',c.status) FROM public.watch_agent_commands c WHERE c.device_id=a.device_id AND c.status IN ('queued','claimed') AND c.expires_at>now() LIMIT 1),
      'latestCommand',(SELECT jsonb_build_object('action',c.action,'status',CASE WHEN c.status IN ('queued','claimed') AND c.expires_at<=now() THEN 'expired' ELSE c.status END,'createdAt',c.created_at) FROM public.watch_agent_commands c WHERE c.device_id=a.device_id ORDER BY c.created_at DESC LIMIT 1))) FROM public.watch_device_agents a WHERE a.user_id=u),'[]'::jsonb);
  END IF;
  IF NOT EXISTS(SELECT 1 FROM public.watch_devices WHERE id=p_device AND user_id=u) THEN RAISE EXCEPTION 'device_not_found'; END IF;
  IF p_action='pair' THEN
    IF NOT EXISTS(SELECT 1 FROM public.watch_bindings WHERE device_id=p_device AND user_id=u AND project='iota') THEN RAISE EXCEPTION 'iota_required'; END IF;
    IF EXISTS(SELECT 1 FROM public.watch_device_agents WHERE device_id=p_device) THEN RAISE EXCEPTION 'already_paired'; END IF;
    INSERT INTO public.watch_agent_pairs VALUES(p_device,u,p_payload->>'hash',now()+interval '10 minutes')
      ON CONFLICT(device_id) DO UPDATE SET token_hash=excluded.token_hash,expires_at=excluded.expires_at;
    RETURN jsonb_build_object('expiresAt',now()+interval '10 minutes');
  ELSIF p_action='revoke' THEN
    DELETE FROM public.watch_agent_pairs WHERE device_id=p_device AND user_id=u;
    DELETE FROM public.watch_device_agents WHERE device_id=p_device AND user_id=u;
    RETURN jsonb_build_object('ok',true);
  ELSIF p_action='settings' THEN
    UPDATE public.watch_device_agents SET logs_enabled=(p_payload->>'logs')::boolean,recovery_enabled=(p_payload->>'recovery')::boolean,
      snapshot=CASE WHEN NOT (p_payload->>'logs')::boolean THEN snapshot-'logs' ELSE snapshot END WHERE device_id=p_device AND user_id=u;
    IF NOT FOUND THEN RAISE EXCEPTION 'agent_not_found'; END IF;
    RETURN jsonb_build_object('ok',true);
  ELSIF p_action IN ('start','stop','restart') THEN
    IF NOT EXISTS(SELECT 1 FROM public.watch_device_agents WHERE device_id=p_device AND user_id=u AND last_seen>now()-interval '90 seconds') THEN RAISE EXCEPTION 'agent_offline'; END IF;
    UPDATE public.watch_agent_commands SET status='expired',finished_at=now() WHERE device_id=p_device AND expires_at<=now() AND status IN ('queued','claimed');
    IF p_action='stop' THEN UPDATE public.watch_device_agents SET recovery_enabled=false WHERE device_id=p_device; END IF;
    INSERT INTO public.watch_agent_commands(device_id,action) VALUES(p_device,p_action) RETURNING jsonb_build_object('id',id) INTO result;
    DELETE FROM public.watch_agent_commands WHERE device_id=p_device AND created_at<now()-interval '7 days';
    RETURN result;
  END IF;
  RAISE EXCEPTION 'invalid_action';
END $$;
REVOKE ALL ON FUNCTION public.watch_agent_owner(text,uuid,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.watch_agent_owner(text,uuid,jsonb) TO authenticated;

CREATE FUNCTION public.watch_agent_exchange(p_action text,p_hash text,p_payload jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE pairing public.watch_agent_pairs; agent public.watch_device_agents; cmd public.watch_agent_commands; snap jsonb;
BEGIN
  IF p_action='pair' THEN
    DELETE FROM public.watch_agent_pairs WHERE token_hash=p_hash AND expires_at>now() RETURNING * INTO pairing;
    IF NOT FOUND THEN RAISE EXCEPTION 'unauthorized'; END IF;
    INSERT INTO public.watch_device_agents(device_id,user_id,credential_hash) VALUES(pairing.device_id,pairing.user_id,p_payload->>'credentialHash');
    RETURN jsonb_build_object('ok',true);
  END IF;
  SELECT * INTO agent FROM public.watch_device_agents WHERE credential_hash=p_hash FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'unauthorized'; END IF;
  IF p_action<>'heartbeat' THEN RAISE EXCEPTION 'invalid_action'; END IF;
  IF agent.last_seen>now()-interval '10 seconds' THEN RAISE EXCEPTION 'rate_limited'; END IF;
  DELETE FROM public.watch_agent_commands WHERE device_id=agent.device_id AND created_at<now()-interval '7 days';
  snap:=p_payload->'snapshot';
  IF NOT agent.logs_enabled THEN snap:=snap-'logs'; END IF;
  UPDATE public.watch_device_agents SET last_seen=now(),snapshot=snap WHERE device_id=agent.device_id;
  UPDATE public.watch_device_agents SET snapshot=snapshot-'logs' WHERE last_seen<now()-interval '24 hours' AND snapshot ? 'logs';
  IF p_payload ? 'ack' AND p_payload->'ack' IS NOT NULL AND p_payload->'ack'<>'null'::jsonb THEN
    UPDATE public.watch_agent_commands SET status=CASE WHEN (p_payload->'ack'->>'success')::boolean THEN 'done' ELSE 'failed' END,finished_at=now()
      WHERE id=(p_payload->'ack'->>'id')::uuid AND device_id=agent.device_id AND status='claimed';
  END IF;
  UPDATE public.watch_agent_commands SET status='expired',finished_at=now() WHERE device_id=agent.device_id AND status IN ('queued','claimed') AND expires_at<=now();
    SELECT * INTO cmd FROM public.watch_agent_commands WHERE device_id=agent.device_id AND status='queued' AND expires_at>now() FOR UPDATE LIMIT 1;
    IF FOUND THEN UPDATE public.watch_agent_commands SET status='claimed' WHERE id=cmd.id; END IF;
  RETURN jsonb_build_object('command',CASE WHEN cmd.id IS NULL THEN NULL ELSE jsonb_build_object('id',cmd.id,'action',cmd.action,'expiresAt',cmd.expires_at) END,
    'logsEnabled',agent.logs_enabled,'recoveryEnabled',agent.recovery_enabled,'serverTime',now());
END $$;
REVOKE ALL ON FUNCTION public.watch_agent_exchange(text,text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_agent_exchange(text,text,jsonb) TO service_role;
