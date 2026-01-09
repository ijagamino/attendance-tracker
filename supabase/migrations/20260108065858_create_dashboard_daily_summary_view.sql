CREATE VIEW dashboard_daily_summary
WITH (security_invoker = on) AS
SELECT
  COUNT(*) FILTER (WHERE ar.time_in IS NOT null) AS time_in_count,
  COUNT(*) FILTER (WHERE ar.time_out IS NOT null) AS time_out_count,
  COUNT(*) FILTER (WHERE ar.status = 'Late') AS late_count,
  COUNT(*) FILTER (WHERE ar.status = 'Absent') AS absent_count,
  MIN(ar.time_in) AS earliest_time_in
FROM attendance_records ar
INNER JOIN profiles p
  ON p.id = ar.user_id
  AND p.is_active = true
WHERE date_trunc('day', ar.date) = date_trunc('day', CURRENT_DATE)

