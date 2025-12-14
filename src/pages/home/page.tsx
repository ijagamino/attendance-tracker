import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TypographyH1 } from '@/components/ui/typography'
import { useApiFetch } from '@/hooks/use-api-fetch'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/error-handler.ts'

export default function HomePage() {
  const apiFetch = useApiFetch()

  async function submit(type: 'create' | 'update') {
    try {
      if (type === 'create') {
        await apiFetch('attendance-records', 'POST')
      } else {
        await apiFetch('attendance-records', 'PATCH')
      }

      toast.success(`Attendance record ${type}d successfully`)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    }
  }

  return (
    <>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            <TypographyH1>Attendance Tracker</TypographyH1>
          </CardTitle>
        </CardHeader>

        <hr />

        <form className="flex flex-col gap-2">
          <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Button className="w-full" formAction={() => submit('create')}>
              Time In
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              formAction={() => submit('update')}
            >
              Time Out
            </Button>
          </CardContent>
        </form>
      </Card>
    </>
  )
}
