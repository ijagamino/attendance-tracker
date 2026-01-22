import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/data-table.tsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDateStringToLocaleTime } from '@/lib/format'
import type { Column } from '@/shared/types'
import type { LoggedActionWithProfile } from '@/supabase/global.types'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

export default function ActivityLogTable({
  loggedActions,
}: {
  loggedActions: LoggedActionWithProfile[]
}) {
  const [open, setOpen] = useState<boolean>(false)
  const [oldData, setOldData] = useState<string>()
  const [newData, setNewData] = useState<string>()
  const [loggedAction, setLoggedAction] = useState<LoggedActionWithProfile>()

  const columns: Column<LoggedActionWithProfile>[] = [
    {
      label: 'User',
      format: (_, row) => {
        return `${row.profiles.first_name} ${row.profiles.last_name}`
      },
    },
    { label: 'Schema name' },
    { label: 'Table name' },
    { label: 'Action type', },
    {
      label: 'Action timestamp',
      format: (_, row) => {
        if (row.action_timestamp) return formatDateStringToLocaleTime(row.action_timestamp)
      }
    },
  ]

  return (
    <>
      <DataTable<LoggedActionWithProfile>
        columns={columns}
        rows={loggedActions}
        onRowClick={(data) => {
          const rowDataString = JSON.stringify(data.row_data)
          const rowData = rowDataString !== 'null' ? rowDataString.substring(1, rowDataString.length - 1) : 'No previous data'
          const changedFieldsString = JSON.stringify(data.changed_fields)
          const changedFields = changedFieldsString !== 'null' ? changedFieldsString.substring(1, changedFieldsString.length - 1) : 'No new data'

          setOpen(true)
          setOldData(rowData)
          setNewData(changedFields)
          setLoggedAction(data)
        }}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='min-w-7xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              Transaction #{loggedAction?.transaction_id}
              {loggedAction?.action_type &&
                <Badge>{loggedAction?.action_type}</Badge>
              }
              {loggedAction?.action_timestamp &&
                <Badge variant='secondary'>{formatDateStringToLocaleTime(loggedAction?.action_timestamp)}</Badge>
              }
            </DialogTitle>
            <DialogDescription>
              Showing {loggedAction?.profiles.first_name}'s activity log details on <code>{loggedAction?.schema_name}.{loggedAction?.table_name}</code>
            </DialogDescription>
          </DialogHeader>

          <div className='grid grid-cols-2 gap-4'>
            <Card>
              <CardHeader className='border-b-2'>
                <CardTitle>
                  Old data
                </CardTitle>
              </CardHeader>
              <CardContent key={oldData} className=''>
                {oldData && oldData.split(',').map((data, index) => (
                  <code key={`oldData-${index}`} className='block'>{data}</code>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='border-b-2'>
                <CardTitle>
                  New data
                </CardTitle>
              </CardHeader>
              <CardContent key={newData} className='row-span-5'>
                {newData && newData?.split(',').map((data, index) => (
                  <code key={`newData-${index}`} className='block'>{data}</code>
                ))}
              </CardContent>
            </Card>
          </div >
        </DialogContent >
      </Dialog >
    </>
  )
}
