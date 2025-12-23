import type { Enums, Tables } from './database.types'

export type Role = Enums<'app_role'>

export type Profile = Pick<Tables<'profiles'>, 'first_name'>
export type AttendanceRecord =
  Omit<Tables<'attendance_records'>, 'total_hours'> & {
    total_hours: string
  }

export interface DashboardUserSummary {
  users: {
    first_name: string | null
    total_rendered_hours: string
    user_id: string | null
  }[]
}

export interface DashboardDailySummary {
  attendees: number
  lateAttendees: number | null
  earliestTimeIn: number
}
