import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

export default function OnlyAdminPrivateRoute() {
  const { user } = useAuth();

  return user && user.isAdmin ? <Outlet /> : <Navigate to="/login" />;
}
