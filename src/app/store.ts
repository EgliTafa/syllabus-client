import { configureStore } from '@reduxjs/toolkit';
import syllabusReducer from '../features/syllabus/state/syllabusSlice';
import courseReducer from '../features/courses/state/courseSlice';
import themeReducer from '../theme/slice/themeSlice';
import authReducer from '../features/auth/state/authSlice';

export const store = configureStore({
  reducer: {
    syllabus: syllabusReducer,
    course: courseReducer,
    theme: themeReducer,
    auth: authReducer
  },
});
export type IStateStore = ReturnType<typeof store.getState>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
