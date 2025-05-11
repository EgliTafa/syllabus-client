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
import { useGetAllSyllabuses } from '../hooks/useSyllabuses';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';

export const SyllabusList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Syllabuses</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/syllabus/create')}
        >
          Create Syllabus
        </Button>
      </Box>

      <Grid container spacing={3}>
        {syllabusList?.map((syllabus) => (
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