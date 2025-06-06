import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  CircularProgress,
  Chip
} from '@mui/material';
import { useGetAllSyllabuses } from '../hooks/useSyllabuses';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';

export const SyllabusList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get('year');
  const { syllabusList, isFetching, fetchAndUpdateSyllabuses } = useGetAllSyllabuses();

  useEffect(() => {
    fetchAndUpdateSyllabuses(dispatch);
  }, [dispatch]);

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const filteredSyllabuses = selectedYear
    ? syllabusList?.filter(syllabus => syllabus.academicYear === selectedYear)
    : syllabusList;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Syllabuses
            {selectedYear && (
              <Chip 
                label={selectedYear} 
                color="primary" 
                sx={{ ml: 2 }}
                onDelete={() => navigate('/syllabus')}
              />
            )}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/syllabus/create')}
        >
          Create Syllabus
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredSyllabuses?.map((syllabus) => (
          <Grid 
            key={syllabus.id}
            sx={{
              width: {
                xs: '100%',
                sm: '50%',
                md: '33.33%'
              },
              p: 1
            }}
          >
            <Card 
              sx={{ 
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
                  {syllabus.academicYear}
                </Typography>
                <Typography color="textSecondary">
                  {syllabus.courses.length} Courses
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 