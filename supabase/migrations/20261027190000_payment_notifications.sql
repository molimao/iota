-- Durable, private notification queue. The invoice is the deduplication key.
CREATE TABLE public.watch_payment_notifications (
 invoice_id text PRIMARY KEY CHECK (invoice_id ~ '^in_[A-Za-z0-9_]+$'),
 payload jsonb NOT NULL,
 state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','sending','sent')),
 attempts integer NOT NULL DEFAULT 0,
 next_at timestamptz NOT NULL DEFAULT now(),
 lease uuid,
 lease_until timestamptz,
 sent_at timestamptz
);
ALTER TABLE public.watch_payment_notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.watch_payment_notifications FROM PUBLIC, anon, authenticated;
CREATE OR REPLACE FUNCTION public.watch_payment_notification_enqueue(p_invoice text, p_payload jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF p_invoice !~ '^in_[A-Za-z0-9_]+$' OR jsonb_typeof(p_payload) <> 'object' OR octet_length(p_payload::text)>4096 THEN
  RAISE EXCEPTION 'invalid_payment_notification';
 END IF;
 INSERT INTO watch_payment_notifications(invoice_id,payload) VALUES (p_invoice,p_payload)
 ON CONFLICT (invoice_id) DO NOTHING;
END $$;
CREATE OR REPLACE FUNCTION public.watch_payment_notification_worker(p_action text, p_invoice text DEFAULT NULL, p_lease uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE row_record watch_payment_notifications%ROWTYPE; token uuid;
BEGIN
 IF p_action='claim' THEN
  SELECT * INTO row_record FROM watch_payment_notifications
  WHERE (state='pending' AND next_at<=now()) OR (state='sending' AND lease_until<=now())
  ORDER BY next_at,invoice_id FOR UPDATE SKIP LOCKED LIMIT 1;
  IF NOT FOUND THEN RETURN NULL; END IF;
  token:=gen_random_uuid();
  UPDATE watch_payment_notifications SET state='sending',lease=token,lease_until=now()+interval '1 minute' WHERE invoice_id=row_record.invoice_id;
  RETURN jsonb_build_object('invoiceId',row_record.invoice_id,'payload',row_record.payload,'lease',token);
 ELSIF p_action IN ('sent','retry') THEN
  UPDATE watch_payment_notifications SET
   state=CASE WHEN p_action='sent' THEN 'sent' ELSE 'pending' END,
   attempts=attempts+1,
   next_at=CASE WHEN p_action='retry' THEN now()+make_interval(secs=>LEAST(3600,10*power(2,LEAST(attempts,8))::integer)) ELSE next_at END,
   sent_at=CASE WHEN p_action='sent' THEN now() ELSE NULL END,lease=NULL,lease_until=NULL
  WHERE invoice_id=p_invoice AND state='sending' AND lease=p_lease;
  RETURN to_jsonb(FOUND);
 END IF;
 RAISE EXCEPTION 'invalid_payment_notification_action';
END $$;
REVOKE ALL ON FUNCTION public.watch_payment_notification_enqueue(text,jsonb) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.watch_payment_notification_worker(text,text,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.watch_payment_notification_enqueue(text,jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.watch_payment_notification_worker(text,text,uuid) TO service_role;
