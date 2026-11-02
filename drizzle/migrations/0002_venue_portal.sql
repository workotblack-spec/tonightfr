CREATE TABLE public.venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL UNIQUE,
  name text NOT NULL,
  city text NOT NULL DEFAULT '',
  canton text NOT NULL DEFAULT '',
  min_age integer NOT NULL DEFAULT 18,
  dress_code text,
  cloakroom text,
  vip_rules text,
  table_min_spend text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.venues TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.venues TO authenticated;
GRANT ALL ON public.venues TO service_role;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Venues public read" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Owner insert venue" ON public.venues FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id AND char_length(name) BETWEEN 1 AND 120 AND min_age IN (16,18,21));
CREATE POLICY "Owner update venue" ON public.venues FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id AND min_age IN (16,18,21));
CREATE POLICY "Owner delete venue" ON public.venues FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE TRIGGER venues_updated BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

GRANT UPDATE ON public.table_requests TO authenticated;
CREATE POLICY "Event owners read table requests" ON public.table_requests FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.owner_id = auth.uid()));
CREATE POLICY "Event owners update status" ON public.table_requests FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.owner_id = auth.uid()))
  WITH CHECK (status IN ('pending','accepted','refused','arrived','no_show'));