DROP VIEW IF EXISTS dashboard_user_summary;

CREATE VIEW dashboard_user_summary
WITH (security_invoker = on) AS
SELECT
  p.id,
  p.first_name,
  COALESCE(SUM(ar.total_hours), interval '0') AS total_rendered_hours
FROM profiles p
LEFT JOIN attendance_records ar
  ON ar.user_id = p.id
WHERE p.role IS DISTINCT FROM 'admin'
GROUP BY p.id, p.first_name;

