
-- Fix 1: prevent venue owners from self-promoting via direct API
DROP POLICY IF EXISTS "Owners update own events" ON public.events;
CREATE POLICY "Owners update own events" ON public.events
FOR UPDATE
USING ((auth.uid() = owner_id) OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (
  ((auth.uid() = owner_id) OR public.has_role(auth.uid(), 'admin'))
  AND (
    public.has_role(auth.uid(), 'admin')
    OR (is_promoted = false AND promoted_until IS NULL)
  )
);

-- Fix 2: give promo_requests an optional owner link + owner SELECT policy
ALTER TABLE public.promo_requests
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

DROP POLICY IF EXISTS "Submitters read own promo requests" ON public.promo_requests;
CREATE POLICY "Submitters read own promo requests" ON public.promo_requests
FOR SELECT
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());
