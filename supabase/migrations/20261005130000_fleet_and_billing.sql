-- Apply only with the approved production release. Existing records remain intact.
BEGIN;
CREATE TABLE public.watch_billing (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer text UNIQUE,
  stripe_subscription text UNIQUE,
  status text,
  period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  stripe_event_created bigint NOT NULL DEFAULT 0,
  synced_at timestamptz,
  checkout_token uuid,
  checkout_expires_at timestamptz,
  checkout_session text,
  checkout_interval text,
  checkout_locale text
);
ALTER TABLE public.watch_billing ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_billing FROM anon,authenticated;
GRANT SELECT ON public.watch_billing TO authenticated;
GRANT ALL ON public.watch_billing TO service_role;
CREATE POLICY billing_read_owner ON public.watch_billing FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.watch_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 40),
  hardware text NOT NULL DEFAULT '' CHECK (length(hardware) <= 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, user_id)
);
CREATE INDEX watch_devices_owner ON public.watch_devices(user_id);
CREATE TABLE public.watch_bindings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL,
  user_id uuid NOT NULL,
  project text NOT NULL CHECK (project IN ('iota','xid','quantus','flyai')),
  identifier text NOT NULL CHECK (length(identifier) BETWEEN 1 AND 100),
  worker text NOT NULL DEFAULT '' CHECK (length(worker) <= 80),
  FOREIGN KEY (device_id, user_id) REFERENCES public.watch_devices(id, user_id) ON DELETE CASCADE,
  UNIQUE (user_id, project, identifier, worker)
);
CREATE INDEX watch_bindings_device ON public.watch_bindings(device_id);
ALTER TABLE public.watch_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_bindings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_devices,public.watch_bindings FROM anon,authenticated;
GRANT SELECT ON public.watch_devices, public.watch_bindings TO authenticated;
GRANT ALL ON public.watch_devices, public.watch_bindings TO service_role;
CREATE POLICY devices_read_owner ON public.watch_devices FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY bindings_read_owner ON public.watch_bindings FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- One legacy Miner ID becomes one device. Never merge by name or wallet.
INSERT INTO public.watch_devices(id,user_id,name,created_at)
SELECT id,user_id,label,added_at FROM public.user_devices;
INSERT INTO public.watch_bindings(device_id,user_id,project,identifier)
SELECT id,user_id,'iota',hotkey FROM public.user_devices;

-- Fail the complete transaction if even one original record was not preserved.
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM public.user_devices old
    WHERE NOT EXISTS (
      SELECT 1 FROM public.watch_devices d JOIN public.watch_bindings b ON b.device_id=d.id
      WHERE d.id=old.id AND d.user_id=old.user_id AND d.name=old.label
        AND b.user_id=old.user_id AND b.project='iota' AND b.identifier=old.hotkey
    )
  ) THEN RAISE EXCEPTION 'legacy_device_migration_incomplete'; END IF;
END; $$;
-- Archive remains readable; writes now use the atomic fleet RPC below.
REVOKE INSERT, UPDATE, DELETE ON public.user_devices FROM authenticated;

CREATE FUNCTION public.watch_project_device_limit(p_user uuid) RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE WHEN EXISTS (SELECT 1 FROM watch_billing WHERE user_id = p_user
    AND status = 'active' AND period_end > now()) THEN 50 ELSE 5 END;
$$;
REVOKE ALL ON FUNCTION public.watch_project_device_limit(uuid) FROM PUBLIC, anon, authenticated;

CREATE FUNCTION public.watch_list_devices() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'quotaScope', 'per_project',
    'projectDeviceLimit', watch_project_device_limit(auth.uid()),
    'plan', CASE WHEN watch_project_device_limit(auth.uid()) = 50 THEN 'pro' ELSE 'free' END,
    'projectCounts', (SELECT jsonb_object_agg(p.project, (SELECT count(DISTINCT b.device_id)
      FROM watch_bindings b WHERE b.user_id=auth.uid() AND b.project=p.project))
      FROM (VALUES ('iota'),('xid'),('quantus'),('flyai')) AS p(project)),
    'devices', coalesce((SELECT jsonb_agg(jsonb_build_object(
      'id',d.id,'name',d.name,'hardware',d.hardware,'createdAt',floor(extract(epoch FROM d.created_at)*1000),
      'bindings',coalesce((SELECT jsonb_agg(jsonb_build_object('id',b.id,'project',b.project,
        'identifier',b.identifier,'worker',b.worker) ORDER BY b.id) FROM watch_bindings b
        WHERE b.device_id=d.id AND b.user_id=auth.uid()),'[]'::jsonb)
    ) ORDER BY d.created_at,d.id) FROM watch_devices d WHERE d.user_id=auth.uid()),'[]'::jsonb)
  ) WHERE auth.uid() IS NOT NULL;
