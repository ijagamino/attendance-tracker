import connection from './db.ts'
import type { ResultSetHeader } from 'shared/types/database'
import { hash } from '../lib/utils.ts'

export default async function seedUsers() {
  await connection.query<ResultSetHeader>('DROP TABLE IF EXISTS users CASCADE')

  await connection.query<ResultSetHeader>(
    `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        role ENUM('admin', 'user') DEFAULT ('user')
    )`
  )

  await connection.execute<ResultSetHeader>(
    `
        INSERT INTO users (username, password, role)
        VALUES
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?),
          (?, ?, ?)`,
    [
      'admin',
      await hash('123456'),
      'admin',
      'ivan',
      await hash('123456'),
      'user',
      'edward',
      await hash('123456'),
      'user',
      'john',
      await hash('123456'),
      'user',
      'charles',
      await hash('123456'),
      'user',
      'niro',
      await hash('123456'),
      'user',
    ]
  )
}
