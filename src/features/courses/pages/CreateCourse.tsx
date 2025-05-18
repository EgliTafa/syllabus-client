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
    syllabusId: '',
    academicProgram: '',
    academicYear: '',
    language: '',
    courseTypeLabel: '',
    ethicsCode: '',
    examMethod: '',
    teachingFormat: '',
    detailCredits: '',
    objective: '',
    keyConcepts: '',
    prerequisites: '',
    skillsAcquired: '',
    courseResponsible: '',
    literature: '',
    tpLectureHours: '',
    tpLabHours: '',
    tpPracticeHours: '',
    tpExerciseHours: '',
    tpWeeklyHours: '',
    tpIndividualStudyHours: '',
    ebParticipation: '',
    ebTest1: '',
    ebTest2: '',
    ebTest3: '',
    ebFinalExam: '',
    topics: '',
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

            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Course Details</Typography>
              <TextField fullWidth label="Academic Program" name="academicProgram" value={formData.academicProgram} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Academic Year" name="academicYear" value={formData.academicYear} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Language" name="language" value={formData.language} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Course Type Label" name="courseTypeLabel" value={formData.courseTypeLabel} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Ethics Code" name="ethicsCode" value={formData.ethicsCode} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Exam Method" name="examMethod" value={formData.examMethod} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Teaching Format" name="teachingFormat" value={formData.teachingFormat} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Credits (Detail)" name="detailCredits" type="number" value={formData.detailCredits} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Objective" name="objective" value={formData.objective} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Key Concepts" name="keyConcepts" value={formData.keyConcepts} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Prerequisites" name="prerequisites" value={formData.prerequisites} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Skills Acquired" name="skillsAcquired" value={formData.skillsAcquired} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Course Responsible" name="courseResponsible" value={formData.courseResponsible} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Literature (Backend support coming soon)" name="literature" value={formData.literature} onChange={handleChange} margin="normal" />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Teaching Plan</Typography>
              <TextField fullWidth label="Lecture Hours" name="tpLectureHours" type="number" value={formData.tpLectureHours} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Lab Hours" name="tpLabHours" type="number" value={formData.tpLabHours} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Practice Hours" name="tpPracticeHours" type="number" value={formData.tpPracticeHours} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Exercise Hours" name="tpExerciseHours" type="number" value={formData.tpExerciseHours} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Weekly Hours" name="tpWeeklyHours" type="number" value={formData.tpWeeklyHours} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Individual Study Hours" name="tpIndividualStudyHours" type="number" value={formData.tpIndividualStudyHours} onChange={handleChange} margin="normal" />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Evaluation Breakdown</Typography>
              <TextField fullWidth label="Participation %" name="ebParticipation" type="number" value={formData.ebParticipation} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Test 1 %" name="ebTest1" type="number" value={formData.ebTest1} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Test 2 %" name="ebTest2" type="number" value={formData.ebTest2} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Test 3 %" name="ebTest3" type="number" value={formData.ebTest3} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Final Exam %" name="ebFinalExam" type="number" value={formData.ebFinalExam} onChange={handleChange} margin="normal" />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Topics</Typography>
              <TextField fullWidth label="Topics (comma separated)" name="topics" value={formData.topics} onChange={handleChange} margin="normal" />
            </Box>

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