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
  Alert,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CreateCourseRequest } from '../core/_models';
import { useCourses } from '../../courses/hooks/useCourses';

interface CreateCourseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (courseData: CreateCourseRequest) => Promise<void>;
}

interface ValidationErrors {
  title?: string;
  code?: string;
  year?: string;
  semester?: string;
  credits?: string;
  lectureHours?: string;
  seminarHours?: string;
  labHours?: string;
  practiceHours?: string;
  courseTypeLabel?: string;
  examMethod?: string;
  electiveGroup?: string;
  general?: string;
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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic-info']);

  const handleAccordionChange = (section: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSections(prev => 
      isExpanded 
        ? [...prev, section]
        : prev.filter(s => s !== section)
    );
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Required field validations
    if (!formData.title.trim()) {
      errors.title = 'Course title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Course title must be at least 3 characters long';
    } else if (formData.title.trim().length > 255) {
      errors.title = 'Course title must not exceed 255 characters';
    }

    if (!formData.code.trim()) {
      errors.code = 'Course code is required';
    } else if (!/^[A-Z]{2,4}\d{3,4}$/.test(formData.code.trim())) {
      errors.code = 'Course code should be in format like CS101, MATH201, etc. (2-4 letters followed by 3-4 digits)';
    } else if (formData.code.trim().length > 50) {
      errors.code = 'Course code must not exceed 50 characters';
    }

    // Year validation
    if (formData.year < 1 || formData.year > 3) {
      errors.year = 'Year must be between 1 and 3';
    }

    // Semester validation
    if (formData.semester < 1 || formData.semester > 2) {
      errors.semester = 'Semester must be between 1 and 2';
    }

    // Credits validation
    if (formData.credits <= 0) {
      errors.credits = 'Credits must be greater than 0';
    } else if (formData.credits > 30) {
      errors.credits = 'Credits should not exceed 30 per course';
    }

    // Hours validations
    if (formData.lectureHours < 0) {
      errors.lectureHours = 'Lecture hours cannot be negative';
    }
    if (formData.seminarHours < 0) {
      errors.seminarHours = 'Seminar hours cannot be negative';
    }
    if (formData.labHours < 0) {
      errors.labHours = 'Lab hours cannot be negative';
    }
    if (formData.practiceHours < 0) {
      errors.practiceHours = 'Practice hours cannot be negative';
    }

    // Total hours validation
    const totalHours = formData.lectureHours + formData.seminarHours + formData.labHours + formData.practiceHours;
    if (totalHours === 0) {
      errors.general = 'At least one type of hours must be greater than 0';
    } else if (totalHours > 60) {
      errors.general = 'Total hours should not exceed 60 per semester';
    }

    // Course type validation
    if (!formData.courseTypeLabel) {
      errors.courseTypeLabel = 'Course type is required';
    }

    // Exam method validation
    if (!formData.examMethod) {
      errors.examMethod = 'Exam method is required';
    }

    // Elective group validation (only for Core and Elective courses)
    if ((formData.courseTypeLabel === 'C' || formData.courseTypeLabel === 'E') && !formData.electiveGroup) {
      errors.electiveGroup = 'Elective group is required for Core and Elective courses';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      // Reset form on success
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
      setValidationErrors({});
    } catch (error: any) {
      // Handle API errors
      let errorMessage = 'Failed to create course. Please try again.';
      
      if (error.response?.data?.detail) {
        // API returns error details in the 'detail' field
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setValidationErrors({ general: errorMessage });
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
      setValidationErrors({});
      setExpandedSections(['basic-info']);
      onClose();
    }
  };

  const hasErrors = Object.keys(validationErrors).length > 0;
  const totalHours = formData.lectureHours + formData.seminarHours + formData.labHours + formData.practiceHours;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Course</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {validationErrors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationErrors.general}
            </Alert>
          )}

          {/* Basic Information Section */}
          <Accordion 
            expanded={expandedSections.includes('basic-info')} 
            onChange={handleAccordionChange('basic-info')}
            defaultExpanded
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Basic Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <TextField
                    fullWidth
                    label="Course Title *"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    margin="normal"
                    disabled={isSubmitting}
                    placeholder="e.g., Data Structures and Algorithms"
                    error={!!validationErrors.title}
                    helperText={validationErrors.title}
                    inputProps={{ maxLength: 255 }}
                  />
                </Grid>
                <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <TextField
                    fullWidth
                    label="Course Code *"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    margin="normal"
                    disabled={isSubmitting}
                    placeholder="e.g., CS201"
                    error={!!validationErrors.code}
                    helperText={validationErrors.code}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
                <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <TextField
                    fullWidth
                    label="Year *"
                    name="year"
                    select
                    value={formData.year}
                    onChange={handleChange}
                    required
                    margin="normal"
                    disabled={isSubmitting}
                    error={!!validationErrors.year}
                    helperText={validationErrors.year}
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
                    label="Semester *"
                    name="semester"
                    select
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    margin="normal"
                    disabled={isSubmitting}
                    error={!!validationErrors.semester}
                    helperText={validationErrors.semester}
                    SelectProps={{ native: true }}
                  >
                    <option value={1}>Semester 1 (Fall)</option>
                    <option value={2}>Semester 2 (Spring)</option>
                  </TextField>
                </Grid>
                <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <TextField
                    fullWidth
                    label="Credits *"
                    name="credits"
                    type="number"
                    value={formData.credits}
                    onChange={handleChange}
                    required
                    margin="normal"
                    disabled={isSubmitting}
                    error={!!validationErrors.credits}
                    helperText={validationErrors.credits}
                    inputProps={{ min: 1, max: 30 }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Teaching Hours Section */}
          <Accordion 
            expanded={expandedSections.includes('teaching-hours')} 
            onChange={handleAccordionChange('teaching-hours')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Teaching Hours</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <TextField
                    fullWidth
                    label="Lecture Hours"
                    name="lectureHours"
                    type="number"
                    value={formData.lectureHours}
                    onChange={handleChange}
                    margin="normal"
                    disabled={isSubmitting}
                    error={!!validationErrors.lectureHours}
                    helperText={validationErrors.lectureHours}
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
                    margin="normal"
                    disabled={isSubmitting}
                    error={!!validationErrors.seminarHours}
                    helperText={validationErrors.seminarHours}
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
                    margin="normal"
                    disabled={isSubmitting}
                    error={!!validationErrors.labHours}
                    helperText={validationErrors.labHours}
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
                    margin="normal"
                    disabled={isSubmitting}
                    error={!!validationErrors.practiceHours}
                    helperText={validationErrors.practiceHours}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Total Hours:</strong> {totalHours}
                  {totalHours > 60 && (
                    <span style={{ color: 'red' }}> (Exceeds recommended 60 hours per semester)</span>
                  )}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Course Classification Section */}
          <Accordion 
            expanded={expandedSections.includes('classification')} 
            onChange={handleAccordionChange('classification')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Course Classification</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <TextField
                    fullWidth
                    label="Course Type *"
                    name="courseTypeLabel"
                    select
                    value={formData.courseTypeLabel}
                    onChange={handleChange}
                    required
                    margin="normal"
                    disabled={isSubmitting}
                    error={!!validationErrors.courseTypeLabel}
                    helperText={validationErrors.courseTypeLabel}
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
                    label="Exam Method *"
                    name="examMethod"
                    select
                    value={formData.examMethod}
                    onChange={handleChange}
                    required
                    margin="normal"
                    disabled={isSubmitting}
                    error={!!validationErrors.examMethod}
                    helperText={validationErrors.examMethod}
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
                      label="Elective Group *"
                      name="electiveGroup"
                      select
                      value={formData.electiveGroup || ''}
                      onChange={handleChange}
                      required
                      margin="normal"
                      disabled={isSubmitting}
                      error={!!validationErrors.electiveGroup}
                      helperText={validationErrors.electiveGroup}
                      SelectProps={{ native: true }}
                    >
                      <option value="">Select Elective Group</option>
                      <option value="Elective I">Elective I</option>
                      <option value="Elective II">Elective II</option>
                    </TextField>
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting || isFetching || hasErrors}
          >
            {isSubmitting || isFetching ? <CircularProgress size={24} /> : 'Create Course'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 