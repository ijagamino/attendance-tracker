import type { Column, DashboardUser } from 'shared/types/api'
import { DataTable } from '@/components/data-table.tsx'

export default function DashboardUserTable({
  users,
}: {
  users: DashboardUser[]
}) {
  const columns: Column[] = [
    { label: 'Name', value: 'username' },
    { label: 'Total Rendered Hours' },
  ]

  return (
    <>
      <DataTable<DashboardUser> columns={columns} rows={users} />
    </>
  )
}
