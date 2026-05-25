-- Stocker CRON_SECRET dans Vault et reprogrammer le cron pour le lire dynamiquement
-- L'utilisateur doit insérer la valeur via le formulaire sécurisé (voir étape suivante)

-- 1) Unschedule l'ancien job
SELECT cron.unschedule('tonight-nightly-ingest') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'tonight-nightly-ingest');

-- 2) Reprogrammer en lisant le secret depuis Vault
SELECT cron.schedule(
  'tonight-nightly-ingest',
  '0 4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--bef9f403-76ca-46c2-a723-2d1f8606abb7.lovable.app/api/public/ingest',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'CRON_SECRET' LIMIT 1)
    ),
    body := jsonb_build_object('source','cron')
  );
  $$
);