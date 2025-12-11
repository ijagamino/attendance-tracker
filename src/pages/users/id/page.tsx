import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH2 } from "@/components/ui/typography";
import { get } from "@/lib/apiFetch";
import { formatDateToLocal } from "@/lib/date";
import type {
  AttendanceRecord,
  DataWithPagination,
  RowsWithStats,
} from "@/types";
import AttendanceRecordTable from "@/pages/records/ui/table";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";

export function UserIdPage() {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);

  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
  });

  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>();
  const [totalProgress, setTotalProgress] = useState<string>("");
  const [username, setUsername] = useState<string | undefined>("");

  function handleParamChange(key: string, val: string) {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set(key, val);
      return newParams;
    });
  }

  const { id } = useParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    get(`users/${id}/attendance-records?${params}`).then(
      (
        response: DataWithPagination<
          RowsWithStats<AttendanceRecord[], { totalProgress: string }>
        >
      ) => {
        setAttendanceRecords(
          response.data.rows.map((item) => ({
            ...item,
            date: formatDateToLocal(item.date, "MM-dd-yyyy"),
          }))
        );
        setUsername(response.data.rows[0].username);
        setTotalProgress(response.data.stats.totalProgress);
        setTotalPage(response.pagination?.totalPage);
        setPage(response.pagination?.page);
      }
    );
  }, [searchParams, id]);

  const [hours, minutes, seconds] = totalProgress.split(":");

  return (
    <>
      <TypographyH2>{username}'s attendance records</TypographyH2>
      <div className="grid my-2 max-w-72">
        <Card>
          <CardHeader>
            <CardTitle>Total hours rendered this month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-2">
              <span className="col-span-1 row-span-2 font-extrabold text-7xl">
                {hours}H
              </span>
              <div className="flex flex-col">
                <span className="col-span-1 text-2xl font-bold text-center">
                  {minutes}M
                </span>
                <span className="col-span-1 text-2xl">{seconds}S</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* <TypographyP></TypographyP> */}

      <AttendanceRecordTable attendanceRecords={attendanceRecords} />

      <div className="flex justify-center w-full gap-2 mx-auto mt-2">
        <Button
          onClick={() => {
            const previousPage = page - 1;
            setPage(previousPage);
            handleParamChange("page", String(previousPage));
          }}
          disabled={page <= 1}
        >
          <ArrowLeftIcon />
        </Button>

        <Button
          onClick={() => {
            const nextPage = page + 1;
            setPage(nextPage);
            handleParamChange("page", String(nextPage));
          }}
          disabled={page === totalPage}
        >
          <ArrowRightIcon />
        </Button>
      </div>
    </>
  );
}
