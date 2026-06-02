ALTER TABLE public.promo_requests
  ADD CONSTRAINT promo_requests_venue_len CHECK (char_length(venue) BETWEEN 1 AND 120),
  ADD CONSTRAINT promo_requests_name_len CHECK (char_length(contact_name) BETWEEN 1 AND 100),
  ADD CONSTRAINT promo_requests_email_len CHECK (char_length(email) BETWEEN 3 AND 160 AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  ADD CONSTRAINT promo_requests_phone_len CHECK (phone IS NULL OR char_length(phone) <= 40),
  ADD CONSTRAINT promo_requests_event_len CHECK (event_name IS NULL OR char_length(event_name) <= 160),
  ADD CONSTRAINT promo_requests_message_len CHECK (message IS NULL OR char_length(message) <= 2000),
  ADD CONSTRAINT promo_requests_plan_chk CHECK (plan IS NULL OR plan IN ('starter','boost','premium','custom')),
  ADD CONSTRAINT promo_requests_city_chk CHECK (city IS NULL OR city IN ('Fribourg','Bulle','Lausanne','Autre'));

DROP POLICY "Anyone can submit a promo request" ON public.promo_requests;

CREATE POLICY "Anyone can submit a valid promo request"
  ON public.promo_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(venue) > 0
    AND char_length(contact_name) > 0
    AND char_length(email) > 3
  );