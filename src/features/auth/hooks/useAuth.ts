import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import {
  setUser,
  setIsFetching,
  setError,
  logout
} from '../state/authSlice';
import {
  register,
  login,
  forgotPassword,
  resetPassword
} from '../core/_requests';
import {
  RegisterUserRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../core/_models';

interface AuthState {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
  } | null;
  isAuthenticated: boolean;
  isFetching: boolean;
  error: string | null;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isFetching, error } = useSelector(
    (state: RootState) => state.auth as AuthState
  );

  const registerUser = useCallback(
    async (request: RegisterUserRequest) => {
      try {
        dispatch(setIsFetching(true));
        const response = await register(request);
        dispatch(setUser(response));
        dispatch(setError(null));
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Registration failed';
        dispatch(setError(errorMessage));
        throw err;
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch]
  );

  const loginUser = useCallback(
    async (request: LoginRequest) => {
      try {
        dispatch(setIsFetching(true));
        const response = await login(request);
        dispatch(setUser(response));
        dispatch(setError(null));
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        dispatch(setError(errorMessage));
        throw err;
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch]
  );

  const handleForgotPassword = useCallback(
    async (request: ForgotPasswordRequest) => {
      try {
        dispatch(setIsFetching(true));
        const response = await forgotPassword(request);
        dispatch(setError(null));
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to process forgot password request';
        dispatch(setError(errorMessage));
        throw err;
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch]
  );

  const handleResetPassword = useCallback(
    async (request: ResetPasswordRequest) => {
      try {
        dispatch(setIsFetching(true));
        const response = await resetPassword(request);
        dispatch(setError(null));
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
        dispatch(setError(errorMessage));
        throw err;
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isFetching,
    error,
    registerUser,
    loginUser,
    handleForgotPassword,
    handleResetPassword,
    logoutUser
  };
}; 