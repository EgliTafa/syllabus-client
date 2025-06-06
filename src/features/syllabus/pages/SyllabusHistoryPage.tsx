import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGetAllSyllabuses } from '../hooks/useSyllabuses';
import { useDispatch } from 'react-redux';

export const SyllabusHistoryPage = () => {
  const { academicYear } = useParams<{ academicYear: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { syllabusList, isFetching, fetchAndUpdateSyllabuses } = useGetAllSyllabuses();

  useEffect(() => {
    fetchAndUpdateSyllabuses(dispatch);
  }, [fetchAndUpdateSyllabuses, dispatch]);

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const syllabusesForYear = syllabusList.filter(s => s.academicYear === academicYear);

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/syllabus')}
          sx={{ mr: 2 }}
        >
          Back to List
        </Button>
        <Typography variant="h4">
          Syllabuses for Academic Year {academicYear}
        </Typography>
      </Box>

      {syllabusesForYear.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No syllabuses found for this academic year.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {syllabusesForYear.map((syllabus) => (
            <Card
              key={syllabus.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6
                }
              }}
              onClick={() => navigate(`/syllabus/${syllabus.id}`)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {syllabus.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Academic Year: {syllabus.academicYear}
                </Typography>
                <Typography variant="body2">
                  {syllabus.courses.length} Courses
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}; 