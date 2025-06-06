import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  Drawer,
  IconButton,
  ListItemButton,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import MenuIcon from '@mui/icons-material/Menu';
import { useGetAllSyllabuses } from '../hooks/useSyllabuses';
import { Syllabus } from '../core/_models';
import { useDispatch } from 'react-redux';

export const SyllabusHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { syllabusList, isFetching, fetchAndUpdateSyllabuses } = useGetAllSyllabuses();

  useEffect(() => {
    fetchAndUpdateSyllabuses(dispatch);
  }, [fetchAndUpdateSyllabuses, dispatch]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleYearClick = (academicYear: string) => {
    navigate(`/syllabus/history/${academicYear}`);
    handleClose();
    setMobileMenuOpen(false);
  };

  // Get unique academic years and sort them in ascending order (oldest to newest)
  const academicYears = Array.from(new Set(syllabusList.map((s: Syllabus) => s.academicYear)))
    .sort((a: string, b: string) => {
      // Extract the first year from the academic year string (e.g., "2023-2024" -> "2023")
      const yearA = parseInt(a.split('-')[0]);
      const yearB = parseInt(b.split('-')[0]);
      return yearA - yearB;
    });

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
    >
      <List sx={{ width: 250 }}>
        <ListItem>
          <ListItemText primary="Syllabus History" primaryTypographyProps={{ fontWeight: 'bold' }} />
        </ListItem>
        <Divider />
        {academicYears.map((year: string) => (
          <ListItemButton
            key={year}
            onClick={() => handleYearClick(year)}
          >
            <ListItemText primary={year} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          color="inherit"
          onClick={handleMobileMenuToggle}
          sx={{ ml: 1 }}
        >
          <HistoryIcon />
        </IconButton>
        {renderMobileMenu()}
      </>
    );
  }

  return (
    <>
      <Button
        color="inherit"
        startIcon={<HistoryIcon />}
        onClick={handleMenu}
        sx={{ ml: 1 }}
      >
        Syllabus History
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        {academicYears.map((year: string) => (
          <MenuItem
            key={year}
            onClick={() => handleYearClick(year)}
          >
            <ListItemText primary={year} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}; 