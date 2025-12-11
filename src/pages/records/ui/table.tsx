import { useNavigate } from "react-router";
import type { AttendanceRecord } from "../../../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AttendanceRecordTable({
  attendanceRecords,
}: {
  attendanceRecords: AttendanceRecord[];
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time In</TableHead>
              <TableHead>Time Out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRecords.map((attendanceRecord) => (
              <TableRow
                key={attendanceRecord.id}
                onClick={() => navigate(`/users/${attendanceRecord.userId}`)}
              >
                <TableCell>{attendanceRecord.username}</TableCell>
                <TableCell>{attendanceRecord.date}</TableCell>
                <TableCell>{attendanceRecord.timeIn}</TableCell>
                <TableCell>{attendanceRecord.timeOut}</TableCell>
                <TableCell>{attendanceRecord.status}</TableCell>
                <TableCell>{attendanceRecord.totalHours}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
