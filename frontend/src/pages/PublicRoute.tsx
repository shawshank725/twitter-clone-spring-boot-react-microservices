import { Navigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import type { JSX } from "react";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuth();

  // If user is logged in, redirect to home
  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return <div>{children}</div>;
}
