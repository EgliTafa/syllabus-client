import { useEffect } from 'react';
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
  Grid
} from '@mui/material';
import { useCourses } from '../hooks/useCourses';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

export const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { selectedCourse, isFetching, loadCourseById } = useCourses();

  useEffect(() => {
    if (courseId) {
      loadCourseById(parseInt(courseId));
    }
  }, [courseId, loadCourseById]);

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/courses')}
        >
          Back to Courses
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/courses/${courseId}/edit`)}
        >
          Edit Course
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {selectedCourse.title}
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {selectedCourse.code}
        </Typography>

        <Grid container spacing={3} mt={2}>
          <Grid 
            sx={{
              width: {
                xs: '100%',
                md: 'calc(50% - 12px)'
              }
            }}
          >
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Semester" 
                  secondary={selectedCourse.semester} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Credits" 
                  secondary={selectedCourse.credits} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Type" 
                  secondary={selectedCourse.type} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Evaluation Method" 
                  secondary={selectedCourse.evaluation} 
                />
              </ListItem>
            </List>
          </Grid>

          <Grid 
            sx={{
              width: {
                xs: '100%',
                md: 'calc(50% - 12px)'
              }
            }}
          >
            <Typography variant="h6" gutterBottom>
              Hours
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Lecture Hours" 
                  secondary={selectedCourse.lectureHours} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Seminar Hours" 
                  secondary={selectedCourse.seminarHours} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Lab Hours" 
                  secondary={selectedCourse.labHours} 
                />
              </ListItem>
            </List>
          </Grid>

          {selectedCourse.detail && (
            <>
              <Grid 
                sx={{
                  width: '100%'
                }}
              >
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Course Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid 
                    sx={{
                      width: {
                        xs: '100%',
                        md: 'calc(50% - 12px)'
                      }
                    }}
                  >
                    <List>
                      <ListItem>
                        <ListItemText 
                          primary="Academic Program" 
                          secondary={selectedCourse.detail.academicProgram} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Academic Year" 
                          secondary={selectedCourse.detail.academicYear} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Language" 
                          secondary={selectedCourse.detail.language} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Course Type" 
                          secondary={selectedCourse.detail.courseTypeLabel} 
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid 
                    sx={{
                      width: {
                        xs: '100%',
                        md: 'calc(50% - 12px)'
                      }
                    }}
                  >
                    <List>
                      <ListItem>
                        <ListItemText 
                          primary="Ethics Code" 
                          secondary={selectedCourse.detail.ethicsCode} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Exam Method" 
                          secondary={selectedCourse.detail.examMethod} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Teaching Format" 
                          secondary={selectedCourse.detail.teachingFormat} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Course Responsible" 
                          secondary={selectedCourse.detail.courseResponsible || 'Not assigned'} 
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Grid>

              <Grid 
                sx={{
                  width: '100%'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Course Content
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Objective" 
                      secondary={selectedCourse.detail.objective} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Key Concepts" 
                      secondary={selectedCourse.detail.keyConcepts} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Prerequisites" 
                      secondary={selectedCourse.detail.prerequisites} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Skills Acquired" 
                      secondary={selectedCourse.detail.skillsAcquired} 
                    />
                  </ListItem>
                </List>
              </Grid>

              {selectedCourse.detail.topics && selectedCourse.detail.topics.length > 0 && (
                <Grid 
                  sx={{
                    width: '100%'
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Topics
                  </Typography>
                  <List>
                    {selectedCourse.detail.topics.map((topic, index) => (
                      <ListItem key={index}>
                        <ListItemText 
                          primary={topic.title}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                Hours: {topic.hours}
                              </Typography>
                              {topic.reference && (
                                <Typography component="span" variant="body2" display="block">
                                  Reference: {topic.reference}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Paper>
    </Box>
  );
}; 