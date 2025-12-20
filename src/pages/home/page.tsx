import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TypographyH1 } from '@/components/ui/typography'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/error/error-handler.ts'
import { Separator } from '@/components/ui/separator.tsx'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import type { AttendanceRecord } from '@/supabase/global.types'
import { useCallback, useEffect, useState } from 'react'
import { PostgrestError } from '@supabase/supabase-js'

export default function HomePage() {
  const { userId, isLoading } = useAuth()
  const [myAttendanceRecord, setMyAttendanceRecord] =
    useState<AttendanceRecord>()

  const getMyAttendanceRecord = useCallback(async () => {
    if (isLoading) return null
    if (!userId) throw new Error('User ID is not available')

    const [date] = new Date().toISOString().split('T')

    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select()
        .eq('user_id', userId)
        .eq('date', date)
        .single()

      if (!data) return
      if (error) throw error
      if (data) setMyAttendanceRecord(data)
    } catch (error) {
      console.error(error)
    }
  }, [userId, isLoading])

  async function submit(type: 'create' | 'update') {
    try {
      if (!userId) throw new Error('User ID is not available')
      const [date] = new Date().toISOString().split('T')

      if (type === 'create') {
        const { error } = await supabase
          .from('attendance_records')
          .insert({ user_id: userId })

        if (error) throw new Error(error.message)
      } else {
        const { error } = await supabase
          .from('attendance_records')
          .update({ time_out: new Date().toISOString() })
          .eq('user_id', userId)
          .eq('date', date)

        if (error) throw new Error(error.message)
      }

      await getMyAttendanceRecord()
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    }
  }

  useEffect(() => {
    try {
      getMyAttendanceRecord()
    } catch (error) {
      if (error instanceof Error) console.log('hello world')
    }
  }, [getMyAttendanceRecord])

  const timeIn: string = myAttendanceRecord?.time_in
    ? new Date(myAttendanceRecord?.time_in).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : ''

  const timeOut: string = myAttendanceRecord?.time_out
    ? new Date(myAttendanceRecord?.time_out).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : ''

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
          <div className="grid grid-cols-2 h-36 justify-between [&>div]:text-center [&>div]:flex [&>div]:flex-col [&>div]:justify-between">
            <div>
              {myAttendanceRecord?.time_in ? (
                <>
                  <p>You timed in today at</p>
                  <p className="text-6xl font-extrabold">{timeIn}</p>
                </>
              ) : (
                <p>You have not timed in yet</p>
              )}
            </div>

            <div>
              {myAttendanceRecord?.time_out ? (
                <>
                  <p>You timed out today at</p>
                  <p className="text-6xl font-extrabold">{timeOut}</p>
                </>
              ) : (
                <p>You have not timed out yet</p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <Button
            className="w-full"
            onClick={() => submit('create')}
            disabled={!!myAttendanceRecord?.time_in}
          >
            Time In
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => submit('update')}
            disabled={!myAttendanceRecord?.time_in}
          >
            Time Out
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
