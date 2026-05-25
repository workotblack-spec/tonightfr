-- 1. Enforce http(s) ticket_url at the DB level
ALTER TABLE public.events
  ADD CONSTRAINT events_ticket_url_scheme_chk
  CHECK (ticket_url IS NULL OR ticket_url ~* '^https?://');

-- 2. Stop leaking email prefix via public profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$function$;

-- 3. Backfill: anonymize existing display_names that look like email prefixes
-- (only those that exactly match the local part of the user's email)
UPDATE public.profiles p
SET display_name = 'User'
FROM auth.users u
WHERE p.user_id = u.id
  AND p.display_name = split_part(u.email, '@', 1);