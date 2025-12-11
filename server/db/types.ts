import mysql from "mysql2/promise";

export type RowDataPacket = mysql.RowDataPacket;
export type ResultSetHeader = mysql.ResultSetHeader;

export interface RowCount extends RowDataPacket {
  totalRows: number;
}

export interface AttendanceRecord extends RowDataPacket {
  id: number;
  date: string;
  time_in: string;
  time_out?: string;
  status?: string;
}

export interface User extends RowDataPacket {
  id: number;
  username: string;
}

export interface UserStats extends RowDataPacket {
  total_progress: string;
}

export interface Dashboard extends RowDataPacket {
  users: { username: string; total_hours_rendered: string }[];
}

export interface DashboardStats extends RowDataPacket {
  attendees: 5;
  late_attendees: 3;
  earliest: "08:30:00";
}
