CREATE TABLE public.watch_agent_idle_xds (
  device_id uuid PRIMARY KEY REFERENCES public.watch_device_agents(device_id) ON DELETE CASCADE,
  threads integer NOT NULL CHECK (threads BETWEEN 1 AND 4)
);
ALTER TABLE public.watch_agent_idle_xds ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_agent_idle_xds FROM PUBLIC, anon, authenticated;

CREATE FUNCTION public.watch_idle_xds_settings(p_settings jsonb DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); d record;
BEGIN
  IF u IS NULL THEN RAISE EXCEPTION 'sign_in_required'; END IF;
  IF p_settings IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM watch_billing WHERE user_id=u
      AND status IN ('active','trialing') AND period_end>now()) THEN RAISE EXCEPTION 'pro_required'; END IF;
    IF jsonb_typeof(p_settings->'devices') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'invalid_settings'; END IF;
    FOR d IN SELECT * FROM jsonb_to_recordset(p_settings->'devices') AS x("deviceId" uuid,threads integer)
    LOOP
      IF d.threads IS NULL OR d.threads NOT BETWEEN 0 AND 4 THEN RAISE EXCEPTION 'invalid_threads'; END IF;
      IF NOT EXISTS (SELECT 1 FROM watch_device_agents a WHERE a.device_id=d."deviceId" AND a.user_id=u
        AND (d.threads=0 OR (a.snapshot->>'platform'='darwin'
          AND a.snapshot->>'monitorOnly' IS DISTINCT FROM 'true'
          AND a.snapshot ? 'idleXds' AND a.snapshot->'idleXds'->>'state'<>'setup')))
        THEN RAISE EXCEPTION 'device_not_available'; END IF;
      IF d.threads=0 THEN
        DELETE FROM watch_agent_idle_xds WHERE device_id=d."deviceId";
      ELSE
        INSERT INTO watch_agent_idle_xds(device_id,threads) VALUES(d."deviceId",d.threads)
          ON CONFLICT(device_id) DO UPDATE SET threads=excluded.threads;
      END IF;
    END LOOP;
  END IF;
  RETURN jsonb_build_object('devices',coalesce((SELECT jsonb_agg(jsonb_build_object(
    'deviceId',a.device_id,'threads',c.threads)) FROM watch_agent_idle_xds c
    JOIN watch_device_agents a USING(device_id) WHERE a.user_id=u),'[]'::jsonb));
END $$;

CREATE FUNCTION public.watch_idle_xds_lease(p_hash text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
  SELECT jsonb_build_object('settings',jsonb_build_object('threads',c.threads,
    'whenQueued',true,'whenPaused',true),
    'seconds',least(45,floor(extract(epoch FROM (b.period_end-now())))::int))
  FROM watch_device_agents a JOIN watch_agent_idle_xds c USING(device_id)
  JOIN watch_billing b ON b.user_id=a.user_id
  WHERE a.credential_hash=p_hash AND a.snapshot->>'platform'='darwin'
    AND a.snapshot->>'monitorOnly' IS DISTINCT FROM 'true'
    AND a.snapshot ? 'idleXds' AND a.snapshot->'idleXds'->>'state'<>'setup'
    AND b.status IN ('active','trialing') AND b.period_end>now()+interval '1 second'
$$;
REVOKE ALL ON FUNCTION public.watch_idle_xds_settings(jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_idle_xds_settings(jsonb) TO authenticated;
REVOKE ALL ON FUNCTION public.watch_idle_xds_lease(text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_idle_xds_lease(text) TO service_role;
