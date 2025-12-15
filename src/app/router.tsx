import { BrowserRouter, Route, Routes } from 'react-router'
import DashboardPage from '@/pages/dashboard/page'
import DefaultLayout from '@/layouts/default-layout'
import RecordsPage from '@/pages/records/page'
import HomePage from '@/pages/home/page'
import UserIdPage from '@/pages/users/id/page'
import LoginPage from '@/pages/login/page'
import LoginLayout from '@/layouts/login-layout'
import RegisterPage from '@/pages/register/page'
import ProtectRoute from '@/components/protect-route'
import LoginRouteWrapper from '@/components/login-route-wrapper.tsx'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectRoute>
              <DefaultLayout />
            </ProtectRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route
            path="dashboard"
            element={
              <ProtectRoute allowedRole="admin">
                <DashboardPage />
              </ProtectRoute>
            }
          />

          <Route path="records">
            <Route index element={<RecordsPage />} />
          </Route>

          <Route path="users">
            <Route path=":id" element={<UserIdPage />} />
          </Route>
        </Route>

        <Route
          path="/"
          element={
            <LoginRouteWrapper>
              <LoginLayout />
            </LoginRouteWrapper>
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
