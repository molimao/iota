CREATE TABLE public.watch_log_analyses (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 request_id uuid NOT NULL,
 digest text NOT NULL CHECK(digest ~ '^[a-f0-9]{64}$'),
 project text NOT NULL CHECK(length(project) BETWEEN 1 AND 40),
 status text NOT NULL DEFAULT 'running' CHECK(status IN ('running','done','failed')),
 result jsonb,
 created_at timestamptz NOT NULL DEFAULT now(),
 finished_at timestamptz,
 UNIQUE(user_id,request_id),
 CHECK(result IS NULL OR octet_length(result::text)<=40000)
);
CREATE INDEX watch_log_analyses_owner ON public.watch_log_analyses(user_id,created_at DESC);
ALTER TABLE public.watch_log_analyses ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_log_analyses FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.watch_log_analyses TO service_role;
CREATE FUNCTION public.watch_log_analysis(p_action text,p_request uuid DEFAULT NULL,p_digest text DEFAULT NULL,p_project text DEFAULT NULL,p_result jsonb DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); job watch_log_analyses; used integer; start_day timestamptz:=date_trunc('day',now() AT TIME ZONE 'Asia/Shanghai') AT TIME ZONE 'Asia/Shanghai'; eligible boolean;
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'authentication_required'; END IF;
 eligible:=watch_project_device_limit(u)=50;
 IF p_action='list' THEN
  RETURN jsonb_build_object('eligible',eligible,'used',(SELECT count(*) FROM watch_log_analyses WHERE user_id=u AND created_at>=start_day),'limit',10,'items',coalesce((SELECT jsonb_agg(x) FROM (SELECT id,project,result,created_at FROM watch_log_analyses WHERE user_id=u AND status='done' ORDER BY created_at DESC LIMIT 20)x),'[]'::jsonb));
 END IF;
 IF NOT eligible THEN RAISE EXCEPTION 'pro_required'; END IF;
 IF p_action='reserve' THEN
  IF p_request IS NULL OR p_digest IS NULL OR p_digest !~ '^[a-f0-9]{64}$' OR p_project IS NULL OR length(p_project) NOT BETWEEN 1 AND 40 THEN RAISE EXCEPTION 'invalid_analysis_request'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(u::text, 181100));
  SELECT * INTO job FROM watch_log_analyses WHERE user_id=u AND request_id=p_request;
  IF FOUND THEN
   IF job.digest<>p_digest OR job.project<>p_project THEN RAISE EXCEPTION 'request_mismatch'; END IF;
   RETURN jsonb_build_object('fresh',false,'status',job.status,'result',job.result);
  END IF;
  SELECT count(*) INTO used FROM watch_log_analyses WHERE user_id=u AND created_at>=start_day;
  IF used>=10 THEN RAISE EXCEPTION 'analysis_daily_limit'; END IF;
  IF (SELECT count(*) FROM watch_log_analyses WHERE user_id=u AND created_at>now()-interval '1 minute')>=2 THEN RAISE EXCEPTION 'analysis_rate_limit'; END IF;
  INSERT INTO watch_log_analyses(user_id,request_id,digest,project) VALUES(u,p_request,p_digest,p_project);
  RETURN jsonb_build_object('fresh',true,'status','running','remaining',9-used);
 ELSIF p_action IN ('complete','fail') THEN
  IF p_action='complete' AND (p_result IS NULL OR jsonb_typeof(p_result)<>'object' OR octet_length(p_result::text)>40000) THEN RAISE EXCEPTION 'invalid_analysis_result'; END IF;
  UPDATE watch_log_analyses SET status=CASE WHEN p_action='complete' THEN 'done' ELSE 'failed' END,result=CASE WHEN p_action='complete' THEN p_result ELSE NULL END,finished_at=now() WHERE user_id=u AND request_id=p_request AND status='running' AND created_at>now()-interval '3 minutes';
  IF NOT FOUND THEN RAISE EXCEPTION 'analysis_request_unavailable'; END IF;
  RETURN jsonb_build_object('ok',true);
 END IF;
 RAISE EXCEPTION 'invalid_analysis_action';
END $$;
REVOKE ALL ON FUNCTION public.watch_log_analysis(text,uuid,text,text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_log_analysis(text,uuid,text,text,jsonb) TO authenticated;
