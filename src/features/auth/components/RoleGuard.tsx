import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../core/_models';
import { AuthInitializer } from '../core/AuthInitializer';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  requireAll?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  requireAll = false
}) => {
  const { isAuthenticated, hasAnyRole, hasAllRoles, user } = useAuth();
  const location = useLocation();

  // First, validate authentication state
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Validate that the stored auth state is still valid
  if (!AuthInitializer.validateAuthState()) {
    console.log('Invalid auth state in RoleGuard, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the required roles
  const hasAccess = requireAll ? hasAllRoles(allowedRoles) : hasAnyRole(allowedRoles);

  if (!hasAccess) {
    // Log the access attempt for debugging
    console.log('Access denied:', {
      userRoles: user?.roles || [],
      requiredRoles: allowedRoles,
      requireAll,
      attemptedPath: location.pathname
    });

    // Redirect to unauthorized page with context
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ 
          from: location,
          requiredRoles: allowedRoles,
          userRoles: user?.roles || [],
          requireAll
        }} 
        replace 
      />
    );
  }

  return <>{children}</>;
}; 