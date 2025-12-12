import mysql from "mysql2/promise";

export type RowDataPacket = mysql.RowDataPacket;
export type ResultSetHeader = mysql.ResultSetHeader;

export interface RowCount extends RowDataPacket {
  totalRows: number;
}

export interface AttendanceRecord extends RowDataPacket {
  id: number;
  user_id: number;
  date: string;
  time_in: string;
  time_out?: string;
  status?: string;
}

export interface User extends RowDataPacket {
  id: number;
  username: string;
  password: string;
}

export interface DashboardUsersQuery extends RowDataPacket {
  users: (User & { total_rendered_hours: string })[];
}

export interface DashboardSummaryQuery extends RowDataPacket {
  attendees: number;
  late_attendees: number;
  earliest: string;
}
