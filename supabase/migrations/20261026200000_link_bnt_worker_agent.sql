-- An address remains a wallet group. Each explicit Worker gets its own owned
-- project binding on a paired computer; no wallet move or miner command.
CREATE FUNCTION public.watch_link_bnt_worker_agent(p_binding uuid,p_worker text,p_device uuid) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); source public.watch_bindings; existing public.watch_bindings;
  worker_name text:=btrim(p_worker); result_id uuid;
BEGIN
  IF u IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  IF worker_name IS NULL OR length(worker_name) NOT BETWEEN 1 AND 80 THEN
    RAISE EXCEPTION 'worker_required'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(u::text,71051));
  SELECT * INTO source FROM public.watch_bindings WHERE id=p_binding AND user_id=u FOR UPDATE;
  IF NOT FOUND OR source.project<>'bnt' OR (source.worker<>'' AND source.worker<>worker_name)
    THEN RAISE EXCEPTION 'binding_not_found'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.watch_device_agents a JOIN public.watch_devices d
    ON d.id=a.device_id AND d.user_id=a.user_id WHERE a.device_id=p_device AND a.user_id=u)
    THEN RAISE EXCEPTION 'agent_not_found'; END IF;
  SELECT * INTO existing FROM public.watch_bindings
    WHERE user_id=u AND project='bnt' AND identifier=source.identifier AND worker=worker_name FOR UPDATE;
  IF FOUND THEN
    PERFORM public.watch_link_project_agent(existing.id,p_device);
    RETURN existing.id;
  END IF;
  IF (SELECT count(*) FROM public.watch_bindings WHERE user_id=u AND device_id=p_device)>=12
    THEN RAISE EXCEPTION 'binding_limit_reached'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.watch_bindings WHERE user_id=u AND device_id=p_device AND project='bnt')
    AND (SELECT count(DISTINCT device_id) FROM public.watch_bindings WHERE user_id=u AND project='bnt')>=public.watch_project_device_limit(u)
    THEN RAISE EXCEPTION 'project_device_limit_reached'; END IF;
  INSERT INTO public.watch_bindings(user_id,device_id,project,identifier,worker,pool)
    VALUES(u,p_device,'bnt',source.identifier,worker_name,source.pool) RETURNING id INTO result_id;
  RETURN result_id;
END $$;
REVOKE ALL ON FUNCTION public.watch_link_bnt_worker_agent(uuid,text,uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.watch_link_bnt_worker_agent(uuid,text,uuid) TO authenticated;
