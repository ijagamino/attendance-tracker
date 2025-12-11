import express from "express";
import connection from "../db/db.ts";
import type { Dashboard, DashboardStats } from "../db/types.ts";
import type { Object, ApiResponse } from "./types.ts";
import { camelCaseRowFields } from "../lib/utils.ts";

const dashboardRoutes = express.Router();

dashboardRoutes.get("/", async (req, res) => {
  try {
    const [rows] = await connection.query<Dashboard[]>(
      `
      SELECT
      u.*,
      SEC_TO_TIME(SUM(TIME_TO_SEC(total_hours))) AS total_rendered_hours
      FROM attendance_records ar
      JOIN users u ON ar.user_id = u.id
      GROUP BY ar.user_id
      `
    );

    const [statsRow] = await connection.query<DashboardStats[]>(
      `
      SELECT
      COUNT(id) AS attendees,
      SUM(CASE WHEN ar.status = 'Late' THEN 1 ELSE 0 end) AS late_attendees,
      MIN(ar.time_in) AS earliest
      FROM attendance_records ar
      WHERE ar.date = '2025-12-11'
      `
    );

    const stats = statsRow[0];

    const response: ApiResponse<{ rows: Dashboard[]; stats: Object }> = {
      data: {
        rows: camelCaseRowFields(rows) as Dashboard[],
        stats,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Database error" });
  }
});

export default dashboardRoutes;
