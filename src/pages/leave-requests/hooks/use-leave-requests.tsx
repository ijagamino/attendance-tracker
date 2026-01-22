import { supabase } from "@/supabase/client"
import type { LeaveRequestWithProfile } from "@/supabase/global.types"
import { useState, useCallback, useEffect } from "react"

export default function useLeaveRequests({
  page,
  limit
}: {
  page: number,
  limit: number
}) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestWithProfile[]>([])
  const [totalPage, setTotalPage] = useState<number>()

  const getLeaveRequests = useCallback(
    async ({
      page,
      limit,
    }: {
      page?: number,
      limit?: number,
    } = {}
    ) => {
      const query = supabase
        .from('leave_requests')
        .select('*, profiles!inner(id, first_name, last_name)', {
          count: 'exact'
        })

      if (page && limit) {
        const rangeFrom = (page - 1) * limit
        const rangeTo = rangeFrom + limit - 1
        query.range(rangeFrom, rangeTo)
      }

      const { data, count, error } = await query.overrideTypes<Array<{ total_hours: string }>>()
      if (error) throw new Error(error.message)
      return { data, count }

    }, [])

  useEffect(() => {
    getLeaveRequests({ page, limit }).then(({ data, count }) => {
      setLeaveRequests(data)
      setTotalPage(Math.ceil((count ?? 0) / limit))
    })
  }, [getLeaveRequests, page, limit])

  const refetch = useCallback(() => {
    return getLeaveRequests({ page, limit })
      .then((({ data }) => {
        setLeaveRequests(data)
      }))
  }, [getLeaveRequests, page, limit])

  return { leaveRequests, setLeaveRequests, getLeaveRequests, refetch, totalPage }
}
