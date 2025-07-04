import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { isTokenExpired } from '../../utils/jwtUtils';
import { AuthInitializer } from '../../features/auth/core/AuthInitializer';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, checkTokenValidity, handleLogout } = useAuth();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // First, validate the stored auth state
        const isValidState = AuthInitializer.validateAuthState();
        
        if (!isValidState) {
          console.log('Invalid auth state detected, redirecting to login');
          handleLogout();
          return;
        }

        // Check if user is authenticated in Redux state
        if (!isAuthenticated) {
          console.log('User not authenticated in Redux state, redirecting to login');
          return;
        }

        // Additional check for token validity
        if (user?.token && isTokenExpired(user.token)) {
          console.log('Token is expired in ProtectedRoute, redirecting to login');
          handleLogout();
          return;
        }

        // If we reach here, authentication is valid
        setIsValidating(false);
      } catch (error) {
        console.error('Error validating authentication:', error);
        handleLogout();
      }
    };

    validateAuth();
  }, [isAuthenticated, user?.token, checkTokenValidity, handleLogout]);

  // Show loading spinner while validating
  if (isValidating) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated after validation, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Additional safety check for token validity
  if (user?.token && isTokenExpired(user.token)) {
    console.log('Token is expired, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 