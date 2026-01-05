import { DataTable } from '@/components/data-table.tsx'
import { formatInterval } from '@/lib/format'
import type { Column } from '@/shared/types'
import type { DashboardUserSummary } from '@/supabase/global.types'
import { useNavigate } from 'react-router'

export default function DashboardUserTable({
  users,
}: {
  users: DashboardUserSummary[]
}) {
  const navigate = useNavigate()
  const columns: Column<DashboardUserSummary>[] = [
    { label: 'Name', value: 'first_name' },
    {
      label: 'Total Rendered Hours', format: (_, row): string | undefined => {
        if (row.total_rendered_hours) return formatInterval(row.total_rendered_hours as string)
      }
    }
  ]

  return (
    <>
      <DataTable<DashboardUserSummary>
        onRowClick={(row) => {
          navigate(`/users/${row.id}`)
        }}
        columns={columns}
        rows={users}
      />
    </>
  )
}
