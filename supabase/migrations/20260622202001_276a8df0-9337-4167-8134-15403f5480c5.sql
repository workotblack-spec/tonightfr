
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Drop existing if any
DO $$ BEGIN
  PERFORM cron.unschedule('tonight-ingest-morning');
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN
  PERFORM cron.unschedule('tonight-ingest-evening');
EXCEPTION WHEN OTHERS THEN NULL; END $$;

SELECT cron.schedule(
  'tonight-ingest-morning',
  '0 5 * * *',
  $cmd$
  SELECT net.http_post(
    url := 'https://tonightfr.lovable.app/api/public/ingest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'CRON_SECRET' LIMIT 1)
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
  $cmd$
);

SELECT cron.schedule(
  'tonight-ingest-evening',
  '0 17 * * *',
  $cmd$
  SELECT net.http_post(
    url := 'https://tonightfr.lovable.app/api/public/ingest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'CRON_SECRET' LIMIT 1)
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
  $cmd$
);

-- Daily cleanup of past events (older than 1 day)
DO $$ BEGIN
  PERFORM cron.unschedule('tonight-cleanup-past');
EXCEPTION WHEN OTHERS THEN NULL; END $$;

SELECT cron.schedule(
  'tonight-cleanup-past',
  '30 4 * * *',
  $cmd$
  DELETE FROM public.events WHERE starts_at < (now() - interval '1 day');
  $cmd$
);
