import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Syllabus, ListAllSyllabusesResponse } from "../core/_models";

export interface SyllabusState {
  selectedSyllabus: Syllabus | null;
  syllabusList: Syllabus[];
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

const initialState: SyllabusState = {
  selectedSyllabus: null,
  syllabusList: [],
  isFetching: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 12,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const syllabusSlice = createSlice({
  name: "syllabus",
  initialState,
  reducers: {
    setSelectedSyllabus: (state, action: PayloadAction<Syllabus | null>) => {
      state.selectedSyllabus = action.payload;
    },
    setSyllabusList: (state, action: PayloadAction<Syllabus[]>) => {
      state.syllabusList = action.payload;
    },
    setPaginatedSyllabusList: (state, action: PayloadAction<ListAllSyllabusesResponse>) => {
      state.syllabusList = action.payload.syllabuses;
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
  setSelectedSyllabus,
  setSyllabusList,
  setPaginatedSyllabusList,
  setIsFetching,
  setError,
} = syllabusSlice.actions;

export default syllabusSlice.reducer;
