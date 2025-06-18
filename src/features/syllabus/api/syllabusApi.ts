import axios from 'axios';
import { 
  CreateSyllabusRequest, 
  UpdateSyllabusRequest,
  AddOrRemoveCoursesFromSyllabusRequest,
  ListAllSyllabusesResponse,
  Syllabus,
} from '../core/_models';
import { AuthInitializer } from '../../auth/core/AuthInitializer';
import { isTokenExpired } from '../../../utils/jwtUtils';
import config from '../../../config';

const API_URL = `${config.apiUrl}/syllabus`;

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
        console.log('Token is expired in syllabus API, redirecting to login');
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

// Add response interceptor to handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Received 401 response in syllabus API, logging out user');
      AuthInitializer.clearAuthState();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const syllabusApi = {
  create: async (data: CreateSyllabusRequest): Promise<Syllabus> => {
    const response = await api.post<Syllabus>('/create', data);
    return response.data;
  },

  getById: async (id: number): Promise<Syllabus> => {
    const response = await api.get<Syllabus>(`/${id}`);
    return response.data;
  },

  list: async (): Promise<ListAllSyllabusesResponse> => {
    const response = await api.get<ListAllSyllabusesResponse>('/list');
    return response.data;
  },

  update: async (data: UpdateSyllabusRequest): Promise<Syllabus> => {
    const response = await api.put<Syllabus>(`/${data.syllabusId}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
  },

  export: async (id: number): Promise<Blob> => {
    const response = await api.get(`/${id}/export`, {
      responseType: 'blob',
    });
    return response.data;
  },

  addOrRemoveCourses: async (data: AddOrRemoveCoursesFromSyllabusRequest): Promise<Syllabus> => {
    const response = await api.post<Syllabus>(`/${data.syllabusId}/courses`, data);
    return response.data;
  },
}; 