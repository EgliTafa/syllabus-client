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
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useCourses } from '../hooks/useCourses';
import { useGetAllSyllabuses } from '../../syllabus/hooks/useSyllabuses';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CourseType, EvaluationMethod, CreateCourseRequest } from '../core/_models';
import { useDispatch } from 'react-redux';

export const CreateCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { createNewCourse, isFetching } = useCourses();
  const { syllabusList, isFetching: isFetchingSyllabuses } = useGetAllSyllabuses();
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    semester: '',
    lectureHours: '',
    seminarHours: '',
    labHours: '',
    practiceHours: '',
    credits: '',
    evaluation: EvaluationMethod.Exam,
    type: CourseType.Mandatory,
    syllabusId: '',
    year: '',
    electiveGroup: '',
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
    ebLekcion: '',
    ebSeminar: '',
    ebLaborator: '',
    ebFinalExam: '',
    topics: '',
  });
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic-info']);
  const [error, setError] = useState<string | null>(null);

  const handleAccordionChange = (section: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSections(prev => 
      isExpanded 
        ? [...prev, section]
        : prev.filter(s => s !== section)
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Transform form data to match API structure
      const courseData: CreateCourseRequest = {
        title: formData.title,
        code: formData.code,
        semester: parseInt(formData.semester) || 1,
        lectureHours: parseInt(formData.lectureHours) || 0,
        seminarHours: parseInt(formData.seminarHours) || 0,
        labHours: parseInt(formData.labHours) || 0,
        practiceHours: parseInt(formData.practiceHours) || 0,
        credits: parseInt(formData.credits) || 0,
        evaluation: formData.evaluation,
        type: formData.type,
        syllabusId: parseInt(formData.syllabusId),
        year: parseInt(formData.year) || 1,
        electiveGroup: formData.electiveGroup || undefined,
        detail: {
          academicProgram: formData.academicProgram || '',
          academicYear: formData.academicYear || '',
          language: formData.language || '',
          courseTypeLabel: formData.courseTypeLabel || '',
          ethicsCode: formData.ethicsCode || '',
          examMethod: formData.examMethod || '',
          teachingFormat: formData.teachingFormat || '',
          credits: parseInt(formData.detailCredits) || parseInt(formData.credits) || 0,
          teachingPlan: {
            lectureHours: parseInt(formData.tpLectureHours) || parseInt(formData.lectureHours) || 0,
            labHours: parseInt(formData.tpLabHours) || parseInt(formData.labHours) || 0,
            practiceHours: parseInt(formData.tpPracticeHours) || parseInt(formData.practiceHours) || 0,
            exerciseHours: parseInt(formData.tpExerciseHours) || 0,
            weeklyHours: parseInt(formData.tpWeeklyHours) || 0,
            individualStudyHours: parseInt(formData.tpIndividualStudyHours) || 0,
          },
          evaluationBreakdown: {
            participationPercent: parseInt(formData.ebParticipation) || 0,
            test1Percent: parseInt(formData.ebLekcion) || 0,
            test2Percent: parseInt(formData.ebSeminar) || 0,
            test3Percent: parseInt(formData.ebLaborator) || 0,
            finalExamPercent: parseInt(formData.ebFinalExam) || 0,
          },
          objective: formData.objective || '',
          keyConcepts: formData.keyConcepts || '',
          prerequisites: formData.prerequisites || '',
          skillsAcquired: formData.skillsAcquired || '',
          courseResponsible: formData.courseResponsible || '',
          topics: formData.topics ? formData.topics.split('\n').filter(t => t.trim()).map(topic => ({
            title: topic.trim(),
            hours: 0,
          })) : undefined,
        }
      };

      console.log('Sending course data:', JSON.stringify(courseData, null, 2));
      await createNewCourse(courseData);
      navigate('/courses');
    } catch (error: any) {
      console.error('Failed to create course:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || error.message || 'Failed to create course. Please try again.');
    }
  };

  if (isFetching || isFetchingSyllabuses) {
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
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
          <Grid container spacing={3}>
                <Grid sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
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

                <Grid sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
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
                    label="Practice Hours"
                    name="practiceHours"
                    type="number"
                    value={formData.practiceHours}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Year"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    margin="normal"
                    inputProps={{ min: 1, max: 3 }}
                    helperText="Academic year (1, 2, or 3)"
                  />
                  <TextField
                    fullWidth
                    label="Elective Group"
                    name="electiveGroup"
                    value={formData.electiveGroup}
                    onChange={handleChange}
                    margin="normal"
                    helperText="Optional: 'Elective I' or 'Elective II'"
                  />
                  <TextField
                    fullWidth
                    select
                    label="Syllabus"
                name="syllabusId"
                value={formData.syllabusId}
                onChange={handleChange}
                required
                margin="normal"
                  >
                    <MenuItem value="">
                      <em>Select a syllabus</em>
                    </MenuItem>
                    {syllabusList?.map((syllabus) => (
                      <MenuItem key={syllabus.id} value={syllabus.id}>
                        {syllabus.name} ({syllabus.program.academicYear})
                      </MenuItem>
                    ))}
                  </TextField>
                  <Grid sx={{ width: '100%' }}>
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
                  <Grid sx={{ width: '100%' }}>
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
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Course Details Section */}
          <Accordion 
            expanded={expandedSections.includes('course-details')} 
            onChange={handleAccordionChange('course-details')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Course Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                  <TextField 
                    fullWidth 
                    label="Academic Program" 
                    name="academicProgram" 
                    value={formData.academicProgram} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Academic Year" 
                    name="academicYear" 
                    value={formData.academicYear} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Language" 
                    name="language" 
                    value={formData.language} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Course Type Label" 
                    name="courseTypeLabel" 
                    value={formData.courseTypeLabel} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Ethics Code" 
                    name="ethicsCode" 
                    value={formData.ethicsCode} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Exam Method" 
                    name="examMethod" 
                    value={formData.examMethod} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                </Grid>
                <Grid sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                  <TextField 
                    fullWidth 
                    label="Teaching Format" 
                    name="teachingFormat" 
                    value={formData.teachingFormat} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Credits (Detail)" 
                    name="detailCredits" 
                    type="number" 
                    value={formData.detailCredits} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Course Responsible" 
                    name="courseResponsible" 
                    value={formData.courseResponsible} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Literature (Backend support coming soon)" 
                    name="literature" 
                    value={formData.literature} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                </Grid>
                <Grid sx={{ width: '100%' }}>
                  <TextField 
                    fullWidth 
                    label="Objective" 
                    name="objective" 
                    value={formData.objective} 
                    onChange={handleChange} 
                    margin="normal" 
                    multiline
                    rows={3}
                  />
                  <TextField 
                    fullWidth 
                    label="Key Concepts" 
                    name="keyConcepts" 
                    value={formData.keyConcepts} 
                    onChange={handleChange} 
                    margin="normal" 
                    multiline
                    rows={3}
                  />
                  <TextField 
                    fullWidth 
                    label="Prerequisites" 
                    name="prerequisites" 
                    value={formData.prerequisites} 
                    onChange={handleChange} 
                    margin="normal" 
                    multiline
                    rows={3}
                  />
                  <TextField 
                    fullWidth 
                    label="Skills Acquired" 
                    name="skillsAcquired" 
                    value={formData.skillsAcquired} 
                    onChange={handleChange} 
                    margin="normal" 
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Teaching Plan Section */}
          <Accordion 
            expanded={expandedSections.includes('teaching-plan')} 
            onChange={handleAccordionChange('teaching-plan')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Teaching Plan</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                  <TextField 
                    fullWidth 
                    label="Lecture Hours" 
                    name="tpLectureHours" 
                    type="number" 
                    value={formData.tpLectureHours} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Lab Hours" 
                    name="tpLabHours" 
                    type="number" 
                    value={formData.tpLabHours} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Practice Hours" 
                    name="tpPracticeHours" 
                    type="number" 
                    value={formData.tpPracticeHours} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                </Grid>
                <Grid sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                  <TextField 
                    fullWidth 
                    label="Exercise Hours" 
                    name="tpExerciseHours" 
                    type="number" 
                    value={formData.tpExerciseHours} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Weekly Hours" 
                    name="tpWeeklyHours" 
                    type="number" 
                    value={formData.tpWeeklyHours} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Individual Study Hours" 
                    name="tpIndividualStudyHours" 
                    type="number" 
                    value={formData.tpIndividualStudyHours} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Evaluation Breakdown Section */}
          <Accordion 
            expanded={expandedSections.includes('evaluation-breakdown')} 
            onChange={handleAccordionChange('evaluation-breakdown')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Evaluation Breakdown</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                  <TextField 
                    fullWidth 
                    label="Participation %" 
                    name="ebParticipation" 
                    type="number" 
                    value={formData.ebParticipation} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Lekcion %" 
                    name="ebLekcion" 
                    type="number" 
                    value={formData.ebLekcion} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Seminar %" 
                    name="ebSeminar" 
                    type="number" 
                    value={formData.ebSeminar} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                </Grid>
                <Grid sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                  <TextField 
                    fullWidth 
                    label="Laborator %" 
                    name="ebLaborator" 
                    type="number" 
                    value={formData.ebLaborator} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                  <TextField 
                    fullWidth 
                    label="Final Exam %" 
                    name="ebFinalExam" 
                    type="number" 
                    value={formData.ebFinalExam} 
                    onChange={handleChange} 
                    margin="normal" 
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Topics Section */}
          <Accordion 
            expanded={expandedSections.includes('topics')} 
            onChange={handleAccordionChange('topics')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Topics</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField 
                fullWidth 
                label="Topics (comma separated)" 
                name="topics" 
                value={formData.topics} 
                onChange={handleChange} 
                margin="normal" 
                multiline
                rows={4}
                placeholder="Enter topics separated by commas..."
              />
            </AccordionDetails>
          </Accordion>

            <Grid 
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
              mt: 3
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
        </form>
      </Paper>
    </Box>
  );
}; 