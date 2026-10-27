-- Keep all Pro features available as the per-project Pro limit becomes 100.
-- The existing functions use the quota as their Pro entitlement check.
DO $migration$
DECLARE fn record; original text; updated text; changed integer := 0;
BEGIN
 FOR fn IN SELECT p.oid, p.proname FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
   WHERE n.nspname='public' AND p.prokind='f' AND p.proname IN
     ('watch_report_status','watch_set_report_preferences','watch_pro_status','watch_set_pro_preferences',
      'watch_bulk_devices','watch_pro_worker','watch_log_analysis','watch_list_devices')
 LOOP
   original := pg_get_functiondef(fn.oid);
   updated := regexp_replace(original,
     '(watch_project_device_limit\(([^()]|\([^()]*\))*\)\s*(=|<>)\s*)50\M',
     E'\\1' || '100', 'gi');
   IF updated <> original THEN EXECUTE updated; changed := changed + 1; END IF;
 END LOOP;
 -- Seven live functions must be updated; legacy watch_log_analysis is optional.
 IF changed < 7 THEN RAISE EXCEPTION 'pro_quota_migration_missing_entitlement_functions: %', changed; END IF;
END
$migration$;
CREATE OR REPLACE FUNCTION public.watch_project_device_limit(p_user uuid) RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT CASE WHEN EXISTS (SELECT 1 FROM watch_billing WHERE user_id=p_user
 AND status IN ('active','trialing') AND period_end>now()) THEN 100 ELSE 3 END;
$$;
REVOKE ALL ON FUNCTION public.watch_project_device_limit(uuid) FROM PUBLIC, anon, authenticated;
