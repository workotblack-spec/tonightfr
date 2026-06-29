ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.events ADD CONSTRAINT events_image_url_http CHECK (image_url IS NULL OR image_url ~* '^https?://');