import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  InputAdornment,
  Grid,
  Snackbar
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTheme } from '@mui/material/styles';
import { CountryPrefixDropdown } from '../../../components';

export const UserProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, handleUpdateProfile, handleChangePassword, isFetching, error, clearError } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [updateStatus, setUpdateStatus] = useState<{
    type: 'success' | 'error';
    message: string;
    show: boolean;
  }>({
    type: 'success',
    message: '',
    show: false
  });
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phonePrefix: user?.phonePrefix || '',
    phoneNumber: user?.phoneNumber || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrefixChange = (value: string) => {
    setProfileData(prev => ({
      ...prev,
      phonePrefix: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleUpdateProfile(profileData);
      setUpdateStatus({
        type: 'success',
        message: 'Profile updated successfully!',
        show: true
      });
    } catch (error: any) {
      setUpdateStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update profile. Please try again.',
        show: true
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    try {
      await handleChangePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      
      // Clear password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setUpdateStatus({
        type: 'success',
        message: 'Password changed successfully!',
        show: true
      });
    } catch (error: any) {
      setUpdateStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to change password. Please try again.',
        show: true
      });
    }
  };

  const handleCloseSnackbar = () => {
    setUpdateStatus(prev => ({ ...prev, show: false }));
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={4}>
          {/* Profile Information Section */}
          <Grid sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <form onSubmit={handleProfileSubmit}>
              <Grid container spacing={2}>
                <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    required
                    disabled={isFetching}
                  />
                </Grid>
                <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    required
                    disabled={isFetching}
                  />
                </Grid>
                <Grid sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                    disabled={isFetching}
                  />
                </Grid>
                <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <CountryPrefixDropdown
                    value={profileData.phonePrefix}
                    onChange={handlePrefixChange}
                    required
                    disabled={isFetching}
                  />
                </Grid>
                <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                    required
                    disabled={isFetching}
                  />
                </Grid>
                <Grid sx={{ width: '100%' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isFetching}
                    sx={{ mt: 2 }}
                  >
                    {isFetching ? <CircularProgress size={24} /> : 'Update Profile'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Change Password Section */}
          <Grid sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <form onSubmit={handlePasswordSubmit}>
              <Grid container spacing={2}>
                <Grid sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    error={!!validationErrors.currentPassword}
                    helperText={validationErrors.currentPassword}
                    required
                    disabled={isFetching}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            edge="end"
                            disabled={isFetching}
                          >
                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={!!validationErrors.newPassword}
                    helperText={validationErrors.newPassword}
                    required
                    disabled={isFetching}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                            disabled={isFetching}
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    error={!!validationErrors.confirmPassword}
                    helperText={validationErrors.confirmPassword}
                    required
                    disabled={isFetching}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            disabled={isFetching}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid sx={{ width: '100%' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isFetching}
                    sx={{ mt: 2 }}
                  >
                    {isFetching ? <CircularProgress size={24} /> : 'Change Password'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={updateStatus.show}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={updateStatus.type}
          sx={{ width: '100%' }}
        >
          {updateStatus.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 