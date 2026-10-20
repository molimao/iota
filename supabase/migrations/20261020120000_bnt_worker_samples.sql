-- Trusted pool observations only. Client code cannot submit or overwrite hashrates.
CREATE TABLE public.watch_bnt_worker_samples (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 address text NOT NULL CHECK(length(address) BETWEEN 68 AND 93),
 bucket timestamptz NOT NULL,
 observed_at timestamptz NOT NULL,
 workers jsonb NOT NULL CHECK(jsonb_typeof(workers)='array' AND jsonb_array_length(workers)<=100),
 PRIMARY KEY(user_id,address,bucket)
);
CREATE INDEX watch_bnt_worker_samples_expiry ON public.watch_bnt_worker_samples(observed_at);
ALTER TABLE public.watch_bnt_worker_samples ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_bnt_worker_samples FROM PUBLIC,anon,authenticated;

CREATE FUNCTION public.watch_bnt_worker_history_read(p_address text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE u uuid:=auth.uid();
BEGIN
 IF u IS NULL OR NOT EXISTS(SELECT 1 FROM watch_bindings WHERE user_id=u AND project='bnt' AND identifier=p_address) THEN RAISE EXCEPTION 'address_not_saved'; END IF;
 RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('at',floor(extract(epoch FROM s.observed_at)*1000), 'workers',
  coalesce((SELECT jsonb_agg(w) FROM jsonb_array_elements(s.workers) w WHERE EXISTS(SELECT 1 FROM watch_bindings b WHERE b.user_id=u AND b.project='bnt' AND b.identifier=p_address AND (coalesce(b.worker,'')='' OR b.worker=w->>'name'))),'[]'::jsonb)) ORDER BY s.observed_at)
  FROM watch_bnt_worker_samples s WHERE s.user_id=u AND s.address=p_address AND s.observed_at>=now()-interval '24 hours' AND s.observed_at<=now()),'[]'::jsonb);
END;
$$;
CREATE FUNCTION public.watch_bnt_worker_history_record(p_user uuid,p_address text,p_at timestamptz,p_workers jsonb) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM watch_bindings WHERE user_id=p_user AND project='bnt' AND identifier=p_address) THEN RETURN false; END IF;
 IF p_at<now()-interval '5 minutes' OR p_at>now()+interval '1 minute' OR jsonb_typeof(p_workers)<>'array' OR jsonb_array_length(p_workers)>100 THEN RAISE EXCEPTION 'invalid_sample'; END IF;
 IF EXISTS(SELECT 1 FROM jsonb_array_elements(p_workers) w WHERE jsonb_typeof(w->'name') IS DISTINCT FROM 'string' OR length(w->>'name')>80 OR NOT(w ? 'hashrate') OR (w->'hashrate'<>'null'::jsonb AND (jsonb_typeof(w->'hashrate')<>'number' OR (w->>'hashrate')::numeric<0 OR (w->>'hashrate')::numeric>1e18))) THEN RAISE EXCEPTION 'invalid_sample'; END IF;
 DELETE FROM watch_bnt_worker_samples WHERE observed_at<now()-interval '48 hours';
 INSERT INTO watch_bnt_worker_samples(user_id,address,bucket,observed_at,workers)
 VALUES(p_user,p_address,to_timestamp(floor(extract(epoch FROM p_at)/300)*300),p_at,p_workers)
 ON CONFLICT DO NOTHING;
 RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.watch_bnt_worker_history_read(text), public.watch_bnt_worker_history_record(uuid,text,timestamptz,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_bnt_worker_history_read(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.watch_bnt_worker_history_record(uuid,text,timestamptz,jsonb) TO service_role;
