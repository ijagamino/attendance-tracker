import { get } from "@/lib/apiFetch";
import type { DashboardResponse, ApiResponse } from "@/types";
import { useEffect, useState } from "react";
import DashboardCard from "./ui/card";
import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import DashboardUserTable from "./ui/table";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse>();

  useEffect(() => {
    get("dashboard").then((response: ApiResponse<DashboardResponse>) => {
      setDashboardData(response.data);
    });
  }, []);

  const [hours, minutes] = dashboardData?.earliest?.split(":") ?? [];

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

      <DashboardUserTable dashboardData={dashboardData} />
    </>
  );
}
