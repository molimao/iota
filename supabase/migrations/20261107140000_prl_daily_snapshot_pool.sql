-- Freeze the selected pool with each snapshot binding. One wallet can be used on several pools.
DO $migration$
DECLARE
  definition text := pg_get_functiondef('public.watch_pro_worker(text,jsonb)'::regprocedure);
  before text := $old$SELECT a.id,'snapshot',(d-1)::text,coalesce((SELECT jsonb_agg(jsonb_build_object('project',b.project,'identifier',b.identifier,'worker',b.worker,'device',b.device_id,'name',v.name) ORDER BY$old$;
  after text := $new$SELECT a.id,'snapshot',(d-1)::text,coalesce((SELECT jsonb_agg(jsonb_strip_nulls(jsonb_build_object('project',b.project,'identifier',b.identifier,'worker',b.worker,'device',b.device_id,'name',v.name,'pool',nullif(b.pool,''))) ORDER BY$new$;
BEGIN
  IF strpos(definition, before) = 0 THEN
    RAISE EXCEPTION 'snapshot_binding_definition_changed';
  END IF;
  EXECUTE replace(definition, before, after);
END
$migration$;
