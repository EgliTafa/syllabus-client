import {
  Syllabus,
  CreateSyllabusRequest,
  UpdateSyllabusRequest,
  AddOrRemoveCoursesFromSyllabusRequest,
  ListAllSyllabusesResponse
} from "./_models";
import { createApiClient } from '../../../core/api/apiClient';

const api = createApiClient('/api/Syllabus');

export const fetchAllSyllabuses = async (): Promise<Syllabus[]> => {
  const response = await api.get<ListAllSyllabusesResponse>('');
  return response.data.syllabuses;
};

export const fetchSyllabusById = async (syllabusId: number): Promise<Syllabus> => {
  const response = await api.get<Syllabus>(`/${syllabusId}`);
  return response.data;
};

export const createSyllabus = async (syllabus: CreateSyllabusRequest): Promise<Syllabus> => {
  const response = await api.post<Syllabus>('', syllabus);
  return response.data;
};

export const updateSyllabus = async (syllabus: UpdateSyllabusRequest): Promise<Syllabus> => {
  const response = await api.put<Syllabus>(`/${syllabus.syllabusId}`, syllabus);
  return response.data;
};

export const deleteSyllabus = async (syllabusId: number): Promise<void> => {
  await api.delete(`/${syllabusId}`);
};

export const addOrRemoveCoursesFromSyllabus = async (
  request: AddOrRemoveCoursesFromSyllabusRequest
): Promise<Syllabus> => {
  const response = await api.put<Syllabus>(
    `/${request.syllabusId}/courses`,
    request
  );
  return response.data;
};
