import CompanyLogo from "@/components/company-logo";
import { Outlet } from "react-router";

export default function LoginLayout() {
  return (
    <>
      <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md *:not-first:mt-4">
          <div className="flex gap-2 items-center justify-center">
            <CompanyLogo className="size-12" />
            <div>
              <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight text-balance">Techstacks</h1>
              <p className="text-xs leading-none font-medium text-muted-foreground">
                Employee Attendance and Leave Management System
              </p>
            </div>
          </div>
          <Outlet />
        </div>
      </main>
    </>
  );
}
