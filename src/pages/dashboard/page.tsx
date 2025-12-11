import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { get } from "@/lib/apiFetch";
import type {
  DashboardRows,
  DashboardStats,
  RowsWithStats,
  Data,
} from "@/types";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardRows[]>([]);

  useEffect(() => {
    get("dashboard").then(
      (response: Data<RowsWithStats<DashboardRows[], DashboardStats>>) => {
        setDashboardData(response.data.rows);
        console.log(response.data);
      }
    );
  }, []);
  return (
    <div className="rounded-md bordered">
      <Table>
        <TableHeader>
          <TableHead>Name</TableHead>
          <TableHead>Total Rendered Hours</TableHead>
        </TableHeader>
        <TableBody>
          {dashboardData &&
            dashboardData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.totalRenderedHours}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
