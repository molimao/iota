-- Only server-side authenticated handlers may decrypt these values.
BEGIN;
CREATE TABLE public.watch_connections (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 project text NOT NULL CHECK (project IN ('ionet','vast')),
 ciphertext text NOT NULL CHECK (length(ciphertext) < 16000),
 revision uuid NOT NULL DEFAULT gen_random_uuid(),
 expires_at timestamptz NOT NULL,
 PRIMARY KEY (user_id,project)
);
ALTER TABLE public.watch_connections ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_connections FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.watch_connections TO service_role;
COMMIT;
