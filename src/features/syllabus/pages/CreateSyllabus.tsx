import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Grid,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { CreateSyllabusRequest, Course } from '../core/_models';
import { createSyllabus } from '../core/_requests';
import { EvaluationMethod, CourseType } from '../../courses/core/_models';
import { AcademicYearSelect } from '../components/AcademicYearSelect';
import { CourseSelectionForSyllabus } from '../components/CourseSelectionForSyllabus';

export const CreateSyllabus = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCoursesChange = (newCourses: Course[]) => {
    setCourses(newCourses);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);
    if (!name || !academicYear || courses.length === 0) return;

    // Validation: Ensure only one Elective I and one Elective II per syllabus
    const electiveICount = courses.filter(c => c.electiveGroup === 'Elective I').length;
    const electiveIICount = courses.filter(c => c.electiveGroup === 'Elective II').length;
    if (electiveICount > 1) {
      setValidationError('Only one Elective I is allowed per syllabus.');
      return;
    }
    if (electiveIICount > 1) {
      setValidationError('Only one Elective II is allowed per syllabus.');
      return;
    }

    // Validation: 60 credits per year
    for (const year of [1, 2, 3]) {
      const yearCourses = courses.filter(c => c.year === year);
      const yearCredits = yearCourses.reduce((sum, course) => sum + course.credits, 0);
      if (yearCredits !== 60) {
        setValidationError(`Year ${year} must have exactly 60 credits (currently ${yearCredits}).`);
        return;
      }
    }

    // Optionally, validate total credits
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    if (totalCredits !== 180) {
      setValidationError(`Total credits must be 180 (currently ${totalCredits}).`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Helper function to convert exam method string to enum
      const convertExamMethod = (examMethod: string): EvaluationMethod => {
        switch (examMethod) {
          case 'P':
          case 'Provim':
            return EvaluationMethod.Exam;
          case 'V':
          case 'Vlerësim i vazhduar':
            return EvaluationMethod.ContinuousAssessment;
          case 'F':
          case 'Fiton':
            return EvaluationMethod.Pass;
          case 'E':
          case 'Provim Diplome':
            return EvaluationMethod.DiplomaExam;
          default:
            return EvaluationMethod.Exam;
        }
      };

      // Helper function to convert course type string to enum
      const convertCourseType = (courseTypeLabel: string): CourseType => {
        switch (courseTypeLabel) {
          case 'A':
          case 'Avancuar':
            return CourseType.Advanced;
          case 'B':
          case 'Bazë':
            return CourseType.Mandatory;
          case 'C':
          case 'Specializim':
            return CourseType.Specialized;
          case 'D':
          case 'Zgjedhje':
            return CourseType.Elective;
          case 'E':
          case 'Projekt Final':
            return CourseType.FinalProject;
          default:
            return CourseType.Mandatory;
        }
      };

      // Map courses to match CreateCourseRequest structure
      const mappedCourses = courses.map((course) => ({
        title: course.title,
        code: course.code,
        year: course.year,
        semester: course.semester,
        credits: course.credits,
        lectureHours: course.lectureHours,
        seminarHours: course.seminarHours,
        labHours: course.labHours,
        practiceHours: course.practiceHours,
        evaluation: convertExamMethod(course.examMethod || 'P'),
        type: convertCourseType(course.courseTypeLabel || 'B'),
        electiveGroup: course.electiveGroup,
        syllabusId: 0 // Will be set by the backend
      }));

      const syllabusData: CreateSyllabusRequest = {
        name,
        academicYear,
        courses: mappedCourses
      };

      // Create the syllabus via API
      const createdSyllabus = await createSyllabus(syllabusData);
      console.log('Syllabus created successfully:', createdSyllabus);
      
      // Navigate to the syllabus list or the created syllabus details
      navigate('/syllabus');
    } catch (error: any) {
      console.error('Error creating syllabus:', error);
      setValidationError(error?.response?.data?.message || 'Failed to create syllabus. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals for display
  const totals = courses.reduce((acc, course) => {
    const year = course.year;
    if (!acc[year]) {
      acc[year] = { credits: 0, courses: 0 };
    }
    acc[year].credits += course.credits;
    acc[year].courses += 1;
    return acc;
  }, {} as Record<number, { credits: number; courses: number }>);

  const overall = {
    credits: courses.reduce((sum, course) => sum + course.credits, 0),
    courses: courses.length
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/syllabus')}
      >
          Back to Syllabuses
      </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Syllabus
        </Typography>

        {validationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <TextField
              fullWidth
              label="Syllabus Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <AcademicYearSelect
              value={academicYear}
              onChange={setAcademicYear}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Syllabus'}
            </Button>
          </Box>
        </form>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Course Management
        </Typography>

        <CourseSelectionForSyllabus
          selectedCourses={courses}
          onCoursesChange={handleCoursesChange}
        />

        {/* Summary Section */}
        {courses.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Syllabus Summary
            </Typography>
            
            <Grid container spacing={2}>
              {[1, 2, 3].map(year => (
                <Grid key={year} sx={{ width: { xs: '100%', sm: 'calc(33.33% - 16px)' } }}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6">Year {year}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {totals[year]?.courses || 0} courses
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {totals[year]?.credits || 0} credits
        </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Paper sx={{ p: 2, mt: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="body2">
                {overall.courses} courses
              </Typography>
              <Typography variant="h5">
                {overall.credits} credits
              </Typography>
            </Paper>
          </Box>
        )}
      </Paper>
    </Box>
  );
}; 