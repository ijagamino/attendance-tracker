import type { Enums, Tables } from './database.types'

export type Role = Enums<'app_role'>

export type Profile = Pick<Tables<'profiles'>, 'first_name'>
export type AttendanceRecord =
  Omit<Tables<'attendance_records'>, 'total_hours'> & {
    total_hours: string
  }

export interface DashboardData {
  users: {
    first_name: string | null
    total_rendered_hours: string
    user_id: string | null
  }[]
  attendees: number
  lateAttendees: number
  earliestTimeIn: number
}
