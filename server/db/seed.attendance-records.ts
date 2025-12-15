import connection from './db.ts'
import type { ResultSetHeader } from 'shared/types/database'

export default async function seedAttendanceRecords() {
  await connection.query<ResultSetHeader>(
    'DROP TABLE IF EXISTS attendance_records'
  )

  await connection.query<ResultSetHeader>(
    `
    CREATE TABLE IF NOT EXISTS attendance_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE NOT NULL,
        time_in TIME NOT NULL,
        time_out TIME, 
        status VARCHAR(255) GENERATED ALWAYS AS
          (CASE
            WHEN (HOUR(time_in) > 9 AND MINUTE(time_in) > 15) THEN 'Late'
            ELSE 'On time'
          END)
          VIRTUAL,
        total_hours TIME GENERATED ALWAYS AS(
            CASE
            WHEN time_in IS NULL OR time_out IS NULL THEN NULL
            ELSE
              SEC_TO_TIME(
                GREATEST(
                  0,
                  TIME_TO_SEC(TIMEDIFF(LEAST(time_out, '12:00:00'), time_in))
                )
                +
                GREATEST(
                  0,
                  TIME_TO_SEC(TIMEDIFF(time_out, GREATEST(time_in, '13:00:00')))
                )
              )
            END
          ),
        FOREIGN KEY (user_id) references users(id),
        CONSTRAINT unique_user_date UNIQUE (user_id, date)
    )
    `
  )

  await connection.execute<ResultSetHeader>(
    `
        INSERT INTO attendance_records (user_id, date, time_in)
        VALUES
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?)
        `,
    [
      2,
      '2025-12-09',
      '09:00:00',
      2,
      '2025-12-10',
      '09:00:00',
      2,
      '2025-12-11',
      '09:00:00',
      2,
      '2025-12-12',
      '09:00:00',
      2,
      '2025-12-15',
      '09:00:00',
      3,
      '2025-12-09',
      '09:00:00',
      3,
      '2025-12-10',
      '09:00:00',
      3,
      '2025-12-11',
      '09:00:00',
      3,
      '2025-12-12',
      '09:00:00',
      3,
      '2025-12-15',
      '09:00:00',
      4,
      '2025-12-09',
      '09:00:00',
      4,
      '2025-12-10',
      '09:00:00',
      4,
      '2025-12-11',
      '09:00:00',
      4,
      '2025-12-12',
      '09:00:00',
      4,
      '2025-12-15',
      '09:00:00',
      5,
      '2025-12-15',
      '09:00:00',
      6,
      '2025-12-15',
      '09:00:00',
    ]
  )

  await connection.execute<ResultSetHeader>(
    `
    UPDATE attendance_records ar JOIN users u ON ar.user_id = u.id
    SET
      time_out = ?
    WHERE u.id = ? AND date = ?
    `,
    ['18:00:00', 2, '2025-12-09']
  )

  await connection.execute<ResultSetHeader>(
    `
    UPDATE attendance_records ar JOIN users u ON ar.user_id = u.id
    SET
      time_out = ?
    WHERE u.id = ? AND DATE = ?
    `,
    ['15:00:00', 2, '2025-12-10']
  )

  await connection.execute<ResultSetHeader>(
    `
    UPDATE attendance_records ar JOIN users u ON ar.user_id = u.id
    SET
      time_out = ?
    WHERE u.id = ? AND DATE = ?
    `,
    ['15:00:00', 2, '2025-12-11']
  )
  await connection.execute<ResultSetHeader>(
    `
    UPDATE attendance_records ar JOIN users u ON ar.user_id = u.id
    SET
      time_out = ?
    WHERE u.id = ? AND DATE = ?
    `,
    ['15:00:00', 2, '2025-12-12']
  )

  await connection.execute<ResultSetHeader>(
    `
    UPDATE attendance_records ar JOIN users u ON ar.user_id = u.id
    SET
      time_out = ?
    WHERE u.id = ? AND DATE = ?
    `,
    ['15:00:00', 2, '2025-12-15']
  )

  await connection.execute<ResultSetHeader>(
    `
    UPDATE attendance_records ar JOIN users u ON ar.user_id = u.id
    SET
      time_out = ?
    WHERE u.id = ? AND DATE = ?
    `,
    ['15:00:00', 3, '2025-12-09']
  )
}
