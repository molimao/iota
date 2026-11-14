CREATE TABLE public.watch_xds_keys (
  device_id uuid PRIMARY KEY REFERENCES public.watch_device_agents(device_id) ON DELETE CASCADE,
  public_key text NOT NULL
);
CREATE TABLE public.watch_xds_wallets (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  source_device uuid REFERENCES public.watch_device_agents(device_id) ON DELETE SET NULL,
  address text
);
CREATE TABLE public.watch_xds_wallet_targets (
  device_id uuid PRIMARY KEY REFERENCES public.watch_device_agents(device_id) ON DELETE CASCADE,
  wallet_id uuid NOT NULL REFERENCES public.watch_xds_wallets(wallet_id) ON DELETE CASCADE,
  recipient_key text,
  packet jsonb,
  applied boolean NOT NULL DEFAULT false
);
CREATE TABLE public.watch_xds_wallet_backups (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  request_id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_key text NOT NULL,
  packet jsonb
);
ALTER TABLE public.watch_xds_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_xds_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_xds_wallet_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_xds_wallet_backups ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_xds_keys,public.watch_xds_wallets,public.watch_xds_wallet_targets,public.watch_xds_wallet_backups FROM PUBLIC,anon,authenticated;

CREATE FUNCTION public.watch_xds_wallet_settings(p_settings jsonb DEFAULT NULL,p_backup_key text DEFAULT NULL)
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
      IF d.threads IS NULL OR d.threads NOT BETWEEN 0 AND 4 THEN RAISE EXCEPTION 'invalid_threads'; END IF;
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

