import {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseDetail,
  ListAllCoursesResponse
} from "./_models";
import { createApiClient } from '../../../core/api/apiClient';

const api = createApiClient('/api/Courses');

export const fetchAllCourses = async (): Promise<Course[]> => {
  const response = await api.get<ListAllCoursesResponse>('');
  return response.data.allCourses;
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
  await api.delete(`/${courseId}`);
};

export const addCourseDetails = async (courseId: number, details: CourseDetail): Promise<Course> => {
  const response = await api.post<Course>(`/${courseId}/details`, details);
  return response.data;
};

export const updateCourseDetails = async (courseId: number, details: CourseDetail): Promise<Course> => {
  const response = await api.put<Course>(`/${courseId}/details`, details);
  return response.data;
}; 