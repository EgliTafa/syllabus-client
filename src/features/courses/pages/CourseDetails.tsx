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
import { exportCoursePdf } from '../core/_requests';

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
      setEditError(err.message || 'Failed to update course');
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
      setExportError(err.message || 'Failed to export course PDF');
    } finally {
      setIsExporting(false);
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
        <Typography variant="h5">Course not found</Typography>
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
          Back to Courses
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
            onClick={openEditModal}
            size="medium"
            sx={{ 
              minWidth: 'auto',
              px: 2
            }}
          >
            Edit
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
              Basic Information
            </Typography>
            <List>
              <ListItem><ListItemText primary="Semester" secondary={selectedCourse.semester} /></ListItem>
              <ListItem><ListItemText primary="Credits" secondary={selectedCourse.credits} /></ListItem>
              <ListItem><ListItemText primary="Type" secondary={selectedCourse.courseTypeLabel} /></ListItem>
              <ListItem><ListItemText primary="Evaluation Method" secondary={selectedCourse.examMethod} /></ListItem>
            </List>
          </Grid>

          <Grid sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
            <Typography variant="h6" gutterBottom>
              Teaching Plan
            </Typography>
            <List>
              <ListItem><ListItemText primary="Lecture Hours" secondary={selectedCourse.teachingPlan?.lectureHours ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary="Lab Hours" secondary={selectedCourse.teachingPlan?.labHours ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary="Practice Hours" secondary={selectedCourse.teachingPlan?.practiceHours ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary="Exercise Hours" secondary={selectedCourse.teachingPlan?.exerciseHours ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary="Weekly Hours" secondary={selectedCourse.teachingPlan?.weeklyHours ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary="Individual Study Hours" secondary={selectedCourse.teachingPlan?.individualStudyHours ?? 'N/A'} /></ListItem>
            </List>
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Ethics, Format, Language, Academic Info
            </Typography>
            <List>
              <ListItem><ListItemText primary="Ethics Code" secondary={selectedCourse.ethicsCode} /></ListItem>
              <ListItem><ListItemText primary="Exam Method" secondary={selectedCourse.examMethod} /></ListItem>
              <ListItem><ListItemText primary="Teaching Format" secondary={selectedCourse.teachingFormat} /></ListItem>
              <ListItem><ListItemText primary="Language" secondary={selectedCourse.language} /></ListItem>
              <ListItem><ListItemText primary="Academic Program" secondary={selectedCourse.academicProgram} /></ListItem>
              <ListItem><ListItemText primary="Academic Year" secondary={selectedCourse.academicYear} /></ListItem>
              <ListItem><ListItemText primary="Course Responsible" secondary={selectedCourse.courseResponsible || 'Not assigned'} /></ListItem>
            </List>
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Objectives & Key Concepts
            </Typography>
            <List>
              <ListItem><ListItemText primary="Objective" secondary={selectedCourse.objective} /></ListItem>
              <ListItem><ListItemText primary="Key Concepts" secondary={selectedCourse.keyConcepts} /></ListItem>
              <ListItem><ListItemText primary="Prerequisites" secondary={selectedCourse.prerequisites} /></ListItem>
              <ListItem><ListItemText primary="Skills Acquired" secondary={selectedCourse.skillsAcquired} /></ListItem>
            </List>
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Evaluation Breakdown
            </Typography>
            <List>
              <ListItem><ListItemText primary="Participation %" secondary={selectedCourse.evaluationBreakdown?.participationPercent ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary="Test 1 %" secondary={selectedCourse.evaluationBreakdown?.test1Percent ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary="Test 2 %" secondary={selectedCourse.evaluationBreakdown?.test2Percent ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary="Test 3 %" secondary={selectedCourse.evaluationBreakdown?.test3Percent ?? 'N/A'} /></ListItem>
              <ListItem><ListItemText primary="Final Exam %" secondary={selectedCourse.evaluationBreakdown?.finalExamPercent ?? 'N/A'} /></ListItem>
            </List>
          </Grid>

          {selectedCourse.topics && selectedCourse.topics.length > 0 && (
            <Grid sx={{ width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Topics
              </Typography>
              <List>
                {selectedCourse.topics.map((topic, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={topic.title}
                      secondary={`Hours: ${topic.hours}${topic.reference ? `, Reference: ${topic.reference}` : ''}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Dialog open={editOpen} onClose={closeEditModal} maxWidth="md" fullWidth>
        <DialogTitle>Edit Course</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            {/* Main course fields */}
            <TextField fullWidth margin="normal" label="Title" name="title" value={editForm?.title || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Code" name="code" value={editForm?.code || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Semester" name="semester" type="number" value={editForm?.semester || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Lecture Hours" name="lectureHours" type="number" value={editForm?.lectureHours || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Seminar Hours" name="seminarHours" type="number" value={editForm?.seminarHours || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Lab Hours" name="labHours" type="number" value={editForm?.labHours || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Credits" name="credits" type="number" value={editForm?.credits || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Evaluation" name="evaluation" value={editForm?.evaluation || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Type" name="type" value={editForm?.type || ''} onChange={handleEditChange} />
            {/* CourseDetail fields */}
            <TextField fullWidth margin="normal" label="Academic Program" name="academicProgram" value={editForm?.academicProgram || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Academic Year" name="academicYear" value={editForm?.academicYear || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Language" name="language" value={editForm?.language || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Course Type Label" name="courseTypeLabel" value={editForm?.courseTypeLabel || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Ethics Code" name="ethicsCode" value={editForm?.ethicsCode || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Exam Method" name="examMethod" value={editForm?.examMethod || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Teaching Format" name="teachingFormat" value={editForm?.teachingFormat || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Objective" name="objective" value={editForm?.objective || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Key Concepts" name="keyConcepts" value={editForm?.keyConcepts || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Prerequisites" name="prerequisites" value={editForm?.prerequisites || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Skills Acquired" name="skillsAcquired" value={editForm?.skillsAcquired || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Course Responsible" name="courseResponsible" value={editForm?.courseResponsible || ''} onChange={handleEditChange} />
            {/* Teaching Plan fields */}
            <TextField fullWidth margin="normal" label="Practice Hours" name="practiceHours" type="number" value={editForm?.practiceHours || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Exercise Hours" name="exerciseHours" type="number" value={editForm?.exerciseHours || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Weekly Hours" name="weeklyHours" type="number" value={editForm?.weeklyHours || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Individual Study Hours" name="individualStudyHours" type="number" value={editForm?.individualStudyHours || ''} onChange={handleEditChange} />
            {/* Evaluation Breakdown fields */}
            <TextField fullWidth margin="normal" label="Participation %" name="participationPercent" type="number" value={editForm?.participationPercent || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Test 1 %" name="test1Percent" type="number" value={editForm?.test1Percent || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Test 2 %" name="test2Percent" type="number" value={editForm?.test2Percent || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Test 3 %" name="test3Percent" type="number" value={editForm?.test3Percent || ''} onChange={handleEditChange} />
            <TextField fullWidth margin="normal" label="Final Exam %" name="finalExamPercent" type="number" value={editForm?.finalExamPercent || ''} onChange={handleEditChange} />
            {/* Topics editing can be added here as needed */}
            {editError && <Typography color="error" variant="body2">{editError}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditModal} disabled={isSaving}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSaving}>Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}; 