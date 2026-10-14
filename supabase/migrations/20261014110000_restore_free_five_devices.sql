-- Restore the Free new-device quota to five per project. Existing records, readings and subscriptions remain intact.
CREATE OR REPLACE FUNCTION public.watch_project_device_limit(p_user uuid) RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT CASE WHEN EXISTS (SELECT 1 FROM watch_billing WHERE user_id=p_user
 AND status IN ('active','trialing') AND period_end>now()) THEN 50 ELSE 5 END;
$$;
REVOKE ALL ON FUNCTION public.watch_project_device_limit(uuid) FROM PUBLIC, anon, authenticated;
