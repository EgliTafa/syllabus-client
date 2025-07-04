import api from '../../../app/axios';
import { Department } from '../core/_models';

export const departmentsApi = {
  getAll: async (): Promise<Department[]> => {
    const response = await api.get('/api/Department/list');
    return response.data;
  },

  getById: async (id: number): Promise<Department> => {
    const response = await api.get(`/api/Department/${id}`);
    return response.data;
  },

  create: async (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> => {
    const response = await api.post('/api/Department/create', department);
    return response.data;
  },

  update: async (id: number, department: Partial<Department>): Promise<Department> => {
    const response = await api.put(`/api/Department/${id}`, department);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/Department/${id}`);
  }
}; 