import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { setUser, setIsFetching, setError, logout } from "../state/authSlice";
import {
  RegisterUserRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserRole,
} from "../core/_models";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

interface AuthState {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    roles?: UserRole[];
  } | null;
  isAuthenticated: boolean;
  isFetching: boolean;
  error: string | null;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isFetching, error } = useSelector(
    (state: RootState) => state.auth as AuthState
  );

  const handleRegister = async (data: RegisterUserRequest) => {
    try {
      dispatch(setIsFetching(true));
      const response = await authApi.register(data);
      dispatch(setUser(response));
      localStorage.setItem("token", response.token);
      navigate("/syllabus");
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || "Registration failed")
      );
      throw error;
    } finally {
      dispatch(setIsFetching(false));
    }
  };

  const handleLogin = async (data: LoginRequest) => {
    try {
      dispatch(setIsFetching(true));
      const response = await authApi.login(data);
      dispatch(setUser(response));
      localStorage.setItem("token", response.token);
      navigate("/syllabus");
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || "Login failed"));
      throw error;
    } finally {
      dispatch(setIsFetching(false));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleForgotPassword = async (data: ForgotPasswordRequest) => {
    try {
      dispatch(setIsFetching(true));
      await authApi.forgotPassword(data);
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || "Failed to send reset email")
      );
      throw error;
    } finally {
      dispatch(setIsFetching(false));
    }
  };

  const handleResetPassword = async (data: ResetPasswordRequest) => {
    try {
      dispatch(setIsFetching(true));
      await authApi.resetPassword(data);
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || "Failed to reset password")
      );
      throw error;
    } finally {
      dispatch(setIsFetching(false));
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.roles?.includes(role) ?? false;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const hasAllRoles = (roles: UserRole[]): boolean => {
    return roles.every(role => hasRole(role));
  };

  const isAdmin = (): boolean => hasRole(UserRole.Administrator);
  const isProfessor = (): boolean => hasRole(UserRole.Professor);
  const isStudent = (): boolean => hasRole(UserRole.Student);

  return {
    user,
    isAuthenticated,
    isFetching,
    error,
    handleRegister,
    handleLogin,
    handleLogout,
    handleForgotPassword,
    handleResetPassword,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isProfessor,
    isStudent
  };
};
