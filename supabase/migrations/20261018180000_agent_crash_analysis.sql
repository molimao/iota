-- Opted-in Agent excerpts are analyzed asynchronously; heartbeat never waits for AI.
BEGIN;
CREATE TABLE public.watch_agent_ai_preferences (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 locale text NOT NULL CHECK(locale IN ('zh','zh-TW','en','ko','ja'))
);
CREATE TABLE public.watch_agent_crash_analyses (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 device_id uuid NOT NULL REFERENCES public.watch_device_agents(device_id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 fingerprint text NOT NULL, locale text NOT NULL CHECK(locale IN ('zh','zh-TW','en','ko','ja')),
 logs text CHECK(octet_length(logs)<=48000),
 status text NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','running','done','failed','cancelled','limited')),
 created_at timestamptz NOT NULL DEFAULT now(), finished_at timestamptz,
 available_at timestamptz NOT NULL DEFAULT now(), lease uuid, lease_until timestamptz,
 attempts integer NOT NULL DEFAULT 0, result jsonb CHECK(octet_length(result::text)<=40000),
 UNIQUE(device_id,fingerprint,locale)
);
CREATE INDEX watch_agent_crash_pending ON public.watch_agent_crash_analyses(available_at) WHERE status IN ('queued','running');
ALTER TABLE public.watch_agent_ai_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_agent_crash_analyses ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_agent_ai_preferences,public.watch_agent_crash_analyses FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.watch_agent_ai_preferences,public.watch_agent_crash_analyses TO service_role;
CREATE FUNCTION public.watch_capture_agent_crash() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE excerpt text; anchor text; lang text;
BEGIN
 IF NOT NEW.logs_enabled THEN
  UPDATE watch_log_analyses SET status='failed',finished_at=now() WHERE user_id=NEW.user_id AND status='running' AND request_id IN (SELECT id FROM watch_agent_crash_analyses WHERE device_id=NEW.device_id AND status='running');
  UPDATE watch_agent_crash_analyses SET status='cancelled',logs=NULL,lease=NULL,lease_until=NULL
   WHERE device_id=NEW.device_id AND status IN ('queued','running');
  RETURN NEW;
 END IF;
 excerpt:=NEW.snapshot->>'logs';
 IF excerpt IS NULL OR length(excerpt)<20 THEN RETURN NEW; END IF;
 -- Queue/idle/high memory are not crash evidence. Use an explicit fatal line.
 SELECT line INTO anchor FROM regexp_split_to_table(excerpt,E'\n') WITH ORDINALITY AS l(line,n)
 WHERE line !~* '(no (crash|out of memory)|without (a |an )?(crash|out of memory))' AND line ~* '(SIGABRT|SIGSEGV|panicked at|fatal error|out of memory|MPS backend out of memory|missing local CID|PoisonError|process (aborted|crashed)|crash detected)'
 ORDER BY n LIMIT 1;
 IF anchor IS NULL THEN RETURN NEW; END IF;
 -- The first fatal line retains its original timestamp even as the log tail grows.
 SELECT locale INTO lang FROM watch_agent_ai_preferences WHERE user_id=NEW.user_id;
 IF lang IS NULL THEN
  SELECT locale INTO lang FROM watch_pro_preferences WHERE user_id=NEW.user_id;
 END IF;
 lang:=coalesce(lang,'en');
 -- One incident per 15-minute window, regardless of later panic/cleanup lines.
 IF EXISTS(SELECT 1 FROM watch_agent_crash_analyses WHERE device_id=NEW.device_id AND created_at>now()-interval '15 minutes') THEN RETURN NEW; END IF;
 INSERT INTO watch_agent_crash_analyses(device_id,user_id,fingerprint,locale,logs)
 VALUES(NEW.device_id,NEW.user_id,md5(anchor),lang,left(excerpt,12000)) ON CONFLICT DO NOTHING;
 -- Short retention for queued excerpts; completed results contain only cited snippets.
 UPDATE watch_agent_crash_analyses SET logs=NULL,status='cancelled' WHERE logs IS NOT NULL AND created_at<now()-interval '24 hours' AND status IN ('queued','running');
 RETURN NEW;
END $$;
CREATE TRIGGER watch_capture_agent_crash AFTER INSERT OR UPDATE OF snapshot,logs_enabled ON public.watch_device_agents FOR EACH ROW EXECUTE FUNCTION public.watch_capture_agent_crash();
REVOKE ALL ON FUNCTION public.watch_capture_agent_crash() FROM PUBLIC,anon,authenticated;

CREATE FUNCTION public.watch_agent_analysis_locale(p_locale text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid();
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'authentication_required'; END IF;
 IF p_locale IS NULL OR p_locale NOT IN ('zh','zh-TW','en','ko','ja') THEN RAISE EXCEPTION 'invalid_locale'; END IF;
 INSERT INTO watch_agent_ai_preferences VALUES(u,p_locale) ON CONFLICT(user_id) DO UPDATE SET locale=excluded.locale WHERE watch_agent_ai_preferences.locale<>excluded.locale;
END $$;
REVOKE ALL ON FUNCTION public.watch_agent_analysis_locale(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.watch_agent_analysis_locale(text) TO authenticated;

CREATE FUNCTION public.watch_agent_analysis_read(p_device uuid,p_locale text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); a watch_device_agents;
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'authentication_required'; END IF;
 IF p_locale IS NULL OR p_locale NOT IN ('zh','zh-TW','en','ko','ja') THEN RAISE EXCEPTION 'invalid_locale'; END IF;
 SELECT * INTO a FROM watch_device_agents WHERE device_id=p_device AND user_id=u;
 IF NOT FOUND THEN RAISE EXCEPTION 'device_not_found'; END IF;
 INSERT INTO watch_agent_ai_preferences VALUES(u,p_locale) ON CONFLICT(user_id) DO UPDATE SET locale=excluded.locale WHERE watch_agent_ai_preferences.locale<>excluded.locale;
 RETURN jsonb_build_object('eligible',true,'enabled',a.logs_enabled,'items',coalesce((SELECT jsonb_agg(x) FROM (SELECT id,status,locale,created_at,result FROM watch_agent_crash_analyses WHERE device_id=p_device AND user_id=u AND locale=p_locale ORDER BY created_at DESC LIMIT 5)x),'[]'::jsonb));
END $$;
REVOKE ALL ON FUNCTION public.watch_agent_analysis_read(uuid,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.watch_agent_analysis_read(uuid,text) TO authenticated;

CREATE FUNCTION public.watch_agent_analysis_worker(p_action text,p_id uuid DEFAULT NULL,p_lease uuid DEFAULT NULL,p_result jsonb DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE j watch_agent_crash_analyses; used integer; minute_used integer; start_day timestamptz:=date_trunc('day',now() AT TIME ZONE 'Asia/Shanghai') AT TIME ZONE 'Asia/Shanghai';
BEGIN
 IF p_action='claim' THEN
  UPDATE watch_agent_crash_analyses SET status='failed',logs=NULL,lease=NULL,lease_until=NULL WHERE status='running' AND attempts>=3 AND lease_until<now();
  UPDATE watch_agent_crash_analyses q SET status='cancelled',logs=NULL,lease=NULL,lease_until=NULL WHERE status IN ('queued','running') AND (q.created_at<now()-interval '24 hours' OR NOT EXISTS(SELECT 1 FROM watch_device_agents a WHERE a.device_id=q.device_id AND a.user_id=q.user_id AND a.logs_enabled));
  SELECT * INTO j FROM watch_agent_crash_analyses WHERE (status='queued' OR (status='running' AND lease_until<now())) AND available_at<=now() AND attempts<3 ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1;
  IF NOT FOUND THEN RETURN NULL; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(j.user_id::text,181100));
  IF NOT EXISTS(SELECT 1 FROM watch_log_analyses WHERE user_id=j.user_id AND request_id=j.id) THEN
   SELECT count(*) INTO used FROM watch_log_analyses WHERE user_id=j.user_id AND created_at>=start_day;
   IF used>=10 THEN UPDATE watch_agent_crash_analyses SET status='limited',logs=NULL WHERE id=j.id; RETURN NULL; END IF;
   SELECT count(*) INTO minute_used FROM watch_log_analyses WHERE user_id=j.user_id AND created_at>now()-interval '1 minute';
   IF minute_used>=2 THEN UPDATE watch_agent_crash_analyses SET available_at=now()+interval '1 minute' WHERE id=j.id; RETURN NULL; END IF;
   INSERT INTO watch_log_analyses(user_id,request_id,digest,project) VALUES(j.user_id,j.id,md5(j.logs)||md5(j.locale),'iota');
  END IF;
  UPDATE watch_agent_crash_analyses SET status='running',lease=gen_random_uuid(),lease_until=now()+interval '2 minutes',attempts=attempts+1 WHERE id=j.id RETURNING * INTO j;
  RETURN jsonb_build_object('id',j.id,'lease',j.lease,'locale',j.locale,'logs',j.logs);
 ELSIF p_action IN ('complete','fail') THEN
  SELECT * INTO j FROM watch_agent_crash_analyses WHERE id=p_id AND lease=p_lease AND status='running' AND lease_until>now() FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok',false); END IF;
  IF NOT EXISTS(SELECT 1 FROM watch_device_agents WHERE device_id=j.device_id AND user_id=j.user_id AND logs_enabled) THEN
   UPDATE watch_agent_crash_analyses SET status='cancelled',logs=NULL,lease=NULL,lease_until=NULL WHERE id=j.id;
   UPDATE watch_log_analyses SET status='failed',finished_at=now() WHERE request_id=j.id AND user_id=j.user_id;
   RETURN jsonb_build_object('ok',false);
  END IF;
  IF p_action='complete' THEN
   IF p_result IS NULL OR jsonb_typeof(p_result)<>'object' OR octet_length(p_result::text)>40000 OR p_result->>'locale' IS DISTINCT FROM j.locale THEN RAISE EXCEPTION 'invalid_analysis_result'; END IF;
   UPDATE watch_agent_crash_analyses SET status='done',result=p_result,logs=NULL,finished_at=now(),lease=NULL,lease_until=NULL WHERE id=j.id;
   UPDATE watch_log_analyses SET status='done',result=p_result,finished_at=now() WHERE request_id=j.id AND user_id=j.user_id;
  ELSE
   UPDATE watch_agent_crash_analyses SET status=CASE WHEN attempts>=3 THEN 'failed' ELSE 'queued' END,logs=CASE WHEN attempts>=3 THEN NULL ELSE logs END,available_at=now()+interval '5 minutes',lease=NULL,lease_until=NULL WHERE id=j.id;
   UPDATE watch_log_analyses SET status='failed',finished_at=now() WHERE request_id=j.id AND user_id=j.user_id;
  END IF;
  RETURN jsonb_build_object('ok',true);
 END IF;
 RAISE EXCEPTION 'invalid_action';
END $$;
REVOKE ALL ON FUNCTION public.watch_agent_analysis_worker(text,uuid,uuid,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_agent_analysis_worker(text,uuid,uuid,jsonb) TO service_role;
COMMIT;
