import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useGetAllSyllabuses } from '../hooks/useSyllabuses';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

export const SyllabusHistoryDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { syllabusList, fetchAndUpdateSyllabuses } = useGetAllSyllabuses();

  useEffect(() => {
    fetchAndUpdateSyllabuses(dispatch);
  }, [fetchAndUpdateSyllabuses, dispatch]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleYearClick = (academicYear: string) => {
    navigate(`/syllabus/history/${academicYear}`);
    handleClose();
  };

  // Get unique academic years and sort them in ascending order
  const academicYears = Array.from(new Set(syllabusList.map((s) => s.academicYear)))
    .sort((a, b) => {
      const yearA = parseInt(a.split('-')[0]);
      const yearB = parseInt(b.split('-')[0]);
      return yearA - yearB;
    });

  if (isMobile) {
    return null; // We'll handle mobile view in the MainLayout
  }

  return (
    <>
      <Button
        color="inherit"
        onClick={handleMenu}
      >
        Syllabus History
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {academicYears.map((year) => (
          <MenuItem
            key={year}
            onClick={() => handleYearClick(year)}
          >
            {year}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}; 