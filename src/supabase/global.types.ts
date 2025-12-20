import type { Database } from './database.types'

export type Role = Database['public']['Enums']['app_role']
export type AttendanceRecord =
  Database['public']['Tables']['attendance_records']['Row']

export interface DashboardData {
  users: {
    first_name: string | null
    total_rendered_hours: unknown
    user_id: string | null
  }[]
  attendees: number
  lateAttendees: number
  earliestTimeIn: number
}
