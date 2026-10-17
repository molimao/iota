BEGIN;
CREATE TABLE public.watch_agent_history (
  device_id uuid NOT NULL REFERENCES public.watch_device_agents(device_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bucket timestamptz NOT NULL,
  sampled_at timestamptz NOT NULL,
  snapshot jsonb NOT NULL,
  PRIMARY KEY(device_id,bucket)
);
ALTER TABLE public.watch_agent_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_agent_history FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.watch_agent_history TO service_role;
CREATE INDEX watch_agent_history_owner ON public.watch_agent_history(user_id,sampled_at);

-- Five-minute observations, not inferred continuous uptime or a log archive.
CREATE FUNCTION public.watch_capture_agent_history() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN
  IF NEW.last_seen IS NULL THEN RETURN NEW; END IF;
  IF TG_OP='UPDATE' AND NEW.last_seen IS NOT DISTINCT FROM OLD.last_seen THEN RETURN NEW; END IF;
  IF jsonb_typeof(NEW.snapshot->'appRunning')<>'boolean' OR jsonb_typeof(NEW.snapshot->'workerRunning')<>'boolean'
     OR NOT (NEW.snapshot ? 'appRunning' AND NEW.snapshot ? 'workerRunning') THEN RETURN NEW; END IF;
  INSERT INTO watch_agent_history(device_id,user_id,bucket,sampled_at,snapshot)
    VALUES(NEW.device_id,NEW.user_id,to_timestamp(floor(extract(epoch FROM NEW.last_seen)/300)*300),NEW.last_seen,
      jsonb_build_object('appRunning',NEW.snapshot->'appRunning','workerRunning',NEW.snapshot->'workerRunning',
        'queue',CASE WHEN jsonb_typeof(NEW.snapshot->'queue')='object' THEN
          jsonb_build_object('position',NEW.snapshot->'queue'->'position','observedAt',NEW.snapshot->'queue'->'observedAt') ELSE 'null'::jsonb END,
        'trainingState',CASE WHEN jsonb_typeof(NEW.snapshot->'trainingState')='object' THEN
          jsonb_build_object('phase',NEW.snapshot->'trainingState'->'phase','status',NEW.snapshot->'trainingState'->'status',
            'observedAt',NEW.snapshot->'trainingState'->'observedAt') ELSE 'null'::jsonb END))
    ON CONFLICT(device_id,bucket) DO UPDATE SET sampled_at=EXCLUDED.sampled_at,snapshot=EXCLUDED.snapshot;
  DELETE FROM watch_agent_history WHERE device_id=NEW.device_id AND sampled_at<now()-interval '7 days';
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.watch_capture_agent_history() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER watch_agent_history_capture AFTER INSERT OR UPDATE OF last_seen,snapshot ON public.watch_device_agents
  FOR EACH ROW EXECUTE FUNCTION public.watch_capture_agent_history();

CREATE FUNCTION public.watch_read_agent_history(p_device uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid();
BEGIN
  IF u IS NULL THEN RAISE EXCEPTION 'sign_in_required'; END IF;
  IF NOT EXISTS(SELECT 1 FROM watch_device_agents WHERE device_id=p_device AND user_id=u) THEN
    RAISE EXCEPTION 'device_not_found';
  END IF;
  DELETE FROM watch_agent_history WHERE user_id=u AND sampled_at<now()-interval '7 days';
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('sampledAt',h.sampled_at,'snapshot',h.snapshot) ORDER BY h.sampled_at)
    FROM (SELECT sampled_at,snapshot FROM watch_agent_history WHERE device_id=p_device AND user_id=u
      AND sampled_at>=now()-interval '24 hours' ORDER BY sampled_at DESC LIMIT 289) h),'[]'::jsonb);
END $$;
REVOKE ALL ON FUNCTION public.watch_read_agent_history(uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.watch_read_agent_history(uuid) TO authenticated;
COMMIT;
