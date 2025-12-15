import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TypographyH1 } from '@/components/ui/typography'
import { useApiFetch } from '@/hooks/use-api-fetch'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/error-handler.ts'
import { useCallback, useEffect, useState } from 'react'
import type {
  ApiResponse,
  MyAttendanceRecordResponse,
} from 'shared/types/api.ts'
import { Separator } from '@/components/ui/separator.tsx'

export default function HomePage() {
  const apiFetch = useApiFetch()
  const [myAttendanceRecord, setMyAttendanceRecord] =
    useState<MyAttendanceRecordResponse>()

  const getMyAttendanceRecord = useCallback(() => {
    apiFetch<ApiResponse<MyAttendanceRecordResponse>>(
      'me/attendance-records',
      'GET'
    )
      .then((response) => {
        setMyAttendanceRecord(response.data)
      })
      .catch((error) => {
        const errorMessage = getErrorMessage(error)

        errorMessage.then((message) => console.error(message))
      })
  }, [apiFetch])

  async function submit(type: 'create' | 'update') {
    try {
      if (type === 'create') {
        await apiFetch('attendance-records', 'POST')
      } else {
        await apiFetch('attendance-records', 'PATCH')
      }

      toast.success(`Attendance record ${type}d successfully`)
      getMyAttendanceRecord()
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    }
  }

  useEffect(() => {
    getMyAttendanceRecord()
  }, [getMyAttendanceRecord])

  const [timeInHours, timeInMinutes] =
    myAttendanceRecord?.timeIn.split(':') ?? []

  const [timeOutHours, timeOutMinutes] =
    myAttendanceRecord?.timeOut?.split(':') ?? []

  return (
    <>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            <TypographyH1>Attendance Tracker</TypographyH1>
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent>
          <div className="grid grid-cols-2 h-24 justify-between [&>div]:text-center [&>div]:flex [&>div]:flex-col [&>div]:justify-between">
            <div>
              <p>You timed in today at</p>
              {myAttendanceRecord?.timeIn && (
                <p className="text-6xl font-extrabold">
                  {timeInHours}:{timeInMinutes}
                </p>
              )}
            </div>

            <div>
              <p>You timed out today at</p>
              {myAttendanceRecord?.timeOut && (
                <p className="text-6xl font-extrabold">
                  {timeOutHours}:{timeOutMinutes}
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <Button
            className="w-full"
            onClick={() => submit('create')}
            disabled={!!myAttendanceRecord?.timeIn}
          >
            Time In
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => submit('update')}
            disabled={!myAttendanceRecord?.timeIn}
          >
            Time Out
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
