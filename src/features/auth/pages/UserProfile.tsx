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
import { CountryPrefixDropdown, ProfilePictureUpload } from '../../../components';
import { useLockoutStatus } from '../../../hooks/useLockoutStatus';

export const UserProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, handleUpdateProfile, handleChangePassword, handleUploadProfilePicture, isFetching, error, clearError } = useAuth();
  const { isLockedOut } = useLockoutStatus();
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
    phoneNumber: user?.phoneNumber || '',
    profilePictureUrl: user?.profilePictureUrl || ''
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

  const handleProfilePictureUpload = async (file: File): Promise<string> => {
    try {
      const imageUrl = await handleUploadProfilePicture(file);
      
      // Update profile data with the new image URL
      setProfileData(prev => ({
        ...prev,
        profilePictureUrl: imageUrl
      }));

      setUpdateStatus({
        type: 'success',
        message: 'Profile picture updated successfully!',
        show: true
      });

      return imageUrl;
    } catch (error: any) {
      setUpdateStatus({
        type: 'error',
        message: error.message || 'Failed to upload profile picture. Please try again.',
        show: true
      });
      throw error;
    }
  };

  const handleProfilePictureRemove = () => {
    setProfileData(prev => ({
      ...prev,
      profilePictureUrl: ''
    }));
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
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Profile Picture Section */}
        <Box sx={{ width: { xs: '100%', md: '300px' }, flexShrink: 0 }}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Profile Picture
            </Typography>
            <ProfilePictureUpload
              currentImageUrl={profileData.profilePictureUrl || undefined}
              onImageUpload={handleProfilePictureUpload}
              onImageRemove={handleProfilePictureRemove}
              disabled={isFetching || isLockedOut}
              size="large"
              showPreview={false}
            />
          </Paper>
        </Box>

        {/* Profile Information Section */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <form onSubmit={handleProfileSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    required
                    disabled={isFetching || isLockedOut}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    required
                    disabled={isFetching || isLockedOut}
                  />
                </Box>
                
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                  disabled={isFetching || isLockedOut}
                />
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <CountryPrefixDropdown
                    value={profileData.phonePrefix}
                    onChange={handlePrefixChange}
                    required
                    disabled={isFetching || isLockedOut}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                    required
                    disabled={isFetching || isLockedOut}
                  />
                </Box>
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isFetching || isLockedOut}
                  sx={{ mt: 2, alignSelf: 'flex-start' }}
                >
                  {isFetching ? <CircularProgress size={24} /> : 'Update Profile'}
                </Button>
              </Box>
            </form>
          </Paper>

          {/* Change Password Section */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <form onSubmit={handlePasswordSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                  disabled={isFetching || isLockedOut}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                          disabled={isFetching || isLockedOut}
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
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
                    disabled={isFetching || isLockedOut}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                            disabled={isFetching || isLockedOut}
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
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
                    disabled={isFetching || isLockedOut}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            disabled={isFetching || isLockedOut}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isFetching || isLockedOut}
                  sx={{ mt: 2, alignSelf: 'flex-start' }}
                >
                  {isFetching ? <CircularProgress size={24} /> : 'Change Password'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Box>

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