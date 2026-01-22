import { useAuth } from '@/app/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { supabase } from '@/supabase/client'
import type { AttendanceRecord } from '@/supabase/global.types'
import { useState } from 'react'
import { toast } from 'sonner'

export default function RemarksCell({
  row,
  onUpdate
}: {
  row: AttendanceRecord,
  onUpdate: (updatedRow: AttendanceRecord) => void
}) {
  const { role } = useAuth()
  const [remarks, setRemarks] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)

  async function handleUpdate() {
    if (!row.id || !row.date) return

    const payload = remarks !== '' ? remarks : null

    const { data, error } = await supabase
      .from('attendance_records')
      .update({ remarks: payload })
      .eq('id', row.id)
      .select('*, profiles!inner(id, first_name)')
      .single()
      .overrideTypes<{ total_hours: string }>()

    if (error) return toast.error(error.message)

    onUpdate(data)
    toast.success(`${row.date} remarks successfully updated.`)
    setOpen(false)
  }

  const formattedRemarks = row.remarks ?? 'None'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {role === "admin"
        ? (
          <PopoverTrigger>
            {formattedRemarks}
          </PopoverTrigger>
        ) : (
          formattedRemarks
        )
      }
      <PopoverContent className="grid gap-4">
        <div className="space-y-2">
          <h4 className="leading-none font-medium">Time In</h4>
          <p className="text-muted-foreground text-sm">
            Set remarks for {row.date}.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Input
            id="remarks"
            className="col-span-2"
            defaultValue={row.remarks ?? ''}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <Button onClick={() => handleUpdate()}>Update</Button>
      </PopoverContent>
    </Popover>
  )
}
