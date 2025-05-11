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
  Divider
} from '@mui/material';
import { useGetSyllabusById } from '../hooks/useSyllabuses';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { Course } from '../core/_models';

export const SyllabusDetails = () => {
  const { syllabusId } = useParams<{ syllabusId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedSyllabus, isFetching, fetchAndUpdateSyllabusById } = useGetSyllabusById(
    syllabusId ? parseInt(syllabusId) : undefined
  );

  useEffect(() => {
    if (syllabusId) {
      fetchAndUpdateSyllabusById(parseInt(syllabusId), dispatch);
    }
  }, [syllabusId, dispatch]);

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedSyllabus) {
    return (
      <Box p={3}>
        <Typography variant="h5">Syllabus not found</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/syllabus')}
        sx={{ mb: 3 }}
      >
        Back to List
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {selectedSyllabus.name}
        </Typography>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Courses
        </Typography>

        <List>
          {selectedSyllabus.courses.map((course: Course, index: number) => (
            <Box key={course.id}>
              <ListItem>
                <ListItemText
                  primary={course.title}
                  secondary={`Code: ${course.code} | Credits: ${course.credits} | Semester: ${course.semester}`}
                />
              </ListItem>
              {index < selectedSyllabus.courses.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
}; 