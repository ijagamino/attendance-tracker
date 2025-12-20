import { DataTable } from '@/components/data-table.tsx'
import { formatDateStringToLocaleTime } from '@/lib/format-date'
import type { AttendanceRecord } from '@/supabase/global.types'
import type { Column } from 'shared/types/api.ts'

export default function UserAttendanceRecordTable({
  attendanceRecords,
}: {
  attendanceRecords: AttendanceRecord[]
}) {
  const columns: Column<AttendanceRecord>[] = [
    { label: 'Name', value: 'profiles.first_name' },
    { label: 'Date' },
    {
      label: 'Time In',
      format: (_, row) => {
        if (row.time_in) return formatDateStringToLocaleTime(row.time_in)
      },
    },
    {
      label: 'Time Out',
      format: (_, row) => {
        if (row.time_out) return formatDateStringToLocaleTime(row.time_out)
      },
    },
    { label: 'Status' },
    {
      label: 'Total Hours',
      format: (_, row) => {
        const [hours, minutes] = row.total_hours
          ? row.total_hours.split(':')
          : []

        if (row.total_hours) return `${hours}:${minutes}`
      },
    },
  ]

  return (
    <>
      <DataTable<AttendanceRecord> columns={columns} rows={attendanceRecords} />
    </>
  )
}
