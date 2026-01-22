import { useAuth } from "@/app/providers/auth-provider";
import DatePicker from "@/components/date-picker";
import PaginationButtons from "@/components/pagination-buttons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH2 } from "@/components/ui/typography";
import useFieldErrors from "@/hooks/use-field-errors";
import useQueryParam from "@/hooks/use-query-param";
import { createLeaveRequestSchema } from "@/shared/schemas/leave-request.schema";
import { supabase } from "@/supabase/client";
import { format } from 'date-fns';
import { FileUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useLeaveRequests from "./hooks/use-leave-requests";
import LeaveRequestTable from "./ui/table";

export default function LeaveRequestsPage() {
  const { userId } = useAuth()
  const { fieldErrors, handleSetFieldErrors, emptyFieldErrors } = useFieldErrors()
  const [open, setOpen] = useState<boolean>(false)

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [reason, setReason] = useState<string>('')

  const { searchParams, setParam } = useQueryParam({
    page: '1',
    limit: '5',
  })

  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 5)

  const { leaveRequests, setLeaveRequests, refetch: refetchLeaveRequests, totalPage } = useLeaveRequests({ page, limit })

  async function handleRequestLeave() {
    if (!userId) throw new Error('User ID is not available')
    emptyFieldErrors()

    if (!startDate) {
      return toast.error("Start date is required")
    }

    if (!endDate) {
      return toast.error("End date is required")
    }

    const validate = createLeaveRequestSchema.safeParse({
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      reason
    })

    if (!validate.success) return handleSetFieldErrors(validate.error)


    const { error } = await supabase
      .from('leave_requests')
      .insert({
        start_date: validate.data.startDate,
        end_date: validate.data.endDate,
        reason: validate.data.reason,
        user_id: userId,
      })

    if (error) return toast.error(error.message)

    toast.success(`Successfully requested leave.`)
    refetchLeaveRequests()
    setStartDate(undefined)
    setEndDate(undefined)
    setReason('')
    setOpen(false)
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <header>
          <TypographyH2>Leave Requests</TypographyH2>
        </header>

        <div className="flex items-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileUp />
                Request leave
              </Button>
            </DialogTrigger>
            <form
              id="create_user"
              onSubmit={(e) => {
                e.preventDefault()
                handleRequestLeave()
              }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>File for leave</DialogTitle>
                  <DialogDescription>
                    Request for leave.
                    Provide starting date, end date and reason for leave.
                  </DialogDescription>
                </DialogHeader>

                <Field>
                  <FieldLabel htmlFor="start_date">Start Date</FieldLabel>
                  <DatePicker
                    id="start_date"
                    onSelectDate={(selectedDate) => {
                      if (!selectedDate) {
                        setStartDate(undefined)
                      }
                      if (selectedDate) {
                        setStartDate(selectedDate)
                      }
                    }}
                  />
                  <FieldError errors={fieldErrors.startDate} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="end_date">End Date</FieldLabel>
                  <DatePicker
                    id="end_date"
                    onSelectDate={(selectedDate) => {
                      if (!selectedDate) {
                        setEndDate(undefined)
                      }
                      if (selectedDate) {
                        setEndDate(selectedDate)
                      }
                    }}
                  />
                  <FieldError errors={fieldErrors.endDate} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="reason">Reason</FieldLabel>
                  <Textarea
                    id="reason"
                    name="reason"
                    placeholder="Reason..."
                    required
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  />
                  <FieldError errors={fieldErrors.reason} />
                </Field>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button form="create_user">
                    Add User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
      </div >

      <div className="mt-2">
        <LeaveRequestTable
          leaveRequests={leaveRequests}
          setLeaveRequests={setLeaveRequests}
          onLeaveRequestUpdate={refetchLeaveRequests}
        />

        <PaginationButtons
          page={page}
          totalPage={totalPage}
          onPageChange={(newPage) => {
            setParam('page', newPage.toString())
          }}
        />
      </div>
    </>
  )
}
