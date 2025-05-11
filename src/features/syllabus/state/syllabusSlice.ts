import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Syllabus } from "../core/_models";

export interface SyllabusState {
  selectedSyllabus: Syllabus | null;
  syllabusList: Syllabus[];
  isFetching: boolean;
  error: string | null;
}

const initialState: SyllabusState = {
  selectedSyllabus: null,
  syllabusList: [],
  isFetching: false,
  error: null,
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
  setIsFetching,
  setError,
} = syllabusSlice.actions;

export default syllabusSlice.reducer;
