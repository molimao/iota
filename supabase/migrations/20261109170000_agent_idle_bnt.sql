CREATE TABLE public.watch_idle_bnt_wallets (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  address text NOT NULL
);
CREATE TABLE public.watch_agent_idle_bnt (
  device_id uuid PRIMARY KEY REFERENCES public.watch_device_agents(device_id) ON DELETE CASCADE,
  threads integer NOT NULL CHECK (threads BETWEEN 1 AND 4)
);
ALTER TABLE public.watch_idle_bnt_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_agent_idle_bnt ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_idle_bnt_wallets, public.watch_agent_idle_bnt FROM PUBLIC, anon, authenticated;

CREATE FUNCTION public.watch_idle_bnt_settings(p_settings jsonb DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); d record; address text;
BEGIN
  IF u IS NULL THEN RAISE EXCEPTION 'sign_in_required'; END IF;
  IF p_settings IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM watch_billing WHERE user_id=u
        AND status IN ('active','trialing') AND period_end>now()) THEN RAISE EXCEPTION 'pro_required'; END IF;
    address:=p_settings->>'address';
    IF address IS NULL OR address !~ '^[1-9A-HJ-NP-Za-km-z]{68,93}$'
      OR jsonb_typeof(p_settings->'devices') IS DISTINCT FROM 'array'
      THEN RAISE EXCEPTION 'invalid_settings'; END IF;
    INSERT INTO watch_idle_bnt_wallets(user_id,address) VALUES(u,address)
      ON CONFLICT(user_id) DO UPDATE SET address=excluded.address;
    FOR d IN SELECT * FROM jsonb_to_recordset(p_settings->'devices') AS x("deviceId" uuid, threads integer)
    LOOP
      IF d.threads IS NULL OR d.threads NOT BETWEEN 0 AND 4 THEN RAISE EXCEPTION 'invalid_threads'; END IF;
      IF NOT EXISTS (SELECT 1 FROM watch_device_agents a WHERE a.device_id=d."deviceId" AND a.user_id=u
          AND (d.threads=0 OR (a.snapshot ? 'idleBnt'
            AND a.snapshot->>'platform' IS DISTINCT FROM 'linux'
            AND a.snapshot->>'monitorOnly' IS DISTINCT FROM 'true')))
        THEN RAISE EXCEPTION 'device_not_available'; END IF;
      IF d.threads=0 THEN
        DELETE FROM watch_agent_idle_bnt WHERE device_id=d."deviceId";
      ELSE
        INSERT INTO watch_agent_idle_bnt(device_id,threads) VALUES(d."deviceId",d.threads)
          ON CONFLICT(device_id) DO UPDATE SET threads=excluded.threads;
      END IF;
    END LOOP;
  END IF;
  RETURN jsonb_build_object(
    'address', coalesce((SELECT w.address FROM watch_idle_bnt_wallets w WHERE w.user_id=u),''),
    'devices', coalesce((SELECT jsonb_agg(jsonb_build_object('deviceId',a.device_id,'threads',c.threads))
      FROM watch_agent_idle_bnt c JOIN watch_device_agents a USING(device_id) WHERE a.user_id=u),'[]'::jsonb)
  );
END $$;

CREATE FUNCTION public.watch_idle_bnt_lease(p_hash text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
  SELECT jsonb_build_object('settings', jsonb_build_object(
      'address', w.address, 'threads', c.threads, 'memoryMb', c.threads * 2048 + 1024,
      'whenQueued', true, 'whenPaused', true
    ), 'worker', 'iota-' || right(a.device_id::text,12),
    'seconds', least(45, floor(extract(epoch FROM (b.period_end-now())))::int))
  FROM watch_device_agents a
  JOIN watch_agent_idle_bnt c ON c.device_id=a.device_id
  JOIN watch_idle_bnt_wallets w ON w.user_id=a.user_id
  JOIN watch_billing b ON b.user_id=a.user_id
  WHERE a.credential_hash=p_hash AND a.snapshot ? 'idleBnt'
    AND a.snapshot->>'platform' IS DISTINCT FROM 'linux'
    AND a.snapshot->>'monitorOnly' IS DISTINCT FROM 'true'
    AND b.status IN ('active','trialing') AND b.period_end>now()+interval '1 second'
$$;
REVOKE ALL ON FUNCTION public.watch_idle_bnt_settings(jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.watch_idle_bnt_settings(jsonb) TO authenticated;
REVOKE ALL ON FUNCTION public.watch_idle_bnt_lease(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.watch_idle_bnt_lease(text) TO service_role;
