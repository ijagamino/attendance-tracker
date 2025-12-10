import { useEffect, useState } from "react";
import type { AttendanceRecord, FetchAttendanceRecord } from "../types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { get } from "@/lib/apiFetch";
import { formatDateToLocal } from "@/lib/date";

export default function AttendanceTable({
  attendanceRecords,
}: {
  attendanceRecords: AttendanceRecord[];
}) {
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRecords.map((attendanceRecord) => (
              <TableRow key={attendanceRecord.id}>
                <TableCell>{attendanceRecord.username}</TableCell>
                <TableCell>{attendanceRecord.date}</TableCell>
                <TableCell>{attendanceRecord.time_in}</TableCell>
                <TableCell>{attendanceRecord.time_out}</TableCell>
                <TableCell>{attendanceRecord.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
