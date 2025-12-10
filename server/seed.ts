import connection from "./db.ts";

async function seed() {
  console.log("Seeding...");

  try {
    await connection.query("DROP TABLE IF EXISTS attendance_records");
    await connection.query(
      `CREATE TABLE IF NOT EXISTS attendance_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        time_in TIME NOT NULL,
        time_out TIME, 
        status VARCHAR(255) GENERATED ALWAYS AS
          (CASE
            WHEN (HOUR(time_in) > 9) THEN 'Late'
            ELSE 'On time'
          END)
          VIRTUAL,
        CONSTRAINT unique_person_day UNIQUE (username, date)
      )`
    );

    const today = new Date();
    // const now = today.toISOString().split("T")[1].split(".")[0];

    await connection.execute(
      `INSERT INTO attendance_records(username, date, time_in) VALUES (?, ?, ?)`,
      ["Ivan", today, "09:00:00"]
    );

    console.log("Seeding success!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
