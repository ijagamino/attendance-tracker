import connection from "./db.ts";
import seedAttendanceRecords from "./seed.attendance-records.ts";
import seedUsers from "./seed.users.ts";
import type { ResultSetHeader } from "./types.ts";

async function seed() {
  try {
    console.log("Seeding...");
    connection.query<ResultSetHeader>(`SET FOREIGN_KEY_CHECKS = 0`);
    await seedUsers();
    await seedAttendanceRecords();
    connection.query<ResultSetHeader>(`SET FOREIGN_KEY_CHECKS = 1`);

    console.log("Seeding success!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
