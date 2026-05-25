SELECT cron.unschedule('tonight-nightly-ingest') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'tonight-nightly-ingest');

SELECT cron.schedule(
  'tonight-nightly-ingest',
  '0 4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--bef9f403-76ca-46c2-a723-2d1f8606abb7.lovable.app/api/public/ingest',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer emqJx9Mq0aanCAo5szMLNsjc8ojDsV'
    ),
    body := jsonb_build_object('source','cron')
  );
  $$
);