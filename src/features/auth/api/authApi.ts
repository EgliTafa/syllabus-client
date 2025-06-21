import axios from 'axios';
import { 
  RegisterUserRequest, 
  RegisterUserResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../core/_models';
import { AuthInitializer } from '../core/AuthInitializer';
import { decodeToken, isTokenExpired } from '../../../utils/jwtUtils';
import config from '../../../config';

const API_URL = `${config.apiUrl}/auth`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = AuthInitializer.getToken();
    if (token) {
      // Check if token is expired before making the request
      if (isTokenExpired(token)) {
        console.log('Token is expired in auth API, redirecting to login');
        AuthInitializer.clearAuthState();
        window.location.href = '/login';
        return Promise.reject(new Error('Token expired'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token decoding and 401 responses
api.interceptors.response.use(
  (response) => {
    if (response.data.token) {
      const decodedToken = decodeToken(response.data.token);
      console.log('Decoded JWT Token:', decodedToken);
      
      // ASP.NET Core Identity stores roles in the 'role' claim
      // It can be either a single string or an array of strings
      if (decodedToken) {
        const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        console.log('Found roles in token:', roles);
        
        if (roles) {
          response.data.roles = Array.isArray(roles) ? roles : [roles];
        } else {
          // Fallback to check if roles are in the response data
          response.data.roles = response.data.roles || [];
        }
      }
      
      console.log('User Data after role processing:', {
        id: response.data.id,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        roles: response.data.roles,
        token: response.data.token
      });
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('Received 401 response in auth API, logging out user');
      AuthInitializer.clearAuthState();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: RegisterUserRequest): Promise<RegisterUserResponse> => {
    const response = await api.post<RegisterUserResponse>('/register', data);
    AuthInitializer.saveToken(response.data.token);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    console.log('Login attempt for:', data.email);
    const response = await api.post<LoginResponse>('/login', data);
    console.log('Login response received:', response.data);
    AuthInitializer.saveToken(response.data.token);
    
    // Log the current auth state after login
    const currentState = AuthInitializer.loadInitialState();
    console.log('Current auth state after login:', currentState);
    
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await api.post<ForgotPasswordResponse>('/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await api.post<ResetPasswordResponse>('/reset-password', data);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    const response = await api.put<UpdateProfileResponse>('/profile', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const response = await api.post<ChangePasswordResponse>('/change-password', data);
    return response.data;
  },

  /**
   * Resend email confirmation
   */
  resendEmailConfirmation: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/resend-email-confirmation', {
      email,
    });
    return response.data;
  },

  /**
   * Upload profile picture
   */
  uploadProfilePicture: async (file: string, fileName: string, contentType: string): Promise<{ profilePictureUrl: string; message: string }> => {
    const response = await api.post<{ profilePictureUrl: string; message: string }>('/upload-profile-picture', {
      file,
      fileName,
      contentType,
    });
    return response.data;
  },
}; 