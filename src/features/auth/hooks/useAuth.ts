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
  UpdateProfileRequest,
  ChangePasswordRequest,
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
    phonePrefix?: string;
    phoneNumber?: string;
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

  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  const handleRegister = async (data: RegisterUserRequest) => {
    try {
      clearError();
      dispatch(setIsFetching(true));
      const response = await authApi.register(data);
      dispatch(setUser({ ...response, roles: response.roles ?? [] }));
      localStorage.setItem("token", response.token);
      navigate("/syllabus");
    } catch (error: any) {
      let errorMessage = "Registration failed";
      
      if (error.response) {
        // Handle specific error types
        switch (error.response.status) {
          case 400:
            if (error.response.data?.detail?.includes("conflict")) {
              errorMessage = "This email is already registered. Please use a different email or try logging in.";
            } else if (error.response.data?.detail?.includes("validation")) {
              errorMessage = "Please check your input. All fields are required and password must be at least 8 characters.";
            } else {
              errorMessage = error.response.data?.detail || "Invalid registration data. Please check your input.";
            }
            break;
          case 409:
            errorMessage = "This email is already registered. Please use a different email or try logging in.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = error.response.data?.message || "Registration failed. Please try again.";
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your internet connection.";
      }
      
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setIsFetching(false));
    }
  };

  const handleLogin = async (data: LoginRequest) => {
    try {
      clearError();
      dispatch(setIsFetching(true));
      const response = await authApi.login(data);
      dispatch(setUser({ ...response, roles: response.roles ?? [] }));
      localStorage.setItem("token", response.token);
      navigate("/syllabus");
    } catch (error: any) {
      let errorMessage = "Login failed";
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = "Invalid email or password. Please try again.";
            break;
          case 400:
            errorMessage = "Please check your input. Email and password are required.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = error.response.data?.message || "Login failed. Please try again.";
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your internet connection.";
      }
      
      dispatch(setError(errorMessage));
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

  const handleUpdateProfile = async (data: UpdateProfileRequest) => {
    try {
      clearError();
      dispatch(setIsFetching(true));
      const response = await authApi.updateProfile(data);
      dispatch(setUser({ ...response, roles: response.roles ?? [] }));
    } catch (error: any) {
      let errorMessage = "Profile update failed";
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Please check your input. All fields are required.";
            break;
          case 401:
            errorMessage = "Your session has expired. Please log in again.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = error.response.data?.message || "Profile update failed. Please try again.";
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your internet connection.";
      }
      
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setIsFetching(false));
    }
  };

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    try {
      clearError();
      dispatch(setIsFetching(true));
      await authApi.changePassword(data);
    } catch (error: any) {
      let errorMessage = "Password change failed";
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Please check your input. All fields are required.";
            break;
          case 401:
            errorMessage = "Current password is incorrect.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = error.response.data?.message || "Password change failed. Please try again.";
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your internet connection.";
      }
      
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setIsFetching(false));
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordRequest) => {
    try {
      clearError();
      dispatch(setIsFetching(true));
      await authApi.forgotPassword(data);
      return true;
    } catch (error: any) {
      let errorMessage = "Failed to send reset email";
      
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = "No account found with this email address.";
            break;
          case 400:
            errorMessage = "Please enter a valid email address.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = error.response.data?.message || "Failed to send reset email. Please try again.";
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your internet connection.";
      }
      
      dispatch(setError(errorMessage));
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

  const isAdmin = () => {
    return user?.roles?.includes(UserRole.Administrator) ?? false;
  };

  const isProfessor = () => {
    return user?.roles?.includes(UserRole.Professor) ?? false;
  };

  const isStudent = () => {
    return user?.roles?.includes(UserRole.Student) ?? false;
  };

  return {
    user,
    isAuthenticated,
    isFetching,
    error,
    clearError,
    handleRegister,
    handleLogin,
    handleLogout,
    handleUpdateProfile,
    handleChangePassword,
    handleForgotPassword,
    handleResetPassword,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isProfessor,
    isStudent,
  };
};
