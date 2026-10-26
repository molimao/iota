-- Read-only descriptors for this credential's exact device, not its whole account.
CREATE FUNCTION public.watch_agent_binding_manifest(p_hash text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE a public.watch_device_agents;
BEGIN
  SELECT * INTO a FROM public.watch_device_agents WHERE credential_hash=p_hash;
  IF NOT FOUND THEN RAISE EXCEPTION 'unauthorized'; END IF;
  RETURN COALESCE((SELECT jsonb_agg(jsonb_build_object(
    'id',b.id,'project',b.project,'identifier',b.identifier,'worker',b.worker))
    FROM (SELECT id,project,identifier,worker FROM public.watch_bindings
      WHERE user_id=a.user_id AND device_id=a.device_id
      AND project IN ('bnt','prl','noid','xmr')
      AND (project<>'bnt' OR worker<>'')
      ORDER BY id LIMIT 8) b),'[]'::jsonb);
END $$;
REVOKE ALL ON FUNCTION public.watch_agent_binding_manifest(text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_agent_binding_manifest(text) TO service_role;
