import { formatToMonth } from "../lib/utils.ts";
import connection from "./db.ts";
import type { ResultSetHeader } from "./types.ts";
import { subDays } from "date-fns";

export default async function seedAttendanceRecords() {
  await connection.query<ResultSetHeader>(
    "DROP TABLE IF EXISTS attendance_records"
  );

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
        total_hours TIME,
        FOREIGN KEY (user_id) references users(id),
        CONSTRAINT unique_user_date UNIQUE (user_id, date)
    )
    `
  );

  const yesterday = subDays(new Date(), 1);

  const today = new Date();

  await connection.execute<ResultSetHeader>(
    `INSERT INTO attendance_records (user_id, date, time_in) VALUES (?, ?, ?)`,
    [1, yesterday, "09:00:00"]
  );

  await connection.execute<ResultSetHeader>(
    `
    UPDATE attendance_records ar JOIN users u ON ar.user_id = u.id
    SET
      time_out = ?,
      total_hours = TIMEDIFF(time_out, time_in)
    WHERE LOWER(u.username) = ? AND date = ?
    `,
    ["18:00:00", "ivan", formatToMonth(yesterday)]
  );

  await connection.execute<ResultSetHeader>(
    `INSERT INTO attendance_records (user_id, date, time_in) VALUES (?, ?, ?)`,
    [1, today, "09:00:00"]
  );

  await connection.execute<ResultSetHeader>(
    `INSERT INTO attendance_records (user_id, date, time_in) VALUES (?, ?, ?)`,
    [2, today, "09:00:00"]
  );

  await connection.execute<ResultSetHeader>(
    `
    UPDATE attendance_records ar JOIN users u ON ar.user_id = u.id
    SET
      time_out = ?,
      total_hours = TIMEDIFF(time_out, time_in)
    WHERE LOWER(u.username) = ? AND DATE = ?
    `,
    ["15:00:00", "EDWARD", formatToMonth(today)]
  );
}
