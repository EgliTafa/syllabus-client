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
import { fetchAllCourses } from '../../courses/core/_requests';
import { useTranslation } from 'react-i18next';

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
  
  console.log('SyllabusDetails render:', { syllabusId, selectedSyllabus, isFetching });
  
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
  const { t } = useTranslation();

  // Local state for visual course management
  const [localCoursesToRemove, setLocalCoursesToRemove] = useState<number[]>([]);
  const [localCoursesToAdd, setLocalCoursesToAdd] = useState<SelectedCourse[]>([]);

  // Ensure syllabus is fetched when component mounts
  useEffect(() => {
    if (syllabusId && !selectedSyllabus && !isFetching) {
      fetchAndUpdateSyllabusById(parseInt(syllabusId));
    }
  }, [syllabusId, selectedSyllabus, isFetching, fetchAndUpdateSyllabusById]);

  // Reset local state when dialog opens/closes
  useEffect(() => {
    if (isAddCourseDialogOpen) {
      setLocalCoursesToRemove([]);
      setLocalCoursesToAdd([]);
    }
  }, [isAddCourseDialogOpen]);

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
      fetchAndUpdateSyllabusById(selectedSyllabus.id);
      setEditMode(false);
      setIsEditDialogOpen(false);
    } catch (err: any) {
      setError(err.message || t('syllabusDetails.failedToUpdate'));
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
      setExportError(err.message || t('syllabusDetails.failedToExport'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddCourseClick = () => {
    setIsAddCourseDialogOpen(true);
  };

  const handleRemoveCourse = (courseId: number) => {
    setLocalCoursesToRemove(prev => [...prev, courseId]);
  };

  const handleUndoRemoveCourse = (courseId: number) => {
    setLocalCoursesToRemove(prev => prev.filter(id => id !== courseId));
  };

  const handleAddCourses = async () => {
    if (!selectedSyllabus) return;
    
    setIsUpdatingCourses(true);
    try {
      // Extract course IDs from localCoursesToAdd
      const courseIdsToAdd = localCoursesToAdd.map(sc => sc.courseId);
      
      await addOrRemoveCoursesFromSyllabus({
        syllabusId: selectedSyllabus.id,
        courseIdsToAdd: courseIdsToAdd,
        courseIdsToRemove: localCoursesToRemove
      });
      
      // Refresh syllabus data
      fetchAndUpdateSyllabusById(selectedSyllabus.id);
      
      // Reset state
      setLocalCoursesToAdd([]);
      setLocalCoursesToRemove([]);
      setIsAddCourseDialogOpen(false);
    } catch (err: any) {
      setError(err.message || t('syllabusDetails.failedToUpdateCourses'));
    } finally {
      setIsUpdatingCourses(false);
    }
  };

  const handleCloseCourseDialog = () => {
    setIsAddCourseDialogOpen(false);
    setLocalCoursesToAdd([]);
    setLocalCoursesToRemove([]);
  };

  const fetchAvailableCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const coursesResponse = await fetchAllCourses();
      
      // Convert courses from courses module format to syllabus module format
      const convertedCourses: Course[] = coursesResponse.map(course => ({
        id: course.id,
        title: course.title,
        code: course.code,
        year: course.year || 1, // Use actual year from API or default to 1
        semester: course.semester,
        credits: course.credits,
        lectureHours: course.lectureHours || 0,
        seminarHours: course.seminarHours || 0,
        labHours: course.labHours || 0,
        practiceHours: course.practiceHours || 0,
        courseTypeLabel: course.courseTypeLabel || '',
        examMethod: course.examMethod || '',
        academicProgram: course.academicProgram || '',
        academicYear: course.academicYear || '',
        language: course.language || '',
        ethicsCode: course.ethicsCode || '',
        teachingFormat: course.teachingFormat || '',
        teachingPlan: course.teachingPlan,
        evaluationBreakdown: course.evaluationBreakdown,
        objective: course.objective || '',
        keyConcepts: course.keyConcepts || '',
        prerequisites: course.prerequisites || '',
        skillsAcquired: course.skillsAcquired || '',
        courseResponsible: course.courseResponsible || '',
        topics: course.topics || [],
        electiveGroup: course.electiveGroup || null,
      }));
      
      setAvailableCourses(convertedCourses);
    } catch (err) {
      console.error('Error fetching available courses:', err);
      setError('Failed to load available courses. Please try again.');
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

  // Get courses to display (excluding those marked for removal)
  const getDisplayCourses = () => {
    if (!selectedSyllabus) return [];
    return selectedSyllabus.courses.filter(course => !localCoursesToRemove.includes(course.id));
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
        <Typography variant="h5">{t('syllabusDetails.notFound')}</Typography>
      </Box>
    );
  }

  const { totals, overall } = getTotals(getDisplayCourses());

  // Group courses by year and semester
  const coursesByYearSemester = getDisplayCourses().reduce((acc, course) => {
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
    <Box>
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
            {t('syllabusDetails.backToList')}
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
              {isExporting ? t('syllabusDetails.generatingPdf') : t('syllabusDetails.generatePdf')}
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
              {t('syllabusDetails.edit')}
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
              {t('syllabusDetails.addOrRemoveCourses')}
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
              {t('syllabusDetails.delete')}
            </Button>
          </Box>
        </Box>
        <Dialog open={isEditDialogOpen} onClose={handleEditCancel}>
          <DialogTitle>{t('syllabusDetails.editSyllabus')}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
              <TextField
                fullWidth
                label={t('syllabusDetails.syllabusName')}
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
            <Button onClick={handleEditCancel}>{t('syllabusDetails.cancel')}</Button>
            <Button 
              onClick={handleEditSubmit} 
              variant="contained" 
              color="primary"
              disabled={!newName || !newAcademicYear}
            >
              {t('syllabusDetails.saveChanges')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={isAddCourseDialogOpen} 
          onClose={handleCloseCourseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{t('syllabusDetails.addOrRemoveCoursesTitle')}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('syllabusDetails.availableCourses')}
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
                  selectedCourses={localCoursesToAdd}
                  onSelectionChange={setLocalCoursesToAdd}
                />
              )}

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                {t('syllabusDetails.currentCourses')}
              </Typography>
              
              {/* Summary of changes */}
              {(localCoursesToAdd.length > 0 || localCoursesToRemove.length > 0) && (
                <Box sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {t('syllabusDetails.summaryOfChanges')}
                  </Typography>
                  {localCoursesToAdd.length > 0 && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      📥 <strong>{localCoursesToAdd.length}</strong> {t('syllabusDetails.coursesToAdd')}
                    </Typography>
                  )}
                  {localCoursesToRemove.length > 0 && (
                    <Typography variant="body2">
                      📤 <strong>{localCoursesToRemove.length}</strong> {t('syllabusDetails.coursesToRemove')}
                    </Typography>
                  )}
                </Box>
              )}
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('syllabusDetails.course')}</TableCell>
                      <TableCell>Code</TableCell>
                      <TableCell>{t('syllabusDetails.year')}</TableCell>
                      <TableCell>{t('syllabusDetails.semester')}</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getDisplayCourses().map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{course.code}</TableCell>
                        <TableCell>{t('syllabusDetails.year')} {course.year}</TableCell>
                        <TableCell>{course.semester}</TableCell>
                        <TableCell>
                          <Tooltip title={t('syllabusDetails.removeCourse')}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveCourse(course.id);
                              }}
                              disabled={isUpdatingCourses}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {localCoursesToRemove.length > 0 && (
                      <>
                        <TableRow>
                          <TableCell colSpan={5} sx={{ background: '#fff3e0', fontWeight: 'bold' }}>
                            {t('syllabusDetails.coursesMarkedForRemoval')}
                          </TableCell>
                        </TableRow>
                        {selectedSyllabus?.courses
                          .filter(course => localCoursesToRemove.includes(course.id))
                          .map((course) => (
                            <TableRow key={course.id} sx={{ background: '#fff3e0' }}>
                              <TableCell sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                {course.title}
                              </TableCell>
                              <TableCell sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                {course.code}
                              </TableCell>
                              <TableCell sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                {t('syllabusDetails.year')} {course.year}
                              </TableCell>
                              <TableCell sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                {course.semester}
                              </TableCell>
                              <TableCell>
                                <Tooltip title={t('syllabusDetails.undoRemove')}>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUndoRemoveCourse(course.id);
                                    }}
                                    disabled={isUpdatingCourses}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                      </>
                    )}
                    {getDisplayCourses().length === 0 && localCoursesToRemove.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography color="textSecondary">
                            {t('syllabusDetails.noCoursesInSyllabus')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseCourseDialog}
              disabled={isUpdatingCourses}
            >
              {t('syllabusDetails.cancel')}
            </Button>
            <Button
              onClick={handleAddCourses}
              variant="contained"
              color="primary"
              disabled={isUpdatingCourses || (localCoursesToAdd.length === 0 && localCoursesToRemove.length === 0)}
            >
              {isUpdatingCourses ? t('syllabusDetails.updating') : t('syllabusDetails.saveChanges')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogTitle>{t('syllabusDetails.deleteSyllabus')}</DialogTitle>
          <DialogContent>
            <Typography>
              {t('syllabusDetails.deleteConfirmation')}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              {t('syllabusDetails.cancel')}
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              disabled={isDeleting}
            >
              {isDeleting ? t('syllabusDetails.deleting') : t('syllabusDetails.delete')}
            </Button>
          </DialogActions>
        </Dialog>

        <Paper sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              {selectedSyllabus.name} ({selectedSyllabus.academicYear})
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {t('syllabusDetails.studyProgram')}
            </Typography>
            {isAddCourseDialogOpen && (
              <Alert severity="info" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
                <Typography variant="body2">
                  {t('syllabusDetails.courseManagementOpen')}
                </Typography>
              </Alert>
            )}
          </Box>
          {/* Totals display */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t('syllabusDetails.totals')}</Typography>
            {Object.entries(totals).map(([year, semesters]) => (
              <Box key={year} sx={{ mb: 1, pl: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{t('syllabusDetails.year')} {year}:</Typography>
                {Object.entries(semesters).map(([semester, semesterData]) => (
                  <Typography key={semester} variant="body2" sx={{ ml: 2 }}>
                    {t('syllabusDetails.semester')} {semester}: {semesterData.credits} {t('syllabusDetails.credits')}, {semesterData.lecture} {t('syllabusDetails.lecture')}, {semesterData.seminar} {t('syllabusDetails.seminar')}, {semesterData.lab} {t('syllabusDetails.lab')}, {semesterData.practice} {t('syllabusDetails.practice')}, {semesterData.total} {t('syllabusDetails.totalHours')}
                  </Typography>
                ))}
                <Typography variant="body2" sx={{ ml: 2, fontWeight: 'bold' }}>
                  {t('syllabusDetails.year')} {year} {t('syllabusDetails.yearTotal')}: {Object.values(semesters).reduce((sum, s) => sum + s.credits, 0)} {t('syllabusDetails.credits')}
                </Typography>
              </Box>
            ))}
            <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
              {t('syllabusDetails.overall')}: {overall.credits} {t('syllabusDetails.credits')}, {overall.lecture} {t('syllabusDetails.lecture')}, {overall.seminar} {t('syllabusDetails.seminar')}, {overall.lab} {t('syllabusDetails.lab')}, {overall.practice} {t('syllabusDetails.practice')}, {overall.total} {t('syllabusDetails.totalHours')}
            </Typography>
          </Box>

          {Object.entries(coursesByYearSemester).map(([year, semesters]) => (
            <Box key={year} sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
                {t('syllabusDetails.year')} {year}
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
                      {t('syllabusDetails.semester')} {semester}
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('syllabusDetails.no')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('syllabusDetails.course')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('syllabusDetails.type')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('syllabusDetails.lecture')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('syllabusDetails.seminar')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('syllabusDetails.lab')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('syllabusDetails.total')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('syllabusDetails.practice')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('syllabusDetails.yearlyTotal')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('syllabusDetails.credits')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('syllabusDetails.evaluationMethod')}</TableCell>
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
                            const isMarkedForRemoval = localCoursesToRemove.includes(course.id);
                            return (
                              <TableRow
                                key={course.id}
                                onClick={() => navigate(`/courses/${course.id}`)}
                                sx={{
                                  cursor: 'pointer',
                                  backgroundColor: isMarkedForRemoval ? '#ffebee' : 'inherit',
                                  opacity: isMarkedForRemoval ? 0.6 : 1,
                                  '&:hover': {
                                    backgroundColor: isMarkedForRemoval ? '#ffcdd2' : 'rgba(0, 0, 0, 0.04)'
                                  }
                                }}
                              >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell sx={{ textDecoration: isMarkedForRemoval ? 'line-through' : 'none' }}>
                                  {course.title}
                                </TableCell>
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
                                {t('syllabusDetails.electiveCourses')}
                              </TableCell>
                            </TableRow>
                          )}
                          {/* Show Elective I if present */}
                          {electivesI.length > 0 && (
                            <TableRow>
                              <TableCell colSpan={11} style={{ background: '#e3f2fd', fontWeight: 'bold' }}>
                                {t('syllabusDetails.electiveI')}
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
                            const isMarkedForRemoval = localCoursesToRemove.includes(course.id);
                            return (
                              <TableRow
                                key={course.id}
                                onClick={() => navigate(`/courses/${course.id}`)}
                                sx={{
                                  cursor: 'pointer',
                                  backgroundColor: isMarkedForRemoval ? '#ffebee' : 'inherit',
                                  opacity: isMarkedForRemoval ? 0.6 : 1,
                                  '&:hover': {
                                    backgroundColor: isMarkedForRemoval ? '#ffcdd2' : 'rgba(0, 0, 0, 0.04)'
                                  }
                                }}
                              >
                                <TableCell>{mandatoryCourses.length + index + 1}</TableCell>
                                <TableCell sx={{ textDecoration: isMarkedForRemoval ? 'line-through' : 'none' }}>
                                  {course.title}
                                </TableCell>
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
                                {t('syllabusDetails.electiveII')}
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
                            const isMarkedForRemoval = localCoursesToRemove.includes(course.id);
                            return (
                              <TableRow
                                key={course.id}
                                onClick={() => navigate(`/courses/${course.id}`)}
                                sx={{
                                  cursor: 'pointer',
                                  backgroundColor: isMarkedForRemoval ? '#ffebee' : 'inherit',
                                  opacity: isMarkedForRemoval ? 0.6 : 1,
                                  '&:hover': {
                                    backgroundColor: isMarkedForRemoval ? '#ffcdd2' : 'rgba(0, 0, 0, 0.04)'
                                  }
                                }}
                              >
                                <TableCell>{mandatoryCourses.length + electivesI.length + index + 1}</TableCell>
                                <TableCell sx={{ textDecoration: isMarkedForRemoval ? 'line-through' : 'none' }}>
                                  {course.title}
                                </TableCell>
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
                            const isMarkedForRemoval = localCoursesToRemove.includes(course.id);
                            return (
                              <TableRow
                                key={course.id}
                                onClick={() => navigate(`/courses/${course.id}`)}
                                sx={{
                                  cursor: 'pointer',
                                  backgroundColor: isMarkedForRemoval ? '#ffebee' : 'inherit',
                                  opacity: isMarkedForRemoval ? 0.6 : 1,
                                  '&:hover': {
                                    backgroundColor: isMarkedForRemoval ? '#ffcdd2' : 'rgba(0, 0, 0, 0.04)'
                                  }
                                }}
                              >
                                <TableCell>{mandatoryCourses.length + electivesI.length + electivesII.length + index + 1}</TableCell>
                                <TableCell sx={{ textDecoration: isMarkedForRemoval ? 'line-through' : 'none' }}>
                                  {course.title}
                                </TableCell>
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
              {t('legend.title')}
            </Typography>
            <Grid container spacing={2}>
              <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {t('legend.courseTypes')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • {t('legend.types.A')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • {t('legend.types.B')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • {t('legend.types.C')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • {t('legend.types.D')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • {t('legend.types.E')}
                </Typography>
              </Grid>
              <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {t('legend.evaluationMethods')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • {t('legend.eval.P')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • {t('legend.eval.V')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • {t('legend.eval.F')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  • {t('legend.eval.diploma')}
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
    </Box>
  );
}; 