import { Navigate, Outlet } from "react-router-dom";
import { clearAccessToken, getAccessToken } from "../lib/auth";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function ProtectedRoute() {
  const token = getAccessToken();
  const { isLoading, isError } = useCurrentUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f4ef]">
        <div className="rounded-full border-2 border-slate-300 border-t-slate-800 h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (isError) {
    clearAccessToken();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
