-- Requires approval for the corresponding production release.
BEGIN;
CREATE TABLE public.watch_project_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 request_id uuid NOT NULL,
 project_name text NOT NULL CHECK (char_length(project_name) BETWEEN 1 AND 80 AND project_name !~ '[[:cntrl:]<>]' AND project_name !~ '[\u202a-\u202e\u2066-\u2069]'),
 official_url text NOT NULL CHECK (char_length(official_url)<=500 AND official_url ~ '^https://([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{0,62}(/[^[:space:]<>?#]*)?$' AND official_url !~ '^https://[^/]*\.(localhost|local|internal|test|invalid)(/|$)'),
 description text NOT NULL CHECK (char_length(description)<=1000 AND translate(description,chr(9)||chr(10),'') !~ '[[:cntrl:]<>]' AND description !~ '[\u202a-\u202e\u2066-\u2069]'),
 locale text NOT NULL CHECK (locale IN ('zh','zh-TW','en','ko','ja')),
 submitted_day date NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Hong_Kong')::date,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (user_id,submitted_day)
);
ALTER TABLE public.watch_project_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_project_requests FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.watch_project_requests TO authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.watch_project_requests TO service_role;
CREATE POLICY requests_read_owner ON public.watch_project_requests FOR SELECT TO authenticated USING (auth.uid()=user_id);
CREATE FUNCTION public.watch_project_request_status() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); day date:=(now() AT TIME ZONE 'Asia/Hong_Kong')::date;
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
 RETURN jsonb_build_object('canSubmit',NOT EXISTS(SELECT 1 FROM watch_project_requests WHERE user_id=u AND submitted_day=day),'nextAt',(day+1)::timestamp AT TIME ZONE 'Asia/Hong_Kong');
END; $$;
CREATE FUNCTION public.watch_submit_project_request(p_request uuid,p_name text,p_url text,p_description text,p_locale text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE u uuid:=auth.uid(); day date:=(now() AT TIME ZONE 'Asia/Hong_Kong')::date; inserted uuid; previous public.watch_project_requests; next_at timestamptz:=(day+1)::timestamp AT TIME ZONE 'Asia/Hong_Kong';
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
 INSERT INTO watch_project_requests(user_id,request_id,project_name,official_url,description,locale,submitted_day)
 VALUES(u,p_request,btrim(p_name),p_url,btrim(p_description),p_locale,day)
 ON CONFLICT (user_id,submitted_day) DO NOTHING RETURNING id INTO inserted;
 IF inserted IS NOT NULL THEN RETURN jsonb_build_object('status','submitted','nextAt',next_at); END IF;
 SELECT * INTO previous FROM watch_project_requests WHERE user_id=u AND submitted_day=day;
 IF previous.request_id=p_request AND previous.project_name=btrim(p_name) AND previous.official_url=p_url AND previous.description=btrim(p_description) AND previous.locale=p_locale THEN
  RETURN jsonb_build_object('status','submitted','nextAt',next_at);
 END IF;
 RETURN jsonb_build_object('status','daily-limit','nextAt',next_at);
END; $$;
REVOKE ALL ON FUNCTION public.watch_project_request_status() FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.watch_submit_project_request(uuid,text,text,text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.watch_project_request_status(),public.watch_submit_project_request(uuid,text,text,text,text) TO authenticated;
COMMIT;
