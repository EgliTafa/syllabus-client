import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  CircularProgress,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper
} from '@mui/material';
import { useGetAllSyllabuses } from '../hooks/useSyllabuses';
import { useDepartments } from '../../departments/hooks/useDepartments';
import { usePrograms } from '../../programs/hooks/usePrograms';
import { Syllabus } from '../core/_models';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

export const SyllabusList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { syllabusList, isFetching, fetchAndUpdateSyllabuses } = useGetAllSyllabuses();
  const { departments, isLoading: departmentsLoading } = useDepartments();
  const { programs, isLoading: programsLoading } = usePrograms();
  const { t } = useTranslation();

  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [programFilter, setProgramFilter] = useState<string>('');
  const [academicYearFilter, setAcademicYearFilter] = useState<string>('');

  useEffect(() => {
    fetchAndUpdateSyllabuses(dispatch);
  }, [dispatch]);

  // Get unique academic years from programs
  const academicYears = useMemo(() => {
    const years = Array.from(new Set(programs.map(p => p.academicYear)))
      .sort((a, b) => {
        const yearA = parseInt(a.split('-')[0]);
        const yearB = parseInt(b.split('-')[0]);
        return yearA - yearB;
      });
    return years;
  }, [programs]);

  // Filter syllabuses based on selected filters
  const filteredSyllabuses = useMemo(() => {
    return syllabusList.filter(syllabus => {
      const matchesDepartment = !departmentFilter || syllabus.program.departmentId.toString() === departmentFilter;
      const matchesProgram = !programFilter || syllabus.program.id.toString() === programFilter;
      const matchesAcademicYear = !academicYearFilter || syllabus.program.academicYear === academicYearFilter;
      
      return matchesDepartment && matchesProgram && matchesAcademicYear;
    });
  }, [syllabusList, departmentFilter, programFilter, academicYearFilter]);

  // Get programs filtered by selected department
  const filteredPrograms = useMemo(() => {
    if (!departmentFilter) return programs;
    return programs.filter(program => program.departmentId.toString() === departmentFilter);
  }, [programs, departmentFilter]);

  if (isFetching || departmentsLoading || programsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{t('syllabusList.title')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/syllabus/create')}
        >
          {t('syllabusList.create')}
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              value={departmentFilter}
              label="Department"
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setProgramFilter(''); // Reset program filter when department changes
              }}
            >
              <MenuItem value="">
                <em>All Departments</em>
              </MenuItem>
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.id.toString()}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Program</InputLabel>
            <Select
              value={programFilter}
              label="Program"
              onChange={(e) => setProgramFilter(e.target.value)}
              disabled={!departmentFilter} // Disable if no department selected
            >
              <MenuItem value="">
                <em>All Programs</em>
              </MenuItem>
              {filteredPrograms.map((program) => (
                <MenuItem key={program.id} value={program.id.toString()}>
                  {program.name} ({program.academicYear})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Academic Year</InputLabel>
            <Select
              value={academicYearFilter}
              label="Academic Year"
              onChange={(e) => setAcademicYearFilter(e.target.value)}
            >
              <MenuItem value="">
                <em>All Years</em>
              </MenuItem>
              {academicYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={() => {
              setDepartmentFilter('');
              setProgramFilter('');
              setAcademicYearFilter('');
            }}
            sx={{ height: '56px' }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {/* Results count */}
      <Typography variant="body2" color="textSecondary" mb={2}>
        Showing {filteredSyllabuses.length} of {syllabusList.length} syllabuses
      </Typography>

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
                  {syllabus.program.name} ({syllabus.program.academicYear})
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {syllabus.program.departmentName}
                </Typography>
                <Typography color="textSecondary">
                  {t('syllabusList.courses', { count: syllabus.courses.length })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredSyllabuses.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            No syllabuses found matching the selected filters.
          </Typography>
        </Box>
      )}
    </Box>
  );
}; 