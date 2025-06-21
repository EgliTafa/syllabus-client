import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Autocomplete,
  Popper,
  ClickAwayListener,
} from '@mui/material';
import { UserRole } from '../../auth/core/_models';
import { roleManagementApi } from '../api/roleManagementApi';
import { adminApi, SearchUserResponse } from '../api/adminApi';

const ALL_ROLES = [UserRole.Administrator, UserRole.Professor, UserRole.Student];

export const RoleManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUserResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<SearchUserResponse | null>(null);
  const [userId, setUserId] = useState('');
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Debounced search function
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length >= 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          setIsSearching(true);
          const results = await adminApi.searchUsers(searchQuery);
          setSearchResults(results);
        } catch (err: any) {
          console.error('Search error:', err);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300); // 300ms delay
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleUserSelect = async (user: SearchUserResponse | null) => {
    setSelectedUser(user);
    setSearchQuery(user ? `${user.firstName} ${user.lastName} (${user.email})` : '');
    
    if (user) {
      setUserId(user.id);
      try {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        setSuccess(`Selected user: ${user.firstName} ${user.lastName}`);
        // Get user roles
        const rolesResponse = await roleManagementApi.getUserRoles(user.id);
        setRoles(rolesResponse || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to get user roles');
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setUserId('');
      setRoles([]);
    }
  };

  const handleAssignRole = async (role: UserRole) => {
    if (!userId) {
      setError('Please select a user first');
      return;
    }

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
    if (!userId) {
      setError('Please select a user first');
      return;
    }

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom color="text.primary">
        Role Assignment
      </Typography>

      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom color="text.primary">
          Search and Select User
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Autocomplete
            options={searchResults}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
            value={selectedUser}
            onChange={(event, newValue) => handleUserSelect(newValue)}
            onInputChange={(event, newInputValue) => {
              // Extract just the search part, not the full display value
              if (!selectedUser || !newInputValue.includes(selectedUser.email)) {
                setSearchQuery(newInputValue);
              }
            }}
            loading={isSearching}
            filterOptions={(x) => x} // Disable built-in filtering since we're doing server-side search
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search users by name or email"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                color="primary"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <ListItem {...props}>
                <ListItemText
                  primary={`${option.firstName} ${option.lastName}`}
                  secondary={option.email}
                  primaryTypographyProps={{ color: 'text.primary' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            )}
            noOptionsText={searchQuery.length >= 2 ? "No users found" : "Type at least 2 characters to search"}
            sx={{
              '& .MuiAutocomplete-paper': {
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
              },
            }}
          />
        </Box>
        {selectedUser && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" color="text.primary">User ID: <b>{selectedUser.id}</b></Typography>
            <Typography variant="body1" color="text.primary">Name: <b>{selectedUser.firstName} {selectedUser.lastName}</b></Typography>
            <Typography variant="body1" color="text.primary">Email: <b>{selectedUser.email}</b></Typography>
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
  );
}; 