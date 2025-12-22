import { Outlet } from "react-router";
import AppHeader from "@/components/app-header";

export default function DefaultLayout() {
  return (
    <>
      <AppHeader />
      <main className="container px-4 mx-auto mt-8">
        <Outlet />
      </main>
    </>
  );
}
