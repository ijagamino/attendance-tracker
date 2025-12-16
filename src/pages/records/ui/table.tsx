import { useNavigate } from 'react-router'
import type { AttendanceRecord, Column } from 'shared/types/api'
import { DataTable } from '@/components/data-table'

export default function AttendanceRecordTable({
  attendanceRecords,
}: {
  attendanceRecords: AttendanceRecord[]
}) {
  const navigate = useNavigate()

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
      <DataTable<AttendanceRecord>
        columns={columns}
        rows={attendanceRecords}
        onRowClick={(row) => {
          navigate(`/users/${row.userId}`)
        }}
      />
    </>
  )
}
