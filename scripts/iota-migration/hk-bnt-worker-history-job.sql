-- Install after the sampling route and its database functions are live.
SELECT cron.schedule(
  'watch-bnt-worker-history',
  '*/5 * * * *',
  $$SELECT iota_scheduler.dispatch('/api/bnt/worker-history/cron')$$
);
