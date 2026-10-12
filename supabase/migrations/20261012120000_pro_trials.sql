-- Trial subscriptions receive the same time-bounded Pro access as paid subscriptions.
CREATE OR REPLACE FUNCTION public.watch_project_device_limit(p_user uuid) RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT CASE WHEN EXISTS (SELECT 1 FROM watch_billing WHERE user_id=p_user
 AND status IN ('active','trialing') AND period_end>now()) THEN 50 ELSE 5 END;
$$;
CREATE OR REPLACE FUNCTION public.watch_enqueue_reports(p_now timestamptz) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE inserted integer; day date:=(p_now AT TIME ZONE 'Asia/Shanghai')::date;
BEGIN
 INSERT INTO watch_report_jobs(user_id,report_day,revision,recipient,locale,device_count,bindings)
 SELECT p.user_id,day-1,p.revision,p.recipient,p.locale,(SELECT count(*) FROM watch_devices WHERE user_id=p.user_id),
 coalesce((SELECT jsonb_agg(jsonb_build_object('project',b.project,'identifier',b.identifier,'worker',b.worker) ORDER BY b.project,b.identifier) FROM watch_bindings b WHERE b.user_id=p.user_id),'[]')
 FROM watch_report_preferences p JOIN auth.users u ON u.id=p.user_id JOIN watch_billing b ON b.user_id=p.user_id
 WHERE p.enabled AND p.recipient=u.email AND u.email_confirmed_at IS NOT NULL AND u.deleted_at IS NULL
 AND b.status IN ('active','trialing') AND b.period_end>p_now AND p.enabled_at<(day::timestamp AT TIME ZONE 'Asia/Shanghai')
 AND EXISTS(SELECT 1 FROM watch_bindings WHERE user_id=p.user_id)
 ON CONFLICT(user_id,report_day) DO NOTHING;
 GET DIAGNOSTICS inserted=ROW_COUNT;
 -- Only this feature's own expired report snapshots are purged.
 DELETE FROM watch_report_jobs WHERE report_day<day-7;
 RETURN inserted;
END; $$;

CREATE OR REPLACE FUNCTION public.watch_claim_report(p_phase text,p_now timestamptz) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE j watch_report_jobs; token uuid:=gen_random_uuid(); day date:=(p_now AT TIME ZONE 'Asia/Shanghai')::date;
BEGIN
 IF p_phase NOT IN ('prepare','send') THEN RAISE EXCEPTION 'invalid_phase'; END IF;
 UPDATE watch_report_jobs x SET status='canceled',lease_token=NULL,lease_until=NULL WHERE x.status IN ('queued','ready','sending') AND (
 x.report_day<>day-1 OR NOT EXISTS(SELECT 1 FROM watch_report_preferences p JOIN auth.users u ON u.id=p.user_id JOIN watch_billing b ON b.user_id=p.user_id
 WHERE p.user_id=x.user_id AND p.enabled AND p.revision=x.revision AND p.recipient=x.recipient AND u.email=x.recipient AND u.email_confirmed_at IS NOT NULL AND u.deleted_at IS NULL AND b.status IN ('active','trialing') AND b.period_end>p_now));
 SELECT * INTO j FROM watch_report_jobs x WHERE x.report_day=day-1 AND x.available_at<=p_now AND (x.lease_until IS NULL OR x.lease_until<p_now)
 AND ((p_phase='prepare' AND x.status='queued') OR (p_phase='send' AND x.status IN ('ready','sending') AND (p_now AT TIME ZONE 'Asia/Shanghai')::time>=time '09:30'))
 AND (p_now AT TIME ZONE 'Asia/Shanghai')::time<time '11:00' AND x.attempts<8 ORDER BY x.available_at,x.created_at FOR UPDATE SKIP LOCKED LIMIT 1;
 IF NOT FOUND THEN RETURN NULL; END IF;
 UPDATE watch_report_jobs SET lease_token=token,lease_until=p_now+interval '3 minutes',status=CASE WHEN p_phase='send' THEN 'sending' ELSE status END,attempts=attempts+CASE WHEN p_phase='send' AND payload IS NOT NULL THEN 1 ELSE 0 END WHERE id=j.id;
 RETURN to_jsonb(j)||jsonb_build_object('lease_token',token,'unsubscribe_token',(SELECT unsubscribe_token FROM watch_report_preferences WHERE user_id=j.user_id));
END; $$;

CREATE OR REPLACE FUNCTION public.watch_report_can_send(p_id uuid,p_lease uuid,p_now timestamptz) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
 SELECT EXISTS(SELECT 1 FROM watch_report_jobs j JOIN watch_report_preferences p ON p.user_id=j.user_id JOIN auth.users u ON u.id=j.user_id JOIN watch_billing b ON b.user_id=j.user_id
 WHERE j.id=p_id AND j.lease_token=p_lease AND j.lease_until>p_now AND j.status='sending' AND j.report_day=(p_now AT TIME ZONE 'Asia/Shanghai')::date-1 AND p.enabled AND p.revision=j.revision
 AND u.email=j.recipient AND p.recipient=j.recipient AND u.email_confirmed_at IS NOT NULL AND u.deleted_at IS NULL AND b.status IN ('active','trialing') AND b.period_end>p_now);
$$;
