ALTER TABLE public.watch_agent_commands DROP CONSTRAINT watch_agent_commands_action_check;
ALTER TABLE public.watch_agent_commands ADD CONSTRAINT watch_agent_commands_action_check CHECK(action IN ('start','stop','restart','update'));
CREATE OR REPLACE FUNCTION public.watch_agent_owner(p_action text,p_device uuid DEFAULT NULL,p_payload jsonb DEFAULT '{}') RETURNS jsonb
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
  ELSIF p_action IN ('start','stop','restart','update') THEN
    IF NOT EXISTS(SELECT 1 FROM public.watch_device_agents WHERE device_id=p_device AND user_id=u AND last_seen>now()-interval '90 seconds') THEN RAISE EXCEPTION 'agent_offline'; END IF;
    IF p_action='update' AND NOT EXISTS (
      SELECT 1 FROM public.watch_device_agents WHERE device_id=p_device AND user_id=u
      AND CASE WHEN snapshot->>'version' ~ '^1\.0\.[0-9]{1,4}$' THEN split_part(snapshot->>'version','.',3)::int >= 2
               WHEN snapshot->>'version' ~ '^[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}$' THEN (split_part(snapshot->>'version','.',1)::int,split_part(snapshot->>'version','.',2)::int) > (1,0)
               ELSE false END
    ) THEN RAISE EXCEPTION 'manual_agent_upgrade_required'; END IF;
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

