DROP POLICY IF EXISTS "Admins or owners can update profiles"
ON public.profiles;

CREATE FUNCTION old_role()
RETURNS app_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT role
    FROM profiles p
    WHERE (SELECT auth.uid()) = p.id
  );
END;
$$;

CREATE POLICY "Employees can update their own profile (except role)"
ON public.profiles
FOR UPDATE
USING (
    (SELECT auth.uid()) = id
)
WITH CHECK (
    (SELECT auth.uid()) = id
    AND
    role = old_role()
);

CREATE POLICY "Admin can update all profiles (except own role)"
ON public.profiles
FOR UPDATE
USING (
    is_admin()
)
WITH CHECK (
    (SELECT auth.uid()) = id AND role = old_role()
    OR
    (SELECT auth.uid()) <> id
);
