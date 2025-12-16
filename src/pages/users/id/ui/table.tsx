import { DataTable } from '@/components/data-table.tsx'
import type { AttendanceRecord, Column } from 'shared/types/api.ts'

export default function UserAttendanceRecordTable({
  attendanceRecords,
}: {
  attendanceRecords: AttendanceRecord[]
}) {
  const columns: Column[] = [
    { label: 'Name', value: 'username' },
    { label: 'Date' },
    { label: 'Time In' },
    { label: 'Time Out' },
    { label: 'Status' },
    { label: 'Total Hours' },
  ]

  return (
    <>
      <DataTable<AttendanceRecord> columns={columns} rows={attendanceRecords} />
    </>
  )
}
