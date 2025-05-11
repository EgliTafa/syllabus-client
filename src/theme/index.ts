import {
  createTheme,
  responsiveFontSizes,
  PaletteColorOptions,
} from "@mui/material/styles";
import { deepPurple, indigo, teal, grey, red } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }

  interface PaletteOptions {
    tertiary?: PaletteColorOptions;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
}

const baseTheme = createTheme({
  palette: {
    mode: "light",
    primary: indigo,
    secondary: deepPurple,
    tertiary: {
      main: teal[500],
      light: teal[300],
      dark: teal[700],
      contrastText: "#fff",
    },
    error: red,
    background: {
      default: grey[50],
      paper: "#fff",
    },
  },
  typography: {
    fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(
      ","
    ),
    h1: { fontWeight: 700, fontSize: "2.125rem" },
    h2: { fontWeight: 700, fontSize: "1.625rem" },
    body2: { fontSize: "0.875rem" },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 8 },
        // containedTertiary: {
        //   color: "#fff",
        //   backgroundColor: teal[500],
        //   ":hover": { backgroundColor: teal[600] },
        // },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${grey[200]}` },
      },
    },
  },
});

export const theme = responsiveFontSizes(baseTheme);
