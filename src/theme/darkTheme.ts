import { createTheme } from '@mui/material/styles';
import { theme as light } from './index';
import { grey } from '@mui/material/colors';

export const darkTheme = createTheme({
  ...light,
  palette: {
    ...light.palette,
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#fff',
      secondary: grey[400],
    },
    divider: grey[800],
  },
  components: {
    ...light.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          borderBottom: `1px solid ${grey[800]}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
