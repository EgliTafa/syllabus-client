import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  Pagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Stack,
  Chip
} from '@mui/material';
import { useCourses } from '../hooks/useCourses';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

export const CourseList = () => {
  const navigate = useNavigate();
  const { 
    courseList, 
    isFetching, 
    loadCourses,
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage
  } = useCourses();
  const { t } = useTranslation();

  // Local state for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadCourses({
      page,
      pageSize,
      sortBy,
      sortDirection,
      searchTerm: searchTerm || undefined
    });
  }, [loadCourses, page, pageSize, sortBy, sortDirection, searchTerm]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
    setPage(1); // Reset to first page when sorting changes
  };

  const handleSortDirectionChange = (event: SelectChangeEvent) => {
    setSortDirection(event.target.value as 'asc' | 'desc');
    setPage(1); // Reset to first page when sorting changes
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Search is already handled by useEffect
  };

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Use safe fallback values to avoid NaN
  const safeCurrentPage = currentPage || 1;
  const safePageSize = pageSize || 10;
  const safeTotalCount = totalCount || 0;

  const startItem = safeTotalCount === 0 ? 0 : (safeCurrentPage - 1) * safePageSize + 1;
  const endItem = safeTotalCount === 0 ? 0 : Math.min(safeCurrentPage * safePageSize, safeTotalCount);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{t('courseList.title')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/courses/create')}
        >
          {t('courseList.createCourse')}
        </Button>
      </Box>

      {/* Search and Filters */}
      <Box mb={3}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} alignItems="center">
          <Box flex={1} width="100%">
            <form onSubmit={handleSearchSubmit}>
              <TextField
                fullWidth
                placeholder={t('courseList.searchPlaceholder') || "Search courses..."}
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </form>
          </Box>
          <Box minWidth={{ xs: '100%', md: '200px' }}>
            <FormControl fullWidth>
              <InputLabel>{t('courseList.sortBy') || "Sort by"}</InputLabel>
              <Select
                value={sortBy}
                label={t('courseList.sortBy') || "Sort by"}
                onChange={handleSortByChange}
              >
                <MenuItem value="title">{t('courseList.title') || "Title"}</MenuItem>
                <MenuItem value="code">{t('courseList.code') || "Code"}</MenuItem>
                <MenuItem value="semester">{t('courseList.semester') || "Semester"}</MenuItem>
                <MenuItem value="credits">{t('courseList.credits') || "Credits"}</MenuItem>
                <MenuItem value="year">{t('courseList.year') || "Year"}</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box minWidth={{ xs: '100%', md: '200px' }}>
            <FormControl fullWidth>
              <InputLabel>{t('courseList.sortDirection') || "Direction"}</InputLabel>
              <Select
                value={sortDirection}
                label={t('courseList.sortDirection') || "Direction"}
                onChange={handleSortDirectionChange}
              >
                <MenuItem value="asc">{t('courseList.ascending') || "Ascending"}</MenuItem>
                <MenuItem value="desc">{t('courseList.descending') || "Descending"}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Results Summary */}
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          {t('courseList.showingResults', { 
            start: startItem, 
            end: endItem, 
            total: safeTotalCount 
          }) || `Showing ${startItem}-${endItem} of ${safeTotalCount} courses`}
        </Typography>
        {searchTerm && (
          <Chip 
            label={`Search: "${searchTerm}"`} 
            onDelete={() => setSearchTerm('')}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {/* Course Grid */}
      <Box 
        display="grid" 
        gridTemplateColumns={{
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        }}
        gap={3}
        mb={3}
      >
        {(courseList || []).map((course) => (
          <Card 
            key={course.id}
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
                {t('courseList.semester')}: {course.semester}
              </Typography>
              <Typography variant="body2">
                {t('courseList.credits')}: {course.credits}
              </Typography>
              <Typography variant="body2">
                {t('courseList.type')}: {course.type}
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
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* No Results */}
      {((courseList || []).length === 0) && !isFetching && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm 
              ? t('courseList.noSearchResults') || "No courses found matching your search."
              : t('courseList.noCourses') || "No courses available."
            }
          </Typography>
          {searchTerm && (
            <Button 
              variant="outlined" 
              onClick={() => setSearchTerm('')}
              sx={{ mt: 2 }}
            >
              {t('courseList.clearSearch') || "Clear Search"}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}; 