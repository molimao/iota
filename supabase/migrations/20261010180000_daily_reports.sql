-- Apply only as part of the separately approved production release.
BEGIN;
CREATE TABLE public.watch_report_preferences (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 enabled boolean NOT NULL DEFAULT false,
 recipient text NOT NULL CHECK(length(recipient)<=254),
 locale text NOT NULL CHECK(locale IN ('zh','zh-TW','en','ko','ja')),
 enabled_at timestamptz NOT NULL DEFAULT now(),
 revision uuid NOT NULL DEFAULT gen_random_uuid(),
 unsubscribe_token uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.watch_report_jobs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 report_day date NOT NULL,
 revision uuid NOT NULL,
 recipient text NOT NULL,
 locale text NOT NULL,
 device_count integer NOT NULL,
 bindings jsonb NOT NULL,
 readings jsonb NOT NULL DEFAULT '[]',
 cursor integer NOT NULL DEFAULT 0,
 payload jsonb,
 status text NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','ready','sending','sent','suppressed','canceled','failed')),
 lease_token uuid,
 lease_until timestamptz,
 available_at timestamptz NOT NULL DEFAULT now(),
 attempts integer NOT NULL DEFAULT 0,
 provider_id text,
 sent_at timestamptz,
 error_code text,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(user_id,report_day)
);
CREATE INDEX report_jobs_ready ON public.watch_report_jobs(status,available_at);
ALTER TABLE public.watch_report_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_report_jobs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_report_preferences,public.watch_report_jobs FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.watch_report_preferences,public.watch_report_jobs TO service_role;

CREATE FUNCTION public.watch_report_status() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
 SELECT jsonb_build_object('enabled',coalesce(p.enabled,false),'recipient',u.email,'locale',coalesce(p.locale,'zh'),
 'emailChanged',coalesce(p.recipient<>u.email,false),'enabledAt',p.enabled_at,'eligible',watch_project_device_limit(u.id)=50 AND u.email_confirmed_at IS NOT NULL,
 'lastSentAt',(SELECT max(sent_at) FROM watch_report_jobs WHERE user_id=u.id AND status='sent'))
 FROM auth.users u LEFT JOIN watch_report_preferences p ON p.user_id=u.id WHERE u.id=auth.uid();
$$;
CREATE FUNCTION public.watch_set_report_preferences(p_enabled boolean,p_locale text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); e text; confirmed timestamptz;
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
 IF p_enabled IS NULL OR p_locale NOT IN ('zh','zh-TW','en','ko','ja') OR p_locale IS NULL THEN RAISE EXCEPTION 'invalid_preference'; END IF;
 SELECT email,email_confirmed_at INTO e,confirmed FROM auth.users WHERE id=u AND deleted_at IS NULL;
 IF e IS NULL THEN RAISE EXCEPTION 'email_unavailable'; END IF;
 IF p_enabled AND (watch_project_device_limit(u)<>50 OR confirmed IS NULL) THEN RAISE EXCEPTION 'pro_required'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(u::text,81010));
 INSERT INTO watch_report_preferences(user_id,enabled,recipient,locale) VALUES(u,p_enabled,e,p_locale)
 ON CONFLICT(user_id) DO UPDATE SET enabled=excluded.enabled,recipient=e,locale=p_locale,
 enabled_at=CASE WHEN NOT watch_report_preferences.enabled OR watch_report_preferences.recipient<>e THEN now() ELSE watch_report_preferences.enabled_at END,
 revision=CASE WHEN watch_report_preferences.enabled<>p_enabled OR watch_report_preferences.recipient<>e THEN gen_random_uuid() ELSE watch_report_preferences.revision END,unsubscribe_token=CASE WHEN p_enabled AND (NOT watch_report_preferences.enabled OR watch_report_preferences.recipient<>e) THEN gen_random_uuid() ELSE watch_report_preferences.unsubscribe_token END,updated_at=now();
 RETURN watch_report_status();
END; $$;

CREATE FUNCTION public.watch_enqueue_reports(p_now timestamptz) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE inserted integer; day date:=(p_now AT TIME ZONE 'Asia/Shanghai')::date;
BEGIN
 INSERT INTO watch_report_jobs(user_id,report_day,revision,recipient,locale,device_count,bindings)
 SELECT p.user_id,day-1,p.revision,p.recipient,p.locale,(SELECT count(*) FROM watch_devices WHERE user_id=p.user_id),
 coalesce((SELECT jsonb_agg(jsonb_build_object('project',b.project,'identifier',b.identifier,'worker',b.worker) ORDER BY b.project,b.identifier) FROM watch_bindings b WHERE b.user_id=p.user_id),'[]')
 FROM watch_report_preferences p JOIN auth.users u ON u.id=p.user_id JOIN watch_billing b ON b.user_id=p.user_id
 WHERE p.enabled AND p.recipient=u.email AND u.email_confirmed_at IS NOT NULL AND u.deleted_at IS NULL
 AND b.status='active' AND b.period_end>p_now AND p.enabled_at<(day::timestamp AT TIME ZONE 'Asia/Shanghai')
 AND EXISTS(SELECT 1 FROM watch_bindings WHERE user_id=p.user_id)
 ON CONFLICT(user_id,report_day) DO NOTHING;
 GET DIAGNOSTICS inserted=ROW_COUNT;
 -- Only this feature's own expired report snapshots are purged.
 DELETE FROM watch_report_jobs WHERE report_day<day-7;
 RETURN inserted;
