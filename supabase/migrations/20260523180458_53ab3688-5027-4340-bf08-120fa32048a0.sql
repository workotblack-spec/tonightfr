
-- Add external_id for dedup
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS external_id text;
CREATE UNIQUE INDEX IF NOT EXISTS events_external_id_key ON public.events(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS events_starts_at_idx ON public.events(starts_at);

-- Enable cron + http
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule nightly ingest at 04:00 UTC
SELECT cron.unschedule('tonight-nightly-ingest') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'tonight-nightly-ingest');

SELECT cron.schedule(
  'tonight-nightly-ingest',
  '0 4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--bef9f403-76ca-46c2-a723-2d1f8606abb7.lovable.app/api/public/ingest',
    headers := jsonb_build_object('Content-Type','application/json'),
    body := jsonb_build_object('source','cron')
  );
  $$
);
