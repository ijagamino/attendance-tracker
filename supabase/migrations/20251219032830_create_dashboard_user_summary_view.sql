CREATE VIEW dashboard_user_summary WITH (security_invoker = on) AS
SELECT
  p.id,
  p.user_id,
  p.first_name,
  COALESCE(SUM(ar.total_hours), interval '0') as total_rendered_hours
FROM profiles p
LEFT JOIN attendance_records ar
  ON ar.user_id = p.user_id
GROUP BY p.id, p.user_id, p.first_name;

