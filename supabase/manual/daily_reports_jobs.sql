-- Operator-only setup after approved production configuration and migration.
-- The server's DAILY_REPORTS_CRON_SECRET must match the Vault secret below.
-- Store it securely as Vault name 'watch_daily_reports_cron'; never put the
-- actual value in a repository migration or expose it to a client.
-- Do not run until the digest-capable mail provider and sender domain work.
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM vault.decrypted_secrets WHERE name='watch_daily_reports_cron') THEN
  RAISE EXCEPTION 'Store the approved cron secret in Vault first';
 END IF;
 IF NOT EXISTS(SELECT 1 FROM cron.job WHERE jobname='watch-reports-prepare-and-retry') THEN
  PERFORM cron.schedule('watch-reports-prepare-and-retry','*/5 0-2 * * *', $job$
   SELECT net.http_post(url:='https://iotahome.site/api/reports/cron',
    headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||(SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='watch_daily_reports_cron' LIMIT 1)),
    body:='{}'::jsonb,timeout_milliseconds:=55000);
  $job$);
 END IF;
 IF NOT EXISTS(SELECT 1 FROM cron.job WHERE jobname='watch-reports-0930') THEN
  PERFORM cron.schedule('watch-reports-0930','30 1 * * *', $job$
   SELECT net.http_post(url:='https://iotahome.site/api/reports/cron',
    headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||(SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='watch_daily_reports_cron' LIMIT 1)),
    body:='{}'::jsonb,timeout_milliseconds:=55000);
  $job$);
 END IF;
END $$;
-- 01:30 UTC = 09:30 Beijing; preparation/recovery runs 08:00–10:55 Beijing.
