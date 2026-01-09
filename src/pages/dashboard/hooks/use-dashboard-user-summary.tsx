import { supabase } from "@/supabase/client"
import type { DashboardUserSummary } from "@/supabase/global.types"
import { useCallback, useEffect, useState } from "react"

export function useDashboardUserSummary({
  page,
  limit,
  name
}: {
  page: number
  limit: number
  name: string
}) {
  const [dashboardUserSummary, setDashboardUserSummary] = useState<DashboardUserSummary[]>()
  const [totalPage, setTotalPage] = useState<number>()

  const getDashboardUserSummary = useCallback(
    async ({ page, limit, name }: { page?: number, limit?: number, name?: string } = {}) => {
      const query = supabase
        .from('dashboard_user_summary')
        .select('*', { count: 'exact' })

      if (name) query.ilike('profiles.first_name', `%${name}%`)
      if (page && limit) {
        const rangeFrom = (page - 1) * limit
        const rangeTo = rangeFrom + limit - 1
        query.range(rangeFrom, rangeTo)
      }

      const { data, count, error } = await query.overrideTypes<Array<{ total_rendered_hours: string }>>()
      if (error) throw error

      return { data, count }
    }, [])


  useEffect(() => {
    getDashboardUserSummary({ page, limit, name }).then(({ data, count }) => {
      setTotalPage(Math.ceil((count ?? 0) / limit))
      setDashboardUserSummary(data)
    })
  }, [getDashboardUserSummary, page, limit, name])

  return { dashboardUserSummary, totalPage, getDashboardUserSummary }
}
