import express from 'express'
import connection from '../db/db.ts'
import type { Request, Response } from 'express'
import type {
  DashboardUsersQuery,
  DashboardSummaryQuery,
  RowCount,
} from 'shared/types/database'
import type {
  ApiResponse,
  DashboardResponse,
  PaginationParams,
  ResponseLocals,
} from 'shared/types/api'
import { camelCaseRowFields, formatToMonth } from '../lib/utils.ts'
import pagination from '../lib/pagination.ts'

const dashboardRoutes = express.Router()

dashboardRoutes.get(
  '/',
  async (
    req: Request<unknown, unknown, unknown, PaginationParams>,
    res: Response<unknown, ResponseLocals>
  ) => {
    const { page = '1', limit = '5' } = req.query
    const userRole = res.locals.user.role

    if (userRole !== 'admin')
      return res.status(403).json('You do not have sufficient permissions')

    try {
      const [usersCount] = await connection.query<RowCount[]>(`
        SELECT COUNT(id) as count FROM attendance_records
      `)

      const { pageNum, limitNum, offset, totalPage } = pagination(
        page,
        limit,
        usersCount
      )

      const [users] = await connection.query<DashboardUsersQuery[]>(
        `
      SELECT
      u.id, u.username,
      SEC_TO_TIME(SUM(TIME_TO_SEC(total_hours))) AS total_rendered_hours
      FROM attendance_records ar
      JOIN users u ON ar.user_id = u.id
      GROUP BY ar.user_id
      LIMIT ${limitNum}
      OFFSET ${offset}
      `
      )

      const today = new Date()
      const [statsRow] = await connection.execute<DashboardSummaryQuery[]>(
        `
      SELECT
      COUNT(id) AS attendees,
      SUM(CASE WHEN ar.status = 'Late' THEN 1 ELSE 0 end) AS late_attendees,
      MIN(ar.time_in) AS earliest
      FROM attendance_records ar
      WHERE ar.date = ?
      `,
        [formatToMonth(today)]
      )

      const stats = statsRow[0]

      const response: ApiResponse<DashboardResponse> = {
        data: {
          users: {
            items: camelCaseRowFields(users),
            pagination: {
              page: pageNum,
              totalPage,
            },
          },
          attendees: stats.attendees,
          lateAttendees: stats.late_attendees,
          earliest: stats.earliest,
        },
      }

      return res.status(200).json(response)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Database error' })
    }
  }
)

export default dashboardRoutes
