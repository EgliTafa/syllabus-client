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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Course } from '../core/_models';

interface CourseSelectionDialogProps {
  availableCourses: Course[];
  selectedCourseIds: number[];
  onSelectionChange: (courseIds: number[]) => void;
}

export const CourseSelectionDialog = ({
  availableCourses,
  selectedCourseIds,
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

  const handleCourseSelection = (courseId: number) => {
    const newSelection = selectedCourseIds.includes(courseId)
      ? selectedCourseIds.filter(id => id !== courseId)
      : [...selectedCourseIds, courseId];
    onSelectionChange(newSelection);
  };

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
                  checked={filteredCourses.length > 0 && filteredCourses.every(course => selectedCourseIds.includes(course.id))}
                  indeterminate={
                    filteredCourses.some(course => selectedCourseIds.includes(course.id)) &&
                    !filteredCourses.every(course => selectedCourseIds.includes(course.id))
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelectionChange(Array.from(new Set([...selectedCourseIds, ...filteredCourses.map(c => c.id)])));
                    } else {
                      onSelectionChange(selectedCourseIds.filter(id => !filteredCourses.find(c => c.id === id)));
                    }
                  }}
                />
              </TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Credits</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCourseIds.includes(course.id)}
                    onChange={() => handleCourseSelection(course.id)}
                  />
                </TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.code}</TableCell>
                <TableCell>{course.semester}</TableCell>
                <TableCell>{course.credits}</TableCell>
              </TableRow>
            ))}
            {filteredCourses.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
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