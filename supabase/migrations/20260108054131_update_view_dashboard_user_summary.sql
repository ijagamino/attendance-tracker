CREATE OR REPLACE VIEW dashboard_user_summary
WITH (security_invoker = on) AS
SELECT
  p.id,
  p.first_name,
  COALESCE(SUM(ar.total_hours), interval '0') AS total_rendered_hours,
  COUNT(*) FILTER (WHERE ar.status = 'Late') AS total_lates,
  COUNT(*) FILTER (WHERE ar.status = 'Absent') AS total_absents
FROM profiles p
LEFT JOIN attendance_records ar
  ON ar.user_id = p.id
WHERE p.is_active = true
GROUP BY p.id, p.first_name;

