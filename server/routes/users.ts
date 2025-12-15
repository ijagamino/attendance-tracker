import express from 'express'
import connection from '../db/db.ts'
import type {
  AttendanceRecord,
  RowCount,
  RowDataPacket,
} from 'shared/types/database'
import type {
  ApiResponse,
  PaginationParams,
  ResponseLocals,
  UserProfileResponse,
} from 'shared/types/api'
import type { Request, Response } from 'express'
import { camelCaseRowFields, formatToMonth } from '../lib/utils.ts'
import { startOfMonth, endOfMonth } from 'date-fns'
import pagination from '../lib/pagination.ts'

const userRoutes = express.Router()

interface UserParam {
  id: number
}

userRoutes.get(
  '/:id/attendance-records',
  async (
    req: Request<UserParam, unknown, unknown, PaginationParams>,
    res: Response<unknown, ResponseLocals>
  ) => {
    const id = req.params.id
    const { page = '1', limit = '5' } = req.query
    const { id: userId, role: userRole } = res.locals.user

    if (userRole !== 'admin' && id !== userId)
      return res.status(403).json('Insufficient permissions')

    try {
      const values: number[] = [id]

      const [attendanceRecordsCount] = await connection.execute<RowCount[]>(
        `
        SELECT COUNT(ar.id) as count
        FROM attendance_records ar JOIN users u ON ar.user_id = u.id
        WHERE u.id = ?`,
        values
      )

      const { pageNum, limitNum, offset, totalPage } = pagination(
        page,
        limit,
        attendanceRecordsCount
      )

      const sql = `
      SELECT * FROM users u 
        JOIN attendance_records ar
        ON u.id = ar.user_id 
      WHERE u.id = ?
      LIMIT ${limitNum}
      OFFSET ${offset}
      `

      const [attendanceRecords] = await connection.execute<AttendanceRecord[]>(
        sql,
        values
      )

      const today = new Date()

      const [totalRenderedHoursRow] = await connection.execute<
        ({ total_rendered_hours: string } & RowDataPacket)[]
      >(
        `
      SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(total_hours))) AS total_rendered_hours
      FROM attendance_records ar
        JOIN users u
        ON ar.user_id = u.id
      WHERE u.id = ?
        AND
        (ar.date >= ? AND ar.date <= ?)
      `,
        [
          id,
          formatToMonth(startOfMonth(today)),
          formatToMonth(endOfMonth(today)),
        ]
      )

      const totalRenderedHours = totalRenderedHoursRow[0].total_rendered_hours

      const response: ApiResponse<UserProfileResponse> = {
        data: {
          attendanceRecords: {
            items: camelCaseRowFields(attendanceRecords),
            pagination: {
              page: pageNum,
              totalPage,
            },
          },
          totalRenderedHours: totalRenderedHours,
        },
      }

      res.json(response)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Database error' })
    }
  }
)

export default userRoutes
