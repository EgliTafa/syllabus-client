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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useCourses } from '../hooks/useCourses';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { exportCoursePdf, deleteCourse } from '../core/_requests';
import { useTranslation } from 'react-i18next';
import { useLockoutStatus } from '../../../hooks/useLockoutStatus';

export const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { selectedCourse, isFetching, loadCourseById, updateExistingCourse, updateDetails } = useCourses();
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { isLockedOut } = useLockoutStatus();

  useEffect(() => {
    if (courseId) {
      loadCourseById(parseInt(courseId));
    }
  }, [courseId, loadCourseById]);

  const openEditModal = () => {
    if (!selectedCourse) return;
    setEditForm({
      ...selectedCourse,
      ...selectedCourse.teachingPlan,
      ...selectedCourse.evaluationBreakdown,
      ...selectedCourse,
      ...selectedCourse.detail,
    });
    setEditOpen(true);
  };

  const closeEditModal = () => {
    setEditOpen(false);
    setEditError(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setIsSaving(true);
    setEditError(null);
    try {
      // Update main course info
      await updateExistingCourse({
        courseId: selectedCourse.id,
        title: editForm.title,
        code: editForm.code,
        semester: Number(editForm.semester),
        lectureHours: Number(editForm.lectureHours),
        seminarHours: Number(editForm.seminarHours),
        labHours: Number(editForm.labHours),
        credits: Number(editForm.credits),
        evaluation: editForm.evaluation,
        type: editForm.type,
      });
      // Update course details
      await updateDetails(selectedCourse.id, {
        academicProgram: editForm.academicProgram,
        academicYear: editForm.academicYear,
        language: editForm.language,
        courseTypeLabel: editForm.courseTypeLabel,
        ethicsCode: editForm.ethicsCode,
        examMethod: editForm.examMethod,
        teachingFormat: editForm.teachingFormat,
        credits: Number(editForm.credits),
        teachingPlan: {
          lectureHours: Number(editForm.lectureHours),
          labHours: Number(editForm.labHours),
          practiceHours: Number(editForm.practiceHours),
          exerciseHours: Number(editForm.exerciseHours),
          weeklyHours: Number(editForm.weeklyHours),
          individualStudyHours: Number(editForm.individualStudyHours),
        },
        evaluationBreakdown: {
          participationPercent: Number(editForm.participationPercent),
          test1Percent: Number(editForm.test1Percent),
          test2Percent: Number(editForm.test2Percent),
          test3Percent: Number(editForm.test3Percent),
          finalExamPercent: Number(editForm.finalExamPercent),
        },
        objective: editForm.objective,
        keyConcepts: editForm.keyConcepts,
        prerequisites: editForm.prerequisites,
        skillsAcquired: editForm.skillsAcquired,
        courseResponsible: editForm.courseResponsible,
        topics: selectedCourse.topics || [], // For now, keep topics as is
      });
      await loadCourseById(selectedCourse.id);
      setEditOpen(false);
    } catch (err: any) {
      setEditError(err.message || t('courseDetails.failedToUpdate'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateDocument = async () => {
    if (!selectedCourse) return;
    setIsExporting(true);
    setExportError(null);
    try {
      const pdfBlob = await exportCoursePdf(selectedCourse.id);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Course_${selectedCourse.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setExportError(err.message || t('courseDetails.failedToExport'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCourse) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteCourse(selectedCourse.id);
      navigate('/courses');
    } catch (err: any) {
      setDeleteError(err.message || t('courseDetails.failedToDelete'));
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedCourse) {
    return (
      <Box p={3}>
        <Typography variant="h5">{t('courseDetails.notFound')}</Typography>
      </Box>
    );
  }

  return (
    <Box>
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
          onClick={() => navigate('/courses')}
          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
        >
          {t('courseDetails.backToCourses')}
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
            {isExporting ? t('courseDetails.generatingPdf') : t('courseDetails.generatePdf')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={openEditModal}
            disabled={isLockedOut}
            size="medium"
            sx={{ 
              minWidth: 'auto',
              px: 2
            }}
          >
            {t('courseDetails.edit')}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
            disabled={isLockedOut}
            size="medium"
            sx={{ 
              minWidth: 'auto',
              px: 2
            }}
          >
            {t('courseDetails.delete')}
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {selectedCourse.title}
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {selectedCourse.code}
        </Typography>

        <Grid container spacing={3} mt={2}>
          <Grid sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
            <Typography variant="h6" gutterBottom>
              {t('courseDetails.basicInformation')}
            </Typography>
            <List>
              <ListItem><ListItemText primary={t('courseDetails.semester')} secondary={selectedCourse.semester} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.credits')} secondary={selectedCourse.credits} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.type')} secondary={selectedCourse.courseTypeLabel} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.evaluationMethod')} secondary={selectedCourse.examMethod} /></ListItem>
            </List>
          </Grid>

          <Grid sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
            <Typography variant="h6" gutterBottom>
              {t('courseDetails.teachingPlan')}
            </Typography>
            <List>
              <ListItem><ListItemText primary={t('courseDetails.lectureHours')} secondary={selectedCourse.teachingPlan?.lectureHours ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.labHours')} secondary={selectedCourse.teachingPlan?.labHours ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.practiceHours')} secondary={selectedCourse.teachingPlan?.practiceHours ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.exerciseHours')} secondary={selectedCourse.teachingPlan?.exerciseHours ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.weeklyHours')} secondary={selectedCourse.teachingPlan?.weeklyHours ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.individualStudyHours')} secondary={selectedCourse.teachingPlan?.individualStudyHours ?? 'N/A'} /></ListItem>
            </List>
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              {t('courseDetails.ethicsFormatLanguageAcademic')}
            </Typography>
            <List>
              <ListItem><ListItemText primary={t('courseDetails.ethicsCode')} secondary={selectedCourse.ethicsCode} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.examMethod')} secondary={selectedCourse.examMethod} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.teachingFormat')} secondary={selectedCourse.teachingFormat} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.language')} secondary={selectedCourse.language} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.academicProgram')} secondary={selectedCourse.academicProgram} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.academicYear')} secondary={selectedCourse.academicYear} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.courseResponsible')} secondary={selectedCourse.courseResponsible || t('courseDetails.notAssigned')} /></ListItem>
            </List>
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t('courseDetails.objectivesKeyConcepts')}
            </Typography>
            <List>
              <ListItem><ListItemText primary={t('courseDetails.objective')} secondary={selectedCourse.objective} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.keyConcepts')} secondary={selectedCourse.keyConcepts} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.prerequisites')} secondary={selectedCourse.prerequisites} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.skillsAcquired')} secondary={selectedCourse.skillsAcquired} /></ListItem>
            </List>
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t('courseDetails.evaluationBreakdown')}
            </Typography>
            <List>
              <ListItem><ListItemText primary={t('courseDetails.participationPercent')} secondary={selectedCourse.evaluationBreakdown?.participationPercent ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.test1Percent')} secondary={selectedCourse.evaluationBreakdown?.test1Percent ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.test2Percent')} secondary={selectedCourse.evaluationBreakdown?.test2Percent ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.test3Percent')} secondary={selectedCourse.evaluationBreakdown?.test3Percent ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary={t('courseDetails.finalExamPercent')} secondary={selectedCourse.evaluationBreakdown?.finalExamPercent ?? 'N/A'} /></ListItem>
            </List>
          </Grid>

          {selectedCourse.topics && selectedCourse.topics.length > 0 && (
            <Grid sx={{ width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                {t('courseDetails.topics')}
              </Typography>
              <List>
                {selectedCourse.topics.map((topic, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={topic.title}
                      secondary={`${t('courseDetails.hours')}: ${topic.hours}${topic.reference ? `, ${t('courseDetails.reference')}: ${topic.reference}` : ''}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Legend Section */}
      <Paper sx={{ p: 3, mt: 3 }}>
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
      </Paper>

      <Dialog open={editOpen} onClose={closeEditModal} maxWidth="md" fullWidth>
        <DialogTitle>{t('courseDetails.editCourse')}</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            {/* Main course fields */}
            <TextField fullWidth margin="normal" label={t('courseDetails.title')} name="title" value={editForm?.title || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.code')} name="code" value={editForm?.code || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.semester')} name="semester" type="number" value={editForm?.semester || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.lectureHours')} name="lectureHours" type="number" value={editForm?.lectureHours || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.seminarHours')} name="seminarHours" type="number" value={editForm?.seminarHours || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.labHours')} name="labHours" type="number" value={editForm?.labHours || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.credits')} name="credits" type="number" value={editForm?.credits || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.evaluation')} name="evaluation" value={editForm?.evaluation || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.type')} name="type" value={editForm?.type || ''} onChange={handleEditChange} />
            {/* CourseDetail fields */}
            <TextField fullWidth margin="normal" label={t('courseDetails.academicProgram')} name="academicProgram" value={editForm?.academicProgram || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.academicYear')} name="academicYear" value={editForm?.academicYear || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.language')} name="language" value={editForm?.language || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.courseTypeLabel')} name="courseTypeLabel" value={editForm?.courseTypeLabel || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.ethicsCode')} name="ethicsCode" value={editForm?.ethicsCode || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.examMethod')} name="examMethod" value={editForm?.examMethod || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.teachingFormat')} name="teachingFormat" value={editForm?.teachingFormat || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.objective')} name="objective" value={editForm?.objective || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.keyConcepts')} name="keyConcepts" value={editForm?.keyConcepts || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.prerequisites')} name="prerequisites" value={editForm?.prerequisites || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.skillsAcquired')} name="skillsAcquired" value={editForm?.skillsAcquired || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.courseResponsible')} name="courseResponsible" value={editForm?.courseResponsible || ''} onChange={handleEditChange} />
            {/* Teaching Plan fields */}
            <TextField fullWidth margin="normal" label={t('courseDetails.practiceHoursLabel')} name="practiceHours" type="number" value={editForm?.practiceHours || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.exerciseHoursLabel')} name="exerciseHours" type="number" value={editForm?.exerciseHours || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.weeklyHoursLabel')} name="weeklyHours" type="number" value={editForm?.weeklyHours || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.individualStudyHoursLabel')} name="individualStudyHours" type="number" value={editForm?.individualStudyHours || ''} onChange={handleEditChange} />
            {/* Evaluation Breakdown fields */}
            <TextField fullWidth margin="normal" label={t('courseDetails.participationPercentLabel')} name="participationPercent" type="number" value={editForm?.participationPercent || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.test1PercentLabel')} name="test1Percent" type="number" value={editForm?.test1Percent || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.test2PercentLabel')} name="test2Percent" type="number" value={editForm?.test2Percent || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.test3PercentLabel')} name="test3Percent" type="number" value={editForm?.test3Percent || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label={t('courseDetails.finalExamPercentLabel')} name="finalExamPercent" type="number" value={editForm?.finalExamPercent || ''} onChange={handleEditChange} />
            {/* Topics editing can be added here as needed */}
            {editError && <Typography color="error" variant="body2">{editError}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditModal} disabled={isSaving}>{t('courseDetails.cancel')}</Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSaving}>{t('courseDetails.save')}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>{t('courseDetails.deleteCourse')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('courseDetails.deleteConfirmation')}
          </Typography>
          {deleteError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {deleteError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            {t('courseDetails.cancel')}
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {isDeleting ? t('courseDetails.deleting') : t('courseDetails.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 