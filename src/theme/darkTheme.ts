import { createTheme } from '@mui/material/styles';
import { theme as light } from './index';

export const darkTheme = createTheme({
  ...light,
  palette: {
    ...light.palette,
    mode: 'dark',
    background: { default: '#121212', paper: '#1e1e1e' },
  },
});
