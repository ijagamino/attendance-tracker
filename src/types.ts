interface Entity {
  id: string;
}

interface Pagination {
  totalPage: number;
  page: number;
}

export interface Data<T> {
  data: T;
}

export interface DataWithPagination<T> extends Data<T> {
  pagination: Pagination;
}

export interface RowsWithStats<Rows, Stats> {
  rows: Rows;
  stats: Stats;
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

export interface DashboardRows {
  id: string;
  username: string;
  totalRenderedHours: number;
}

export interface DashboardStats {
  attendees: number;
  lateAttendees: number;
  earliest: string;
}
