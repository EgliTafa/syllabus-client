import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useGetAllSyllabuses } from '../../features/syllabus/hooks/useSyllabuses';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Syllabus } from '../../features/syllabus/core/_models';

const SyllabusHistory: React.FC = () => {
  const navigate = useNavigate();
  const { syllabusList, isFetching, fetchAndUpdateSyllabuses } = useGetAllSyllabuses();
  const { user, isAdmin } = useAuth();
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [filteredSyllabuses, setFilteredSyllabuses] = useState<Syllabus[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [syllabusToDelete, setSyllabusToDelete] = useState<Syllabus | null>(null);

  useEffect(() => {
    fetchAndUpdateSyllabuses();
  }, [fetchAndUpdateSyllabuses, user]);

  useEffect(() => {
    if (selectedYear) {
      const filtered = syllabusList.filter(s => s.academicYear === selectedYear);
      setFilteredSyllabuses(filtered);
    } else {
      setFilteredSyllabuses(syllabusList);
    }
  }, [selectedYear, syllabusList]);

  const handleDelete = async (syllabus: Syllabus) => {
    setSyllabusToDelete(syllabus);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (syllabusToDelete) {
      try {
        await deleteSyllabus(syllabusToDelete.id);
        fetchAndUpdateSyllabuses();
        setDeleteDialogOpen(false);
        setSyllabusToDelete(null);
      } catch (error) {
        console.error('Failed to delete syllabus:', error);
      }
    }
  };

  const handleView = (id: number) => {
    navigate(`/syllabus/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/syllabus/edit/${id}`);
  };

  const uniqueYears = Array.from(new Set(syllabusList.map(s => s.academicYear))).sort((a, b) => b.localeCompare(a));

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Syllabus History</Typography>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Years</MenuItem>
          {uniqueYears.map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Academic Year</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSyllabuses.map((syllabus) => (
              <TableRow key={syllabus.id}>
                <TableCell>{syllabus.name}</TableCell>
                <TableCell>{syllabus.academicYear}</TableCell>
                <TableCell>{syllabus.courses.length}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleView(syllabus.id)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  {isAdmin() && (
                    <>
                      <IconButton onClick={() => handleEdit(syllabus.id)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(syllabus)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Syllabus</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this syllabus?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SyllabusHistory; 