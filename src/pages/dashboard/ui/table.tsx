import { DataTable } from '@/components/data-table.tsx'
import { formatInterval } from '@/lib/format'
import type { Column } from '@/shared/types'
import type { DashboardData } from '@/supabase/global.types'
import { useNavigate } from 'react-router'

export default function DashboardUserTable({
  users,
}: {
  users: DashboardData['users']
}) {
  const navigate = useNavigate()
  const columns: Column<DashboardData['users'][number]>[] = [
    { label: 'Name', value: 'first_name' },
    {
      label: 'Total Rendered Hours', format: (_, row): string | undefined => {
        if (row.total_rendered_hours) return formatInterval(row.total_rendered_hours as string)
      }
    }
  ]

  return (
    <>
      <DataTable<DashboardData['users'][number]>
        onRowClick={(row) => {
          navigate(`/users/${row.user_id}`)
        }}
        columns={columns}
        rows={users}
      />
    </>
  )
}
