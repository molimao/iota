-- Reuse the existing physical Mac instead of installing an Agent per project.
-- Move only this owned binding; keep its ID, address, pool and worker unchanged.
CREATE FUNCTION public.watch_link_project_agent(p_binding uuid,p_device uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); b public.watch_bindings; before_count integer; after_count integer;
BEGIN
  IF u IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(u::text,71051));
  SELECT * INTO b FROM public.watch_bindings WHERE id=p_binding AND user_id=u FOR UPDATE;
  IF NOT FOUND OR b.project NOT IN ('bnt','prl','noid','xmr') THEN RAISE EXCEPTION 'binding_not_found'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.watch_device_agents a JOIN public.watch_devices d
    ON d.id=a.device_id AND d.user_id=a.user_id WHERE a.device_id=p_device AND a.user_id=u)
    THEN RAISE EXCEPTION 'agent_not_found'; END IF;
  IF b.project='bnt' AND b.worker='' THEN RAISE EXCEPTION 'worker_required'; END IF;
  IF b.device_id=p_device THEN RETURN; END IF;
  IF (SELECT count(*) FROM public.watch_bindings WHERE user_id=u AND device_id=p_device)>=12
    THEN RAISE EXCEPTION 'binding_limit_reached'; END IF;
  SELECT count(DISTINCT device_id) INTO before_count FROM public.watch_bindings WHERE user_id=u AND project=b.project;
  after_count:=before_count;
  IF NOT EXISTS(SELECT 1 FROM public.watch_bindings WHERE user_id=u AND device_id=b.device_id AND project=b.project AND id<>p_binding)
    THEN after_count:=after_count-1; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.watch_bindings WHERE user_id=u AND device_id=p_device AND project=b.project)
    THEN after_count:=after_count+1; END IF;
  IF after_count>before_count AND after_count>public.watch_project_device_limit(u)
    THEN RAISE EXCEPTION 'project_device_limit_reached'; END IF;
  UPDATE public.watch_bindings SET device_id=p_device WHERE id=p_binding AND user_id=u;
END $$;
REVOKE ALL ON FUNCTION public.watch_link_project_agent(uuid,uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.watch_link_project_agent(uuid,uuid) TO authenticated;
