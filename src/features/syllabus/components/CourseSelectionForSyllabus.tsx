import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Course as SyllabusCourse, CreateCourseRequest } from '../core/_models';
import { Course as CoursesCourse } from '../../courses/core/_models';
import { CourseSelectionDialog } from './CourseSelectionDialog';
import { useCourses } from '../../courses/hooks/useCourses';
import { CreateCourseModal } from './CreateCourseModal';

interface CourseSelectionForSyllabusProps {
  selectedCourses: SyllabusCourse[];
  onCoursesChange: (courses: SyllabusCourse[]) => void;
}

interface SelectedCourse {
  courseId: number;
  year: number;
}

// Helper function to convert CoursesCourse to SyllabusCourse
const convertToSyllabusCourse = (course: CoursesCourse, year: number = 1): SyllabusCourse => {
  return {
    id: course.id,
    title: course.title,
    code: course.code,
    year: year,
    semester: course.semester,
    credits: course.credits,
    lectureHours: 0, // Default value since courses module doesn't have these
    seminarHours: 0,
    labHours: 0,
    practiceHours: 0,
    courseTypeLabel: course.courseTypeLabel || 'B',
    examMethod: course.examMethod || 'P',
    academicProgram: course.academicProgram,
    academicYear: course.academicYear,
    language: course.language,
    ethicsCode: course.ethicsCode,
    teachingFormat: course.teachingFormat,
    teachingPlan: course.teachingPlan,
    evaluationBreakdown: course.evaluationBreakdown,
    objective: course.objective,
    keyConcepts: course.keyConcepts,
    prerequisites: course.prerequisites,
    skillsAcquired: course.skillsAcquired,
    courseResponsible: course.courseResponsible,
    topics: course.topics,
    electiveGroup: null, // Default value
  };
};

// Helper function to convert CreateCourseRequest to SyllabusCourse
const convertCreateRequestToSyllabusCourse = (courseData: CreateCourseRequest): SyllabusCourse => {
  return {
    id: Date.now(), // Temporary ID for new courses
    title: courseData.title,
    code: courseData.code,
    year: courseData.year,
    semester: courseData.semester,
    credits: courseData.credits,
    lectureHours: courseData.lectureHours,
    seminarHours: courseData.seminarHours,
    labHours: courseData.labHours,
    practiceHours: courseData.practiceHours,
    courseTypeLabel: courseData.courseTypeLabel,
    examMethod: courseData.examMethod,
    electiveGroup: courseData.electiveGroup,
    // Set default values for other fields
    academicProgram: '',
    academicYear: '',
    language: '',
    ethicsCode: '',
    teachingFormat: '',
    objective: '',
    keyConcepts: '',
    prerequisites: '',
    skillsAcquired: '',
    courseResponsible: '',
    topics: [],
  };
};

