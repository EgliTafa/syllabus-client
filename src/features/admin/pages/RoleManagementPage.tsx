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
      setRoles(rolesResponse.roles || []);
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
      const response = await roleManagementApi.getUserRoles(userId);
      setRoles(response.roles || []);
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
      const response = await roleManagementApi.getUserRoles(userId);
      setRoles(response.roles || []);
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
        <Typography variant="h4" component="h1" gutterBottom>
          Role Management
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Lookup User
          </Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="User Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
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
        </Paper>

        {userId && (
          <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Assign Administrator Role
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAssignRole(UserRole.Administrator)}
                  disabled={hasRole(UserRole.Administrator)}
                >
                  Assign Administrator Role
                </Button>
              </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Current User Roles
              </Typography>
              <List>
                {Array.isArray(roles) && roles.map((role) => (
                  <ListItem key={role}>
                    <ListItemText primary={role} />
                    <Chip
                      label="Remove"
                      color="error"
                      onClick={() => handleRemoveRole(role)}
                    />
                  </ListItem>
                ))}
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