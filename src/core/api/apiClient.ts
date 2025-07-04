import axios, { AxiosInstance } from 'axios';
import config from '../../config';
import { AuthInitializer } from '../../features/auth/core/AuthInitializer';

export const createApiClient = (basePath: string): AxiosInstance => {
  const api = axios.create({
    baseURL: `${config.apiUrl}${basePath}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to add auth token
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

  return api;
}; 