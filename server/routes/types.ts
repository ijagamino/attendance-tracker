import type { AttendanceRecord, User } from "../db/types.ts";
import type { JwtPayload } from "jsonwebtoken";

interface Pagination {
  page: number;
  totalPage: number;
}

export interface PaginationParams {
  page: string;
  limit: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

export interface UserProfileResponse {
  attendanceRecords: Paginated<AttendanceRecord>;
  totalRenderedHours: string;
}

export interface AttendanceRecordResponse {
  attendanceRecords: Paginated<AttendanceRecord>;
}

export interface UsersResponse {
  users: User[];
}

export interface UserIdResponse extends UsersResponse {
  total_progress: string;
}

export interface DashboardResponse {
  users: (User & { totalRenderedHours: string })[];
  attendees: number;
  lateAttendees: number;
  earliest: string;
}

export interface AuthPayload extends JwtPayload {
  id: number;
  username: string;
}
