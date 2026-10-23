-- Apply only with a separately approved production release.
BEGIN;
ALTER TABLE public.watch_bindings DROP CONSTRAINT watch_bindings_pool_check;
ALTER TABLE public.watch_bindings ADD CONSTRAINT watch_bindings_pool_check CHECK (
  (project='csd' AND pool='gpools') OR
  (project='bnt' AND pool='bntpool') OR
  (project='mds' AND pool='luckypool') OR
  (project='prl' AND pool IN ('kryptex','luckypool')) OR
  (project='xmr' AND pool='kryptex') OR
  (project IN ('etc','rvn','zec','kas','erg','zeph','ethw') AND pool='2miners') OR
  (project='btc' AND pool='ckpool') OR
  (project NOT IN ('csd','bnt','mds','prl','xmr','etc','rvn','zec','kas','erg','zeph','btc','ethw') AND pool='')
);

ALTER TABLE public.watch_bindings DROP CONSTRAINT watch_bindings_user_id_project_identifier_worker_key;
ALTER TABLE public.watch_bindings ADD CONSTRAINT watch_bindings_source_key UNIQUE(user_id,project,identifier,worker,pool);
COMMIT;
