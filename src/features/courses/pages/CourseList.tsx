import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  CircularProgress
} from '@mui/material';
import { useCourses } from '../hooks/useCourses';
import AddIcon from '@mui/icons-material/Add';

export const CourseList = () => {
  const navigate = useNavigate();
  const { courseList, isFetching, loadCourses } = useCourses();

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

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
        <Typography variant="h4">Courses</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/courses/create')}
        >
          Create Course
        </Button>
      </Box>

      <Grid container spacing={3}>
        {courseList.map((course) => (
          <Grid 
            key={course.id}
            sx={{
              width: {
                xs: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.33% - 16px)'
              }
            }}
          >
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6
                }
              }}
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {course.code}
                </Typography>
                <Typography variant="body2">
                  Semester: {course.semester}
                </Typography>
                <Typography variant="body2">
                  Credits: {course.credits}
                </Typography>
                <Typography variant="body2">
                  Type: {course.type}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 