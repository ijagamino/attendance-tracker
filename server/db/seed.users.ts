import connection from "./db.ts";
import type { ResultSetHeader } from "./types.ts";

export default async function seedUsers() {
  await connection.query<ResultSetHeader>("DROP TABLE IF EXISTS users CASCADE");

  await connection.query<ResultSetHeader>(
    `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL
    )`
  );

  await connection.execute<ResultSetHeader>(
    `INSERT INTO users (username) VALUES (?), (?), (?)`,
    ["Ivan", "Edward", "John"]
  );
}
