import axios from 'axios';
import { PingResponse, AuthenticatedPingResponse, HealthCheckResponse } from '../core/_models';
import { AuthInitializer } from '../../auth/core/AuthInitializer';
import { isTokenExpired } from '../../../utils/jwtUtils';
import config from '../../../config';

const API_URL = `${config.apiUrl}/ping`;

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
        console.log('Token is expired in ping API, redirecting to login');
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

// Add response interceptor to handle 401 and 403 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Received 401 response in ping API, logging out user');
      AuthInitializer.clearAuthState();
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.log('Received 403 response in ping API, access denied');
      // Don't redirect for 403, let the component handle the error
    }
    return Promise.reject(error);
  }
);

export const pingApi = {
  ping: async (): Promise<PingResponse> => {
    const response = await api.get<PingResponse>('');
    return response.data;
  },

  authenticatedPing: async (): Promise<AuthenticatedPingResponse> => {
    const response = await api.get<AuthenticatedPingResponse>('/auth');
    return response.data;
  },

  healthCheck: async (): Promise<HealthCheckResponse> => {
    const response = await api.get<HealthCheckResponse>('/health');
    return response.data;
  },
}; 