import type { Response } from 'express'
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
  ResponseLocals,
} from 'shared/types/api'
import { camelCaseRowFields, formatToMonth } from '../lib/utils.ts'
import type { Request } from 'express'
import pagination from '../lib/pagination.ts'

const attendanceRecordRoutes = express.Router()

interface AttendanceRecordParams extends PaginationParams {
  name?: string
  date?: string
}

attendanceRecordRoutes.get(
  '/',
  async (
    req: Request<unknown, unknown, unknown, AttendanceRecordParams>,
    res: Response<unknown, ResponseLocals>
  ) => {
    const { page = '1', limit = '5', name = '', date = '' } = req.query
    const userRole = res.locals.user.role
    const userId = res.locals.user.id

    try {
      const [attendanceRecordCount] = await connection.query<RowCount[]>(
        'SELECT COUNT(id) as count FROM attendance_records'
      )

      const { pageNum, limitNum, offset, totalPage } = pagination(
        page,
        limit,
        attendanceRecordCount
      )

      let sql = `
      SELECT ar.*, u.username FROM attendance_records ar
        JOIN users u
        ON ar.user_id = u.id
      WHERE LOWER(u.username) LIKE LOWER(?)
      `

      const values: (string | number)[] = [`%${name}%`]

      if (userRole !== 'admin') {
        sql += ` AND ar.user_id = ?`
        values.push(userId)
      }

      if (date) {
        sql += ` AND date = ?`
        values.push(date)
      }

      sql += `ORDER BY date DESC LIMIT ${limitNum} OFFSET ${offset}`

      const [attendanceRecords] = await connection.execute<AttendanceRecord[]>(
        sql,
        values
      )

      const response: ApiResponse<AttendanceRecordResponse> = {
        data: {
          attendanceRecords: {
            items: camelCaseRowFields(attendanceRecords),
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

attendanceRecordRoutes.post(
  '/',
  async (_req, res: Response<unknown, ResponseLocals>) => {
    const userId = res.locals.user.id

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
  }
)

attendanceRecordRoutes.patch(
  '/',
  async (_req, res: Response<unknown, ResponseLocals>) => {
    const userId = res.locals.user.id

    try {
      const today = new Date()

      const sql = `
      UPDATE attendance_records 
      SET
        time_out = ?
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
  }
)

export default attendanceRecordRoutes
