import { useApiFetch } from '@/hooks/use-api-fetch'
import type {
  DashboardResponse,
  ApiResponse,
  DashboardUser,
} from 'shared/types/api'
import { useEffect, useState } from 'react'
import DashboardCard from './ui/card'
import { TypographyH1, TypographyH2 } from '@/components/ui/typography'
import DashboardUserTable from './ui/table'
import useQueryParam from '@/hooks/use-query-param.ts'
import PaginationButtons from '@/components/pagination-buttons.tsx'

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse>()
  const [dashboardUsers, setDashboardUsers] = useState<DashboardUser[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>()

  const apiFetch = useApiFetch()

  const { searchParams, setParam } = useQueryParam({
    page: '1',
  })

  useEffect(() => {
    const params = new URLSearchParams(searchParams)

    apiFetch<ApiResponse<DashboardResponse>>(`dashboard?${params}`, 'GET').then(
      (response) => {
        setDashboardUsers(response.data.users.items)
        setDashboardData(response.data)
        setTotalPage(response.data.users.pagination.totalPage)
        setPage(response.data.users.pagination.page)
      }
    )
  }, [apiFetch, searchParams])

  const [hours, minutes] = dashboardData?.earliest?.split(':') ?? []

  return (
    <>
      <header>
        <TypographyH1>Dashboard</TypographyH1>
      </header>

      <TypographyH2>Summary of today</TypographyH2>

      <div className="grid my-8 grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard title="Attendees">
          <p className="font-extrabold text-center text-6xl">
            {dashboardData?.attendees}
          </p>
        </DashboardCard>

        <DashboardCard title="Late Attendees">
          <p className="font-extrabold text-center text-6xl">
            {dashboardData?.lateAttendees}
          </p>
        </DashboardCard>

        <DashboardCard title="Earliest Time-in">
          <p className=" font-extrabold text-center text-6xl">
            {hours}:{minutes}
          </p>
        </DashboardCard>
      </div>

      <hr className="mb-4" />

      <TypographyH2>Summary per user</TypographyH2>

      <DashboardUserTable users={dashboardUsers} />

      <PaginationButtons
        page={page}
        totalPage={totalPage}
        onPageChange={(newPage) => {
          setPage(newPage)
          setParam('page', newPage.toString())
        }}
      />
    </>
  )
}
