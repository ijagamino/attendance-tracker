import { DataTable } from '@/components/data-table.tsx'
import type { Column } from '@/shared/types'
import type { LeaveRequestWithProfile } from '@/supabase/global.types'
import type { Dispatch, SetStateAction } from 'react'
import ActionCell from './action-cell'
import { useAuth } from '@/app/providers/auth-provider'

export default function LeaveRequestTable({
  leaveRequests,
  setLeaveRequests,
  onLeaveRequestUpdate
}: {
  leaveRequests: LeaveRequestWithProfile[]
  setLeaveRequests: Dispatch<SetStateAction<LeaveRequestWithProfile[]>>
  onLeaveRequestUpdate: () => void
}) {
  const { role } = useAuth()

  const columns: Column<LeaveRequestWithProfile>[] = [
    {
      label: 'User',
      format: (_, row) => {
        return `${row.profiles.first_name} ${row.profiles.last_name}`
      },
    },
    { label: 'Start Date' },
    { label: 'End Date' },
    {
      label: 'Reason',
    },
    {
      label: 'Status',
      value: 'is_approved',
      format: (_, row) => {
        return row.is_approved === true
          ? "Approved"
          : row.is_approved === false
            ? "Disapproved"
            : "Pending"
      },
    },
    {
      label: 'Notes',
    },
    {
      label: 'Action',
      Cell: (row) => {
        return (
          <ActionCell
            key={row.id}
            row={row}
            onUpdate={
              updatedRow => {
                setLeaveRequests((prev: LeaveRequestWithProfile[]) => prev.map(r => r.id === updatedRow.id ? updatedRow : r))
                onLeaveRequestUpdate()
              }
            }
          />)
      },
      visibility: role === "admin" ? true : false
    }
  ]

  return (
    <>
      <DataTable<LeaveRequestWithProfile>
        columns={columns}
        rows={leaveRequests}
      />
    </>
  )
}
