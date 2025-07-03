import {
  Syllabus,
  CreateSyllabusRequest,
  UpdateSyllabusRequest,
  AddOrRemoveCoursesFromSyllabusRequest,
  ListAllSyllabusesResponse,
  SyllabusListParams
} from "./_models";
import { createApiClient } from '../../../core/api/apiClient';

const api = createApiClient('/api/Syllabus');

export const fetchAllSyllabuses = async (params?: SyllabusListParams): Promise<ListAllSyllabusesResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection);
  if (params?.searchTerm) queryParams.append('searchTerm', params.searchTerm);
  if (params?.departmentId) queryParams.append('departmentId', params.departmentId.toString());
  if (params?.programId) queryParams.append('programId', params.programId.toString());
  if (params?.academicYear) queryParams.append('academicYear', params.academicYear);

  const queryString = queryParams.toString();
  const url = queryString ? `?${queryString}` : '';
  
  const response = await api.get<ListAllSyllabusesResponse>(url);
  return response.data;
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

export const exportSyllabusPdf = async (syllabus: Syllabus): Promise<{ blob: Blob; filename: string }> => {
  const response = await api.get<Blob>(`/${syllabus.id}/export-pdf`, {
    responseType: 'blob'
  });
  
  // Generate filename with syllabus name, academic year, program, and department
  const syllabusName = syllabus.name?.replace(/\s+/g, '_') || 'Syllabus';
  const academicYear = syllabus.programAcademicYear?.academicYear || '';
  const programName = syllabus.program?.name?.replace(/\s+/g, '_') || '';
  const departmentName = syllabus.program?.departmentName?.replace(/\s+/g, '_') || '';
  
  const filename = `${syllabusName}_${academicYear}_${programName}_${departmentName}.pdf`;
  
  return { blob: response.data, filename };
};

// Export the interface for use in other files
export type { SyllabusListParams };
