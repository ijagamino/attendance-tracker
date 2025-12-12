import { Navigate } from "react-router";
import { useAuth } from "./auth-provider";
import type { ReactNode } from "react";

export default function ProtectRoute({ children }: { children: ReactNode }) {
  const { isAuth } = useAuth();
  if (!isAuth) return <Navigate to="/login" />;
  return children;
}
