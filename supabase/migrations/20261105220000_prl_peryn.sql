BEGIN;
ALTER TABLE public.watch_bindings DROP CONSTRAINT watch_bindings_pool_check;
ALTER TABLE public.watch_bindings ADD CONSTRAINT watch_bindings_pool_check CHECK (
  (project='csd' AND pool='gpools') OR
  (project='bnt' AND pool='bntpool') OR
  (project='mds' AND pool='luckypool') OR
  (project='prl' AND pool IN ('kryptex','luckypool','peryn')) OR
  (project='xmr' AND pool='kryptex') OR
  (project IN ('etc','rvn','zec','kas','erg','zeph','ethw') AND pool='2miners') OR
  (project='tsc' AND pool IN ('chain','tigerpool','boblabs','ariapool','luckypool','suprnova')) OR
  (project='btc' AND pool='ckpool') OR
  (project NOT IN ('csd','bnt','mds','prl','xmr','etc','rvn','zec','kas','erg','zeph','btc','ethw','tsc') AND pool='')
);
COMMIT;
