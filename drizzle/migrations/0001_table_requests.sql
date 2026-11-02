CREATE TABLE public.table_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  event_id uuid NOT NULL,
  zone text NOT NULL DEFAULT 'vip',
  guests int NOT NULL DEFAULT 4,
  contact_name text NOT NULL,
  phone text NOT NULL,
  note text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.table_requests TO authenticated;
GRANT ALL ON public.table_requests TO service_role;
ALTER TABLE public.table_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own select" ON public.table_requests FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own insert" ON public.table_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'pending' AND guests BETWEEN 1 AND 30 AND length(contact_name) BETWEEN 1 AND 100 AND length(phone) BETWEEN 6 AND 30 AND (note IS NULL OR length(note) <= 500));
CREATE POLICY "own delete" ON public.table_requests FOR DELETE TO authenticated USING (auth.uid() = user_id);