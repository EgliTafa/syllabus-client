import axios from 'axios';
import config from '../../../config';

const API_URL = `${config.apiUrl}/api/Admin`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phonePrefix: string;
  phoneNumber: string;
  role: string;
  profilePictureUrl?: string;
}

export interface CreateUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phonePrefix: string;
  phoneNumber: string;
  role: string;
  profilePictureUrl?: string;
}

export interface UpdateUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phonePrefix: string;
  phoneNumber: string;
  role: string;
  profilePictureUrl?: string;
  status: string;
  emailConfirmed: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emailConfirmed: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
  status: string;
  roles: string[];
  profilePictureUrl?: string;
}

export interface RevokeAccessRequest {
  reason?: string;
  lockoutDurationDays?: number;
}

export interface RevokeAccessResponse {
  id: string;
  email: string;
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
  status: string;
  message: string;
}

export interface RestoreAccessResponse {
  id: string;
  email: string;
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
  status: string;
  message: string;
}

export interface SearchUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const adminApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  searchUsers: async (query: string): Promise<SearchUserResponse[]> => {
    const response = await api.get<SearchUserResponse[]>(`/users/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  createUser: async (userData: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await api.post<CreateUserResponse>('/users', userData);
    return response.data;
  },

  updateUser: async (userId: string, userData: UpdateUserRequest): Promise<UpdateUserResponse> => {
    const response = await api.put<UpdateUserResponse>(`/users/${userId}`, userData);
    return response.data;
  },

  revokeUserAccess: async (userId: string, revokeData: RevokeAccessRequest): Promise<RevokeAccessResponse> => {
    const response = await api.post<RevokeAccessResponse>(`/users/${userId}/revoke`, revokeData);
    return response.data;
  },

  restoreUserAccess: async (userId: string): Promise<RestoreAccessResponse> => {
    const response = await api.post<RestoreAccessResponse>(`/users/${userId}/restore`);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },

  /**
   * Upload profile picture for a specific user (admin only)
   */
  uploadUserProfilePicture: async (userId: string, file: string, fileName: string, contentType: string): Promise<{ profilePictureUrl: string; message: string }> => {
    const response = await api.post<{ profilePictureUrl: string; message: string }>(`/users/${userId}/upload-profile-picture`, {
      file,
      fileName,
      contentType,
    });
    return response.data;
  },
}; 