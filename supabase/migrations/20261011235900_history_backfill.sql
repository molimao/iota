-- Bounded official-history reconstruction. Apply only with current release approval.
BEGIN;
CREATE TABLE public.watch_history_backfills (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 batch text NOT NULL, start_day date NOT NULL, end_day date NOT NULL,
 bindings jsonb NOT NULL CHECK(jsonb_typeof(bindings)='array' AND jsonb_array_length(bindings)<=6000),
 total integer NOT NULL CHECK(total BETWEEN 1 AND 6000), cursor integer NOT NULL DEFAULT 0, day_cursor integer NOT NULL DEFAULT 0,
 data jsonb NOT NULL DEFAULT '[]', locale text NOT NULL DEFAULT 'zh',
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','done','failed')),
 lease uuid, lease_until timestamptz, available_at timestamptz NOT NULL DEFAULT now(), failures integer NOT NULL DEFAULT 0,
 inserted integer NOT NULL DEFAULT 0, error_code text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(end_day>=start_day AND end_day-start_day<90), UNIQUE(user_id,batch,start_day,end_day)
);
CREATE INDEX watch_backfill_queue ON public.watch_history_backfills(status,available_at);
CREATE INDEX watch_backfill_owner ON public.watch_history_backfills(user_id,created_at DESC);
ALTER TABLE public.watch_history_backfills ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_history_backfills FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.watch_history_backfills TO service_role;

CREATE FUNCTION public.watch_history_backfill_status() RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); j watch_history_backfills;
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'authentication_required'; END IF;
 SELECT * INTO j FROM watch_history_backfills WHERE user_id=u ORDER BY created_at DESC,id DESC LIMIT 1;
 RETURN jsonb_build_object('state',coalesce(j.status,'none'),'completed',coalesce(j.cursor,0),'total',coalesce(j.total,0),'inserted',coalesce(j.inserted,0));
END $$;

CREATE FUNCTION public.watch_history_backfill_worker(p_action text,p_payload jsonb DEFAULT '{}') RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE n timestamptz:=coalesce((p_payload->>'now')::timestamptz,now()); d date:=(n AT TIME ZONE 'Asia/Shanghai')::date;
 j watch_history_backfills; v jsonb; inserted_rows integer; count_rows integer:=0;