END; $$;

CREATE FUNCTION public.watch_claim_report(p_phase text,p_now timestamptz) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE j watch_report_jobs; token uuid:=gen_random_uuid(); day date:=(p_now AT TIME ZONE 'Asia/Shanghai')::date;
BEGIN
 IF p_phase NOT IN ('prepare','send') THEN RAISE EXCEPTION 'invalid_phase'; END IF;
 UPDATE watch_report_jobs x SET status='canceled',lease_token=NULL,lease_until=NULL WHERE x.status IN ('queued','ready','sending') AND (
 x.report_day<>day-1 OR NOT EXISTS(SELECT 1 FROM watch_report_preferences p JOIN auth.users u ON u.id=p.user_id JOIN watch_billing b ON b.user_id=p.user_id
 WHERE p.user_id=x.user_id AND p.enabled AND p.revision=x.revision AND p.recipient=x.recipient AND u.email=x.recipient AND u.email_confirmed_at IS NOT NULL AND u.deleted_at IS NULL AND b.status='active' AND b.period_end>p_now));
 SELECT * INTO j FROM watch_report_jobs x WHERE x.report_day=day-1 AND x.available_at<=p_now AND (x.lease_until IS NULL OR x.lease_until<p_now)
 AND ((p_phase='prepare' AND x.status='queued') OR (p_phase='send' AND x.status IN ('ready','sending') AND (p_now AT TIME ZONE 'Asia/Shanghai')::time>=time '09:30'))
 AND (p_now AT TIME ZONE 'Asia/Shanghai')::time<time '11:00' AND x.attempts<8 ORDER BY x.available_at,x.created_at FOR UPDATE SKIP LOCKED LIMIT 1;
 IF NOT FOUND THEN RETURN NULL; END IF;
 UPDATE watch_report_jobs SET lease_token=token,lease_until=p_now+interval '3 minutes',status=CASE WHEN p_phase='send' THEN 'sending' ELSE status END,attempts=attempts+CASE WHEN p_phase='send' AND payload IS NOT NULL THEN 1 ELSE 0 END WHERE id=j.id;
 RETURN to_jsonb(j)||jsonb_build_object('lease_token',token,'unsubscribe_token',(SELECT unsubscribe_token FROM watch_report_preferences WHERE user_id=j.user_id));
END; $$;

CREATE FUNCTION public.watch_update_report(p_id uuid,p_lease uuid,p_cursor integer,p_readings jsonb,p_payload jsonb,p_status text,p_provider text,p_error text,p_retry_at timestamptz) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN
 IF p_status NOT IN ('queued','ready','sending','sent','suppressed','failed','canceled') OR p_cursor<0 OR jsonb_typeof(p_readings)<>'array' THEN RAISE EXCEPTION 'invalid_job_update'; END IF;
 UPDATE watch_report_jobs SET cursor=p_cursor,readings=p_readings,payload=coalesce(payload,p_payload),status=p_status,provider_id=coalesce(p_provider,provider_id),error_code=p_error,
 sent_at=CASE WHEN p_status='sent' THEN now() ELSE sent_at END,available_at=coalesce(p_retry_at,now()),lease_token=NULL,lease_until=NULL
 WHERE id=p_id AND lease_token=p_lease AND cursor<=p_cursor;
 RETURN FOUND;
END; $$;
CREATE FUNCTION public.watch_report_can_send(p_id uuid,p_lease uuid,p_now timestamptz) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
 SELECT EXISTS(SELECT 1 FROM watch_report_jobs j JOIN watch_report_preferences p ON p.user_id=j.user_id JOIN auth.users u ON u.id=j.user_id JOIN watch_billing b ON b.user_id=j.user_id
 WHERE j.id=p_id AND j.lease_token=p_lease AND j.lease_until>p_now AND j.status='sending' AND j.report_day=(p_now AT TIME ZONE 'Asia/Shanghai')::date-1 AND p.enabled AND p.revision=j.revision
 AND u.email=j.recipient AND p.recipient=j.recipient AND u.email_confirmed_at IS NOT NULL AND u.deleted_at IS NULL AND b.status='active' AND b.period_end>p_now);
$$;
CREATE FUNCTION public.watch_report_unsubscribe(p_token uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN
 UPDATE watch_report_preferences SET enabled=false,revision=gen_random_uuid(),updated_at=now() WHERE unsubscribe_token=p_token AND enabled;
 RETURN FOUND;
END; $$;
REVOKE ALL ON FUNCTION public.watch_report_status(),public.watch_set_report_preferences(boolean,text),public.watch_enqueue_reports(timestamptz),public.watch_claim_report(text,timestamptz),public.watch_update_report(uuid,uuid,integer,jsonb,jsonb,text,text,text,timestamptz),public.watch_report_can_send(uuid,uuid,timestamptz),public.watch_report_unsubscribe(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_report_status(),public.watch_set_report_preferences(boolean,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.watch_enqueue_reports(timestamptz),public.watch_claim_report(text,timestamptz),public.watch_update_report(uuid,uuid,integer,jsonb,jsonb,text,text,text,timestamptz),public.watch_report_can_send(uuid,uuid,timestamptz),public.watch_report_unsubscribe(uuid) TO service_role;
COMMIT;
