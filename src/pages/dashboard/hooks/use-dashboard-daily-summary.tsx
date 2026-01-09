import { supabase } from "@/supabase/client"
import type { DashboardDailySummary } from "@/supabase/global.types"
import { useState, useEffect } from "react"

export function useDashboardDailySummary() {
  const [dashboardDailySummary, setDashboardDailySummary] = useState<DashboardDailySummary>()

  useEffect(() => {
    async function getDashboardDailySummary() {
      const { data, error } = await supabase
        .from('dashboard_daily_summary')
        .select('*')
        .single()
      if (error) throw error
      if (data) {
        setDashboardDailySummary(data)
      }
    }

    getDashboardDailySummary()
  }, [])

  return { dashboardDailySummary }
}
