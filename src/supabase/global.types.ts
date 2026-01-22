import type { Database, Enums, Tables } from './database.types'

export type Role = Enums<'app_role'>

export type Profile = Tables<'profiles'>

export type LeaveRequest = Tables<'leave_requests'>

export type LeaveRequestWithProfile = LeaveRequest & {
  profiles: Pick<Profile, 'id' | 'first_name' | 'last_name'>
}

export type AttendanceRecord = Omit<Tables<'attendance_records'>, 'total_hours'> & {
  total_hours: string
}

export type AttendanceRecordWithProfile = AttendanceRecord & {
  profiles: Pick<Profile, 'id' | 'first_name' | 'last_name'>
}

export type LoggedActionWithProfile = Omit<Tables<'logged_actions'>, 'transaction_id'> & {
  profiles: Pick<Profile, 'id' | 'first_name' | 'last_name'>
  transaction_id: string
}

export type UserProfileSummary = Omit<Database['public']['Views']['user_profile_summary']['Row'], 'total_rendered_hours'> & {
  total_rendered_hours: string
}

export type DashboardUserSummary = Omit<Database['public']['Views']['dashboard_user_summary']['Row'], 'total_rendered_hours'> & {
  total_rendered_hours: string
}


export type DashboardDailySummary = Database['public']['Views']['dashboard_daily_summary']['Row']
