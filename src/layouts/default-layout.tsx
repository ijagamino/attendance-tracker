import { Outlet } from "react-router";
import AppHeader from "@/components/app-header";

export default function DefaultLayout() {
  return (
    <>
      <AppHeader />
      <main className="container max-w-4xl mx-auto mt-4">
        <Outlet />
      </main>
    </>
  );
}
