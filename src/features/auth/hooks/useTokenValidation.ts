import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { isTokenExpired } from '../../../utils/jwtUtils';
import { useAuth } from './useAuth';

export const useTokenValidation = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { handleLogout } = useAuth();

  const checkTokenValidity = useCallback(() => {
    if (isAuthenticated && user?.token) {
      if (isTokenExpired(user.token)) {
        console.log('Token is expired in useTokenValidation, logging out');
        handleLogout();
        return false;
      }
    }
    return true;
  }, [isAuthenticated, user?.token, handleLogout]);

  useEffect(() => {
    // Check token validity on mount and when user/token changes
    checkTokenValidity();
  }, [checkTokenValidity]);

  // Set up periodic check
  useEffect(() => {
    if (!isAuthenticated || !user?.token) {
      return;
    }

    const interval = setInterval(() => {
      checkTokenValidity();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated, user?.token, checkTokenValidity]);

  return {
    isTokenValid: checkTokenValidity(),
    checkTokenValidity,
  };
}; 