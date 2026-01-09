CREATE POLICY "Admins or owners can update profiles"
ON public.profiles
FOR UPDATE
USING (
    (SELECT auth.uid()) = id OR is_admin()
)
WITH CHECK (
    (SELECT auth.uid()) = id OR is_admin()
);
