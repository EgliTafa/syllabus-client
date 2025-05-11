import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme as lightTheme } from "./theme";
import { darkTheme } from "./theme/darkTheme";

import { Provider, useSelector } from "react-redux";
import { store, RootState } from "./app/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const ThemedApp = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const activeTheme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
