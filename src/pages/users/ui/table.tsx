import { DataTable } from '@/components/data-table.tsx'
import type { Column } from '@/shared/types'
import type { Profile } from '@/supabase/global.types'
import { useNavigate } from 'react-router'
import lodash from 'lodash'

export default function UserTable({
  userProfiles,
}: {
  userProfiles: Profile[]
}) {
  const navigate = useNavigate()

  const columns: Column<Profile>[] = [
    { label: 'First Name' },
    { label: 'Last Name' },
    {
      label: 'Role', format: (_, row) => {
        return lodash.capitalize(row.role)
      }
    },
    {
      label: 'Status',
      value: 'is_active',
      format: (_, row) => {
        return row.is_active === true ? "Active" : "Inactive"
      }
    },
  ]

  return (
    <>
      <DataTable<Profile>
        columns={columns}
        rows={userProfiles}
        onRowClick={(row) => {
          navigate(`/users/${row.id}`)
        }}
      />
    </>
  )
}
