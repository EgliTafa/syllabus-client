import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Course, ListAllCoursesResponse } from "../core/_models";

export interface CourseState {
  selectedCourse: Course | null;
  courseList: Course[];
  isFetching: boolean;
  error: string | null;
  // Pagination state
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const initialState: CourseState = {
  selectedCourse: null,
  courseList: [],
  isFetching: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 12,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setSelectedCourse: (state, action: PayloadAction<Course | null>) => {
      state.selectedCourse = action.payload;
    },
    setCourseList: (state, action: PayloadAction<Course[]>) => {
      state.courseList = action.payload;
    },
    setPaginatedCourseList: (state, action: PayloadAction<ListAllCoursesResponse>) => {
      state.courseList = action.payload.courses;
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.currentPage;
      state.pageSize = action.payload.pageSize;
      state.totalPages = action.payload.totalPages;
      state.hasNextPage = action.payload.hasNextPage;
      state.hasPreviousPage = action.payload.hasPreviousPage;
    },
    setIsFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSelectedCourse,
  setCourseList,
  setPaginatedCourseList,
  setIsFetching,
  setError,
} = courseSlice.actions;

export default courseSlice.reducer; 