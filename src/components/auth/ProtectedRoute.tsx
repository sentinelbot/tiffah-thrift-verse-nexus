
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasAnyRole, hasPermission } from '@/utils/authUtils';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermission?: string;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  requiredPermission,
  redirectTo = '/auth',
}) => {
  const { user, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      // Not authenticated
      if (!user) {
        setIsAuthorized(false);
        return;
      }

      // Just need authentication, no specific roles or permissions
      if (!requiredRoles && !requiredPermission) {
        setIsAuthorized(true);
        return;
      }

      // Check roles if specified
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRole = await hasAnyRole(user.id, requiredRoles);
        if (hasRole) {
          setIsAuthorized(true);
          return;
        }
      }

      // Check permission if specified
      if (requiredPermission) {
        const hasRequiredPermission = await hasPermission(user.id, requiredPermission);
        if (hasRequiredPermission) {
          setIsAuthorized(true);
          return;
        }
      }

      // Not authorized
      setIsAuthorized(false);
    };

    if (!isLoading) {
      checkAccess();
    }
  }, [user, isLoading, requiredRoles, requiredPermission]);

  // While checking authentication, show a loading spinner
  if (isLoading || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated or not authorized, redirect to login
  if (!isAuthorized) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated and authorized, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
