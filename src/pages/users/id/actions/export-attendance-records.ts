import { exportXlsx } from "@/lib/export"
import { formatDateStringToLocaleTime, formatInterval } from "@/lib/format";
import type { AttendanceRecordWithProfile, Profile } from "@/supabase/global.types"

export default async function exportAttendanceRecords({
  userId,
  profile,
  getUserAttendanceRecords
}: {
  userId: string,
  profile?: Profile,
  getUserAttendanceRecords: (userId: string) => Promise<{ data: AttendanceRecordWithProfile[]; count: number | null }>
}) {
  exportXlsx<{
    name: string
    date: string | null
    timeIn: string
    timeOut: string
    totalHours: string
  }>({
    worksheetName: "Attendance records",
    columns: [
      { label: 'Name', width: 20 },
      { label: 'Date', width: 15 },
      { label: 'Time In', width: 15 },
      { label: 'Time Out', width: 15 },
      { label: 'Total Hours', width: 10 },
      { label: 'Status', width: 10 },
      { label: 'Remarks', width: 20 }
    ],
    fileName: `${profile ? profile.first_name : ''}-attendance-records`,
    callback: async () => {
      if (!userId) return []
      const { data } = await getUserAttendanceRecords(userId)
      if (!data) return []

      return data.map((attendanceRecord) => ({
        name: attendanceRecord.profiles.first_name,
        date: attendanceRecord.date,
        timeIn: attendanceRecord.time_in ? formatDateStringToLocaleTime(attendanceRecord.time_in) : '',
        timeOut: attendanceRecord.time_out ? formatDateStringToLocaleTime(attendanceRecord.time_out) : '',
        totalHours: formatInterval(attendanceRecord.total_hours),
        status: attendanceRecord.status,
        remarks: attendanceRecord.remarks
      }))
    }
  })
}
