CREATE OR REPLACE FUNCTION public.sync_cron_secret_to_vault(_value text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
DECLARE
  existing_id uuid;
BEGIN
  SELECT id INTO existing_id FROM vault.secrets WHERE name = 'CRON_SECRET' LIMIT 1;
  IF existing_id IS NULL THEN
    PERFORM vault.create_secret(_value, 'CRON_SECRET', 'Tonight cron auth token');
  ELSE
    PERFORM vault.update_secret(existing_id, _value, 'CRON_SECRET', 'Tonight cron auth token');
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_cron_secret_to_vault(text) FROM PUBLIC, anon, authenticated;