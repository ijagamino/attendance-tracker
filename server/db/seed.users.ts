import connection from "./db.ts";
import type { ResultSetHeader } from "./types.ts";
import { hash } from "../lib/utils.ts";

export default async function seedUsers() {
  await connection.query<ResultSetHeader>("DROP TABLE IF EXISTS users CASCADE");

  await connection.query<ResultSetHeader>(
    `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255)
    )`
  );

  await connection.execute<ResultSetHeader>(
    `INSERT INTO users (username, password) VALUES (?, ?), (?, ?), (?, ?)`,
    [
      "ivan",
      await hash("123456"),
      "edward",
      await hash("123456"),
      "john",
      await hash("123456"),
    ]
  );
}
