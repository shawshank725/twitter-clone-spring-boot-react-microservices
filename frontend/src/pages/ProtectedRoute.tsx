import { Navigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { type ReactNode } from "react";
import LoadingScreen from "@/pages/LoadingScreen";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return <div>{children}</div>;
}

export default ProtectedRoute;