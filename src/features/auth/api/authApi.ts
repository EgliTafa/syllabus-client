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
  ChangePasswordRequest,
} from '../core/_models';
import { AuthInitializer } from '../core/AuthInitializer';
import config from '../../../config';

const API_URL = `${config.apiUrl}/auth`;

// Function to decode JWT token
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

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
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token decoding
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

  updateProfile: async (data: UpdateProfileRequest): Promise<LoginResponse> => {
    const response = await api.put<LoginResponse>('/profile', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.post('/change-password', data);
  },
}; 