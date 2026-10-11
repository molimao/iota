-- Run ONLY after this release is explicitly approved, the migration is applied,
-- PRO_TOOLS_ENABLED=true is saved server-side, and provider delivery is verified.
-- Uses the existing report-only credential, never an actual secret in source.
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM vault.decrypted_secrets WHERE name='watch_daily_reports_cron') THEN
  RAISE EXCEPTION 'Configure the approved cron credential first';
 END IF;
 IF NOT EXISTS(SELECT 1 FROM cron.job WHERE jobname='watch-pro-tools') THEN
  PERFORM cron.schedule('watch-pro-tools','* * * * *', $job$
   SELECT net.http_post(url:='https://iotahome.site/api/pro/cron',
    headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||(SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='watch_daily_reports_cron' LIMIT 1)),
    body:='{}'::jsonb,timeout_milliseconds:=55000);
  $job$);
 END IF;
END $$;
-- The bounded dispatcher records yesterday after 08:00 Beijing, samples alerts
-- once per 10-minute bucket, and queues the previous month on the 1st after 09:30.
-- Keep the existing daily-report jobs; this dispatcher does not replace them.
-- Pause reversibly: cron.unschedule('watch-pro-tools') and PRO_TOOLS_ENABLED=false.
