CREATE VIEW user_profile_summary WITH (security_invoker = on) AS
SELECT
  p.id,
  COALESCE(SUM(ar.total_hours), interval '0') as total_rendered_hours,
  COUNT(*) FILTER (WHERE ar.status = 'Late') AS total_lates,
  COUNT(*) FILTER (WHERE ar.status = 'Absent') AS total_absents
FROM profiles p
LEFT JOIN attendance_records ar
  ON ar.user_id = p.id
GROUP BY p.id;

