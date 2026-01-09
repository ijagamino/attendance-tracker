DROP VIEW IF EXISTS dashboard_user_summary;

ALTER TABLE public.attendance_records
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS total_hours;

ALTER TABLE public.attendance_records
ADD COLUMN status TEXT GENERATED ALWAYS AS (
    CASE
        WHEN time_in IS NULL THEN 'Absent'
        WHEN (time_in AT TIME ZONE 'Asia/Manila')::time > '9:15' THEN 'Late'
        ELSE 'On time'
    END
) STORED;

ALTER TABLE public.attendance_records
ADD COLUMN total_hours INTERVAL GENERATED ALWAYS AS (
  CASE
      WHEN time_in IS NULL OR time_out IS NULL then NULL
      ELSE
          MAKE_INTERVAL(
              secs =>
                  GREATEST(
                          0,
                          EXTRACT(EPOCH FROM (
                              LEAST(time_out, (date + TIME '12:00:00') AT TIME ZONE ('Asia/Manila')) - time_in
                          )
                      )
                  )
                  +
                  GREATEST(
                          0,
                          EXTRACT(EPOCH FROM (
                              time_out - GREATEST(time_in, (date + TIME '13:00:00') AT TIME ZONE('Asia/Manila'))
                          )
                      )
                  )
          )
      END
) STORED,
ADD COLUMN remarks TEXT;

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
