import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Container, Button } from '@mui/material';

export const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Syllabus Management
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/syllabus"
          >
            Syllabuses
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/courses"
          >
            Courses
          </Button>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}; 