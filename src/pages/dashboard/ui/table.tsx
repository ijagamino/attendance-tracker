import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DashboardResponse } from "@/types";

export default function DashboardUserTable({
  dashboardData,
}: {
  dashboardData?: DashboardResponse;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Total Rendered Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dashboardData &&
            dashboardData.users.map((item) => (
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
