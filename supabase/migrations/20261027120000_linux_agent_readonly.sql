-- Monitoring-only Linux agents must not receive miner-control or Mac update commands,
-- including calls made directly to the authenticated RPCs.
CREATE OR REPLACE FUNCTION public.watch_agent_readonly_command_guard() RETURNS trigger
LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.watch_device_agents a WHERE a.device_id=NEW.device_id
    AND (a.snapshot->>'platform'='linux' OR a.snapshot->>'monitorOnly'='true')) THEN
    RAISE EXCEPTION 'agent_monitor_only';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.watch_agent_readonly_command_guard() FROM PUBLIC;
CREATE TRIGGER watch_agent_readonly_command_guard BEFORE INSERT ON public.watch_agent_commands
FOR EACH ROW EXECUTE FUNCTION public.watch_agent_readonly_command_guard();
