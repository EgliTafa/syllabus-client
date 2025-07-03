import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Pagination
} from '@mui/material';
import { useSyllabuses } from '../hooks/useSyllabuses';
import { useDepartments } from '../../departments/hooks/useDepartments';
import { usePrograms } from '../../programs/hooks/usePrograms';
import { Syllabus } from '../core/_models';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

export const SyllabusList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    syllabusList, 
    isFetching, 
    loadSyllabuses,
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage
  } = useSyllabuses();
  const { departments, isLoading: departmentsLoading } = useDepartments();
  const { programs, isLoading: programsLoading } = usePrograms();
  const { t } = useTranslation();

  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [programFilter, setProgramFilter] = useState<string>('');
  const [academicYearFilter, setAcademicYearFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadSyllabuses({
      page,
      pageSize,
      sortBy,
      sortDirection,
      searchTerm: debouncedSearchTerm || undefined,
      departmentId: departmentFilter ? parseInt(departmentFilter) : undefined,
      programId: programFilter ? parseInt(programFilter) : undefined,
      academicYear: academicYearFilter || undefined
    });
  }, [loadSyllabuses, page, pageSize, sortBy, sortDirection, debouncedSearchTerm, departmentFilter, programFilter, academicYearFilter]);

  // Get unique academic years from all programs' academic years
  const academicYears = useMemo(() => {
    const years = Array.from(
      new Set(
        programs.flatMap(p => (p.academicYears || []).map((ay: { academicYear: string }) => ay.academicYear)).filter(Boolean)
      )
    ).sort((a, b) => {
      const yearA = parseInt(a.split('-')[0]);
      const yearB = parseInt(b.split('-')[0]);
      return yearA - yearB;
    });
    return years;
  }, [programs]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [departmentFilter, programFilter, academicYearFilter, debouncedSearchTerm, sortBy, sortDirection]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

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

  // Use safe fallback values to avoid NaN
  const safeCurrentPage = currentPage || 1;
  const safePageSize = pageSize || 12;
  const safeTotalCount = totalCount || 0;

  const startItem = safeTotalCount === 0 ? 0 : (safeCurrentPage - 1) * safePageSize + 1;
  const endItem = safeTotalCount === 0 ? 0 : Math.min(safeCurrentPage * safePageSize, safeTotalCount);

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
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2 }}>
          <TextField
            fullWidth
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search syllabuses..."
            size="small"
          />
          <FormControl fullWidth>
            <InputLabel shrink>Department</InputLabel>
            <Select
              value={departmentFilter}
              label="Department"
              displayEmpty
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
            <InputLabel shrink>Program</InputLabel>
            <Select
              value={programFilter}
              label="Program"
              displayEmpty
              onChange={(e) => setProgramFilter(e.target.value)}
              disabled={!departmentFilter} // Disable if no department selected
            >
              <MenuItem value="">
                <em>All Programs</em>
              </MenuItem>
              {filteredPrograms.map((program) => (
                <MenuItem key={program.id} value={program.id.toString()}>
                  {program.name} ({(program.academicYears || []).map((ay: { academicYear: string }) => ay.academicYear).join(', ') || 'No years'})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel shrink>Academic Year</InputLabel>
            <Select
              value={academicYearFilter}
              label="Academic Year"
              displayEmpty
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
              setSearchTerm('');
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
        {t('courseList.showingResults', { 
          start: startItem, 
          end: endItem, 
          total: safeTotalCount 
        }) || `Showing ${startItem}-${endItem} of ${safeTotalCount} syllabuses`}
      </Typography>

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3,
          mb: 3
        }}
      >
        {(syllabusList || []).map((syllabus) => (
          <Card 
            key={syllabus.id}
            sx={{ 
              height: '100%',
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
                {syllabus.program.name} {syllabus.programAcademicYear ? `(${syllabus.programAcademicYear.academicYear})` : syllabus.program.academicYears?.[0] ? `(${syllabus.program.academicYears[0].academicYear})` : ''}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {syllabus.program.departmentName}
              </Typography>
              <Typography color="textSecondary">
                {t('syllabusList.courses', { count: syllabus.courses.length })}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {syllabusList.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            No syllabuses found matching the selected filters.
          </Typography>
        </Box>
      )}
    </Box>
  );
}; 