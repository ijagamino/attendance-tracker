import { useAuth } from '@/app/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDateStringToLocaleTime } from '@/lib/format'
import { supabase } from '@/supabase/client'
import type { AttendanceRecord } from '@/supabase/global.types'
import { format } from 'date-fns'
import { useState } from 'react'
import { toast } from 'sonner'

export default function TimeInCell({
  row,
  onUpdate
}: {
  row: AttendanceRecord,
  onUpdate: (updatedRow: AttendanceRecord) => void
}) {
  const { role } = useAuth()
  const [timeIn, setTimeIn] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const time = row.time_in ? format(row.time_in, 'HH:mm:ss') : ''

  async function handleUpdate() {
    if (!row.id || !row.date) return

    const [h, m, s] = timeIn.split(":").map(Number)
    const date = new Date(row.date)
    date.setHours(h, m, s ?? 0, 0)
    const payload = date.toISOString()

    const { data, error } = await supabase
      .from('attendance_records')
      .update({ time_in: payload })
      .eq('id', row.id)
      .select('*, profiles!inner(id, first_name)')
      .single()
      .overrideTypes<{ total_hours: string }>()

    if (error) return toast.error(error.message)

    onUpdate(data)
    toast.success(`${row.date} time in successfully updated.`)
    setOpen(false)
  }

  const formattedTimeIn = row.time_in ? formatDateStringToLocaleTime(row.time_in) : '---'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {role === "admin"
        ? (
          <PopoverTrigger>
            {formattedTimeIn}
          </PopoverTrigger>
        ) : (
          formattedTimeIn
        )
      }
      <PopoverContent className="grid gap-4">
        <div className="space-y-2">
          <h4 className="leading-none font-medium">Time In</h4>
          <p className="text-muted-foreground text-sm">
            Override time in for {row.date}.
          </p>
        </div>
        <Field className="grid grid-cols-3 gap-2">
          <FieldLabel htmlFor="time_in">Time In</FieldLabel>
          <Input
            id="time_in"
            className="col-span-2"
            type="time"
            defaultValue={time}
            onChange={(e) => setTimeIn(e.target.value)}
          />
        </Field>
        <Button onClick={() => handleUpdate()}>Update</Button>
      </PopoverContent>
    </Popover>
  )
}
