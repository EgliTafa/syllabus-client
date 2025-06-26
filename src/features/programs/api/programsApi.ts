import axios from 'axios';
import { 
  CreateProgramRequest, 
  UpdateProgramRequest,
  Program,
  Department
} from '../core/_models';
import { AuthInitializer } from '../../auth/core/AuthInitializer';
import { isTokenExpired } from '../../../utils/jwtUtils';
import config from '../../../config';

const API_URL = `${config.apiUrl}/api/Program`;
const DEPARTMENT_API_URL = `${config.apiUrl}/api/Department`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const departmentApi = axios.create({
  baseURL: DEPARTMENT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
const addAuthInterceptor = (instance: any) => {
  instance.interceptors.request.use(
    (config: any) => {
      const token = AuthInitializer.getToken();
      if (token) {
        // Check if token is expired before making the request
        if (isTokenExpired(token)) {
          console.log('Token is expired in programs API, redirecting to login');
          AuthInitializer.clearAuthState();
          window.location.href = '/login';
          return Promise.reject(new Error('Token expired'));
        }
        
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle 401 responses
  instance.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (error.response?.status === 401) {
        console.log('Received 401 response in programs API, logging out user');
        AuthInitializer.clearAuthState();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(api);
addAuthInterceptor(departmentApi);

export const programsApi = {
  // Program operations
  create: async (data: CreateProgramRequest): Promise<Program> => {
    const response = await api.post<Program>('/create', data);
    return response.data;
  },

  getById: async (id: number): Promise<Program> => {
    const response = await api.get<Program>(`/${id}`);
    return response.data;
  },

  list: async (): Promise<Program[]> => {
    const response = await api.get<Program[]>('/list');
    return response.data;
  },

  update: async (data: UpdateProgramRequest): Promise<Program> => {
    const response = await api.put<Program>(`/${data.id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
  },

  // Department operations
  getDepartments: async (): Promise<Department[]> => {
    const response = await departmentApi.get<Department[]>('/list');
    return response.data;
  },

  getDepartmentById: async (id: number): Promise<Department> => {
    const response = await departmentApi.get<Department>(`/${id}`);
    return response.data;
  },
}; 