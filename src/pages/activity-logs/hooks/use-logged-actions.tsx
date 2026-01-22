import { supabase } from "@/supabase/client"
import type { LoggedActionWithProfile } from "@/supabase/global.types"
import { useState, useCallback, useEffect } from "react"

export default function useLoggedActions({
  page,
  limit
}: {
  page: number,
  limit: number
}) {
  const [loggedActions, setLoggedActions] = useState<LoggedActionWithProfile[]>([])
  const [totalPage, setTotalPage] = useState<number>()

  const getLoggedActions = useCallback(
    async ({
      page,
      limit,
    }: {
      page?: number,
      limit?: number,
    } = {}
    ) => {
      const query = supabase
        .from('logged_actions')
        .select('*, profiles!inner(id, first_name, last_name)', {
          count: 'exact'
        })

      if (page && limit) {
        const rangeFrom = (page - 1) * limit
        const rangeTo = rangeFrom + limit - 1
        query.range(rangeFrom, rangeTo)
      }

      const { data, count, error } = await query.overrideTypes<Array<{ transaction_id: string }>>()
      if (error) throw new Error(error.message)
      return { data, count }

    }, [])

  useEffect(() => {
    getLoggedActions({ page, limit }).then(({ data, count }) => {
      setLoggedActions(data)
      setTotalPage(Math.ceil((count ?? 0) / limit))
    })
  }, [getLoggedActions, page, limit])

  const refetch = useCallback(() => {
    return getLoggedActions({ page, limit })
      .then((({ data }) => {
        setLoggedActions(data)
      }))
  }, [getLoggedActions, page, limit])

  return { loggedActions, setLoggedActions, getLoggedActions, refetch, totalPage }
}
