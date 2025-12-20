import type { Column } from 'shared/types/api'
import { DataTable } from '@/components/data-table.tsx'
import type { DashboardData } from '@/supabase/global.types'

export default function DashboardUserTable({
  users,
}: {
  users: DashboardData['users']
}) {
  const columns: Column<DashboardData['users'][number]>[] = [
    { label: 'Name', value: 'first_name' },
    { label: 'Total Rendered Hours' },
  ]

  return (
    <>
      <DataTable<DashboardData['users'][number]>
        columns={columns}
        rows={users}
      />
    </>
  )
}
