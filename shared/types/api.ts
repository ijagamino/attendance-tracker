import type { JwtPayload } from 'jsonwebtoken'

export type AccessToken = string | null

export type UserRole = 'admin' | 'user'

export type ResponseLocals = {
  user: Pick<User, 'id' | 'role'>
}

export interface Entity extends Record<string, string | number | boolean> {
  id: number
}

export interface Column {
  label: string
  value?: string
}

export interface PaginationParams {
  page: string
  limit: string
}

export interface ApiResponse<T> {
  data: T
}

interface Pagination {
  totalPage: number
  page: number
}

export interface Paginated<T> {
  items: T[]
  pagination: Pagination
}

export interface User extends Entity {
  username: string
  role: UserRole
}

export interface AttendanceRecord extends Entity {
  date: string
  timeIn: string
  timeOut: string
  status: string
  totalHours: string
  userId: string
  username: string
}

export interface AttendanceRecordResponse {
  attendanceRecords: Paginated<AttendanceRecord>
}

export interface UsersResponse {
  users: User[]
}

export interface UserProfileResponse {
  attendanceRecords: Paginated<AttendanceRecord>
  totalRenderedHours: string
}

export interface DashboardUser extends Entity {
  username: string
  totalRenderedHours: string
}

export interface DashboardResponse {
  users: Paginated<DashboardUser>
  attendees: number
  lateAttendees: number
  earliest: string
}

export interface AuthPayload extends JwtPayload {
  user: Pick<User, 'id' | 'role'>
}

export interface MyAttendanceRecordResponse {
  timeIn: string
  timeOut: string | undefined
  status: string | undefined | null
}

export interface LoginRequestBody {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: AccessToken
  user: Pick<User, 'id' | 'role'>
}
