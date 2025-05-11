import axios from 'axios';
import { 
  RegisterUserRequest, 
  RegisterUserResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse
} from '../core/_models';
import { AuthInitializer } from '../core/AuthInitializer';
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
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
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
    const response = await api.post<LoginResponse>('/login', data);
    AuthInitializer.saveToken(response.data.token);
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
}; 