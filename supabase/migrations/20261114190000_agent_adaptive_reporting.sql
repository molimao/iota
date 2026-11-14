ALTER TABLE public.watch_device_agents ADD COLUMN contact_at timestamptz;
CREATE TABLE public.watch_agent_viewers (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 until_at timestamptz NOT NULL
);
ALTER TABLE public.watch_agent_viewers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_agent_viewers FROM PUBLIC,anon,authenticated;

ALTER FUNCTION public.watch_agent_owner(text,uuid,jsonb) RENAME TO watch_agent_owner_before_adaptive;
REVOKE ALL ON FUNCTION public.watch_agent_owner_before_adaptive(text,uuid,jsonb) FROM PUBLIC,anon,authenticated;
CREATE FUNCTION public.watch_agent_owner(p_action text,p_device uuid DEFAULT NULL,p_payload jsonb DEFAULT '{}') RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE result jsonb; u uuid:=auth.uid();
BEGIN
 result:=watch_agent_owner_before_adaptive(p_action,p_device,p_payload);
 IF p_action='list' THEN
  IF p_payload->>'watching'='true' THEN
   INSERT INTO watch_agent_viewers VALUES(u,now()+interval '35 seconds')
    ON CONFLICT(user_id) DO UPDATE SET until_at=excluded.until_at;
  END IF;
  SELECT coalesce(jsonb_agg(jsonb_set(item,'{lastSeen}',coalesce(to_jsonb(greatest(a.last_seen,a.contact_at)),'null'::jsonb)) || jsonb_build_object('snapshotAt',a.last_seen)),'[]'::jsonb)
    INTO result FROM jsonb_array_elements(result) item JOIN watch_device_agents a ON a.device_id=(item->>'deviceId')::uuid;
 END IF;
 RETURN result;
END $$;
GRANT EXECUTE ON FUNCTION public.watch_agent_owner(text,uuid,jsonb) TO authenticated;
REVOKE ALL ON FUNCTION public.watch_agent_owner(text,uuid,jsonb) FROM PUBLIC,anon;

