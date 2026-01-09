import { exportXlsx } from "@/lib/export"
import { formatDateToLocal, formatInterval } from "@/lib/format"
import type { DashboardUserSummary } from "@/supabase/global.types"

export default async function exportAttendanceRecords({
  getDashboardUserSummary
}: {
  getDashboardUserSummary: () => Promise<{ data: DashboardUserSummary[] }>
}) {
  exportXlsx<{
    name: string | null
    totalRenderedHours: string
  }>({
    worksheetName: "Attendance records",
    columns: [
      { label: 'Name', width: 20 },
      { label: 'Total Rendered Hours', width: 15 },
    ],
    fileName: `${formatDateToLocal(new Date(), "yyyy-MM-dd")}-dashboard-user-summary`,
    callback: async () => {
      const { data } = await getDashboardUserSummary()

      if (!data) return []

      function timeStringToSeconds(time: string) {
        const [hours = 0, minutes = 0, seconds = 0] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
      }

      return data
        .filter(user => timeStringToSeconds(user.total_rendered_hours) > 0)
        .map((user) => ({
          name: user.first_name,
          totalRenderedHours: formatInterval(user.total_rendered_hours)
        }))
    }
  })
}
