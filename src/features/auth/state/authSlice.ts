import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../core/_models';
import { AuthInitializer } from '../core/AuthInitializer';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isFetching: boolean;
  error: string | null;
}

const initialState: AuthState = AuthInitializer.loadInitialState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
      AuthInitializer.saveAuthState(state);
    },
    setIsFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
      AuthInitializer.saveAuthState(state);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      AuthInitializer.saveAuthState(state);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      AuthInitializer.clearAuthState();
    },
  },
});

export const { setUser, setIsFetching, setError, logout } = authSlice.actions;

export default authSlice.reducer; 