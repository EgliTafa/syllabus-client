import { IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleMode } from '../../../theme/slice/themeSlice';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const theme = useTheme();

  return (
    <IconButton 
      onClick={() => dispatch(toggleMode())} 
      color="inherit"
      sx={{ ml: 1 }}
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ThemeToggle; 