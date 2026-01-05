import { useNavigate } from 'react-router'
import type { Column } from '@/shared/types'
import type { AttendanceRecord } from '@/supabase/global.types'
import { DataTable } from '@/components/data-table'
import { formatDateStringToLocaleTime, formatInterval } from '@/lib/format'

export default function AttendanceRecordTable({
  attendanceRecords,
}: {
  attendanceRecords: AttendanceRecord[]
}) {
  const navigate = useNavigate()

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
        return formatInterval(row.total_hours as string)
      },
    },
  ]

  return (
    <>
      <DataTable<AttendanceRecord>
        columns={columns}
        rows={attendanceRecords}
        onRowClick={(row) => {
          navigate(`/users/${row.id}`)
        }}
      />
    </>
  )
}
