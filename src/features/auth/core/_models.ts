export enum UserRole {
  Student = 'Student',
  Professor = 'Professor',
  Administrator = 'Administrator'
}

export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phonePrefix: string;
  phoneNumber: string;
}

export interface RegisterUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  roles?: UserRole[];
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
  roles?: UserRole[];
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phonePrefix: string;
  phoneNumber: string;
}

export interface UpdateProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phonePrefix: string;
  phoneNumber: string;
  profilePictureUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  changedAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  roles: UserRole[];
} 