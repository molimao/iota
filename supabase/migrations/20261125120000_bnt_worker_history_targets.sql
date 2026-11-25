CREATE FUNCTION public.watch_bnt_worker_history_targets() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT coalesce(jsonb_agg(to_jsonb(target) ORDER BY target.address), '[]'::jsonb)
  FROM (
    SELECT identifier AS address, array_agg(DISTINCT user_id) AS user_ids
    FROM public.watch_bindings
    WHERE project = 'bnt'
    GROUP BY identifier
  ) target;
$$;

REVOKE ALL ON FUNCTION public.watch_bnt_worker_history_targets() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.watch_bnt_worker_history_targets() TO service_role;
