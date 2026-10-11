-- Pro history, opt-in notifications and atomic bulk mutations. Not applied until release approval.
BEGIN;
CREATE TABLE public.watch_pro_preferences (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 alerts boolean NOT NULL DEFAULT false, monthly boolean NOT NULL DEFAULT false,
 locale text NOT NULL CHECK(locale IN ('zh','zh-TW','en','ko','ja')),
 recipient text NOT NULL, revision uuid NOT NULL DEFAULT gen_random_uuid(),
 unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.watch_pro_history (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, day date NOT NULL,
 report jsonb NOT NULL CHECK(jsonb_typeof(report)='object'),
 device_reports jsonb NOT NULL DEFAULT '[]' CHECK(jsonb_typeof(device_reports)='array' AND jsonb_array_length(device_reports)<=6000), created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(user_id,day)
);
CREATE TABLE public.watch_pro_tasks (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 kind text NOT NULL CHECK(kind IN ('snapshot','sample','alert','monthly')), task_key text NOT NULL,
 bindings jsonb NOT NULL DEFAULT '[]', cursor integer NOT NULL DEFAULT 0, data jsonb NOT NULL DEFAULT '[]',
 recipient text, locale text NOT NULL DEFAULT 'zh', revision uuid,
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','done','failed')),
 lease uuid, lease_until timestamptz, available_at timestamptz NOT NULL DEFAULT now(), attempts integer NOT NULL DEFAULT 0,
 provider_id text, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id,kind,task_key)
);
CREATE INDEX watch_pro_queue ON public.watch_pro_tasks(status,available_at,created_at);
CREATE TABLE public.watch_alert_states (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, resource text NOT NULL,
 healthy_seen boolean NOT NULL DEFAULT false, first_bad timestamptz, last_at timestamptz NOT NULL,
 bad_count integer NOT NULL DEFAULT 0, notified boolean NOT NULL DEFAULT false,
 PRIMARY KEY(user_id,resource)
);
CREATE TABLE public.watch_bulk_receipts (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, request uuid NOT NULL,
 digest text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,request)
);
ALTER TABLE public.watch_pro_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_pro_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_pro_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_alert_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_bulk_receipts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_pro_preferences,public.watch_pro_history,public.watch_pro_tasks,public.watch_alert_states,public.watch_bulk_receipts FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.watch_pro_preferences,public.watch_pro_history,public.watch_pro_tasks,public.watch_alert_states,public.watch_bulk_receipts TO service_role;

CREATE FUNCTION public.watch_pro_status() RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); e text; p watch_pro_preferences;
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'authentication_required'; END IF;
 SELECT email INTO e FROM auth.users WHERE id=u AND email_confirmed_at IS NOT NULL AND deleted_at IS NULL;
 SELECT * INTO p FROM watch_pro_preferences WHERE user_id=u;
 RETURN jsonb_build_object('alerts',coalesce(p.alerts,false) AND coalesce(p.recipient=e,false),'monthly',coalesce(p.monthly,false) AND coalesce(p.recipient=e,false),'locale',coalesce(p.locale,'zh'),'recipient',e,'eligible',watch_project_device_limit(u)=50 AND e IS NOT NULL);
END $$;
CREATE FUNCTION public.watch_set_pro_preferences(p_alerts boolean,p_monthly boolean,p_locale text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); e text;
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'authentication_required'; END IF;
 IF p_locale NOT IN ('zh','zh-TW','en','ko','ja') THEN RAISE EXCEPTION 'invalid_locale'; END IF;
 SELECT email INTO e FROM auth.users WHERE id=u AND email_confirmed_at IS NOT NULL AND deleted_at IS NULL;
 IF (p_alerts OR p_monthly) AND (watch_project_device_limit(u)<>50 OR e IS NULL) THEN RAISE EXCEPTION 'pro_required'; END IF;
 IF e IS NULL THEN UPDATE watch_pro_preferences SET alerts=false,monthly=false,revision=gen_random_uuid() WHERE user_id=u; RETURN watch_pro_status(); END IF;
 INSERT INTO watch_pro_preferences(user_id,alerts,monthly,locale,recipient) VALUES(u,p_alerts,p_monthly,p_locale,e)
 ON CONFLICT(user_id) DO UPDATE SET alerts=p_alerts,monthly=p_monthly,locale=p_locale,recipient=e,revision=gen_random_uuid(),unsubscribe_token=gen_random_uuid(),updated_at=now();
 -- Re-enabling starts a new baseline and cannot replay pre-consent incidents.
 DELETE FROM watch_alert_states WHERE user_id=u;
 RETURN watch_pro_status();
