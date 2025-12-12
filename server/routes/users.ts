import express from "express";
import connection from "../db/db.ts";
import type { AttendanceRecord, RowCount, RowDataPacket } from "../db/types.ts";
import type { ApiResponse, UserProfileResponse } from "./types.ts";
import type { Request } from "express";
import { camelCaseRowFields, formatToMonth } from "../lib/utils.ts";
import { startOfMonth, endOfMonth } from "date-fns";

const userRoutes = express.Router();

interface Params {
  page: string;
  limit: string;
}

userRoutes.get(
  "/:id/attendance-records",
  async (req: Request<unknown, unknown, unknown, Params>, res) => {
    const { page = "1", limit = "5" } = req.query;

    const pageNum: number = Number(page);
    const limitNum: number = Number(limit);
    const offset: number =
      pageNum - 1 > 0 ? Math.ceil((pageNum - 1) * limitNum) : 0;

    const { id } = req.params as { id: string };

    try {
      const sql = `
    SELECT * FROM users u 
      JOIN attendance_records ar
      ON u.id = ar.user_id 
    WHERE u.id = ?
    LIMIT ${limitNum}
    OFFSET ${offset}
    `;

      const values: string[] = [id];

      const [rows] = await connection.execute<AttendanceRecord[]>(sql, values);

      const [countRow] = await connection.query<RowCount[]>(
        "SELECT COUNT(id) as totalRows FROM attendance_records"
      );

      const totalRows: number = countRow.length > 0 ? countRow[0].totalRows : 0;

      const totalPage: number = Math.ceil(totalRows / limitNum);

      const today = new Date();

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
      );

      const totalRenderedHours = totalRenderedHoursRow[0].total_rendered_hours;

      const response: ApiResponse<UserProfileResponse> = {
        data: {
          attendanceRecords: {
            items: camelCaseRowFields(rows) as AttendanceRecord[],
            pagination: {
              page: pageNum,
              totalPage,
            },
          },
          totalRenderedHours: totalRenderedHours,
        },
      };

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Database error" });
    }
  }
);

export default userRoutes;
