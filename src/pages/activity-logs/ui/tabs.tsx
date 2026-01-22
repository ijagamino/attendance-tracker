import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { TabsContent } from '@/components/ui/tabs'
import type { LoggedActionWithProfile } from '@/supabase/global.types'

interface Tab {
  value: string
}

interface OverviewTab extends Tab {
  oldData: string,
  newData: string,
}

interface DetailsTab extends Tab {
  loggedAction: LoggedActionWithProfile
}

export function OverviewTab({ value, oldData, newData }: OverviewTab) {
  // const [oldData, setOldData] = useState<string>()
  // const [newData, setNewData] = useState<string>()

  return (
    <TabsContent className='grid grid-cols-2 gap-4' value={value}>
      <Card>
        <CardHeader className='border-b-2'>
          <CardTitle>
            Old data
          </CardTitle>
        </CardHeader>
        <CardContent key={oldData} className=''>
          {/* <pre className='whitespace-pre-wrap'> */}
          {oldData && oldData.split(',').map((data, index) => (
            <code key={`oldData-${index}`} className='block'>{data}</code>
          ))}
          {/* </pre> */}
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
    </TabsContent >
  )
}

export function DetailsTab({ value, loggedAction }: DetailsTab) {
  return (
    <TabsContent value={value}>
      <Card>
        <CardContent className=''>
          <FieldGroup>
            <Field>
              <FieldLabel>Transaction ID</FieldLabel>
              <Input defaultValue={loggedAction.transaction_id} disabled />
            </Field>
            <Field>
              <FieldLabel>Action Type</FieldLabel>
              <Input defaultValue={loggedAction.action_type} disabled />
            </Field>
            <Field>
              <FieldLabel>Action Timestamp</FieldLabel>
              <Input defaultValue={loggedAction.action_timestamp} disabled />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
