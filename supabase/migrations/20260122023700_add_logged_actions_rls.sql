ALTER TABLE public.logged_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all logs, users can view own logs"
ON public.logged_actions
FOR SELECT
USING (
  (SELECT auth.uid()) = user_id OR is_admin()
);
