import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../core/_models';

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
  const { isAuthenticated, hasAnyRole, hasAllRoles } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasAccess = requireAll ? hasAllRoles(allowedRoles) : hasAnyRole(allowedRoles);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}; 