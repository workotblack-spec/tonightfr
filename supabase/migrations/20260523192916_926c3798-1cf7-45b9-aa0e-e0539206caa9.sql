DROP INDEX IF EXISTS public.events_external_id_key;
ALTER TABLE public.events ADD CONSTRAINT events_external_id_key UNIQUE (external_id);