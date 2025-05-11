import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
  Grid,
  CircularProgress
} from '@mui/material';
import { useCourses } from '../hooks/useCourses';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CourseType, EvaluationMethod } from '../core/_models';

export const CreateCourse = () => {
  const navigate = useNavigate();
  const { createNewCourse, isFetching } = useCourses();
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    semester: '',
    lectureHours: '',
    seminarHours: '',
    labHours: '',
    credits: '',
    evaluation: EvaluationMethod.Exam,
    type: CourseType.Mandatory,
    syllabusId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNewCourse({
        ...formData,
        semester: parseInt(formData.semester),
        lectureHours: parseInt(formData.lectureHours),
        seminarHours: parseInt(formData.seminarHours),
        labHours: parseInt(formData.labHours),
        credits: parseInt(formData.credits),
        syllabusId: parseInt(formData.syllabusId)
      });
      navigate('/courses');
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/courses')}
        >
          Back to Courses
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Course
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid 
              sx={{
                width: {
                  xs: '100%',
                  md: 'calc(50% - 12px)'
                }
              }}
            >
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Semester"
                name="semester"
                type="number"
                value={formData.semester}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Credits"
                name="credits"
                type="number"
                value={formData.credits}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>

            <Grid 
              sx={{
                width: {
                  xs: '100%',
                  md: 'calc(50% - 12px)'
                }
              }}
            >
              <TextField
                fullWidth
                label="Lecture Hours"
                name="lectureHours"
                type="number"
                value={formData.lectureHours}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Seminar Hours"
                name="seminarHours"
                type="number"
                value={formData.seminarHours}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Lab Hours"
                name="labHours"
                type="number"
                value={formData.labHours}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Syllabus ID"
                name="syllabusId"
                type="number"
                value={formData.syllabusId}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>

            <Grid 
              sx={{
                width: {
                  xs: '100%',
                  md: 'calc(50% - 12px)'
                }
              }}
            >
              <TextField
                fullWidth
                select
                label="Evaluation Method"
                name="evaluation"
                value={formData.evaluation}
                onChange={handleChange}
                required
                margin="normal"
              >
                {Object.values(EvaluationMethod).map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid 
              sx={{
                width: {
                  xs: '100%',
                  md: 'calc(50% - 12px)'
                }
              }}
            >
              <TextField
                fullWidth
                select
                label="Course Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                margin="normal"
              >
                {Object.values(CourseType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid 
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 2
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Create Course
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}; 