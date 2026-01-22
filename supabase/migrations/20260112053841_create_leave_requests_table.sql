CREATE TABLE IF NOT EXISTS
    public.leave_requests
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    reason      TEXT NOT NULL,
    is_approved BOOLEAN,
    notes       TEXT
);

ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins or owners can view leave requests"
ON public.leave_requests
FOR SELECT
USING (
  (SELECT auth.uid()) = user_id OR is_admin()
);

CREATE POLICY "Admins or employees can create leave requests"
ON public.leave_requests
FOR INSERT
WITH CHECK (
    (SELECT auth.uid()) = user_id OR is_admin()
);

CREATE POLICY "Admins or employees can update leave requests"
ON public.leave_requests
FOR UPDATE
USING (
    (SELECT auth.uid()) = user_id OR is_admin()
)
WITH CHECK (
    (SELECT auth.uid()) = user_id OR is_admin()
);
