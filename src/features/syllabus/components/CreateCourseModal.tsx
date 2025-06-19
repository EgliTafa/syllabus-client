import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { CreateCourseRequest } from '../core/_models';
import { useCourses } from '../../courses/hooks/useCourses';

interface CreateCourseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (courseData: CreateCourseRequest) => Promise<void>;
}

export const CreateCourseModal = ({
  open,
  onClose,
  onSubmit
}: CreateCourseModalProps) => {
  const { isFetching } = useCourses();
  const [formData, setFormData] = useState<CreateCourseRequest>({
    title: '',
    code: '',
    year: 1,
    semester: 1,
    credits: 0,
    lectureHours: 0,
    seminarHours: 0,
    labHours: 0,
    practiceHours: 0,
    courseTypeLabel: 'B',
    examMethod: 'P',
    electiveGroup: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'semester' || name === 'credits' || 
              name === 'lectureHours' || name === 'seminarHours' || name === 'labHours' || 
              name === 'practiceHours' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.code) {
      setError('Title and code are required');
      return;
    }

    // Validate course code format (basic validation)
    if (!/^[A-Z]{2,4}\d{3,4}$/.test(formData.code)) {
      setError('Course code should be in format like CS101, MATH201, etc.');
      return;
    }

    if (formData.credits <= 0) {
      setError('Credits must be greater than 0');
      return;
    }

    if (formData.year < 1 || formData.year > 3) {
      setError('Year must be between 1 and 3');
      return;
    }

    if (formData.semester < 1 || formData.semester > 2) {
      setError('Semester must be between 1 and 2');
      return;
    }

    // Validate total hours
    const totalHours = formData.lectureHours + formData.seminarHours + formData.labHours + formData.practiceHours;
    if (totalHours === 0) {
      setError('At least one type of hours must be greater than 0');
      return;
    }

    if (totalHours > 60) {
      setError('Total hours should not exceed 60 per semester');
      return;
    }

    // Validate that semester makes sense for the year
    const expectedSemester = formData.semester === 1 ? 'Fall' : 'Spring';
    const academicYear = `${formData.year}${formData.year + 1}`;
    
    // Optional: Add a more descriptive semester label
    const semesterLabel = `Year ${formData.year}, Semester ${formData.semester} (${expectedSemester} ${academicYear})`;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        title: '',
        code: '',
        year: 1,
        semester: 1,
        credits: 0,
        lectureHours: 0,
        seminarHours: 0,
        labHours: 0,
        practiceHours: 0,
        courseTypeLabel: 'B',
        examMethod: 'P',
        electiveGroup: null,
      });
    } catch (error) {
      setError('Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form to initial state
      setFormData({
        title: '',
        code: '',
        year: 1,
        semester: 1,
        credits: 0,
        lectureHours: 0,
        seminarHours: 0,
        labHours: 0,
        practiceHours: 0,
        courseTypeLabel: 'B',
        examMethod: 'P',
        electiveGroup: null,
      });
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Course</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="Course Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                margin="normal"
                disabled={isSubmitting}
                placeholder="e.g., Data Structures and Algorithms"
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="Course Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                margin="normal"
                disabled={isSubmitting}
                placeholder="e.g., CS201"
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                select
                value={formData.year}
                onChange={handleChange}
                required
                margin="normal"
                disabled={isSubmitting}
                SelectProps={{ native: true }}
              >
                <option value={1}>Year 1</option>
                <option value={2}>Year 2</option>
                <option value={3}>Year 3</option>
              </TextField>
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="Semester"
                name="semester"
                select
                value={formData.semester}
                onChange={handleChange}
                required
                margin="normal"
                disabled={isSubmitting}
                SelectProps={{ native: true }}
              >
                <option value={1}>Semester 1 (Fall)</option>
                <option value={2}>Semester 2 (Spring)</option>
              </TextField>
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="Credits"
                name="credits"
                type="number"
                value={formData.credits}
                onChange={handleChange}
                required
                margin="normal"
                disabled={isSubmitting}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="Lecture Hours"
                name="lectureHours"
                type="number"
                value={formData.lectureHours}
                onChange={handleChange}
                required
                margin="normal"
                disabled={isSubmitting}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="Seminar Hours"
                name="seminarHours"
                type="number"
                value={formData.seminarHours}
                onChange={handleChange}
                required
                margin="normal"
                disabled={isSubmitting}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="Lab Hours"
                name="labHours"
                type="number"
                value={formData.labHours}
                onChange={handleChange}
                required
                margin="normal"
                disabled={isSubmitting}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="Practice Hours"
                name="practiceHours"
                type="number"
                value={formData.practiceHours}
                onChange={handleChange}
                required
                margin="normal"
                disabled={isSubmitting}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="Course Type"
                name="courseTypeLabel"
                select
                value={formData.courseTypeLabel}
                onChange={handleChange}
                required
                margin="normal"
                disabled={isSubmitting}
                SelectProps={{ native: true }}
              >
                <option value="B">B (Basic)</option>
                <option value="C">C (Core)</option>
                <option value="E">E (Elective)</option>
              </TextField>
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="Exam Method"
                name="examMethod"
                select
                value={formData.examMethod}
                onChange={handleChange}
                required
                margin="normal"
                disabled={isSubmitting}
                SelectProps={{ native: true }}
              >
                <option value="P">P (Project)</option>
                <option value="V">V (Oral)</option>
                <option value="F">F (Final)</option>
              </TextField>
            </Grid>
            {(formData.courseTypeLabel === 'C' || formData.courseTypeLabel === 'E') && (
              <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Elective Group"
                  name="electiveGroup"
                  select
                  value={formData.electiveGroup || ''}
                  onChange={handleChange}
                  margin="normal"
                  disabled={isSubmitting}
                  SelectProps={{ native: true }}
                >
                  <option value="">None</option>
                  <option value="Elective I">Elective I</option>
                  <option value="Elective II">Elective II</option>
                </TextField>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting || isFetching}
          >
            {isSubmitting || isFetching ? <CircularProgress size={24} /> : 'Create Course'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 