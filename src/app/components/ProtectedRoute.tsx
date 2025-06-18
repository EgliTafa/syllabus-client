import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { isTokenExpired } from '../../utils/jwtUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, checkTokenValidity } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Check token validity on component mount and when user changes
    if (isAuthenticated && user?.token) {
      if (isTokenExpired(user.token)) {
        console.log('Token is expired in ProtectedRoute, redirecting to login');
        checkTokenValidity();
      }
    }
  }, [isAuthenticated, user?.token, checkTokenValidity]);

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Additional check for token validity
  if (user?.token && isTokenExpired(user.token)) {
    console.log('Token is expired, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 