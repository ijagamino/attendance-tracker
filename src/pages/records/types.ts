export type AttendanceRecord = {
  id: string;
  username: string;
  date: string;
  time_in?: string;
  time_out?: string;
  status?: string;
};

export type FetchAttendanceRecord = {
  rows: AttendanceRecord[];
  totalPage: number;
};