CREATE FUNCTION public.watch_xds_wallet_agent(p_hash text,p_payload jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE a watch_device_agents; w watch_xds_wallets; k text; e jsonb; task jsonb; action text:=p_payload->>'action'; pro boolean;
BEGIN
  SELECT * INTO a FROM watch_device_agents WHERE credential_hash=p_hash;
  IF a.device_id IS NULL OR a.snapshot->>'platform' IS DISTINCT FROM 'darwin' OR a.snapshot->>'monitorOnly'='true'
    THEN RAISE EXCEPTION 'unauthorized'; END IF;
  IF action IN ('available','poll') THEN
    INSERT INTO watch_xds_keys VALUES(a.device_id,p_payload->>'publicKey')
      ON CONFLICT(device_id) DO UPDATE SET public_key=excluded.public_key WHERE watch_xds_keys.public_key IS DISTINCT FROM excluded.public_key;
  END IF;
  SELECT EXISTS (SELECT 1 FROM watch_billing WHERE user_id=a.user_id AND status IN ('active','trialing') AND period_end>now()) INTO pro;
  SELECT * INTO w FROM watch_xds_wallets WHERE user_id=a.user_id;
  IF w.user_id IS NULL THEN RETURN CASE WHEN action='available' THEN 'false'::jsonb ELSE NULL END; END IF;
  -- Owners keep backup access after Pro expires; new setup and mining still require Pro.
  IF NOT pro AND w.address IS NULL THEN RETURN CASE WHEN action='available' THEN 'false'::jsonb ELSE NULL END; END IF;
  IF action IN ('available','poll') THEN
    IF (w.source_device IS NULL OR NOT EXISTS(SELECT 1 FROM watch_device_agents WHERE device_id=w.source_device AND last_seen>now()-interval '60 seconds'))
      AND a.snapshot->'idleXds'->>'state'<>'setup'
      AND EXISTS(SELECT 1 FROM watch_xds_wallet_targets WHERE device_id=a.device_id AND wallet_id=w.wallet_id AND applied) THEN
      UPDATE watch_xds_wallets SET source_device=a.device_id WHERE user_id=a.user_id RETURNING * INTO w;
    END IF;
    IF a.device_id=w.source_device THEN
      SELECT coalesce(jsonb_agg(jsonb_build_object('deviceId',d.device_id,'publicKey',d.public_key)),'[]'::jsonb) INTO e
        FROM (SELECT t.device_id,k.public_key FROM watch_xds_wallet_targets t JOIN watch_xds_keys k USING(device_id)
          JOIN watch_agent_idle_xds c USING(device_id) WHERE t.wallet_id=w.wallet_id AND t.device_id<>a.device_id
          AND pro AND (t.packet IS NULL OR t.recipient_key IS DISTINCT FROM k.public_key) ORDER BY t.device_id LIMIT 10) d;
      SELECT jsonb_build_object('id',request_id,'publicKey',public_key) INTO task
        FROM watch_xds_wallet_backups WHERE user_id=a.user_id AND packet IS NULL;
      IF w.address IS NULL OR jsonb_array_length(e)>0 OR task IS NOT NULL THEN
        task:=jsonb_build_object('kind','source','walletId',w.wallet_id,'address',w.address,'recipients',e,'backup',task);
      ELSE task:=NULL; END IF;
    ELSE
      SELECT jsonb_build_object('kind','receive','walletId',w.wallet_id,'deviceId',a.device_id,'address',w.address,'packet',t.packet)
        INTO task FROM watch_xds_wallet_targets t JOIN watch_xds_keys k USING(device_id) JOIN watch_agent_idle_xds c USING(device_id)
        WHERE t.device_id=a.device_id AND t.wallet_id=w.wallet_id AND pro AND NOT t.applied AND t.packet IS NOT NULL AND t.recipient_key=k.public_key;
    END IF;
    RETURN CASE WHEN action='available' THEN to_jsonb(task IS NOT NULL) ELSE task END;
  END IF;
  IF p_payload->>'walletId' IS DISTINCT FROM w.wallet_id::text THEN RAISE EXCEPTION 'wallet_mismatch'; END IF;
  IF action='source' AND a.device_id=w.source_device THEN
    IF w.address IS NOT NULL AND w.address IS DISTINCT FROM p_payload->>'address' THEN RAISE EXCEPTION 'wallet_mismatch'; END IF;
    UPDATE watch_xds_wallets SET address=p_payload->>'address' WHERE user_id=a.user_id;
    UPDATE watch_xds_wallet_targets SET applied=true WHERE device_id=a.device_id AND wallet_id=w.wallet_id;
    FOR e IN SELECT * FROM jsonb_array_elements(CASE WHEN pro THEN p_payload->'envelopes' ELSE '[]'::jsonb END) LOOP
      UPDATE watch_xds_wallet_targets t SET packet=e->'packet',recipient_key=e->>'publicKey',applied=false
        FROM watch_xds_keys k WHERE t.device_id=k.device_id AND t.device_id=(e->>'deviceId')::uuid
          AND t.wallet_id=w.wallet_id AND k.public_key=e->>'publicKey';
    END LOOP;
    IF p_payload ? 'backup' THEN
      UPDATE watch_xds_wallet_backups SET packet=p_payload->'backup'->'packet'
        WHERE user_id=a.user_id AND request_id=(p_payload->'backup'->>'id')::uuid;
    END IF;
  ELSIF action='received' AND w.address=p_payload->>'address' THEN
    UPDATE watch_xds_wallet_targets t SET applied=true FROM watch_xds_keys k WHERE t.device_id=a.device_id
      AND k.device_id=a.device_id AND t.wallet_id=w.wallet_id AND t.recipient_key=k.public_key AND k.public_key=p_payload->>'publicKey';
  ELSE RAISE EXCEPTION 'unauthorized'; END IF;
  RETURN 'null'::jsonb;
END $$;

CREATE OR REPLACE FUNCTION public.watch_idle_xds_lease(p_hash text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
  SELECT jsonb_build_object('settings',jsonb_build_object('threads',c.threads,'whenQueued',true,'whenPaused',true),
    'seconds',least(45,floor(extract(epoch FROM (b.period_end-now())))::int))
  FROM watch_device_agents a JOIN watch_agent_idle_xds c USING(device_id) JOIN watch_billing b ON b.user_id=a.user_id
  JOIN watch_xds_wallet_targets t USING(device_id)
  WHERE a.credential_hash=p_hash AND a.snapshot->>'platform'='darwin' AND t.applied
    AND a.snapshot->'idleXds'->>'state'<>'setup'
    AND a.snapshot->>'monitorOnly' IS DISTINCT FROM 'true' AND b.status IN ('active','trialing') AND b.period_end>now()+interval '1 second'
$$;
REVOKE ALL ON FUNCTION public.watch_xds_wallet_settings(jsonb,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_xds_wallet_settings(jsonb,text) TO authenticated;
REVOKE ALL ON FUNCTION public.watch_xds_wallet_agent(text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_xds_wallet_agent(text,jsonb) TO service_role;
