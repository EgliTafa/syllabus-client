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
  TableRow,
  Snackbar,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { useGetSyllabusById } from '../hooks/useSyllabuses';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { Course } from '../core/_models';
import { updateSyllabus, exportSyllabusPdf, addOrRemoveCoursesFromSyllabus, deleteSyllabus } from '../core/_requests';
import { AcademicYearSelect } from '../components/AcademicYearSelect';
import { CourseSelectionDialog } from '../components/CourseSelectionDialog';

interface SelectedCourse {
  courseId: number;
  year: number;
}

export const SyllabusDetails = () => {
  const { syllabusId } = useParams<{ syllabusId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedSyllabus, isFetching, fetchAndUpdateSyllabusById } = useGetSyllabusById(
    syllabusId ? parseInt(syllabusId) : undefined
  );
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(selectedSyllabus?.name || '');
  const [newAcademicYear, setNewAcademicYear] = useState(selectedSyllabus?.academicYear || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const [selectedCoursesToAdd, setSelectedCoursesToAdd] = useState<SelectedCourse[]>([]);
  const [selectedCoursesToRemove, setSelectedCoursesToRemove] = useState<number[]>([]);
  const [isUpdatingCourses, setIsUpdatingCourses] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (syllabusId) {
      fetchAndUpdateSyllabusById(parseInt(syllabusId), dispatch);
    }
  }, [syllabusId, dispatch]);

  const handleEditClick = () => {
    setNewName(selectedSyllabus?.name || '');
    setNewAcademicYear(selectedSyllabus?.academicYear || '');
    setEditMode(true);
    setIsEditDialogOpen(true);
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setError(null);
    setIsEditDialogOpen(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSyllabus) return;
    setIsUpdating(true);
    setError(null);
    try {
      await updateSyllabus({ 
        syllabusId: selectedSyllabus.id, 
        name: newName,
        academicYear: newAcademicYear
      });
      fetchAndUpdateSyllabusById(selectedSyllabus.id, dispatch);
      setEditMode(false);
      setIsEditDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update syllabus');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGenerateDocument = async () => {
    if (!selectedSyllabus) return;
    
    setIsExporting(true);
    setExportError(null);
    
    try {
      const pdfBlob = await exportSyllabusPdf(selectedSyllabus.id);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(pdfBlob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `Syllabus_${selectedSyllabus.id}.pdf`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setExportError(err.message || 'Failed to export syllabus PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddCourseClick = () => {
    setIsAddCourseDialogOpen(true);
  };

  const handleRemoveCourse = (courseId: number) => {
    setSelectedCoursesToRemove([...selectedCoursesToRemove, courseId]);
  };

  const handleAddCourses = async () => {
    if (!selectedSyllabus) return;
    
    setIsUpdatingCourses(true);
    try {
      // Extract course IDs from selectedCoursesToAdd
      const courseIdsToAdd = selectedCoursesToAdd.map(sc => sc.courseId);
      
      await addOrRemoveCoursesFromSyllabus({
        syllabusId: selectedSyllabus.id,
        courseIdsToAdd: courseIdsToAdd,
        courseIdsToRemove: selectedCoursesToRemove
      });
      
      // Refresh syllabus data
      fetchAndUpdateSyllabusById(selectedSyllabus.id, dispatch);
      
      // Reset state
      setSelectedCoursesToAdd([]);
      setSelectedCoursesToRemove([]);
      setIsAddCourseDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update courses');
    } finally {
      setIsUpdatingCourses(false);
    }
  };

  const fetchAvailableCourses = async () => {
    setIsLoadingCourses(true);
    try {
      // TODO: Replace with actual API call to get available courses
      const response = await fetch('/api/Course');
      const data = await response.json();
      setAvailableCourses(data);
    } catch (err) {
      console.error('Error fetching available courses:', err);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  useEffect(() => {
    if (isAddCourseDialogOpen) {
      fetchAvailableCourses();
    }
  }, [isAddCourseDialogOpen]);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSyllabus) return;
    
    setIsDeleting(true);
    try {
      await deleteSyllabus(selectedSyllabus.id);
      navigate('/syllabus');
    } catch (err: any) {
      setError(err.message || 'Failed to delete syllabus');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Utility: Calculate totals for details view
  const getTotals = (courses: Course[]) => {
    const totals: Record<number, { [semester: number]: { credits: number; lecture: number; seminar: number; lab: number; practice: number; total: number } }> = {};
    let overall = { credits: 0, lecture: 0, seminar: 0, lab: 0, practice: 0, total: 0 };
    for (const c of courses) {
      if (!totals[c.year]) totals[c.year] = {};
      if (!totals[c.year][c.semester]) totals[c.year][c.semester] = { credits: 0, lecture: 0, seminar: 0, lab: 0, practice: 0, total: 0 };
      totals[c.year][c.semester].credits += c.credits;
      totals[c.year][c.semester].lecture += c.lectureHours;
      totals[c.year][c.semester].seminar += c.seminarHours;
      totals[c.year][c.semester].lab += c.labHours;
      totals[c.year][c.semester].practice += c.practiceHours || 0;
      totals[c.year][c.semester].total += c.lectureHours + c.seminarHours + c.labHours + (c.practiceHours || 0);
      overall.credits += c.credits;
      overall.lecture += c.lectureHours;
      overall.seminar += c.seminarHours;
      overall.lab += c.labHours;
      overall.practice += c.practiceHours || 0;
      overall.total += c.lectureHours + c.seminarHours + c.labHours + (c.practiceHours || 0);
    }
    return { totals, overall };
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

  const { totals, overall } = getTotals(selectedSyllabus.courses);

  // Group courses by year and semester
  const coursesByYearSemester = selectedSyllabus.courses.reduce((acc, course) => {
    if (!acc[course.year]) {
      acc[course.year] = {};
    }
    if (!acc[course.year][course.semester]) {
      acc[course.year][course.semester] = [];
    }
    acc[course.year][course.semester].push(course);
    return acc;
  }, {} as Record<number, Record<number, Course[]>>);

  return (
    <Box p={3}>
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between" 
        alignItems={{ xs: 'stretch', sm: 'center' }} 
        gap={2}
        mb={3}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/syllabus')}
          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
        >
          Back to List
        </Button>
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={2}
          width={{ xs: '100%', sm: 'auto' }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGenerateDocument}
            disabled={isExporting}
            size="medium"
            sx={{ 
              minWidth: 'auto',
              px: 2
            }}
          >
            {isExporting ? 'Generating PDF...' : 'Generate PDF'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditClick}
            size="medium"
            sx={{ 
              minWidth: 'auto',
              px: 2
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddCourseClick}
            size="medium"
            sx={{ 
              minWidth: 'auto',
              px: 2
            }}
          >
            Add Courses
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
            size="medium"
            sx={{ 
              minWidth: 'auto',
              px: 2
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
      <Dialog open={isEditDialogOpen} onClose={handleEditCancel}>
        <DialogTitle>Edit Syllabus</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Syllabus Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <AcademicYearSelect
              value={newAcademicYear}
              onChange={setNewAcademicYear}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Cancel</Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained" 
            color="primary"
            disabled={!newName || !newAcademicYear}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={isAddCourseDialogOpen} 
        onClose={() => setIsAddCourseDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add or Remove Courses</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Available Courses
            </Typography>
            {isLoadingCourses ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <CourseSelectionDialog
                availableCourses={availableCourses.filter(
                  course => !selectedSyllabus?.courses.some(c => c.id === course.id)
                )}
                selectedCourses={selectedCoursesToAdd}
                onSelectionChange={setSelectedCoursesToAdd}
              />
            )}

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Current Courses
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Course</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Semester</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedSyllabus?.courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.title}</TableCell>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.semester}</TableCell>
                      <TableCell>
                        <Tooltip title="Remove Course">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveCourse(course.id)}
                            disabled={isUpdatingCourses}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setIsAddCourseDialogOpen(false);
              setSelectedCoursesToAdd([]);
              setSelectedCoursesToRemove([]);
            }}
            disabled={isUpdatingCourses}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddCourses}
            variant="contained"
            color="primary"
            disabled={isUpdatingCourses || (selectedCoursesToAdd.length === 0 && selectedCoursesToRemove.length === 0)}
          >
            {isUpdatingCourses ? 'Updating...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Syllabus</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this syllabus? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {selectedSyllabus.name} ({selectedSyllabus.academicYear})
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Study Program
          </Typography>
        </Box>
        {/* Totals display */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Totals</Typography>
          {Object.entries(totals).map(([year, semesters]) => (
            <Box key={year} sx={{ mb: 1, pl: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Year {year}:</Typography>
              {Object.entries(semesters).map(([semester, t]) => (
                <Typography key={semester} variant="body2" sx={{ ml: 2 }}>
                  Semester {semester}: {t.credits} credits, {t.lecture} lecture, {t.seminar} seminar, {t.lab} lab, {t.practice} practice, {t.total} total hours
                </Typography>
              ))}
              <Typography variant="body2" sx={{ ml: 2, fontWeight: 'bold' }}>
                Year {year} total: {Object.values(semesters).reduce((sum, s) => sum + s.credits, 0)} credits
              </Typography>
            </Box>
          ))}
          <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
            Overall: {overall.credits} credits, {overall.lecture} lecture, {overall.seminar} seminar, {overall.lab} lab, {overall.practice} practice, {overall.total} total hours
          </Typography>
        </Box>

        {Object.entries(coursesByYearSemester).map(([year, semesters]) => (
          <Box key={year} sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
              Year {year}
            </Typography>
            {Object.entries(semesters).map(([semester, courses]) => {
              // Group electives by electiveGroup and type
              const electives = courses.filter(c => (c.courseTypeLabel === 'C' || c.courseTypeLabel === 'E'));
              const electivesI = electives.filter(c => c.electiveGroup === 'Elective I');
              const electivesII = electives.filter(c => c.electiveGroup === 'Elective II');
              const otherElectives = electives.filter(c => !c.electiveGroup);
              const mandatoryCourses = courses.filter(c => c.courseTypeLabel !== 'C' && c.courseTypeLabel !== 'E');
              return (
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
                        {/* Show mandatory courses first */}
                        {mandatoryCourses.map((course, index) => {
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
                        {/* Lëndë me zgjedhje group */}
                        {electives.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={11} style={{ background: '#f3e5f5', fontWeight: 'bold' }}>
                              Lëndë me zgjedhje
                            </TableCell>
                          </TableRow>
                        )}
                        {/* Show Elective I if present */}
                        {electivesI.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={11} style={{ background: '#e3f2fd', fontWeight: 'bold' }}>
                              Elective I
                            </TableCell>
                          </TableRow>
                        )}
                        {electivesI.map((course, index) => {
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
                                backgroundColor: '#e3f2fd',
                                '&:hover': {
                                  backgroundColor: '#bbdefb'
                                }
                              }}
                            >
                              <TableCell>{mandatoryCourses.length + index + 1}</TableCell>
                              <TableCell>{course.title}</TableCell>
                              <TableCell>{course.courseTypeLabel || 'C'}</TableCell>
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
                        {/* Show Elective II if present */}
                        {electivesII.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={11} style={{ background: '#fff3e0', fontWeight: 'bold' }}>
                              Elective II
                            </TableCell>
                          </TableRow>
                        )}
                        {electivesII.map((course, index) => {
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
                                backgroundColor: '#fff3e0',
                                '&:hover': {
                                  backgroundColor: '#ffe0b2'
                                }
                              }}
                            >
                              <TableCell>{mandatoryCourses.length + electivesI.length + index + 1}</TableCell>
                              <TableCell>{course.title}</TableCell>
                              <TableCell>{course.courseTypeLabel || 'C'}</TableCell>
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
                        {/* Show other electives if present */}
                        {otherElectives.map((course, index) => {
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
                                backgroundColor: '#f3e5f5',
                                '&:hover': {
                                  backgroundColor: '#ce93d8'
                                }
                              }}
                            >
                              <TableCell>{mandatoryCourses.length + electivesI.length + electivesII.length + index + 1}</TableCell>
                              <TableCell>{course.title}</TableCell>
                              <TableCell>{course.courseTypeLabel || 'C'}</TableCell>
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
              );
            })}
          </Box>
        ))}

        <Box sx={{ 
          mt: 4, 
          p: 2, 
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="h6" gutterBottom>
            Legend
          </Typography>
          <Grid container spacing={2}>
            <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
              <Typography variant="body2" color="text.secondary">
                • Basic courses are marked with (B)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Elective courses are marked with (C)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Optional courses are marked with (E)
              </Typography>
            </Grid>
            <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
              <Typography variant="body2" color="text.secondary">
                • Evaluation Methods: Exam (P), Observation (V), Attendance (F)
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar 
        open={!!exportError} 
        autoHideDuration={6000} 
        onClose={() => setExportError(null)}
      >
        <Alert onClose={() => setExportError(null)} severity="error">
          {exportError}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 