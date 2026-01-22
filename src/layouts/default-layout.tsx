import { Outlet } from "react-router";
import AppHeader from "@/components/app-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";

export default function DefaultLayout() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <AppHeader />
          <div className="container max-w-4xl mx-auto mt-8">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}