CREATE FUNCTION public.watch_agent_probe(p_hash text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE a watch_device_agents; active boolean;
BEGIN
 SELECT * INTO a FROM watch_device_agents WHERE credential_hash=p_hash;
 IF a.device_id IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
 -- Keep connection liveness separate from the less frequent full snapshot.
 UPDATE watch_device_agents SET contact_at=now() WHERE device_id=a.device_id
   AND coalesce(greatest(contact_at,last_seen),'-infinity'::timestamptz)<now()-interval '20 seconds';
 SELECT (EXISTS(SELECT 1 FROM watch_agent_viewers WHERE user_id=a.user_id AND until_at>now())
   OR EXISTS(SELECT 1 FROM watch_agent_commands WHERE device_id=a.device_id AND status IN ('queued','claimed') AND expires_at>now())
   OR a.logs_enabled OR a.recovery_enabled) INTO active;
 RETURN jsonb_build_object('active',active);
END $$;
REVOKE ALL ON FUNCTION public.watch_agent_probe(text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_agent_probe(text) TO service_role;

CREATE OR REPLACE FUNCTION public.watch_agent_batch(p_action text,p_id uuid,p_devices uuid[],p_target_version text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); ids uuid[]; d uuid; n text; agent_row public.watch_device_agents;
 c uuid; disposition text; installed text; target int[];
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'sign_in_required'; END IF;
 IF p_action='update' THEN
  IF p_target_version IS NULL OR p_target_version !~ '^[0-9]{1,4}[.][0-9]{1,4}[.][0-9]{1,4}$' THEN
   RAISE EXCEPTION 'invalid_target_version'; END IF;
  target:=string_to_array(p_target_version,'.')::int[];
 END IF;
 IF p_action IN ('start','stop','restart','update') THEN
  IF p_id IS NULL OR p_devices IS NULL OR cardinality(p_devices) NOT BETWEEN 1 AND 50 OR array_position(p_devices,NULL) IS NOT NULL THEN
   RAISE EXCEPTION 'invalid_targets'; END IF;
  SELECT array_agg(x ORDER BY x) INTO ids FROM (SELECT DISTINCT unnest(p_devices) x) q;
  IF EXISTS(SELECT 1 FROM unnest(ids) x WHERE NOT EXISTS(SELECT 1 FROM watch_devices WHERE id=x AND user_id=u)) THEN
   RAISE EXCEPTION 'device_not_found'; END IF;
  IF (p_action='update' OR cardinality(ids)>1) AND NOT EXISTS(SELECT 1 FROM watch_agent_batches WHERE id=p_id AND user_id=u)
   AND NOT EXISTS(SELECT 1 FROM watch_billing WHERE user_id=u AND status IN ('active','trialing') AND period_end>now()) THEN
   RAISE EXCEPTION 'pro_required'; END IF;
  INSERT INTO watch_agent_batches(id,user_id,target_ids,action) VALUES(p_id,u,ids,p_action) ON CONFLICT DO NOTHING;
  -- The row lock also serializes retries of the same request.
  PERFORM 1 FROM watch_agent_batches WHERE id=p_id AND user_id=u AND target_ids=ids AND action=p_action FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'batch_conflict'; END IF;
  IF NOT EXISTS(SELECT 1 FROM watch_agent_batch_items WHERE batch_id=p_id) THEN
   FOREACH d IN ARRAY ids LOOP
    SELECT name INTO n FROM watch_devices WHERE id=d AND user_id=u;
    SELECT * INTO agent_row FROM watch_device_agents WHERE device_id=d AND user_id=u FOR UPDATE;
    c:=NULL; disposition:='queued';
    IF NOT FOUND OR agent_row.snapshot->>'monitorOnly'='true' OR agent_row.snapshot->>'platform' IN ('linux','win32')
      OR (p_action<>'update' AND NOT EXISTS(SELECT 1 FROM watch_bindings WHERE device_id=d AND user_id=u AND project='iota')) THEN
     disposition:='unavailable';
    ELSIF greatest(agent_row.last_seen,agent_row.contact_at) IS NULL OR greatest(agent_row.last_seen,agent_row.contact_at)<=now()-interval '60 seconds' OR greatest(agent_row.last_seen,agent_row.contact_at)>now()+interval '5 seconds' THEN
     disposition:='offline';
    ELSIF p_action='update' THEN
     installed:=agent_row.snapshot->>'version';
     IF installed ~ '^[0-9]{1,4}[.][0-9]{1,4}[.][0-9]{1,4}$' THEN
      IF string_to_array(installed,'.')::int[] >= target THEN disposition:='upToDate'; END IF;
     END IF;
     IF disposition='queued' THEN
      BEGIN
       c:=(public.watch_agent_owner('update',d)->>'id')::uuid;
      EXCEPTION WHEN unique_violation THEN disposition:='busy';
       WHEN raise_exception THEN
        IF SQLERRM<>'manual_agent_upgrade_required' THEN RAISE; END IF;
        disposition:='manualUpdate';
      END;
     END IF;
    ELSE
     UPDATE watch_agent_commands SET status='expired',finished_at=now() WHERE device_id=d AND status IN ('queued','claimed') AND expires_at<=now();
     BEGIN
      INSERT INTO watch_agent_commands(device_id,action) VALUES(d,p_action) RETURNING id INTO c;
      IF p_action='stop' THEN UPDATE watch_device_agents SET recovery_enabled=false WHERE device_id=d AND user_id=u; END IF;
     EXCEPTION WHEN unique_violation THEN disposition:='busy';
     END;
    END IF;
    INSERT INTO watch_agent_batch_items VALUES(p_id,d,n,c,disposition);
   END LOOP;
  END IF;
 ELSIF p_action IS DISTINCT FROM 'list' THEN RAISE EXCEPTION 'invalid_action'; END IF;
 RETURN coalesce((SELECT jsonb_agg(b ORDER BY b."createdAt" DESC) FROM (
  SELECT j.id,j.action,j.created_at AS "createdAt",coalesce((SELECT jsonb_agg(jsonb_build_object(
   'deviceId',i.device_id,'name',i.device_name,'disposition',i.disposition,'commandId',i.command_id,
   'status',CASE WHEN c.status IN ('queued','claimed') AND c.expires_at<=now() THEN 'expired' ELSE c.status END,
   'finishedAt',c.finished_at,'lastSeen',greatest(a.last_seen,a.contact_at),
   'snapshot',coalesce(a.snapshot-'logs','{}'::jsonb)) ORDER BY i.device_name,i.device_id)
   FROM watch_agent_batch_items i LEFT JOIN watch_agent_commands c ON c.id=i.command_id
   LEFT JOIN watch_device_agents a ON a.device_id=i.device_id AND a.user_id=u WHERE i.batch_id=j.id),'[]'::jsonb) AS items
  FROM watch_agent_batches j WHERE j.user_id=u AND j.created_at>now()-interval '7 days'
  ORDER BY j.created_at DESC LIMIT 5
 ) b),'[]'::jsonb);
END $$;
REVOKE ALL ON FUNCTION public.watch_agent_batch(text,uuid,uuid[],text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_agent_batch(text,uuid,uuid[],text) TO authenticated;
