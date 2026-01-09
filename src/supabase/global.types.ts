import type { Database, Enums, Tables } from './database.types'

export type Role = Enums<'app_role'>

export type Profile = Tables<'profiles'>

export type AttendanceRecord =
  Omit<Tables<'attendance_records'>, 'total_hours'> & {
    total_hours: string
  }

export type AttendanceRecordWithProfile = AttendanceRecord & {
  profiles: {
    id: string
    first_name: string
  }
}

export type UserProfileSummary = Omit<Database['public']['Views']['user_profile_summary']['Row'], 'total_rendered_hours'> & {
  total_rendered_hours: string
}

export type DashboardUserSummary = Omit<Database['public']['Views']['dashboard_user_summary']['Row'], 'total_rendered_hours'> & {
  total_rendered_hours: string
}


export type DashboardDailySummary = Database['public']['Views']['dashboard_daily_summary']['Row']
