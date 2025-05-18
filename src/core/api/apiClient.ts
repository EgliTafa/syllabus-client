import axios, { AxiosInstance, AxiosError } from 'axios';
import config from '../../config';
import { AuthInitializer } from '../../features/auth/core/AuthInitializer';

export const createApiClient = (basePath: string): AxiosInstance => {
  const api = axios.create({
    baseURL: `${config.apiUrl}${basePath}`,
    headers: {
      'Content-Type': 'application/json',
    },
    // Add timeout
    timeout: 10000,
  });

  // Add request interceptor to add auth token
  api.interceptors.request.use(
    (config) => {
      const token = AuthInitializer.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        console.log('API Request:', {
          url: config.url,
          method: config.method,
          headers: config.headers,
          data: config.data
        });
      }
      
      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  api.interceptors.response.use(
    (response) => {
      // Log response in development
      if (process.env.NODE_ENV === 'development') {
        console.log('API Response:', {
          status: response.status,
          data: response.data
        });
      }
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('API No Response:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('API Error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return api;
}; 