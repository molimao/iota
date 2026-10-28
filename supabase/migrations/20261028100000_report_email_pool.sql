-- Daily mail needs the saved pool, so PRL and TensorCash read the same account as the site.
CREATE OR REPLACE FUNCTION public.watch_enqueue_reports(p_now timestamptz) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE inserted integer; day date:=(p_now AT TIME ZONE 'Asia/Shanghai')::date;
BEGIN
 INSERT INTO watch_report_jobs(user_id,report_day,revision,recipient,locale,device_count,bindings)
 SELECT p.user_id,day-1,p.revision,p.recipient,p.locale,(SELECT count(*) FROM watch_devices WHERE user_id=p.user_id),
 coalesce((SELECT jsonb_agg(jsonb_strip_nulls(jsonb_build_object('project',b.project,'identifier',b.identifier,'worker',b.worker,'pool',nullif(b.pool,''))) ORDER BY b.project,b.identifier) FROM watch_bindings b WHERE b.user_id=p.user_id),'[]')
 FROM watch_report_preferences p JOIN auth.users u ON u.id=p.user_id JOIN watch_billing b ON b.user_id=p.user_id
 WHERE p.enabled AND p.recipient=u.email AND u.email_confirmed_at IS NOT NULL AND u.deleted_at IS NULL
 AND b.status IN ('active','trialing') AND b.period_end>p_now AND p.enabled_at<(day::timestamp AT TIME ZONE 'Asia/Shanghai')
 AND EXISTS(SELECT 1 FROM watch_bindings WHERE user_id=p.user_id)
 ON CONFLICT(user_id,report_day) DO NOTHING;
 GET DIAGNOSTICS inserted=ROW_COUNT;
 DELETE FROM watch_report_jobs WHERE report_day<day-7;
 RETURN inserted;
END; $$;
