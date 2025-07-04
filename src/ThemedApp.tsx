import { CssBaseline, ThemeProvider } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./app/store";
import { theme as lightTheme } from "./theme";
import { darkTheme } from "./theme/darkTheme";
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { useEffect } from 'react';
import { AuthInterceptor } from './features/auth/core/AuthInterceptor';
import { setupSystemThemeListener } from './theme/slice/themeSlice';

export const ThemedApp = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const activeTheme = mode === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    // Initialize the auth interceptor when the app starts
    AuthInterceptor.initialize();
    
    // Set up system theme change listener
    const cleanup = setupSystemThemeListener(dispatch);
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [dispatch]);

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}; 