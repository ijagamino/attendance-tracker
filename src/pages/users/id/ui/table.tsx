import { DataTable } from '@/components/data-table.tsx'
import { formatInterval } from '@/lib/format'
import type { Column } from '@/shared/types'
import type { AttendanceRecord } from '@/supabase/global.types'
import TimeInCell from './time-in-cell'
import type { Dispatch, SetStateAction } from 'react'
import TimeOutCell from './time-out-cell'
import RemarksCell from './remarks-cell'

export default function UserAttendanceRecordTable({
  userAttendanceRecords,
  setUserAttendanceRecords,
  onUserAttendanceRecordUpdate
}: {
  userAttendanceRecords: AttendanceRecord[]
  setUserAttendanceRecords: Dispatch<SetStateAction<AttendanceRecord[]>>
  onUserAttendanceRecordUpdate: () => void
}) {
  const columns: Column<AttendanceRecord>[] = [
    { label: 'Name', value: 'profiles.first_name' },
    { label: 'Date' },
    {
      label: 'Time In',
      Cell: (row) => {
        return (
          <TimeInCell
            key={row.id}
            row={row}
            onUpdate={
              updatedRow => {
                setUserAttendanceRecords((prev: AttendanceRecord[]) => prev.map(r => r.id === updatedRow.id ? updatedRow : r))
                onUserAttendanceRecordUpdate()
              }
            }
          />)
      }
    },
    {
      label: 'Time Out',
      Cell: (row) => {
        return (
          <TimeOutCell
            key={row.id}
            row={row}
            onUpdate={
              updatedRow => {
                setUserAttendanceRecords((prev: AttendanceRecord[]) => prev.map(r => r.id === updatedRow.id ? updatedRow : r))
                onUserAttendanceRecordUpdate()
              }
            }
          />)
      }
    },
    {
      label: 'Total Hours',
      format: (_, row) => {
        if (!row.total_hours) return '---'
        if (row.total_hours) return formatInterval(row.total_hours as string)
      },
    },
    { label: 'Status' },
    {
      label: 'Remarks',
      Cell: (row) => {
        return (
          <RemarksCell
            key={row.id}
            row={row}
            onUpdate={
              updatedRow => setUserAttendanceRecords((prev: AttendanceRecord[]) => prev.map(r => r.id === updatedRow.id ? updatedRow : r))
            }
          />)
      }
    },
  ]

  return (
    <>
      <DataTable<AttendanceRecord> columns={columns} rows={userAttendanceRecords} />
    </>
  )
}
