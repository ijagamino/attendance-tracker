import express from 'express'
import connection from '../db/db.ts'
import type {
  AttendanceRecord,
  ResultSetHeader,
  RowCount,
} from 'shared/types/database'
import type {
  ApiResponse,
  AttendanceRecordResponse,
  PaginationParams,
} from 'shared/types/api'
import { camelCaseRowFields, formatToMonth } from '../lib/utils.ts'
import type { Request } from 'express'

const attendanceRecordRoutes = express.Router()

interface AttendanceRecordParams extends PaginationParams {
  name?: string
  date?: string
}

attendanceRecordRoutes.get(
  '/',
  async (
    req: Request<unknown, unknown, unknown, AttendanceRecordParams>,
    res
  ) => {
    const { name = '', date = '', page = '1', limit = '5' } = req.query

    const pageNum: number = Number(page)
    const limitNum: number = Number(limit)
    const offset: number =
      pageNum - 1 > 0 ? Math.ceil((pageNum - 1) * limitNum) : 0

    try {
      let sql = `
    SELECT ar.*, u.username FROM attendance_records ar
      JOIN users u
      ON ar.user_id = u.id
    WHERE LOWER(u.username) LIKE LOWER(?)
    `

      const values: (string | number)[] = [`%${name}%`]

      if (date) {
        sql += ` AND date = ?`
        values.push(date)
      }

      sql += ` LIMIT ${limitNum} OFFSET ${offset}`

      const [rows] = await connection.execute<AttendanceRecord[]>(sql, values)

      const [countRow] = await connection.query<RowCount[]>(
        'SELECT COUNT(id) as totalRows FROM attendance_records'
      )

      const totalRows: number = countRow.length > 0 ? countRow[0].totalRows : 0

      const totalPage: number = Math.ceil(totalRows / limitNum)

      const response: ApiResponse<AttendanceRecordResponse> = {
        data: {
          attendanceRecords: {
            items: camelCaseRowFields(rows),
            pagination: {
              page: pageNum,
              totalPage,
            },
          },
        },
      }

      return res.status(200).json(response)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Database error' })
    }
  }
)

attendanceRecordRoutes.post('/', async (req, res) => {
  const userId = req.userId

  try {
    const today = new Date()

    const sql = `INSERT INTO attendance_records(user_id, date, time_in) VALUES (?, ?, ?)`
    const values: (number | Date)[] = [userId, today, today]

    const [result] = await connection.execute<ResultSetHeader>(sql, values)

    return res.status(200).json(result)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Database error' })
  }
})

attendanceRecordRoutes.patch('/', async (req, res) => {
  const userId = req.userId

  try {
    const today = new Date()

    const sql = `
      UPDATE attendance_records 
      SET
        time_out = ?,
        total_hours = TIMEDIFF(time_out, time_in)
      WHERE
        user_id = ?
        AND
        DATE = ?
      `
    const values = [today, userId, formatToMonth(today)]

    const [result] = await connection.execute<ResultSetHeader>(sql, values)

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: { message: 'You have not timed in today.' } })
    }

    return res.json(result)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Database error' })
  }
})

export default attendanceRecordRoutes
