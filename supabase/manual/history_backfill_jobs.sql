-- Approved release only. Enqueue through authenticated /api/history/backfill
-- with {"enqueue":true}, then run this bounded job. It removes itself when done.
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM vault.decrypted_secrets WHERE name='watch_daily_reports_cron') THEN RAISE EXCEPTION 'Configure the approved report credential first'; END IF;
 IF NOT EXISTS(SELECT 1 FROM cron.job WHERE jobname='watch-history-backfill') THEN
  PERFORM cron.schedule('watch-history-backfill','* * * * *',$job$
   DO $dispatch$ BEGIN
    IF EXISTS(SELECT 1 FROM public.watch_history_backfills WHERE status='pending') THEN
     PERFORM net.http_post(url:='https://iotahome.site/api/history/backfill',headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||(SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='watch_daily_reports_cron' LIMIT 1)),body:='{}'::jsonb,timeout_milliseconds:=55000);
    ELSE
     PERFORM cron.unschedule('watch-history-backfill');
    END IF;
   END $dispatch$;
  $job$);
 END IF;
END $$;
