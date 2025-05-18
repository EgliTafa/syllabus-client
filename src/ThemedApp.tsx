import { CssBaseline, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import { theme as lightTheme } from "./theme";
import { darkTheme } from "./theme/darkTheme";
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';

export const ThemedApp = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const activeTheme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}; 