END $$;
CREATE FUNCTION public.watch_history_read() RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN RETURN watch_export_history_read(NULL); END $$;
CREATE FUNCTION public.watch_device_history_read(p_device uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN
 IF p_device IS NULL THEN RAISE EXCEPTION 'device_not_found'; END IF;
 RETURN watch_export_history_read(p_device);
END $$;
CREATE FUNCTION public.watch_export_history_read(p_device uuid DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); result jsonb;
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'authentication_required'; END IF;
 IF p_device IS NOT NULL AND NOT EXISTS(SELECT 1 FROM watch_devices WHERE user_id=u AND id=p_device) THEN RAISE EXCEPTION 'device_not_found'; END IF;
 IF p_device IS NULL THEN
  SELECT coalesce(jsonb_agg(report ORDER BY day),'[]') INTO result FROM watch_pro_history WHERE user_id=u AND day >= (now() AT TIME ZONE 'Asia/Shanghai')::date-90;
 ELSE
  SELECT coalesce(jsonb_agg(v.value-'id' ORDER BY h.day),'[]') INTO result FROM watch_pro_history h CROSS JOIN LATERAL jsonb_array_elements(h.device_reports) v
  WHERE h.user_id=u AND h.day >= (now() AT TIME ZONE 'Asia/Shanghai')::date-90 AND v.value->>'id'=p_device::text;
 END IF;
 RETURN result;
END $$;
CREATE FUNCTION public.watch_bulk_devices(p_request uuid,p_rows jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); r jsonb; keys jsonb:='{}'; device_uuid uuid; digest text:=md5(p_rows::text); old_digest text; ignored jsonb; k text;
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'authentication_required'; END IF;
 IF watch_project_device_limit(u)<>50 THEN RAISE EXCEPTION 'pro_required'; END IF;
 IF jsonb_typeof(p_rows)<>'array' OR jsonb_array_length(p_rows) NOT BETWEEN 1 AND 100 THEN RAISE EXCEPTION 'invalid_bulk'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(u::text,71051));
 SELECT b.digest INTO old_digest FROM watch_bulk_receipts b WHERE user_id=u AND request=p_request;
 IF old_digest IS NOT NULL THEN IF old_digest<>digest THEN RAISE EXCEPTION 'request_mismatch'; END IF; RETURN watch_list_devices(); END IF;
 IF (SELECT count(*) FROM watch_bulk_receipts WHERE user_id=u AND created_at>now()-interval '1 minute')>=5 THEN RAISE EXCEPTION 'bulk_rate_limit'; END IF;
 FOR r IN SELECT value FROM jsonb_array_elements(p_rows) LOOP
  IF coalesce(length(btrim(r->>'name')),0) NOT BETWEEN 1 AND 40 OR coalesce(length(r->>'hardware'),101)>100 OR length(r::text)>2000 OR
    EXISTS(SELECT 1 FROM jsonb_each_text(r) v WHERE v.value ~ '[[:cntrl:]]') THEN RAISE EXCEPTION 'invalid_bulk'; END IF;
  device_uuid:=nullif(r->>'device_id','')::uuid; k:=r->>'device_key';
  IF device_uuid IS NULL THEN
   IF k IS NULL OR k !~ '^[A-Za-z0-9_-]{1,40}$' THEN RAISE EXCEPTION 'invalid_bulk'; END IF;
   device_uuid:=(keys->>k)::uuid;
   IF device_uuid IS NULL THEN
    INSERT INTO watch_devices(user_id,name,hardware) VALUES(u,btrim(r->>'name'),coalesce(r->>'hardware','')) RETURNING watch_devices.id INTO device_uuid;
    keys:=keys||jsonb_build_object(k,device_uuid);
   ELSE
    IF NOT EXISTS(SELECT 1 FROM watch_devices WHERE user_id=u AND watch_devices.id=device_uuid AND name=r->>'name' AND hardware=coalesce(r->>'hardware','')) THEN RAISE EXCEPTION 'inconsistent_device'; END IF;
   END IF;
  ELSE
   IF NOT EXISTS(SELECT 1 FROM watch_devices WHERE user_id=u AND watch_devices.id=device_uuid) THEN RAISE EXCEPTION 'device_not_found'; END IF;
  END IF;
  IF coalesce(r->>'project','')='' THEN
   ignored:=watch_mutate_device('rename',jsonb_build_object('id',device_uuid,'name',r->>'name','hardware',coalesce(r->>'hardware','')));
  ELSE
   ignored:=watch_mutate_device('link',jsonb_build_object('id',device_uuid,'binding',jsonb_build_object('project',r->>'project','identifier',r->>'identifier','worker',coalesce(r->>'worker',''))));
  END IF;
 END LOOP;
 INSERT INTO watch_bulk_receipts VALUES(u,p_request,digest,now());
 DELETE FROM watch_bulk_receipts WHERE created_at<now()-interval '7 days';
 RETURN watch_list_devices();
