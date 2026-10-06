-- Apply only with the corresponding approved production release.
BEGIN;
ALTER TABLE public.watch_bindings DROP CONSTRAINT watch_bindings_project_check;
ALTER TABLE public.watch_bindings ADD CONSTRAINT watch_bindings_project_check CHECK (project IN ('iota','xid','quantus','flyai','nosana','gonka','akash','ionet','vast','golem'));
CREATE OR REPLACE FUNCTION public.watch_list_devices() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'quotaScope', 'per_project',
    'projectDeviceLimit', watch_project_device_limit(auth.uid()),
    'plan', CASE WHEN watch_project_device_limit(auth.uid()) = 50 THEN 'pro' ELSE 'free' END,
    'projectCounts', (SELECT jsonb_object_agg(p.project, (SELECT count(DISTINCT b.device_id)
      FROM watch_bindings b WHERE b.user_id=auth.uid() AND b.project=p.project))
      FROM (VALUES ('iota'),('xid'),('quantus'),('flyai'),('nosana'),('gonka'),('akash'),('ionet'),('vast'),('golem')) AS p(project)),
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

CREATE OR REPLACE FUNCTION public.watch_mutate_device(p_action text, p_payload jsonb) RETURNS jsonb
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
      WHEN 'akash' THEN b->>'identifier' ~ '^akash1[023456789acdefghjklmnpqrstuvwxyz]{38}$'
      WHEN 'ionet' THEN b->>'identifier' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      WHEN 'vast' THEN b->>'identifier' ~ '^[1-9][0-9]{0,14}$'
      WHEN 'golem' THEN b->>'identifier' ~ '^0x[0-9a-f]{40}$'
      WHEN 'nosana' THEN b->>'identifier' ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$'
      WHEN 'gonka' THEN b->>'identifier' ~ '^gonka1[023456789acdefghjklmnpqrstuvwxyz]{38}$'
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


COMMIT;
