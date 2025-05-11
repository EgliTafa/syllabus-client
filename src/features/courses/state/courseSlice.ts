import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Course } from "../core/_models";

export interface CourseState {
  selectedCourse: Course | null;
  courseList: Course[];
  isFetching: boolean;
  error: string | null;
}

const initialState: CourseState = {
  selectedCourse: null,
  courseList: [],
  isFetching: false,
  error: null,
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
  setIsFetching,
  setError,
} = courseSlice.actions;

export default courseSlice.reducer; 