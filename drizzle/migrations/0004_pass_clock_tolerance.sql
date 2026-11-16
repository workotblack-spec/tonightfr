CREATE OR REPLACE FUNCTION public.validate_member_pass(_code text)
RETURNS TABLE(result text, event_title text) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _p member_passes; _owner uuid; _title text; _step bigint := floor(extract(epoch FROM now()) / 30); _c text := upper(trim(_code));
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT p.* INTO _p FROM member_passes p WHERE upper(substr(replace(p.id::text,'-',''),1,12)) = split_part(_c,'-',1) FOR UPDATE;
  IF _p.id IS NULL THEN RETURN QUERY SELECT 'invalid'::text, NULL::text; RETURN; END IF;
  SELECT owner_id, title INTO _owner, _title FROM events WHERE id = _p.event_id;
  IF _owner IS DISTINCT FROM auth.uid() THEN RETURN QUERY SELECT 'invalid'::text, NULL::text; RETURN; END IF;
  IF _c NOT IN (_pass_code(_p.id,_step-1), _pass_code(_p.id,_step), _pass_code(_p.id,_step+1)) THEN RETURN QUERY SELECT 'expired'::text, _title; RETURN; END IF;
  IF _p.status = 'used' THEN RETURN QUERY SELECT 'already_used'::text, _title; RETURN; END IF;
  IF _p.status <> 'active' THEN RETURN QUERY SELECT 'invalid'::text, _title; RETURN; END IF;
  UPDATE member_passes SET status = 'used', used_at = now() WHERE id = _p.id;
  RETURN QUERY SELECT 'ok'::text, _title;
END $$;
REVOKE ALL ON FUNCTION public.validate_member_pass(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.validate_member_pass(text) TO authenticated;