EXCEPTION WHEN unique_violation THEN RAISE EXCEPTION 'duplicate_binding';
END $$;

-- Service-only dispatcher. Client RPCs cannot choose an owner, write observations or send mail.
CREATE FUNCTION public.watch_pro_worker(p_action text,p_payload jsonb DEFAULT '{}') RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE t watch_pro_tasks; n timestamptz:=coalesce((p_payload->>'now')::timestamptz,now()); d date:=(n AT TIME ZONE 'Asia/Shanghai')::date;
 u uuid; s watch_alert_states; pref watch_pro_preferences; source text; signal text; token uuid; event text; total integer;
BEGIN
 IF p_action='enqueue' THEN
  DELETE FROM watch_pro_history WHERE day<d-90;
  DELETE FROM watch_pro_tasks WHERE created_at<n-interval '7 days';
  DELETE FROM watch_alert_states WHERE last_at<n-interval '7 days';
  INSERT INTO watch_pro_tasks(user_id,kind,task_key,bindings,locale,created_at,available_at)
   SELECT a.id,'snapshot',(d-1)::text,coalesce((SELECT jsonb_agg(jsonb_build_object('project',b.project,'identifier',b.identifier,'worker',b.worker,'device',b.device_id,'name',v.name) ORDER BY b.project,b.id) FROM watch_bindings b JOIN watch_devices v ON v.id=b.device_id WHERE b.user_id=a.id),'[]'),coalesce(p.locale,'zh'),n,n
   FROM auth.users a LEFT JOIN watch_pro_preferences p ON p.user_id=a.id
   WHERE a.deleted_at IS NULL AND (watch_project_device_limit(a.id)=50 OR EXISTS(SELECT 1 FROM watch_bindings b WHERE b.user_id=a.id)) AND (n AT TIME ZONE 'Asia/Shanghai')::time>='08:00' ON CONFLICT DO NOTHING;
  INSERT INTO watch_pro_tasks(user_id,kind,task_key,bindings,recipient,locale,revision,created_at,available_at)
   SELECT a.id,'sample',floor(extract(epoch FROM n)/600)::text,coalesce((SELECT jsonb_agg(jsonb_build_object('project',b.project,'identifier',b.identifier,'worker',b.worker,'device',b.device_id,'name',v.name) ORDER BY b.project,b.id) FROM watch_bindings b JOIN watch_devices v ON v.id=b.device_id WHERE b.user_id=a.id AND b.project IN ('iota','akash','golem')),'[]'),p.recipient,p.locale,p.revision,n,n
   FROM auth.users a JOIN watch_pro_preferences p ON p.user_id=a.id WHERE p.alerts AND p.recipient=a.email AND a.email_confirmed_at IS NOT NULL AND a.deleted_at IS NULL AND watch_project_device_limit(a.id)=50 ON CONFLICT DO NOTHING;
  INSERT INTO watch_pro_tasks(user_id,kind,task_key,recipient,locale,revision,created_at,available_at)
   SELECT a.id,'monthly',to_char(d-1,'YYYY-MM'),p.recipient,p.locale,p.revision,n,n FROM auth.users a JOIN watch_pro_preferences p ON p.user_id=a.id
   WHERE p.monthly AND p.recipient=a.email AND a.email_confirmed_at IS NOT NULL AND a.deleted_at IS NULL AND watch_project_device_limit(a.id)=50 AND extract(day FROM d)=1 AND (n AT TIME ZONE 'Asia/Shanghai')::time>='09:30'
    AND EXISTS(SELECT 1 FROM watch_pro_history h WHERE h.user_id=a.id AND h.day>=date_trunc('month',d-1)::date AND h.day<d)
    AND EXISTS(SELECT 1 FROM watch_pro_history h WHERE h.user_id=a.id AND h.day=d-1) ON CONFLICT DO NOTHING;
  RETURN 'true';
 ELSIF p_action='claim' THEN
  UPDATE watch_pro_tasks q SET status='failed' WHERE status='pending' AND ((q.kind<>'snapshot' AND watch_project_device_limit(q.user_id)<>50) OR NOT EXISTS(SELECT 1 FROM auth.users a WHERE a.id=q.user_id AND a.deleted_at IS NULL) OR
    (q.kind='snapshot' AND q.task_key<>(d-1)::text) OR (q.kind='sample' AND q.created_at<n-interval '15 minutes') OR (q.kind IN ('alert','monthly') AND q.created_at<n-interval '24 hours') OR
    (q.kind IN ('sample','alert','monthly') AND NOT EXISTS(SELECT 1 FROM watch_pro_preferences p JOIN auth.users a ON a.id=p.user_id WHERE p.user_id=q.user_id AND p.revision=q.revision AND p.recipient=q.recipient AND a.email=q.recipient AND a.email_confirmed_at IS NOT NULL AND a.deleted_at IS NULL AND CASE WHEN q.kind='monthly' THEN p.monthly ELSE p.alerts END)));
  SELECT * INTO t FROM watch_pro_tasks WHERE status='pending' AND available_at<=n AND (lease_until IS NULL OR lease_until<=n) AND attempts<8 ORDER BY CASE kind WHEN 'alert' THEN 0 WHEN 'snapshot' THEN 1 WHEN 'monthly' THEN 2 ELSE 3 END,created_at,id FOR UPDATE SKIP LOCKED LIMIT 1;
  IF NOT FOUND THEN RETURN NULL; END IF;
  UPDATE watch_pro_tasks SET lease=gen_random_uuid(),lease_until=n+interval '3 minutes',attempts=attempts+CASE WHEN kind IN ('alert','monthly') THEN 1 ELSE 0 END WHERE id=t.id RETURNING * INTO t;
  SELECT * INTO pref FROM watch_pro_preferences WHERE user_id=t.user_id;
  RETURN to_jsonb(t)||jsonb_build_object('unsubscribe_token',pref.unsubscribe_token);
 ELSIF p_action='progress' THEN
  UPDATE watch_pro_tasks SET cursor=coalesce((p_payload->>'cursor')::integer,cursor),data=coalesce(p_payload->'data',data),status=CASE WHEN p_payload->>'done'='true' THEN 'done' ELSE status END,provider_id=coalesce(p_payload->>'provider',provider_id),lease=NULL,lease_until=NULL,available_at=n+interval '1 second' WHERE id=(p_payload->>'id')::uuid AND lease=(p_payload->>'lease')::uuid AND lease_until>n AND status='pending';
  RETURN to_jsonb(FOUND);
 ELSIF p_action='can_send' THEN
  RETURN to_jsonb(EXISTS(SELECT 1 FROM watch_pro_tasks q JOIN watch_pro_preferences p ON p.user_id=q.user_id JOIN auth.users a ON a.id=q.user_id WHERE q.id=(p_payload->>'id')::uuid AND q.lease=(p_payload->>'lease')::uuid AND q.lease_until>n AND q.status='pending' AND q.created_at>n-interval '24 hours' AND q.revision=p.revision AND q.recipient=p.recipient AND q.recipient=a.email AND a.email_confirmed_at IS NOT NULL AND a.deleted_at IS NULL AND watch_project_device_limit(q.user_id)=50 AND CASE WHEN q.kind='monthly' THEN p.monthly WHEN q.kind='alert' THEN p.alerts AND EXISTS(SELECT 1 FROM watch_bindings b WHERE b.user_id=q.user_id AND b.project=q.data->'event'->>'project' AND b.identifier=q.data->'event'->>'identifier') ELSE false END));
 ELSIF p_action='history' THEN
  SELECT * INTO t FROM watch_pro_tasks WHERE id=(p_payload->>'id')::uuid AND lease=(p_payload->>'lease')::uuid AND lease_until>n AND kind='snapshot' AND status='pending';
  IF NOT FOUND OR NOT EXISTS(SELECT 1 FROM auth.users a WHERE a.id=t.user_id AND a.deleted_at IS NULL) THEN RETURN 'false'; END IF;
  IF p_payload->'report'->>'day'<>t.task_key THEN RAISE EXCEPTION 'invalid_day'; END IF;
  INSERT INTO watch_pro_history(user_id,day,report,device_reports) VALUES(t.user_id,t.task_key::date,p_payload->'report',coalesce(p_payload->'devices','[]')) ON CONFLICT DO NOTHING;
  RETURN 'true';
 ELSIF p_action='read_history' THEN
  SELECT * INTO t FROM watch_pro_tasks WHERE id=(p_payload->>'id')::uuid AND lease=(p_payload->>'lease')::uuid AND lease_until>n AND status='pending';
  IF NOT FOUND THEN RETURN '[]'; END IF;
  RETURN coalesce((SELECT jsonb_agg(report ORDER BY day) FROM watch_pro_history WHERE user_id=t.user_id AND day>=d-90),'[]');
 ELSIF p_action='observe' THEN
  SELECT * INTO t FROM watch_pro_tasks WHERE id=(p_payload->>'id')::uuid AND lease=(p_payload->>'lease')::uuid AND lease_until>n AND status='pending' AND kind='sample';
  IF NOT FOUND THEN RETURN 'false'; END IF;
  SELECT * INTO pref FROM watch_pro_preferences WHERE user_id=t.user_id;
  IF NOT pref.alerts OR pref.revision<>t.revision OR watch_project_device_limit(t.user_id)<>50 THEN RETURN 'false'; END IF;
  IF NOT EXISTS(SELECT 1 FROM watch_bindings b WHERE b.user_id=t.user_id AND b.project=p_payload->'event'->>'project' AND b.identifier=p_payload->'event'->>'identifier') THEN RETURN 'false'; END IF;
  u:=t.user_id; source:=p_payload->>'resource'; signal:=p_payload->>'signal';
  IF length(source)>220 OR signal NOT IN ('healthy','bad','unknown') THEN RAISE EXCEPTION 'invalid_observation'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(u::text,81011));
  INSERT INTO watch_alert_states(user_id,resource,last_at) VALUES(u,source,n-interval '1 hour') ON CONFLICT DO NOTHING;
  SELECT * INTO s FROM watch_alert_states WHERE user_id=u AND resource=source FOR UPDATE;
  IF s.last_at>=n THEN RETURN 'false'; END IF;
  IF signal='healthy' THEN UPDATE watch_alert_states SET healthy_seen=true,first_bad=NULL,bad_count=0,notified=false,last_at=n WHERE user_id=u AND resource=source;
  ELSIF signal='unknown' THEN UPDATE watch_alert_states SET first_bad=NULL,bad_count=0,last_at=n WHERE user_id=u AND resource=source;
  ELSE
   IF s.first_bad IS NULL OR s.last_at<n-interval '15 minutes' THEN s.first_bad:=n; s.bad_count:=0; END IF;
   UPDATE watch_alert_states SET first_bad=s.first_bad,bad_count=s.bad_count+1,last_at=n WHERE user_id=u AND resource=source;
   IF s.healthy_seen AND NOT s.notified AND n-s.first_bad>=interval '20 minutes' AND s.bad_count>=2 AND
     (SELECT count(*) FROM watch_pro_tasks WHERE user_id=u AND kind='alert' AND created_at>=(d::timestamp AT TIME ZONE 'Asia/Shanghai'))<5 THEN
    event:=source||'/'||extract(epoch FROM s.first_bad)::text;
    INSERT INTO watch_pro_tasks(user_id,kind,task_key,recipient,locale,revision,data,created_at,available_at) VALUES(u,'alert',event,pref.recipient,pref.locale,pref.revision,jsonb_build_object('event',p_payload->'event','since',s.first_bad),n,n) ON CONFLICT DO NOTHING;
    UPDATE watch_alert_states SET notified=true WHERE user_id=u AND resource=source;
    RETURN 'true';
   END IF;
  END IF;
  RETURN 'false';
 ELSIF p_action='unsubscribe' THEN
  UPDATE watch_pro_preferences SET alerts=false,monthly=false,revision=gen_random_uuid(),unsubscribe_token=gen_random_uuid(),updated_at=n WHERE unsubscribe_token=(p_payload->>'token')::uuid;
  RETURN to_jsonb(FOUND);
 ELSE RAISE EXCEPTION 'invalid_worker_action'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.watch_export_history_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_export_history_read(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public.watch_device_history_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_device_history_read(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public.watch_pro_status(),public.watch_set_pro_preferences(boolean,boolean,text),public.watch_history_read(),public.watch_bulk_devices(uuid,jsonb),public.watch_pro_worker(text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_pro_status(),public.watch_set_pro_preferences(boolean,boolean,text),public.watch_history_read(),public.watch_bulk_devices(uuid,jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.watch_pro_worker(text,jsonb) TO service_role;
COMMIT;
