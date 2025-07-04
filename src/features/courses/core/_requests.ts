import {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseDetail,
  ListAllCoursesResponse
} from "./_models";
import { createApiClient } from '../../../core/api/apiClient';

const api = createApiClient('/api/Courses');

export interface CourseListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  searchTerm?: string;
}

export const fetchAllCourses = async (params?: CourseListParams): Promise<ListAllCoursesResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection);
  if (params?.searchTerm) queryParams.append('searchTerm', params.searchTerm);

  const queryString = queryParams.toString();
  const url = queryString ? `?${queryString}` : '';
  
  const response = await api.get<ListAllCoursesResponse>(url);
  return response.data;
};

export const fetchCourseById = async (courseId: number): Promise<Course> => {
  const response = await api.get<Course>(`/${courseId}`);
  return response.data;
};

export const createCourse = async (course: CreateCourseRequest): Promise<Course> => {
  const response = await api.post<Course>('', course);
  return response.data;
};

export const updateCourse = async (course: UpdateCourseRequest): Promise<Course> => {
  const response = await api.put<Course>(`/${course.courseId}`, course);
  return response.data;
};

export const deleteCourse = async (courseId: number): Promise<void> => {
  await api.delete(`/${courseId}`, {
    data: { courseId }
  });
};

export const addCourseDetails = async (courseId: number, details: CourseDetail): Promise<Course> => {
  const response = await api.post<Course>(`/${courseId}/details`, details);
  return response.data;
};

export const updateCourseDetails = async (courseId: number, details: CourseDetail): Promise<Course> => {
  const response = await api.put<Course>(`/${courseId}/details`, details);
  return response.data;
};

export const exportCoursePdf = async (courseId: number): Promise<Blob> => {
  const response = await api.get<Blob>(`/${courseId}/export-pdf`, {
    responseType: 'blob'
  });
  return response.data;
}; 