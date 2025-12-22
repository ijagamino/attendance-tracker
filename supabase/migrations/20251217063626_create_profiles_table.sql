CREATE TYPE public.app_role AS ENUM ('admin', 'employee');

CREATE TABLE IF NOT EXISTS
    public.profiles
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    first_name  TEXT NOT NULL,
    role        app_role NOT NULL,

    CONSTRAINT unique_user_profile UNIQUE (user_id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles p
    WHERE (SELECT auth.uid()) = p.user_id 
      AND p.role = 'admin'
  );
END;
$$;


CREATE POLICY "Admins or owners can view profiles"
ON profiles
FOR SELECT
USING (
  (SELECT auth.uid()) = user_id OR is_admin()
);

CREATE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role app_role := 'employee';
  requested_role text;
  first_name text;
BEGIN
  first_name := NEW.raw_user_meta_data->>'first_name';
  requested_role := NEW.raw_user_meta_data->>'role';

  IF first_name IS NULL OR length(trim(first_name)) = 0 THEN
    RAISE EXCEPTION 'First name is reuqired';
  END IF;

  IF requested_role IN ('admin','employee') THEN
    assigned_role := requested_role::app_role;
  END IF;

  INSERT INTO public.profiles (user_id, first_name, role)
  VALUES (
    NEW.id,
    first_name,
    assigned_role
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