export const CourseSelectionForSyllabus = ({
  selectedCourses,
  onCoursesChange,
}: CourseSelectionForSyllabusProps) => {
  const { courseList, isFetching, loadCourses, createNewCourse } = useCourses();
  const [isSelectionDialogOpen, setIsSelectionDialogOpen] = useState(false);
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [selectedCourseSelections, setSelectedCourseSelections] = useState<SelectedCourse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    // Update selected course selections when selectedCourses prop changes
    setSelectedCourseSelections(selectedCourses.map(course => ({ 
      courseId: course.id, 
      year: course.year 
    })));
  }, [selectedCourses]);

  const handleOpenSelectionDialog = () => {
    setIsSelectionDialogOpen(true);
  };

  const handleCloseSelectionDialog = () => {
    setIsSelectionDialogOpen(false);
    setSelectedCourseSelections(selectedCourses.map(course => ({ 
      courseId: course.id, 
      year: course.year 
    })));
  };

  const handleCourseSelectionChange = (selectedCourses: SelectedCourse[]) => {
    setSelectedCourseSelections(selectedCourses);
  };

  const handleConfirmSelection = () => {
    const newSelectedCourses = selectedCourseSelections.map(selection => {
      const course = courseList.find(c => c.id === selection.courseId);
      if (course) {
        return convertToSyllabusCourse(course, selection.year);
      }
      return null;
    }).filter(Boolean) as SyllabusCourse[];
    
    onCoursesChange(newSelectedCourses);
    setIsSelectionDialogOpen(false);
  };

  const handleRemoveCourse = (courseId: number) => {
    const updatedCourses = selectedCourses.filter(course => course.id !== courseId);
    onCoursesChange(updatedCourses);
  };

  const handleCreateNewCourse = async (courseData: CreateCourseRequest) => {
    try {
      // For new courses created in syllabus context, we don't need to call the courses API
      // since they're specific to this syllabus. We'll convert directly to syllabus format.
      const syllabusCourse = convertCreateRequestToSyllabusCourse(courseData);
      onCoursesChange([...selectedCourses, syllabusCourse]);
      setIsCreateCourseModalOpen(false);
    } catch (error) {
      console.error('Failed to create course:', error);
      setError('Failed to create course. Please try again.');
    }
  };

  const availableCourses = courseList.filter(
    course => !selectedCourses.some(selected => selected.id === course.id)
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Selected Courses</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOpenSelectionDialog}
            sx={{ mr: 1 }}
          >
            Add Existing Course
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateCourseModalOpen(true)}
          >
            Create New Course
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {selectedCourses.length === 0 ? (
        <Paper sx={{ 
          p: 3, 
          textAlign: 'center', 
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider'
        }}>
          <Typography color="textSecondary">
            No courses selected. Click "Add Existing Course" to select from available courses or "Create New Course" to add a new one.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {/* Group courses by year */}
          {[1, 2, 3].map(year => {
            const yearCourses = selectedCourses.filter(course => course.year === year);
            const yearCredits = yearCourses.reduce((sum, course) => sum + course.credits, 0);
            
            if (yearCourses.length === 0) return null;
            
            return (
              <Paper key={year} sx={{ 
                mb: 2, 
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider'
              }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  borderTopLeftRadius: 1,
                  borderTopRightRadius: 1
                }}>
                  <Typography variant="h6">
                    Year {year} - {yearCourses.length} courses ({yearCredits} credits)
                  </Typography>
                </Box>
                
                <List sx={{ py: 0 }}>
                  {yearCourses.map((course, index) => (
                    <Box key={course.id}>
                      <ListItem sx={{ 
                        py: 1.5,
                        px: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                            {index + 1}. {course.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Code: {course.code} | Semester: {course.semester} | Credits: {course.credits}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip 
                              label={`Type: ${course.courseTypeLabel || 'B'}`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={`Exam: ${course.examMethod || 'P'}`} 
                              size="small" 
                              color="secondary" 
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            {course.electiveGroup && (
                              <Chip 
                                label={course.electiveGroup} 
                                size="small" 
                                color="success" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            onClick={() => handleRemoveCourse(course.id)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < yearCourses.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </Paper>
            );
          })}
          
          {/* Overall summary */}
          <Paper sx={{ 
            p: 2, 
            bgcolor: 'success.main', 
            color: 'white',
            textAlign: 'center'
          }}>
            <Typography variant="h6">
              Total: {selectedCourses.length} courses ({selectedCourses.reduce((sum, course) => sum + course.credits, 0)} credits)
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Course Selection Dialog */}
      <Dialog 
        open={isSelectionDialogOpen} 
        onClose={handleCloseSelectionDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Courses to Add</DialogTitle>
        <DialogContent>
          {isFetching ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <CourseSelectionDialog
              availableCourses={availableCourses}
              selectedCourses={selectedCourseSelections}
              onSelectionChange={handleCourseSelectionChange}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSelectionDialog}>Cancel</Button>
          <Button onClick={handleConfirmSelection} variant="contained">
            Add Selected Courses
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create New Course Modal */}
      <CreateCourseModal
        open={isCreateCourseModalOpen}
        onClose={() => setIsCreateCourseModalOpen(false)}
        onSubmit={handleCreateNewCourse}
      />
    </Box>
  );
}; 