CREATE TABLE public.promo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  event_name text,
  message text,
  plan text,
  city text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.promo_requests TO anon, authenticated;
GRANT ALL ON public.promo_requests TO service_role;
GRANT SELECT, DELETE ON public.promo_requests TO authenticated;

ALTER TABLE public.promo_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a promo request"
  ON public.promo_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins read promo requests"
  ON public.promo_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete promo requests"
  ON public.promo_requests FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));