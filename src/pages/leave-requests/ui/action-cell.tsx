import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/supabase/client"
import type { LeaveRequestWithProfile } from "@/supabase/global.types"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function ActionCell({
  row,
  onUpdate
}: {
  row: LeaveRequestWithProfile,
  onUpdate: (updatedRow: LeaveRequestWithProfile) => void
}) {
  const [open, setOpen] = useState<boolean>(false)
  const [notes, setNotes] = useState<string>('')

  async function handleUpdate({ is_approved }: { is_approved: boolean }) {
    const { data, error } = await supabase
      .from('leave_requests')
      .update({ notes, is_approved })
      .eq('id', row.id)
      .select('*, profiles!inner(id, first_name, last_name)')
      .single()

    if (error) return toast.error(error.message)

    onUpdate(data)
    toast.success(`${row.profiles.first_name}'s request approved.`)
    setOpen(false)
  }

  const fullName = `${row.profiles.first_name} ${row.profiles.last_name}`

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' size='icon'>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="grid gap-4">
        <DialogHeader>
          <DialogTitle>Leave Request</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field className="grid grid-cols-3 gap-2">
            <FieldLabel htmlFor="notes">Start Date</FieldLabel>
            <Input
              id="notes"
              className="col-span-2"
              defaultValue={row.start_date}
              onChange={(e) => setNotes(e.target.value)}
              disabled
            />
          </Field>
          <Field className="grid grid-cols-3 gap-2">
            <FieldLabel htmlFor="notes">End Date</FieldLabel>
            <Input
              id="notes"
              className="col-span-2"
              defaultValue={row.end_date}
              onChange={(e) => setNotes(e.target.value)}
              disabled
            />
          </Field>
          <Field className="grid grid-cols-3 gap-2">
            <FieldLabel htmlFor="notes">Reason</FieldLabel>
            <Input
              id="notes"
              className="col-span-2"
              defaultValue={row.reason}
              onChange={(e) => setNotes(e.target.value)}
              disabled
            />
          </Field>
        </FieldGroup>

        <Separator />

        <DialogDescription className="text-muted-foreground text-sm">
          Approve {fullName}'s leave request?
        </DialogDescription>
        <Field className="grid grid-cols-3 gap-2">
          <FieldLabel htmlFor="notes">Notes</FieldLabel>
          <Input
            id="notes"
            className="col-span-2"
            defaultValue={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => handleUpdate({ is_approved: true })}>
            Approve
          </Button>
          <Button variant="destructive" onClick={() => handleUpdate({ is_approved: false })}>
            Decline
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
