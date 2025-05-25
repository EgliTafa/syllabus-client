import { useState } from 'react';
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleResetPassword, isFetching, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    token: searchParams.get('token') || '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear password error when user types
    if (name === 'newPassword' || name === 'confirmPassword') {
      setPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    // Validate token
    if (!formData.token) {
      setPasswordError('Invalid or missing reset token');
      return;
    }

    try {
      await handleResetPassword({
        token: formData.token,
        password: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      navigate('/login', { 
        state: { 
          message: 'Password has been reset successfully. Please login with your new password.' 
        }
      });
    } catch (error) {
      // Error is handled by the auth hook
    }
  };

  // If no token is present, show error
  if (!searchParams.get('token')) {
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
            maxWidth: 400
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            Invalid or missing reset token. Please request a new password reset link.
          </Alert>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to="/forgot-password"
              variant="contained"
              fullWidth
            >
              Request New Reset Link
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

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
          maxWidth: 400
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Reset Password
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {passwordError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {passwordError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
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
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            margin="normal"
            helperText="Password must be at least 8 characters long"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isFetching}
            sx={{ mt: 3 }}
          >
            {isFetching ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Remember your password?{' '}
            <Link 
              component={RouterLink} 
              to="/login"
              sx={{ 
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}; 