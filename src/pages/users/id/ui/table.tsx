import { DataTable } from '@/components/data-table.tsx'
import { formatDateStringToLocaleTime, formatInterval } from '@/lib/format'
import type { Column } from '@/shared/types'
import type { AttendanceRecord } from '@/supabase/global.types'

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
        if (row.total_hours) return formatInterval(row.total_hours as string)
      },
    },
  ]

  return (
    <>
      <DataTable<AttendanceRecord> columns={columns} rows={attendanceRecords} />
    </>
  )
}
