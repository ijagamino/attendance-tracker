import express from 'express'
import connection from '../db/db.ts'
import { formatToMonth } from '../lib/utils.ts'
import type { AttendanceRecord } from 'shared/types/database.ts'
import type {
  ApiResponse,
  MyAttendanceRecordResponse,
  ResponseLocals,
} from 'shared/types/api'
import type { Response } from 'express'

const meRoutes = express.Router()

meRoutes.get(
  '/attendance-records',
  async (_req, res: Response<unknown, ResponseLocals>) => {
    const userId = res.locals.user.id

    try {
      const sql = `
        SELECT ar.*, u.username FROM attendance_records ar
          JOIN users u
          ON ar.user_id = u.id
        WHERE ar.user_id = ? AND ar.date = ?
      `

      const today = new Date()

      const values: (string | number)[] = [userId, formatToMonth(today)]

      const [attendanceRecords] = await connection.execute<AttendanceRecord[]>(
        sql,
        values
      )

      const attendanceRecord = attendanceRecords[0]

      if (!attendanceRecord) {
        return res
          .status(404)
          .json({ error: 'No attendance records for today found.' })
      }

      const response: ApiResponse<MyAttendanceRecordResponse> = {
        data: {
          timeIn: attendanceRecord.time_in,
          timeOut: attendanceRecord.time_out,
          status: attendanceRecord.status,
        },
      }

      return res.status(200).json(response)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Database error' })
    }
  }
)

export default meRoutes
