BEGIN;

ALTER TABLE public.watch_bindings DROP CONSTRAINT watch_bindings_pool_check;
ALTER TABLE public.watch_bindings ADD CONSTRAINT watch_bindings_pool_check CHECK (
  (project='quantus' AND pool IN ('','2miners','kryptex')) OR
  (project='csd' AND pool='gpools') OR
  (project='bnt' AND pool='bntpool') OR
  (project='mds' AND pool='luckypool') OR
  (project='prl' AND pool IN ('kryptex','luckypool','peryn','pearlhash','herominers','pearlfortune','alphapool','pearlski')) OR
  (project='xmr' AND pool='kryptex') OR
  (project IN ('etc','rvn','zec','kas','erg','zeph','ethw') AND pool='2miners') OR
  (project='tsc' AND pool IN ('chain','tigerpool','boblabs','ariapool','luckypool','suprnova')) OR
  (project='btc' AND pool='ckpool') OR
  (project NOT IN ('quantus','csd','bnt','mds','prl','xmr','etc','rvn','zec','kas','erg','zeph','btc','ethw','tsc') AND pool='')
);

CREATE OR REPLACE FUNCTION public.watch_link_prl_worker_agent(p_binding uuid,p_worker text,p_device uuid) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); source public.watch_bindings; existing public.watch_bindings;
  worker_name text:=btrim(p_worker); result_id uuid;
BEGIN
  IF u IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  IF worker_name IS NULL OR length(worker_name) NOT BETWEEN 1 AND 80 THEN
    RAISE EXCEPTION 'worker_required'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(u::text,71051));
  SELECT * INTO source FROM public.watch_bindings WHERE id=p_binding AND user_id=u FOR UPDATE;
  IF NOT FOUND OR (source.project <> 'prl' AND NOT (source.project = 'quantus' AND source.pool IN ('2miners','kryptex')))
    THEN RAISE EXCEPTION 'binding_not_found'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.watch_device_agents a JOIN public.watch_devices d
    ON d.id=a.device_id AND d.user_id=a.user_id WHERE a.device_id=p_device AND a.user_id=u)
    THEN RAISE EXCEPTION 'agent_not_found'; END IF;
  SELECT * INTO existing FROM public.watch_bindings
    WHERE user_id=u AND project=source.project AND identifier=source.identifier AND worker=worker_name
      AND pool=source.pool FOR UPDATE;
  IF FOUND THEN
    PERFORM public.watch_link_project_agent(existing.id,p_device);
    RETURN existing.id;
  END IF;
  IF (SELECT count(*) FROM public.watch_bindings WHERE user_id=u AND device_id=p_device)>=12
    THEN RAISE EXCEPTION 'binding_limit_reached'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.watch_bindings WHERE user_id=u AND device_id=p_device AND project=source.project)
    AND (SELECT count(DISTINCT device_id) FROM public.watch_bindings WHERE user_id=u AND project=source.project)>=public.watch_project_device_limit(u)
    THEN RAISE EXCEPTION 'project_device_limit_reached'; END IF;
  INSERT INTO public.watch_bindings(user_id,device_id,project,identifier,worker,pool)
    VALUES(u,p_device,source.project,source.identifier,worker_name,source.pool) RETURNING id INTO result_id;
  RETURN result_id;
END $$;

CREATE OR REPLACE FUNCTION public.watch_link_project_agent(p_binding uuid,p_device uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); b public.watch_bindings; before_count integer; after_count integer;
BEGIN
  IF u IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(u::text,71051));
  SELECT * INTO b FROM public.watch_bindings WHERE id=p_binding AND user_id=u FOR UPDATE;
  IF NOT FOUND OR (b.project NOT IN ('bnt','prl','noid','xmr') AND NOT (b.project = 'quantus' AND b.pool IN ('2miners','kryptex'))) THEN RAISE EXCEPTION 'binding_not_found'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.watch_device_agents a JOIN public.watch_devices d
    ON d.id=a.device_id AND d.user_id=a.user_id WHERE a.device_id=p_device AND a.user_id=u)
    THEN RAISE EXCEPTION 'agent_not_found'; END IF;
  IF b.project IN ('bnt','prl','quantus') AND btrim(b.worker)='' THEN RAISE EXCEPTION 'worker_required'; END IF;
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

COMMIT;
