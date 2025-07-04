import {
  Program,
  Department,
  CreateProgramRequest,
  UpdateProgramRequest
} from "./_models";
import { createApiClient } from '../../../core/api/apiClient';

const api = createApiClient('/api/Program');
const departmentApi = createApiClient('/api/Department');

export const fetchAllPrograms = async (): Promise<Program[]> => {
  const response = await api.get<Program[]>('');
  return response.data;
};

export const fetchProgramById = async (programId: number): Promise<Program> => {
  const response = await api.get<Program>(`/${programId}`);
  return response.data;
};

export const createProgram = async (program: CreateProgramRequest): Promise<Program> => {
  const response = await api.post<Program>('', program);
  return response.data;
};

export const updateProgram = async (program: UpdateProgramRequest): Promise<Program> => {
  const response = await api.put<Program>(`/${program.id}`, program);
  return response.data;
};

export const deleteProgram = async (programId: number): Promise<void> => {
  await api.delete(`/${programId}`);
};

export const fetchAllDepartments = async (): Promise<Department[]> => {
  const response = await departmentApi.get<Department[]>('');
  return response.data;
};

export const fetchDepartmentById = async (departmentId: number): Promise<Department> => {
  const response = await departmentApi.get<Department>(`/${departmentId}`);
  return response.data;
}; 