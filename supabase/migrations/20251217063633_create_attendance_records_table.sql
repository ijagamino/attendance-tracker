CREATE TABLE IF NOT EXISTS
    attendance_records
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
    date        DATE DEFAULT CURRENT_DATE,
    time_in     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    time_out    TIMESTAMPTZ NULL,
    status      TEXT GENERATED ALWAYS AS (
        CASE
            WHEN (time_in AT TIME ZONE 'Asia/Manila')::time > '9:15' THEN 'Late'
            ELSE 'On time'
            END
        ) STORED,
    total_hours INTERVAL GENERATED ALWAYS AS (
        CASE
            WHEN time_out IS NULL then NULL
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

    CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all attendance records"
ON attendance_records
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM profiles p
    WHERE p.user_id = auth.uid()
      AND p.role = 'admin'
  )
);

CREATE POLICY "Employees can view their own attendance"
ON attendance_records
FOR SELECT
USING (
    auth.uid() = user_id
);

CREATE POLICY "Employees can insert their own attendance"
ON attendance_records
FOR INSERT
WITH CHECK (
    auth.uid() = user_id 
);

CREATE POLICY "Employees can update their own attendance"
ON attendance_records
FOR UPDATE
USING (
    auth.uid() = user_id 
)
WITH CHECK (
    auth.uid() = user_id 
);