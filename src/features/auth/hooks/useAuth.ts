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
  ChangePasswordResponse,
} from "../core/_models";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { isTokenExpired } from "../../../utils/jwtUtils";

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
    profilePictureUrl?: string;
    emailConfirmed: boolean;
    lockoutEnabled: boolean;
    status: string;
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

  const handleLogout = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  }, [dispatch, navigate]);

  // Check if current token is valid
  const checkTokenValidity = useCallback(() => {
    if (user?.token && isTokenExpired(user.token)) {
      console.log('Token is expired, logging out user');
      handleLogout();
      return false;
    }
    return true;
  }, [user?.token, handleLogout]);

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
              if (error.response.data?.detail?.includes("phone number")) {
                errorMessage = "This phone number is already registered. Please use a different phone number.";
              } else {
                errorMessage =
                  "This email is already registered. Please use a different email or try logging in.";
              }
            } else if (error.response.data?.detail?.includes("validation")) {
              errorMessage =
                "Please check your input. All fields are required and password must be at least 8 characters.";
            } else {
              errorMessage =
                error.response.data?.detail ||
                "Invalid registration data. Please check your input.";
            }
            break;
          case 409:
            if (error.response.data?.detail?.includes("phone number")) {
              errorMessage = "This phone number is already registered. Please use a different phone number.";
            } else {
              errorMessage =
                "This email is already registered. Please use a different email or try logging in.";
            }
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage =
              error.response.data?.message ||
              "Registration failed. Please try again.";
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check your internet connection.";
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
            errorMessage =
              "Please check your input. Email and password are required.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage =
              error.response.data?.message || "Login failed. Please try again.";
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check your internet connection.";
      }

      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setIsFetching(false));
    }
  };

  const handleUpdateProfile = async (data: UpdateProfileRequest) => {
    // Check token validity before making the request
    if (!checkTokenValidity()) {
      return;
    }

    try {
      clearError();
      dispatch(setIsFetching(true));
      const response = await authApi.updateProfile(data);
      dispatch(
        setUser({
          ...response,
          token: user?.token || "",
          roles: user?.roles || [],
          lockoutEnabled: user?.lockoutEnabled || false,
          status: user?.status || "Active"
        })
      );
    } catch (error: any) {
      let errorMessage = "Profile update failed";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            if (error.response.data?.detail?.includes("phone number")) {
              errorMessage = "This phone number is already registered to another user. Please use a different phone number.";
            } else {
              errorMessage = "Please check your input. All fields are required.";
            }
            break;
          case 401:
            errorMessage = "Your session has expired. Please log in again.";
            handleLogout();
            break;
          case 409:
            if (error.response.data?.detail?.includes("phone number")) {
              errorMessage = "This phone number is already registered to another user. Please use a different phone number.";
            } else {
              errorMessage = "This email is already taken by another user.";
            }
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage =
              error.response.data?.message ||
              "Profile update failed. Please try again.";
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check your internet connection.";
      }

      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setIsFetching(false));
    }
  };

  const handleChangePassword = async (
    data: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> => {
    // Check token validity before making the request
    if (!checkTokenValidity()) {
      throw new Error('Token expired');
    }

    try {
      clearError();
      dispatch(setIsFetching(true));
      const response = await authApi.changePassword(data);
      return response;
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
            errorMessage =
              error.response.data?.message ||
              "Password change failed. Please try again.";
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check your internet connection.";
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
            errorMessage =
              error.response.data?.message ||
              "Failed to send reset email. Please try again.";
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check your internet connection.";
      }

      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setIsFetching(false));
    }
  };

  const handleResetPassword = async (data: ResetPasswordRequest) => {
    try {
      clearError();
      dispatch(setIsFetching(true));
      const response = await authApi.resetPassword(data);
      return response;
    } catch (error: any) {
      let errorMessage = "Password reset failed";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Please check your input. All fields are required.";
            break;
          case 401:
            errorMessage = "Invalid or expired reset token.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage =
              error.response.data?.message || "Password reset failed. Please try again.";
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check your internet connection.";
      }

      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setIsFetching(false));
    }
  };

  const handleUploadProfilePicture = async (file: File): Promise<string> => {
    try {
      clearError();
      dispatch(setIsFetching(true));

      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
      });

      const response = await authApi.uploadProfilePicture(base64, file.name, file.type);
      
      // Update user's profile picture URL in the store
      if (user) {
        dispatch(setUser({
          ...user,
          profilePictureUrl: response.profilePictureUrl,
          emailConfirmed: user.emailConfirmed,
          roles: user.roles || [],
          lockoutEnabled: user.lockoutEnabled,
          status: user.status
        }));
      }

      return response.profilePictureUrl;
    } catch (error: any) {
      let errorMessage = "Profile picture upload failed";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.message || "Invalid file format or size.";
            break;
          case 401:
            errorMessage = "Your session has expired. Please log in again.";
            handleLogout();
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage =
              error.response.data?.message || "Profile picture upload failed. Please try again.";
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check your internet connection.";
      }

      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setIsFetching(false));
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.roles?.includes(role) ?? false;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some((role) => hasRole(role));
  };

  const hasAllRoles = (roles: UserRole[]): boolean => {
    return roles.every((role) => hasRole(role));
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
    handleUploadProfilePicture,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isProfessor,
    isStudent,
    checkTokenValidity,
  };
};
