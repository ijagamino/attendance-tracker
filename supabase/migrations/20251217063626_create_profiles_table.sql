CREATE TYPE public.app_role AS ENUM ('admin', 'employee');

CREATE TABLE IF NOT EXISTS
    public.profiles
(
    id          UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    role        app_role NOT NULL,

    PRIMARY KEY (id)
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
    WHERE (SELECT auth.uid()) = p.id 
      AND p.role = 'admin'
  );
END;
$$;


CREATE POLICY "Admins or owners can view profiles"
ON profiles
FOR SELECT
USING (
  (SELECT auth.uid()) = id OR is_admin()
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
  last_name text;
  full_name text;
  name_parts text[];
  last_index int;
BEGIN
  requested_role := NEW.raw_user_meta_data->>'role';

  first_name := NULLIF(trim(NEW.raw_user_meta_data->>'first_name'), '');
  last_name := NULLIF(trim(NEW.raw_user_meta_data->>'last_name'), '');

  IF first_name IS NULL or last_name IS NULL THEN
    full_name := COALESCE(
      NULLIF(trim(NEW.raw_user_meta_data->>'first_name'), ''),
      NULLIF(trim(NEW.raw_user_meta_data->>'name'), '')
    );

    IF full_name IS NOT NULL THEN
      name_parts := string_to_array(full_name, ' ');
      last_index := array_length(name_parts, 1);

      IF last_index = 1 THEN
        first_name := name_parts[1];
        last_name := 'Unknown';
      ELSE
        first_name := array_to_string(name_parts[1:last_index-1], ' ');
        last_name := name_parts[last_index];
      END IF;
    END IF;
  END IF;

  IF first_name IS NULL OR length(trim(first_name)) = 0 THEN
    first_name := 'Unknown';
  END IF;

  IF last_name IS NULL OR length(trim(last_name)) = 0 THEN
    last_name := 'Unknown';
  END IF;

  IF requested_role IN ('admin','employee') THEN
    assigned_role := requested_role::app_role;
  END IF;

  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    role
  )
  VALUES (
    NEW.id,
    first_name,
    last_name,
    assigned_role
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
