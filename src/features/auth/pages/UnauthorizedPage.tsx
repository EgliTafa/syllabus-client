import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Button, 
  Typography, 
  Box, 
  Container, 
  Paper,
  Alert,
  AlertTitle,
  Chip
} from '@mui/material';
import { 
  Block as BlockIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  ContactSupport as ContactSupportIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../core/_models';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Get additional context from navigation state
  const requiredRoles = location.state?.requiredRoles as UserRole[] | undefined;
  const userRoles = location.state?.userRoles as UserRole[] | undefined;
  const requireAll = location.state?.requireAll as boolean | undefined;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleContactSupport = () => {
    // You can implement this to open a support form or email
    window.open('mailto:support@university.edu?subject=Access Request', '_blank');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            width: '100%',
            maxWidth: 600
          }}
        >
          <BlockIcon sx={{ fontSize: 64, color: 'error.main' }} />
          
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Access Denied
          </Typography>
          
          <Alert severity="warning" sx={{ width: '100%' }}>
            <AlertTitle>Insufficient Permissions</AlertTitle>
            You don't have the required permissions to access this page.
          </Alert>

          {/* Show role information if available */}
          {(requiredRoles || userRoles) && (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              {requiredRoles && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Required {requireAll ? 'all of' : 'any of'} these roles:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {requiredRoles.map((role) => (
                      <Chip 
                        key={role} 
                        label={role} 
                        color="primary" 
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {userRoles && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Your current roles:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {userRoles.length > 0 ? (
                      userRoles.map((role) => (
                        <Chip 
                          key={role} 
                          label={role} 
                          color="secondary" 
                          size="small"
                        />
                      ))
                    ) : (
                      <Chip 
                        label="No roles assigned" 
                        color="error" 
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          <Typography variant="body1" color="text.secondary" align="center">
            The page you're trying to access requires specific permissions that your account doesn't have. 
            Please contact your administrator if you believe this is an error.
          </Typography>

          {location.state?.from && (
            <Typography variant="body2" color="text.secondary" align="center">
              Attempted to access: <strong>{location.state.from.pathname}</strong>
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
            >
              Go Back
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
            >
              Go Home
            </Button>
            
            <Button
              variant="contained"
              startIcon={<ContactSupportIcon />}
              onClick={handleContactSupport}
            >
              Contact Support
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}; 