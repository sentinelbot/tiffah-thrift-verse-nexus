
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

export interface ProtectedRouteProps {
  allowedRoles: string[];
  children?: ReactNode;
  redirectPath?: string;
}

const ProtectedRoute = ({ allowedRoles, children, redirectPath = "/auth" }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Show a loading state while authentication status is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }
  
  // If user is not logged in, redirect to login
  if (!user) {
    // Save the attempted URL for redirecting after login
    const from = location.pathname + location.search;
    return <Navigate to={`${redirectPath}?from=${encodeURIComponent(from)}`} replace />;
  }
  
  // If user doesn't have required role, redirect to unauthorized
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Render children or Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
