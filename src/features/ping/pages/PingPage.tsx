import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { usePing } from '../hooks/usePing';
import { useAuth } from '../../auth/hooks/useAuth';

export const PingPage = () => {
  const { pingData, authenticatedPingData, isLoading, error, clearError, ping, authenticatedPing } = usePing();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError();
  }, [clearError]);

  const handlePing = async () => {
    try {
      await ping();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleAuthenticatedPing = async () => {
    try {
      await authenticatedPing();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        API Health Check
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Test the connectivity and health of the API endpoints.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {/* Public Ping */}
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Public API Ping
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Test basic API connectivity without authentication.
            </Typography>
            
            {pingData && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Message:</strong> {pingData.message}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Version:</strong> {pingData.version}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Timestamp:</strong> {formatTimestamp(pingData.timestamp)}
                </Typography>
              </Box>
            )}
          </CardContent>
          <CardActions>
            <Button 
              onClick={handlePing} 
              disabled={isLoading}
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={16} /> : null}
            >
              {isLoading ? 'Pinging...' : 'Ping API'}
            </Button>
          </CardActions>
        </Card>

        {/* Authenticated Ping */}
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Authenticated API Ping
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Test API connectivity with authentication.
            </Typography>
            
            {!isAuthenticated && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                You need to be logged in to test authenticated endpoints.
              </Alert>
            )}
            
            {authenticatedPingData && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Message:</strong> {authenticatedPingData.message}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Version:</strong> {authenticatedPingData.version}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Timestamp:</strong> {formatTimestamp(authenticatedPingData.timestamp)}
                </Typography>
                {authenticatedPingData.userId && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>User ID:</strong> {authenticatedPingData.userId}
                  </Typography>
                )}
                {authenticatedPingData.userEmail && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>User Email:</strong> {authenticatedPingData.userEmail}
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
          <CardActions>
            <Button 
              onClick={handleAuthenticatedPing} 
              disabled={isLoading || !isAuthenticated}
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={16} /> : null}
            >
              {isLoading ? 'Pinging...' : 'Ping Authenticated API'}
            </Button>
          </CardActions>
        </Card>
      </Box>

      {/* Status Summary */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Connection Status
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Typography variant="body2">
            <strong>Public API:</strong> {pingData ? '✅ Connected' : '❌ Not tested'}
          </Typography>
          <Typography variant="body2">
            <strong>Authenticated API:</strong> {authenticatedPingData ? '✅ Connected' : '❌ Not tested'}
          </Typography>
          <Typography variant="body2">
            <strong>Authentication Status:</strong> {isAuthenticated ? '✅ Logged in' : '❌ Not logged in'}
          </Typography>
          <Typography variant="body2">
            <strong>Last Test:</strong> {pingData || authenticatedPingData ? 'Just now' : 'Never'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}; 