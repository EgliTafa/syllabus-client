import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export const Register = () => {
  const navigate = useNavigate();
  const { registerUser, isFetching, error } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phonePrefix: '',
    phoneNumber: '',
    profilePictureUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      navigate('/');
    } catch (error) {
      // Error is handled by the auth hook
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 600
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid 
              sx={{
                width: {
                  xs: '100%',
                  sm: 'calc(50% - 8px)'
                }
              }}
            >
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid 
              sx={{
                width: {
                  xs: '100%',
                  sm: 'calc(50% - 8px)'
                }
              }}
            >
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid 
              sx={{
                width: '100%'
              }}
            >
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid 
              sx={{
                width: '100%'
              }}
            >
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid 
              sx={{
                width: {
                  xs: '100%',
                  sm: 'calc(33.33% - 8px)'
                }
              }}
            >
              <TextField
                fullWidth
                label="Phone Prefix"
                name="phonePrefix"
                value={formData.phonePrefix}
                onChange={handleChange}
                required
                margin="normal"
                placeholder="+355"
              />
            </Grid>
            <Grid 
              sx={{
                width: {
                  xs: '100%',
                  sm: 'calc(66.67% - 8px)'
                }
              }}
            >
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid 
              sx={{
                width: '100%'
              }}
            >
              <TextField
                fullWidth
                label="Profile Picture URL"
                name="profilePictureUrl"
                value={formData.profilePictureUrl}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isFetching}
            sx={{ mt: 3 }}
          >
            {isFetching ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login">
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}; 