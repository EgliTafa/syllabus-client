import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Course } from '../../courses/core/_models';

interface SelectedCourse {
  courseId: number;
  year: number;
}

interface CourseSelectionDialogProps {
  availableCourses: Course[];
  selectedCourses: SelectedCourse[];
  onSelectionChange: (selectedCourses: SelectedCourse[]) => void;
}

export const CourseSelectionDialog = ({
  availableCourses,
  selectedCourses,
  onSelectionChange,
}: CourseSelectionDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(availableCourses);

  useEffect(() => {
    const filtered = availableCourses.filter(
      course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, availableCourses]);

  const isCourseSelected = (courseId: number) => {
    return selectedCourses.some(sc => sc.courseId === courseId);
  };

  const getSelectedYear = (courseId: number) => {
    const selected = selectedCourses.find(sc => sc.courseId === courseId);
    return selected ? selected.year : 1;
  };

  const handleCourseSelection = (courseId: number, checked: boolean) => {
    if (checked) {
      // Add course with default year 1
      const newSelection = [...selectedCourses, { courseId, year: 1 }];
      onSelectionChange(newSelection);
    } else {
      // Remove course
      const newSelection = selectedCourses.filter(sc => sc.courseId !== courseId);
      onSelectionChange(newSelection);
    }
  };

  const handleYearChange = (courseId: number, year: number) => {
    const newSelection = selectedCourses.map(sc => 
      sc.courseId === courseId ? { ...sc, year } : sc
    );
    onSelectionChange(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Add all filtered courses with default year 1
      const newSelection = [
        ...selectedCourses,
        ...filteredCourses
          .filter(course => !isCourseSelected(course.id))
          .map(course => ({ courseId: course.id, year: 1 }))
      ];
      onSelectionChange(newSelection);
    } else {
      // Remove all filtered courses
      const newSelection = selectedCourses.filter(sc => 
        !filteredCourses.find(course => course.id === sc.courseId)
      );
      onSelectionChange(newSelection);
    }
  };

  const selectedFilteredCount = filteredCourses.filter(course => isCourseSelected(course.id)).length;
  const allFilteredSelected = filteredCourses.length > 0 && filteredCourses.every(course => isCourseSelected(course.id));

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search courses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allFilteredSelected}
                  indeterminate={selectedFilteredCount > 0 && !allFilteredSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Year</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isCourseSelected(course.id)}
                    onChange={(e) => handleCourseSelection(course.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.code}</TableCell>
                <TableCell>{course.semester}</TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell>{course.type || 'Mandatory'}</TableCell>
                <TableCell>
                  {isCourseSelected(course.id) ? (
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <Select
                        value={getSelectedYear(course.id)}
                        onChange={(e) => handleYearChange(course.id, e.target.value as number)}
                        displayEmpty
                      >
                        <MenuItem value={1}>Year 1</MenuItem>
                        <MenuItem value={2}>Year 2</MenuItem>
                        <MenuItem value={3}>Year 3</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      -
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredCourses.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">
                    No courses found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 