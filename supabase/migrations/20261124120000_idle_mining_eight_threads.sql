BEGIN;

ALTER TABLE public.watch_agent_idle_bnt
  DROP CONSTRAINT watch_agent_idle_bnt_threads_check,
  ADD CONSTRAINT watch_agent_idle_bnt_threads_check CHECK (threads BETWEEN 1 AND 8);

ALTER TABLE public.watch_agent_idle_xds
  DROP CONSTRAINT watch_agent_idle_xds_threads_check,
  ADD CONSTRAINT watch_agent_idle_xds_threads_check CHECK (threads BETWEEN 1 AND 8);

CREATE OR REPLACE FUNCTION public.watch_idle_bnt_settings(p_settings jsonb DEFAULT NULL)
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
      IF d.threads IS NULL OR d.threads NOT BETWEEN 0 AND 8 THEN RAISE EXCEPTION 'invalid_threads'; END IF;
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

CREATE OR REPLACE FUNCTION public.watch_xds_wallet_settings(p_settings jsonb DEFAULT NULL,p_backup_key text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); d record; w watch_xds_wallets; source uuid;
BEGIN
  IF u IS NULL THEN RAISE EXCEPTION 'sign_in_required'; END IF;
  SELECT * INTO w FROM watch_xds_wallets WHERE user_id=u;
  IF p_settings IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM watch_billing WHERE user_id=u AND status IN ('active','trialing') AND period_end>now())
      THEN RAISE EXCEPTION 'pro_required'; END IF;
  END IF;
  IF p_settings IS NOT NULL THEN
    IF jsonb_typeof(p_settings->'devices') IS DISTINCT FROM 'array' OR p_settings->>'consent' IS DISTINCT FROM 'true'
      THEN RAISE EXCEPTION 'wallet_consent_required'; END IF;
    IF w.user_id IS NULL AND EXISTS(SELECT 1 FROM jsonb_to_recordset(p_settings->'devices') AS x(threads integer) WHERE threads>0) THEN
      SELECT a.device_id INTO source FROM watch_device_agents a JOIN watch_xds_keys k USING(device_id)
        JOIN jsonb_to_recordset(p_settings->'devices') AS x("deviceId" uuid,threads integer) ON x."deviceId"=a.device_id
        WHERE a.user_id=u AND x.threads>0 AND a.last_seen>now()-interval '60 seconds'
          AND a.snapshot->>'platform'='darwin' ORDER BY a.device_id LIMIT 1;
      IF source IS NULL THEN RAISE EXCEPTION 'device_not_available'; END IF;
      INSERT INTO watch_xds_wallets(user_id,source_device) VALUES(u,source) RETURNING * INTO w;
    END IF;
    FOR d IN SELECT * FROM jsonb_to_recordset(p_settings->'devices') AS x("deviceId" uuid,threads integer)
    LOOP
      IF d.threads IS NULL OR d.threads NOT BETWEEN 0 AND 8 THEN RAISE EXCEPTION 'invalid_threads'; END IF;
      IF NOT EXISTS (SELECT 1 FROM watch_device_agents a LEFT JOIN watch_xds_keys k USING(device_id)
        WHERE a.device_id=d."deviceId" AND a.user_id=u AND (d.threads=0 OR
          (k.public_key IS NOT NULL AND a.snapshot->>'platform'='darwin' AND a.snapshot->>'monitorOnly' IS DISTINCT FROM 'true')))
        THEN RAISE EXCEPTION 'device_not_available'; END IF;
      IF d.threads=0 THEN DELETE FROM watch_agent_idle_xds WHERE device_id=d."deviceId";
      ELSE
        INSERT INTO watch_agent_idle_xds VALUES(d."deviceId",d.threads) ON CONFLICT(device_id) DO UPDATE SET threads=excluded.threads;
        INSERT INTO watch_xds_wallet_targets(device_id,wallet_id) VALUES(d."deviceId",w.wallet_id) ON CONFLICT(device_id) DO NOTHING;
      END IF;
    END LOOP;
  END IF;
  IF p_backup_key IS NOT NULL THEN
    IF w.user_id IS NULL THEN RAISE EXCEPTION 'wallet_not_ready'; END IF;
    INSERT INTO watch_xds_wallet_backups(user_id,public_key) VALUES(u,p_backup_key)
      ON CONFLICT(user_id) DO UPDATE SET request_id=gen_random_uuid(),public_key=excluded.public_key,packet=NULL;
  END IF;
  RETURN jsonb_build_object(
    'wallet',CASE WHEN w.user_id IS NULL THEN NULL ELSE jsonb_build_object('id',w.wallet_id,'address',w.address) END,
    'devices',coalesce((SELECT jsonb_agg(jsonb_build_object('deviceId',a.device_id,'threads',c.threads))
      FROM watch_agent_idle_xds c JOIN watch_device_agents a USING(device_id) WHERE a.user_id=u),'[]'::jsonb),
    'receivers',coalesce((SELECT jsonb_agg(jsonb_build_object('deviceId',a.device_id,'applied',coalesce(t.applied,false),
      'available',k.public_key IS NOT NULL)) FROM watch_device_agents a LEFT JOIN watch_xds_keys k USING(device_id)
      LEFT JOIN watch_xds_wallet_targets t USING(device_id) WHERE a.user_id=u),'[]'::jsonb),
    'backup',(SELECT jsonb_build_object('id',b.request_id,'packet',b.packet) FROM watch_xds_wallet_backups b WHERE b.user_id=u)
  );
END $$;

COMMIT;
