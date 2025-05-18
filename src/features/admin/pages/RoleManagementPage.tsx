import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import { UserRole } from '../../auth/core/_models';
import { roleManagementApi } from '../api/roleManagementApi';

const ALL_ROLES = [UserRole.Administrator, UserRole.Professor, UserRole.Student];

export const RoleManagementPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLookupUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      const response = await roleManagementApi.getUserByEmail(email);
      setUserId(response.userId);
      setSuccess(`Found user: ${response.email}`);
      // Get user roles
      const rolesResponse = await roleManagementApi.getUserRoles(response.userId);
      setRoles(rolesResponse || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to find user');
      setUserId('');
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignRole = async (role: UserRole) => {
    try {
      setError(null);
      setSuccess(null);
      await roleManagementApi.assignRole({ userId, role });
      setSuccess(`Successfully assigned ${role} role`);
      // Refresh roles
      const rolesResponse = await roleManagementApi.getUserRoles(userId);
      setRoles(rolesResponse || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign role');
    }
  };

  const handleRemoveRole = async (role: UserRole) => {
    try {
      setError(null);
      setSuccess(null);
      await roleManagementApi.removeRole({ userId, role });
      setSuccess(`Successfully removed ${role} role`);
      // Refresh roles
      const rolesResponse = await roleManagementApi.getUserRoles(userId);
      setRoles(rolesResponse || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove role');
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return Array.isArray(roles) && roles.includes(role);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          Role Management
        </Typography>

        <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom color="text.primary">
            Lookup User
          </Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="User Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              color="primary"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleLookupUser}
              disabled={!email || isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Lookup User'}
            </Button>
          </Box>
          {userId && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" color="text.primary">User ID: <b>{userId}</b></Typography>
              <Typography variant="body1" color="text.primary">Email: <b>{email}</b></Typography>
            </Box>
          )}
        </Paper>

        {userId && (
          <>
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom color="text.primary">
                Assign/Remove Roles
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {ALL_ROLES.map((role) => (
                  <Button
                    key={role}
                    variant={hasRole(role) ? 'outlined' : 'contained'}
                    color={hasRole(role) ? 'error' : 'primary'}
                    onClick={() => hasRole(role) ? handleRemoveRole(role) : handleAssignRole(role)}
                    disabled={isLoading}
                    sx={{ 
                      minWidth: 180,
                      '&:hover': {
                        bgcolor: hasRole(role) ? 'error.dark' : 'primary.dark'
                      }
                    }}
                  >
                    {hasRole(role) ? `Remove ${role}` : `Assign ${role}`}
                  </Button>
                ))}
              </Box>
            </Paper>

            <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom color="text.primary">
                Current User Roles
              </Typography>
              <List>
                {Array.isArray(roles) && roles.length > 0 ? roles.map((role) => (
                  <ListItem key={role}>
                    <ListItemText 
                      primary={role} 
                      primaryTypographyProps={{ color: 'text.primary' }}
                    />
                  </ListItem>
                )) : (
                  <ListItem>
                    <ListItemText 
                      primary="No roles assigned." 
                      primaryTypographyProps={{ color: 'text.secondary' }}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Box>
    </Container>
  );
}; 