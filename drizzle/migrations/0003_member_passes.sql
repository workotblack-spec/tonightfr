CREATE TABLE public.member_passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  holder_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','used','cancelled')),
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, holder_id)
);
GRANT SELECT ON public.member_passes TO authenticated;
GRANT ALL ON public.member_passes TO service_role;
ALTER TABLE public.member_passes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "holder reads own pass" ON public.member_passes FOR SELECT TO authenticated USING (holder_id = auth.uid());
CREATE POLICY "event owner reads passes" ON public.member_passes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.owner_id = auth.uid()));

CREATE TABLE public.member_pass_secrets (
  pass_id uuid PRIMARY KEY REFERENCES public.member_passes(id) ON DELETE CASCADE,
  secret bytea NOT NULL DEFAULT extensions.gen_random_bytes(32)
);
GRANT ALL ON public.member_pass_secrets TO service_role;
ALTER TABLE public.member_pass_secrets ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.member_pass_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pass_id uuid NOT NULL REFERENCES public.member_passes(id) ON DELETE CASCADE,
  from_user uuid NOT NULL,
  to_user uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.member_pass_transfers TO authenticated;
GRANT ALL ON public.member_pass_transfers TO service_role;
ALTER TABLE public.member_pass_transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parties read transfers" ON public.member_pass_transfers FOR SELECT TO authenticated
  USING (from_user = auth.uid() OR to_user = auth.uid());

CREATE OR REPLACE FUNCTION public._pass_code(_pass uuid, _step bigint)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, extensions AS $$
  SELECT upper(substr(replace(_pass::text,'-',''),1,12)) || '-' ||
    upper(substr(encode(extensions.hmac(convert_to(_step::text,'UTF8'), s.secret, 'sha256'::text),'hex'),1,8))
  FROM public.member_pass_secrets s WHERE s.pass_id = _pass
$$;
REVOKE ALL ON FUNCTION public._pass_code(uuid, bigint) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.issue_member_pass(_event_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _id uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT id INTO _id FROM member_passes WHERE event_id = _event_id AND holder_id = auth.uid();
  IF _id IS NOT NULL THEN RETURN _id; END IF;
  IF NOT EXISTS (SELECT 1 FROM events WHERE id = _event_id AND starts_at > now() - interval '12 hours') THEN
    RAISE EXCEPTION 'event_unavailable'; END IF;
  INSERT INTO member_passes(event_id, holder_id) VALUES (_event_id, auth.uid()) RETURNING id INTO _id;
  INSERT INTO member_pass_secrets(pass_id) VALUES (_id);
  RETURN _id;
END $$;

CREATE OR REPLACE FUNCTION public.member_pass_code(_pass_id uuid)
RETURNS TABLE(code text, expires_at timestamptz) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _step bigint := floor(extract(epoch FROM now()) / 30);
BEGIN
  IF NOT EXISTS (SELECT 1 FROM member_passes WHERE id = _pass_id AND holder_id = auth.uid() AND status = 'active') THEN
    RAISE EXCEPTION 'pass_unavailable'; END IF;
  RETURN QUERY SELECT _pass_code(_pass_id, _step), to_timestamp((_step + 1) * 30);
END $$;

CREATE OR REPLACE FUNCTION public.transfer_member_pass(_pass_id uuid, _email text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _to uuid; _event uuid;
BEGIN
  SELECT event_id INTO _event FROM member_passes WHERE id = _pass_id AND holder_id = auth.uid() AND status = 'active' FOR UPDATE;
  IF _event IS NULL THEN RAISE EXCEPTION 'pass_unavailable'; END IF;
  SELECT id INTO _to FROM auth.users WHERE lower(email) = lower(trim(_email));
  IF _to IS NULL OR _to = auth.uid() THEN RAISE EXCEPTION 'recipient_invalid'; END IF;
  IF EXISTS (SELECT 1 FROM member_passes WHERE event_id = _event AND holder_id = _to) THEN RAISE EXCEPTION 'recipient_has_pass'; END IF;
  UPDATE member_passes SET holder_id = _to WHERE id = _pass_id;
  UPDATE member_pass_secrets SET secret = extensions.gen_random_bytes(32) WHERE pass_id = _pass_id;
  INSERT INTO member_pass_transfers(pass_id, from_user, to_user) VALUES (_pass_id, auth.uid(), _to);
END $$;

CREATE OR REPLACE FUNCTION public.validate_member_pass(_code text)
RETURNS TABLE(result text, event_title text) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _p member_passes; _owner uuid; _title text; _step bigint := floor(extract(epoch FROM now()) / 30); _c text := upper(trim(_code));
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT p.* INTO _p FROM member_passes p WHERE upper(substr(replace(p.id::text,'-',''),1,12)) = split_part(_c,'-',1) FOR UPDATE;
  IF _p.id IS NULL THEN RETURN QUERY SELECT 'invalid'::text, NULL::text; RETURN; END IF;
  SELECT owner_id, title INTO _owner, _title FROM events WHERE id = _p.event_id;
  IF _owner IS DISTINCT FROM auth.uid() THEN RETURN QUERY SELECT 'invalid'::text, NULL::text; RETURN; END IF;
  IF _c NOT IN (_pass_code(_p.id,_step), _pass_code(_p.id,_step-1)) THEN RETURN QUERY SELECT 'expired'::text, _title; RETURN; END IF;
  IF _p.status = 'used' THEN RETURN QUERY SELECT 'already_used'::text, _title; RETURN; END IF;
  IF _p.status <> 'active' THEN RETURN QUERY SELECT 'invalid'::text, _title; RETURN; END IF;
  UPDATE member_passes SET status = 'used', used_at = now() WHERE id = _p.id;
  RETURN QUERY SELECT 'ok'::text, _title;
END $$;

REVOKE ALL ON FUNCTION public.issue_member_pass(uuid), public.member_pass_code(uuid), public.transfer_member_pass(uuid, text), public.validate_member_pass(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.issue_member_pass(uuid), public.member_pass_code(uuid), public.transfer_member_pass(uuid, text), public.validate_member_pass(text) TO authenticated;