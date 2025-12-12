interface Entity {
  id: string;
}

interface Pagination {
  totalPage: number;
  page: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

export interface User extends Entity {
  username: string;
}

export interface AttendanceRecord extends Entity {
  date: string;
  timeIn?: string;
  timeOut?: string;
  status?: string;
  totalHours?: string;
  userId: string;
  username?: string;
}

export interface AttendanceRecordResponse {
  attendanceRecords: Paginated<AttendanceRecord>;
}

export interface UserProfileResponse {
  attendanceRecords: Paginated<AttendanceRecord>;
  totalRenderedHours: string;
}

export interface DashboardResponse {
  users: (User & { totalRenderedHours: string })[];
  attendees: number;
  lateAttendees: number;
  earliest: string;
}
