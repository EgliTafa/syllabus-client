export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phonePrefix: string;
  phoneNumber: string;
  profilePictureUrl?: string;
}

export interface RegisterUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  roles: UserRole[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  roles: UserRole[];
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export enum UserRole {
  Student = 'Student',
  Professor = 'Professor',
  Administrator = 'Administrator'
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  roles: UserRole[];
} 