import { BrowserRouter, Route, Routes } from "react-router";
import DashboardPage from "../pages/dashboard/page";
import DefaultLayout from "../layouts/default-layout";
import RecordsPage from "../pages/records/page";
import HomePage from "../pages/home/page";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<DefaultLayout />}
        >
          <Route
            index
            element={<HomePage />}
          />
          <Route
            path="dashboard"
            element={<DashboardPage />}
          />

          <Route path="records">
            <Route
              index
              element={<RecordsPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
