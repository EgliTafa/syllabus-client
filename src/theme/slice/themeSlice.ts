import { createSlice } from "@reduxjs/toolkit";

// Get initial theme from localStorage, system preference, or default to light
const getInitialTheme = (): "light" | "dark" => {
  if (typeof window !== 'undefined') {
    // First check localStorage
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    
    // If no saved preference, check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

// Listen for system theme changes
const setupSystemThemeListener = (dispatch: any) => {
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme-mode');
      if (!savedTheme) {
        dispatch(setMode(e.matches ? 'dark' : 'light'));
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Return cleanup function
    return () => mediaQuery.removeEventListener('change', handleChange);
  }
};

const slice = createSlice({
  name: "theme",
  initialState: { mode: getInitialTheme() },
  reducers: {
    toggleMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme-mode', state.mode);
      }
    },
    setMode: (state, action) => {
      state.mode = action.payload;
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme-mode', state.mode);
      }
    },
  },
});

export const { toggleMode, setMode } = slice.actions;
export { setupSystemThemeListener };
export default slice.reducer;
