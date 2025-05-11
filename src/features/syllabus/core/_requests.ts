import axios from "axios";
import {
  Syllabus,
  CreateSyllabusRequest,
  UpdateSyllabusRequest,
  AddOrRemoveCoursesFromSyllabusRequest,
  ListAllSyllabusesResponse
} from "./_models";

const API_URL = "/api/syllabus";

export const fetchAllSyllabuses = async (): Promise<Syllabus[]> => {
  const response = await axios.get<ListAllSyllabusesResponse>(API_URL);
  return response.data.syllabuses;
};

export const fetchSyllabusById = async (syllabusId: number): Promise<Syllabus> => {
  const response = await axios.get<Syllabus>(`${API_URL}/${syllabusId}`);
  return response.data;
};

export const createSyllabus = async (syllabus: CreateSyllabusRequest): Promise<Syllabus> => {
  const response = await axios.post<Syllabus>(API_URL, syllabus);
  return response.data;
};

export const updateSyllabus = async (syllabus: UpdateSyllabusRequest): Promise<Syllabus> => {
  const response = await axios.put<Syllabus>(`${API_URL}/${syllabus.syllabusId}`, syllabus);
  return response.data;
};

export const deleteSyllabus = async (syllabusId: number): Promise<void> => {
  await axios.delete(`${API_URL}/${syllabusId}`);
};

export const addOrRemoveCoursesFromSyllabus = async (
  request: AddOrRemoveCoursesFromSyllabusRequest
): Promise<Syllabus> => {
  const response = await axios.put<Syllabus>(
    `${API_URL}/${request.syllabusId}/courses`,
    request
  );
  return response.data;
};
