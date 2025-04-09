
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

export interface ProtectedRouteProps {
  allowedRoles: string[];
  children?: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  
  // Show a loading state while authentication status is being determined
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // If user doesn't have required role, redirect to unauthorized
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Render children or Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
