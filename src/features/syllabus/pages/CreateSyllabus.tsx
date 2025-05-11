import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { CreateSyllabusRequest, CreateCourseRequest } from '../core/_models';

export const CreateSyllabus = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [courses, setCourses] = useState<CreateCourseRequest[]>([]);
  const [newCourse, setNewCourse] = useState<CreateCourseRequest>({
    title: '',
    code: '',
    semester: 1,
    credits: 0
  });

  const handleAddCourse = () => {
    if (newCourse.title && newCourse.code) {
      setCourses([...courses, { ...newCourse }]);
      setNewCourse({
        title: '',
        code: '',
        semester: 1,
        credits: 0
      });
    }
  };

  const handleRemoveCourse = (index: number) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  const handleSubmit = async () => {
    if (!name || courses.length === 0) return;

    const syllabusData: CreateSyllabusRequest = {
      name,
      courses
    };

    // TODO: Implement API call to create syllabus
    console.log('Creating syllabus:', syllabusData);
    navigate('/syllabus');
  };

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
          Create New Syllabus
        </Typography>

        <TextField
          fullWidth
          label="Syllabus Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Add Courses
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Course Title"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Course Code"
            value={newCourse.code}
            onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Semester"
            type="number"
            value={newCourse.semester}
            onChange={(e) => setNewCourse({ ...newCourse, semester: parseInt(e.target.value) })}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Credits"
            type="number"
            value={newCourse.credits}
            onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
            margin="normal"
            fullWidth
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCourse}
            sx={{ mt: 2 }}
          >
            Add Course
          </Button>
        </Box>

        <List>
          {courses.map((course, index) => (
            <Box key={index}>
              <ListItem>
                <ListItemText
                  primary={course.title}
                  secondary={`Code: ${course.code} | Credits: ${course.credits} | Semester: ${course.semester}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveCourse(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < courses.length - 1 && <Divider />}
            </Box>
          ))}
        </List>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!name || courses.length === 0}
          >
            Create Syllabus
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}; 