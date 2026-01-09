import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDateStringToLocaleTime } from '@/lib/format'
import { supabase } from '@/supabase/client'
import type { AttendanceRecord } from '@/supabase/global.types'
import { format } from 'date-fns'
import { useState } from 'react'
import { toast } from 'sonner'
import { isValidDate } from '@/lib/valid-date'

export default function TimeOutCell({
  row,
  onUpdate
}: {
  row: AttendanceRecord,
  onUpdate: (updatedRow: AttendanceRecord) => void
}) {
  const [timeOut, setTimeOut] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const time = row.time_out ? format(row.time_out, 'HH:mm:ss') : '00:00:00'

  async function handleUpdate() {
    if (!row.id || !row.date) return

    const [h, m, s] = timeOut.split(":").map(Number)
    const date = new Date(row.date)
    date.setHours(h, m, s ?? 0, 0)

    if (!isValidDate(date)) {
      toast.error('Invalid date')
      return
    }

    const payload = date.toISOString()

    const { data, error } = await supabase
      .from('attendance_records')
      .update({ time_out: payload })
      .eq('id', row.id)
      .select('*, profiles!inner(id, first_name)')
      .single()
      .overrideTypes<{ total_hours: string }>()

    if (error) return toast.error(error.message)

    onUpdate(data)
    toast.success(`${row.date} time out successfully updated.`)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        {row.time_out ?
          formatDateStringToLocaleTime(row.time_out) : '---'
        }
      </PopoverTrigger>
      <PopoverContent className="grid gap-4">
        <div className="space-y-2">
          <h4 className="leading-none font-medium">Time Out</h4>
          <p className="text-muted-foreground text-sm">
            Override time out for {row.date}.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Label htmlFor="time_out">Time Out</Label>
          <Input
            id="time_out"
            className="col-span-2"
            type="time"
            defaultValue={time}
            onChange={(e) => setTimeOut(e.target.value)}
          />
        </div>
        <Button onClick={() => handleUpdate()}>Update</Button>
      </PopoverContent>
    </Popover>
  )
}
