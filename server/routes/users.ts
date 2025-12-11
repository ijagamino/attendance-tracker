import express from "express";
import connection from "../db/db.ts";
import type { AttendanceRecord, RowCount, UserStats } from "../db/types.ts";
import type { ApiResponse, Object } from "./types.ts";
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

      const [statRow] = await connection.execute<UserStats[]>(
        `
      SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(total_hours))) AS totalProgress
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

      const stats = statRow[0];

      const response: ApiResponse<{
        rows: AttendanceRecord[];
        stats: Object;
      }> = {
        data: {
          rows: camelCaseRowFields(rows) as AttendanceRecord[],
          stats,
        },
        pagination: {
          page: pageNum,
          totalPage,
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
