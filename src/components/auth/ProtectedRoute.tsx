
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiresAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [],
  requiresAuth = true
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register'];
  const isPublicPath = publicPaths.includes(location.pathname);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  // Allow access to public paths without authentication
  if (isPublicPath && !requiresAuth) {
    return <>{children}</>;
  }

  // For authenticated routes, redirect to login if not authenticated
  if (!user && requiresAuth) {
    console.log("User not authenticated, redirecting to login from", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and route requires authentication, check if user has required role
  if (requiresAuth && allowedRoles.length > 0 && user) {
    const userRole = user.user_metadata?.role || 'patient';
    
    if (!allowedRoles.includes(userRole)) {
      // Redirect to dashboard if user doesn't have required role
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
