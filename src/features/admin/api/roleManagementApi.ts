import axios from 'axios';
import { UserRole } from '../../auth/core/_models';
import config from '../../../config';

const API_URL = `${config.apiUrl}/api/RoleManagement`;

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
    console.log('Token being sent:', token); // Debug log
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request headers:', config.headers); // Debug log
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error); // Debug log
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response); // Debug log
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error); // Debug log
    return Promise.reject(error);
  }
);

export interface AssignRoleRequest {
  userId: string;
  role: UserRole;
}

export interface RemoveRoleRequest {
  userId: string;
  role: UserRole;
}

export interface UserLookupResponse {
  userId: string;
  email: string;
}

export const roleManagementApi = {
  getUserByEmail: async (email: string): Promise<UserLookupResponse> => {
    const response = await api.get<UserLookupResponse>(`/user-by-email?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  assignRole: async (data: AssignRoleRequest): Promise<void> => {
    await api.post('/assign', null, {
      params: {
        userId: data.userId,
        role: data.role
      }
    });
  },

  removeRole: async (data: RemoveRoleRequest): Promise<void> => {
    await api.post('/remove', null, {
      params: {
        userId: data.userId,
        role: data.role
      }
    });
  },

  getUserRoles: async (userId: string): Promise<UserRole[]> => {
    const response = await api.get<UserRole[]>(`/user/${userId}`);
    return response.data;
  },

  isUserInRole: async (userId: string, role: UserRole): Promise<boolean> => {
    const response = await api.get<boolean>(`/check`, {
      params: {
        userId,
        role
      }
    });
    return response.data;
  }
}; 