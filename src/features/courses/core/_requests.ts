import axios from "axios";
import {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseDetail,
  ListAllCoursesResponse
} from "./_models";

const API_URL = "/api/courses";

export const fetchAllCourses = async (): Promise<Course[]> => {
  const response = await axios.get<ListAllCoursesResponse>(API_URL);
  return response.data.allCourses;
};

export const fetchCourseById = async (courseId: number): Promise<Course> => {
  const response = await axios.get<Course>(`${API_URL}/${courseId}`);
  return response.data;
};

export const createCourse = async (course: CreateCourseRequest): Promise<Course> => {
  const response = await axios.post<Course>(API_URL, course);
  return response.data;
};

export const updateCourse = async (course: UpdateCourseRequest): Promise<Course> => {
  const response = await axios.put<Course>(`${API_URL}/${course.courseId}`, course);
  return response.data;
};

export const deleteCourse = async (courseId: number): Promise<void> => {
  await axios.delete(`${API_URL}/${courseId}`);
};

export const addCourseDetails = async (courseId: number, details: CourseDetail): Promise<Course> => {
  const response = await axios.post<Course>(`${API_URL}/${courseId}/details`, details);
  return response.data;
};

export const updateCourseDetails = async (courseId: number, details: CourseDetail): Promise<Course> => {
  const response = await axios.put<Course>(`${API_URL}/${courseId}/details`, details);
  return response.data;
}; 