CREATE TABLE public.user_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hotkey TEXT NOT NULL,
  label TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, hotkey)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_devices TO authenticated;
GRANT ALL ON public.user_devices TO service_role;

ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own devices"
ON public.user_devices FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.enforce_user_device_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (SELECT count(*) FROM public.user_devices WHERE user_id = NEW.user_id) >= 10 THEN
    RAISE EXCEPTION 'device_limit_reached';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER user_devices_limit
BEFORE INSERT ON public.user_devices
FOR EACH ROW EXECUTE FUNCTION public.enforce_user_device_limit();

CREATE INDEX user_devices_user_id_idx ON public.user_devices (user_id);