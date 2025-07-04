import { useState, useEffect } from 'react';
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
  Grid,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { CountryPrefixDropdown, ProfilePictureUpload } from '../../../components';
import { authApi } from '../api/authApi';

export const Register = () => {
  const navigate = useNavigate();
  const { handleRegister, isFetching, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phonePrefix: '',
    phoneNumber: '',
    profilePictureUrl: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    // Clear any existing errors and loading states when component mounts
    clearError();
    setLocalLoading(false);
    
    // Cleanup function to clear errors and loading states when component unmounts
    return () => {
      clearError();
      setLocalLoading(false);
    };
  }, [clearError]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phonePrefix.trim()) {
      errors.phonePrefix = 'Phone prefix is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{6,15}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const handlePrefixChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      phonePrefix: value
    }));
    // Clear validation error when user selects
    if (validationErrors.phonePrefix) {
      setValidationErrors(prev => ({
        ...prev,
        phonePrefix: ''
      }));
    }
  };

  const handleProfilePictureUpload = async (file: File): Promise<string> => {
    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
      });

      const response = await authApi.uploadProfilePicture(base64, file.name, file.type);
      
      // Update form data with the profile picture URL
      setFormData(prev => ({
        ...prev,
        profilePictureUrl: response.profilePictureUrl
      }));

      return response.profilePictureUrl;
    } catch (error: any) {
      let errorMessage = "Profile picture upload failed";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.message || "Invalid file format or size.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage =
              error.response.data?.message || "Profile picture upload failed. Please try again.";
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check your internet connection.";
      }

      throw new Error(errorMessage);
    }
  };

  const handleProfilePictureRemove = () => {
    setFormData(prev => ({
      ...prev,
      profilePictureUrl: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLocalLoading(true);
      await handleRegister({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phonePrefix: formData.phonePrefix,
        phoneNumber: formData.phoneNumber,
        profilePictureUrl: formData.profilePictureUrl || undefined
      });
    } catch (error) {
      // Error is handled by the auth hook
    } finally {
      setLocalLoading(false);
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
          maxWidth: 700
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
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
            {/* Left column - Profile picture */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <ProfilePictureUpload
                currentImageUrl={formData.profilePictureUrl || undefined}
                onImageUpload={handleProfilePictureUpload}
                onImageRemove={handleProfilePictureRemove}
                disabled={localLoading}
                size="large"
                showPreview={false}
              />
            </Box>

            {/* Right column - Form fields */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!validationErrors.firstName}
                  helperText={validationErrors.firstName}
                  required
                  disabled={localLoading}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!validationErrors.lastName}
                  helperText={validationErrors.lastName}
                  required
                  disabled={localLoading}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                required
                disabled={localLoading}
              />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <CountryPrefixDropdown
                  value={formData.phonePrefix}
                  onChange={handlePrefixChange}
                  error={!!validationErrors.phonePrefix}
                  helperText={validationErrors.phonePrefix}
                  required
                  disabled={localLoading}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={!!validationErrors.phoneNumber}
                  helperText={validationErrors.phoneNumber}
                  required
                  placeholder="1234567890"
                  disabled={localLoading}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                required
                disabled={localLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={localLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
                required
                disabled={localLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        disabled={localLoading}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={localLoading}
            sx={{ mt: 3 }}
          >
            {localLoading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/login"
              onClick={() => setLocalLoading(false)}
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