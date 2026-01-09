DROP POLICY IF EXISTS "Employees can insert their own attendance"
ON public.attendance_records;

CREATE POLICY "Admins or employees can insert attendance"
ON public.attendance_records
FOR INSERT
WITH CHECK (
    (SELECT auth.uid()) = user_id OR is_admin()
);

DROP POLICY IF EXISTS "Employees can update their own attendance"
ON public.attendance_records;

CREATE POLICY "Admins or employees can update attendance"
ON public.attendance_records
FOR UPDATE
USING (
    (SELECT auth.uid()) = user_id OR is_admin()
)
WITH CHECK (
    (SELECT auth.uid()) = user_id OR is_admin()
);
