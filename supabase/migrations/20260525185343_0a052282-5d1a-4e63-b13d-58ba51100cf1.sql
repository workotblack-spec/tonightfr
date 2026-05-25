ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS is_promoted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS promoted_until timestamptz;

CREATE INDEX IF NOT EXISTS idx_events_promoted ON public.events (is_promoted, promoted_until) WHERE is_promoted = true;