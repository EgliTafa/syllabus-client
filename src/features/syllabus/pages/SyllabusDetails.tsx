import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useGetSyllabusById } from '../hooks/useSyllabuses';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { Course } from '../core/_models';
import { updateSyllabus } from '../core/_requests';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export const SyllabusDetails = () => {
  const { syllabusId } = useParams<{ syllabusId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedSyllabus, isFetching, fetchAndUpdateSyllabusById } = useGetSyllabusById(
    syllabusId ? parseInt(syllabusId) : undefined
  );
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(selectedSyllabus?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (syllabusId) {
      fetchAndUpdateSyllabusById(parseInt(syllabusId), dispatch);
    }
  }, [syllabusId, dispatch]);

  const handleEditClick = () => {
    setNewName(selectedSyllabus?.name || '');
    setEditMode(true);
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSyllabus) return;
    setIsUpdating(true);
    setError(null);
    try {
      await updateSyllabus({ syllabusId: selectedSyllabus.id, name: newName });
      fetchAndUpdateSyllabusById(selectedSyllabus.id, dispatch);
      setEditMode(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update syllabus');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGenerateDocument = () => {
    console.log('Generating syllabus document...');
  };

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedSyllabus) {
    return (
      <Box p={3}>
        <Typography variant="h5">Syllabus not found</Typography>
      </Box>
    );
  }

  // Group courses by semester
  const coursesBySemester = selectedSyllabus.courses.reduce((acc, course) => {
    if (!acc[course.semester]) {
      acc[course.semester] = [];
    }
    acc[course.semester].push(course);
    return acc;
  }, {} as Record<number, Course[]>);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/syllabus')}
          sx={{ mb: 3 }}
        >
          Back to List
        </Button>
        <Box>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ mr: 2 }}
            onClick={handleGenerateDocument}
          >
            Generate Syllabus Document
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditClick}
          >
            Edit Syllabus
          </Button>
        </Box>
      </Box>
      <Dialog open={editMode} onClose={handleEditCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Syllabus Name</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              style={{ width: '100%', padding: 8, fontSize: 16, marginBottom: 16 }}
              disabled={isUpdating}
            />
            {error && <Typography color="error" variant="body2">{error}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditCancel} disabled={isUpdating}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={isUpdating}>Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {selectedSyllabus.name}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Study Program
          </Typography>
        </Box>

        {Object.entries(coursesBySemester).map(([semester, courses]) => (
          <Box key={semester} sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', borderBottom: '2px solid #1976d2' }}>
              Semester {semester}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Lecture</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Seminar</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Lab</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Practice</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Yearly Total</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Credits</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Evaluation Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course, index) => {
                    const le = course.lectureHours || 0;
                    const se = course.seminarHours || 0;
                    const lab = course.labHours || 0;
                    const praktik = course.practiceHours || 0;
                    const totali = le + se + lab;
                    const totaliVjetor = totali + praktik;
                    return (
                      <TableRow
                        key={course.id}
                        onClick={() => navigate(`/courses/${course.id}`)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{course.courseTypeLabel || 'B'}</TableCell>
                        <TableCell>{le}</TableCell>
                        <TableCell>{se}</TableCell>
                        <TableCell>{lab}</TableCell>
                        <TableCell>{totali}</TableCell>
                        <TableCell>{praktik}</TableCell>
                        <TableCell>{totaliVjetor}</TableCell>
                        <TableCell>{course.credits}</TableCell>
                        <TableCell>{course.examMethod || 'P'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Legjenda
          </Typography>
          <Grid container spacing={2}>
            <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
              <Typography variant="body2">
                • Lëndët bazë shënohen me (B)
              </Typography>
              <Typography variant="body2">
                • Lëndët me zgjedhje shënohen me (C)
              </Typography>
              <Typography variant="body2">
                • Lëndët e lira shënohen me (E)
              </Typography>
            </Grid>
            <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
              <Typography variant="body2">
                • Mënyra e vlerësimit: Provim (P), Vrojtim (V), Frekuentim (F)
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}; 