BEGIN
 IF p_action='enqueue' THEN
  INSERT INTO watch_history_backfills(user_id,batch,start_day,end_day,bindings,total,locale,created_at,updated_at,available_at)
   SELECT a.id,md5(b.bindings::text),d-90,d-2,b.bindings,b.total,coalesce(p.locale,'zh'),n,n,n
   FROM auth.users a LEFT JOIN watch_pro_preferences p ON p.user_id=a.id
   CROSS JOIN LATERAL (
    SELECT jsonb_agg(jsonb_build_object('project',w.project,'identifier',w.identifier,'worker',w.worker,'device',w.device_id,'name',v.name) ORDER BY w.project,w.id) AS bindings,
      count(DISTINCT (w.project||':'||CASE WHEN w.project='flyai' THEN lower(w.identifier) ELSE w.identifier END))::integer AS total
    FROM watch_bindings w JOIN watch_devices v ON v.id=w.device_id AND v.user_id=a.id WHERE w.user_id=a.id
   ) b WHERE a.deleted_at IS NULL AND b.total>0 ON CONFLICT DO NOTHING;
  GET DIAGNOSTICS count_rows=ROW_COUNT;
  RETURN to_jsonb(count_rows);
 ELSIF p_action='retry_failed' THEN
  UPDATE watch_history_backfills SET status='pending',failures=0,error_code=NULL,lease=NULL,lease_until=NULL,available_at=n,updated_at=n WHERE status='failed' AND error_code='source_unavailable' AND EXISTS(SELECT 1 FROM auth.users WHERE id=user_id AND deleted_at IS NULL);
  GET DIAGNOSTICS count_rows=ROW_COUNT;
  RETURN to_jsonb(count_rows);
 ELSIF p_action='claim' THEN
  UPDATE watch_history_backfills q SET status='failed',error_code='bindings_changed',lease=NULL,lease_until=NULL,updated_at=n
   WHERE status='pending' AND (NOT EXISTS(SELECT 1 FROM auth.users a WHERE a.id=q.user_id AND a.deleted_at IS NULL) OR
    EXISTS(SELECT 1 FROM jsonb_array_elements(q.bindings) b WHERE NOT EXISTS(SELECT 1 FROM watch_bindings w JOIN watch_devices v ON v.id=w.device_id AND v.user_id=q.user_id WHERE w.user_id=q.user_id AND w.device_id=(b->>'device')::uuid AND w.project=b->>'project' AND w.identifier=b->>'identifier')));
  SELECT * INTO j FROM watch_history_backfills WHERE status='pending' AND available_at<=n AND (lease_until IS NULL OR lease_until<=n) ORDER BY created_at,id FOR UPDATE SKIP LOCKED LIMIT 1;
  IF NOT FOUND THEN RETURN NULL; END IF;
  UPDATE watch_history_backfills SET lease=gen_random_uuid(),lease_until=n+interval '3 minutes',updated_at=n WHERE id=j.id RETURNING * INTO j;
  RETURN to_jsonb(j);
 END IF;
 SELECT * INTO j FROM watch_history_backfills WHERE id=(p_payload->>'id')::uuid AND lease=(p_payload->>'lease')::uuid AND lease_until>n AND status='pending' FOR UPDATE;
 IF NOT FOUND THEN RETURN 'false'; END IF;
 IF p_action='progress' THEN
  IF jsonb_typeof(p_payload->'data') IS DISTINCT FROM 'array' OR jsonb_array_length(p_payload->'data')>j.total OR (p_payload->>'cursor')::integer<j.cursor OR (p_payload->>'cursor')::integer>j.total OR (p_payload->>'day_cursor')::integer NOT BETWEEN 0 AND 90 THEN RAISE EXCEPTION 'invalid_backfill_progress'; END IF;
  UPDATE watch_history_backfills SET data=p_payload->'data',cursor=(p_payload->>'cursor')::integer,day_cursor=(p_payload->>'day_cursor')::integer,lease=NULL,lease_until=NULL,available_at=n+interval '1 second',updated_at=n WHERE id=j.id;
  RETURN 'true';
 ELSIF p_action='retry' THEN
  UPDATE watch_history_backfills SET failures=failures+1,status=CASE WHEN failures>=3 THEN 'failed' ELSE 'pending' END,error_code='source_unavailable',lease=NULL,lease_until=NULL,available_at=n+interval '30 seconds'*power(2,least(failures,3)),updated_at=n WHERE id=j.id;
  RETURN 'true';
 ELSIF p_action='write' THEN
  IF j.cursor<>j.total OR jsonb_typeof(p_payload->'rows') IS DISTINCT FROM 'array' OR jsonb_array_length(p_payload->'rows')>90 THEN RAISE EXCEPTION 'incomplete_backfill'; END IF;
  IF NOT EXISTS(SELECT 1 FROM auth.users WHERE id=j.user_id AND deleted_at IS NULL) THEN RETURN 'false'; END IF;
  IF EXISTS(SELECT 1 FROM jsonb_array_elements(j.bindings) b WHERE NOT EXISTS(SELECT 1 FROM watch_bindings w JOIN watch_devices v ON v.id=w.device_id AND v.user_id=j.user_id WHERE w.user_id=j.user_id AND w.device_id=(b->>'device')::uuid AND w.project=b->>'project' AND w.identifier=b->>'identifier')) THEN RAISE EXCEPTION 'bindings_changed'; END IF;
  FOR v IN SELECT value FROM jsonb_array_elements(p_payload->'rows') LOOP
   IF (v->>'day')::date NOT BETWEEN j.start_day AND j.end_day OR v->'report'->>'day' IS DISTINCT FROM v->>'day' OR v->'report'->>'source' IS DISTINCT FROM 'backfill' OR jsonb_typeof(v->'devices') IS DISTINCT FROM 'array' OR jsonb_array_length(v->'devices')>6000 THEN RAISE EXCEPTION 'invalid_backfill_day'; END IF;
   IF EXISTS(SELECT 1 FROM jsonb_array_elements(v->'devices') b WHERE NOT EXISTS(SELECT 1 FROM jsonb_array_elements(j.bindings) original WHERE original->>'device'=b->>'id') OR b->'report'->>'day'<>v->>'day' OR b->'deviceReport'->>'day'<>v->>'day') THEN RAISE EXCEPTION 'invalid_backfill_device'; END IF;
   IF (v->>'day')::date<d-90 THEN CONTINUE; END IF;
   -- Never change an existing daily/account/device snapshot or its valuation.
   INSERT INTO watch_pro_history(user_id,day,report,device_reports) VALUES(j.user_id,(v->>'day')::date,v->'report',v->'devices') ON CONFLICT DO NOTHING;
   GET DIAGNOSTICS inserted_rows=ROW_COUNT; count_rows:=count_rows+inserted_rows;
  END LOOP;
  UPDATE watch_history_backfills SET status='done',inserted=count_rows,lease=NULL,lease_until=NULL,error_code=NULL,updated_at=n WHERE id=j.id;
  RETURN to_jsonb(count_rows);
 ELSE RAISE EXCEPTION 'invalid_backfill_action'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.watch_history_backfill_status(),public.watch_history_backfill_worker(text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_history_backfill_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.watch_history_backfill_worker(text,jsonb) TO service_role;
COMMIT;