$$;
REVOKE ALL ON FUNCTION public.watch_list_devices() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.watch_list_devices() TO authenticated;

CREATE FUNCTION public.watch_mutate_device(p_action text, p_payload jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  u uuid := auth.uid(); d uuid; source_id uuid; b jsonb;
BEGIN
  IF u IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  -- Serialize all mutations for an account: simultaneous tabs cannot exceed a quota.
  PERFORM pg_advisory_xact_lock(hashtextextended(u::text, 71051));
  IF p_action = 'create' THEN
    -- Creating an aggregation record consumes no project quota.
    INSERT INTO watch_devices(user_id,name,hardware) VALUES(u,btrim(p_payload->>'name'),
      coalesce(btrim(p_payload->>'hardware'),'')) RETURNING id INTO d;
  ELSE
    d := (p_payload->>'id')::uuid;
    IF NOT EXISTS (SELECT 1 FROM watch_devices WHERE id=d AND user_id=u)
      THEN RAISE EXCEPTION 'device_not_found'; END IF;
    CASE p_action
      WHEN 'rename' THEN UPDATE watch_devices SET name=btrim(p_payload->>'name'),
        hardware=coalesce(btrim(p_payload->>'hardware'),'') WHERE id=d AND user_id=u;
      WHEN 'remove' THEN DELETE FROM watch_devices WHERE id=d AND user_id=u;
      WHEN 'unlink' THEN DELETE FROM watch_bindings WHERE id=(p_payload->>'bindingId')::uuid
        AND device_id=d AND user_id=u;
      WHEN 'merge' THEN
        source_id := (p_payload->>'sourceId')::uuid;
        IF source_id=d OR NOT EXISTS (SELECT 1 FROM watch_devices WHERE id=source_id AND user_id=u)
          THEN RAISE EXCEPTION 'device_not_found'; END IF;
        IF (SELECT count(*) FROM watch_bindings WHERE device_id IN (d,source_id)) > 12
          THEN RAISE EXCEPTION 'binding_limit_reached'; END IF;
        UPDATE watch_bindings SET device_id=d WHERE device_id=source_id AND user_id=u;
        UPDATE watch_devices SET hardware=coalesce(nullif(hardware,''),
          (SELECT hardware FROM watch_devices WHERE id=source_id AND user_id=u),'') WHERE id=d AND user_id=u;
        DELETE FROM watch_devices WHERE id=source_id AND user_id=u;
      WHEN 'link' THEN NULL;
      ELSE RAISE EXCEPTION 'invalid_action';
    END CASE;
  END IF;
  IF p_action IN ('create','link') AND p_payload ? 'binding' THEN
    IF (SELECT count(*) FROM watch_bindings WHERE device_id=d AND user_id=u) >= 12
      THEN RAISE EXCEPTION 'binding_limit_reached'; END IF;
    b := p_payload->'binding';
    -- Adding another source for an existing project on the same device consumes
    -- no additional slot. Quotas in other projects never block this project.
    IF NOT EXISTS (SELECT 1 FROM watch_bindings WHERE device_id=d AND user_id=u AND project=b->>'project')
      AND (SELECT count(DISTINCT device_id) FROM watch_bindings WHERE user_id=u AND project=b->>'project')
        >= watch_project_device_limit(u) THEN
      RAISE EXCEPTION 'project_device_limit_reached';
    END IF;
    IF NOT (CASE b->>'project'
      WHEN 'iota' THEN b->>'identifier' ~ '^[1-9A-HJ-NP-Za-km-z]{47,49}$'
      WHEN 'xid' THEN b->>'identifier' ~ '^xpa1[a-z0-9]{50,96}$'
      WHEN 'quantus' THEN b->>'identifier' ~ '^[1-9A-HJ-NP-Za-km-z]{47,60}$'
      WHEN 'flyai' THEN b->>'identifier' ~ '^0x[0-9a-fA-F]{40}$'
      ELSE false END) OR b->>'identifier' IS NULL THEN RAISE EXCEPTION 'invalid_binding'; END IF;
    INSERT INTO watch_bindings(device_id,user_id,project,identifier,worker) VALUES(d,u,b->>'project',
      CASE WHEN b->>'project'='flyai' THEN lower(b->>'identifier') ELSE b->>'identifier' END,
      coalesce(b->>'worker',''));
  END IF;
  RETURN watch_list_devices();
END;
$$;
REVOKE ALL ON FUNCTION public.watch_mutate_device(text,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.watch_mutate_device(text,jsonb) TO authenticated;

CREATE TABLE public.watch_stripe_events(id text PRIMARY KEY, received_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE public.watch_stripe_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_stripe_events FROM anon,authenticated;
GRANT ALL ON public.watch_stripe_events TO service_role;

CREATE FUNCTION public.watch_sync_subscription(p_event text, p_created bigint, p_user uuid,
  p_customer text,p_subscription text,p_status text,p_end timestamptz,p_cancel boolean) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(p_user::text,71051));
  IF EXISTS (SELECT 1 FROM watch_stripe_events WHERE id=p_event) THEN RETURN; END IF;
  IF NOT EXISTS (SELECT 1 FROM watch_billing WHERE user_id=p_user AND stripe_customer=p_customer)
    THEN RAISE EXCEPTION 'customer_mismatch'; END IF;
  UPDATE watch_billing SET stripe_subscription=p_subscription,status=p_status,period_end=p_end,
    cancel_at_period_end=p_cancel,stripe_event_created=p_created,synced_at=now()
    WHERE user_id=p_user AND stripe_customer=p_customer AND stripe_event_created <= p_created
      AND (stripe_subscription IS NULL OR stripe_subscription=p_subscription
        OR status IN ('canceled','incomplete_expired') OR p_status='active');
  INSERT INTO watch_stripe_events(id) VALUES(p_event);
END;
$$;
REVOKE ALL ON FUNCTION public.watch_sync_subscription(text,bigint,uuid,text,text,text,timestamptz,boolean)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_sync_subscription(text,bigint,uuid,text,text,text,timestamptz,boolean)
  TO service_role;

-- Reuse a reservation across tabs, retries and double clicks.
CREATE FUNCTION public.watch_reserve_checkout(p_user uuid,p_interval text,p_customer text,p_locale text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r watch_billing;
BEGIN
  IF p_interval NOT IN ('month','year') OR p_customer !~ '^cus_[A-Za-z0-9]+$'
    OR p_locale NOT IN ('zh','zh-TW','en','ko','ja')
    THEN RAISE EXCEPTION 'invalid_checkout'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(p_user::text,71051));
  INSERT INTO watch_billing(user_id,stripe_customer) VALUES(p_user,p_customer)
    ON CONFLICT(user_id) DO NOTHING;
  SELECT * INTO r FROM watch_billing WHERE user_id=p_user FOR UPDATE;
  IF r.stripe_customer IS NULL THEN
    UPDATE watch_billing SET stripe_customer=p_customer WHERE user_id=p_user;
  ELSIF r.stripe_customer<>p_customer THEN RAISE EXCEPTION 'customer_mismatch'; END IF;
  IF r.status IS NOT NULL AND r.status NOT IN ('canceled','incomplete_expired')
    THEN RAISE EXCEPTION 'subscription_exists'; END IF;
  IF r.checkout_token IS NOT NULL AND r.checkout_expires_at>now() THEN
    IF r.checkout_interval<>p_interval THEN RAISE EXCEPTION 'checkout_pending'; END IF;
  ELSE
    UPDATE watch_billing SET checkout_token=gen_random_uuid(),checkout_expires_at=now()+interval '1 hour',
      checkout_interval=p_interval,checkout_locale=p_locale,checkout_session=NULL WHERE user_id=p_user;
  END IF;
  SELECT * INTO r FROM watch_billing WHERE user_id=p_user;
  RETURN jsonb_build_object('token',r.checkout_token,'expiresAt',floor(extract(epoch FROM r.checkout_expires_at)),
    'session',r.checkout_session,'locale',r.checkout_locale);
END;
$$;
CREATE FUNCTION public.watch_finish_checkout(p_user uuid,p_token uuid,p_session text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE watch_billing SET checkout_session=p_session WHERE user_id=p_user AND checkout_token=p_token;
  IF NOT FOUND THEN RAISE EXCEPTION 'checkout_reservation_expired'; END IF;
END;
$$;
CREATE FUNCTION public.watch_release_checkout(p_user uuid,p_token uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(p_user::text,71051));
  UPDATE watch_billing SET checkout_token=NULL,checkout_session=NULL,checkout_expires_at=NULL,
    checkout_interval=NULL,checkout_locale=NULL WHERE user_id=p_user AND checkout_token=p_token
    AND (status IS NULL OR status IN ('canceled','incomplete_expired'));
  IF NOT FOUND THEN RAISE EXCEPTION 'checkout_processing'; END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.watch_reserve_checkout(uuid,text,text,text),public.watch_finish_checkout(uuid,uuid,text),public.watch_release_checkout(uuid,uuid)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_reserve_checkout(uuid,text,text,text),public.watch_finish_checkout(uuid,uuid,text),public.watch_release_checkout(uuid,uuid)
  TO service_role;
COMMIT;
