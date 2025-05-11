import axiosInstance from '../../../app/axios';
import {
  RegisterUserRequest,
  RegisterUserResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse
} from './_models';

const API_URL = '/auth';

export const register = async (request: RegisterUserRequest): Promise<RegisterUserResponse> => {
  const response = await axiosInstance.post<RegisterUserResponse>(`${API_URL}/register`, request);
  return response.data;
};

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(`${API_URL}/login`, request);
  return response.data;
};

export const forgotPassword = async (request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  const response = await axiosInstance.post<ForgotPasswordResponse>(`${API_URL}/forgot-password`, request);
  return response.data;
};

export const resetPassword = async (request: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const response = await axiosInstance.post<ResetPasswordResponse>(`${API_URL}/reset-password`, request);
  return response.data;
}; 