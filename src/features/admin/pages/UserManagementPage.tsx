import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Block as BlockIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { adminApi, UpdateUserRequest } from '../api/adminApi';
import { CountryPrefixDropdown } from '../../../components/CountryPrefixDropdown';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emailConfirmed: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
  status: string;
  roles: string[];
}

interface CreateUserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phonePrefix: string;
  phoneNumber: string;
  role: string;
  profilePictureUrl?: string;
}

interface EditUserForm {
  firstName: string;
  lastName: string;
  email: string;
  phonePrefix: string;
  phoneNumber: string;
  role: string;
  profilePictureUrl?: string;
}

interface RevokeAccessForm {
  reason?: string;
  lockoutDurationDays?: number;
}

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Create user dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createUserForm, setCreateUserForm] = useState<CreateUserForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phonePrefix: '+355', // Default to Albania
    phoneNumber: '',
    role: 'Student',
  });

  // Edit user dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string>('');
  const [editUserForm, setEditUserForm] = useState<EditUserForm>({
    firstName: '',
    lastName: '',
    email: '',
    phonePrefix: '+355',
    phoneNumber: '',
    role: 'Student',
  });

  // Revoke access dialog
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [revokeForm, setRevokeForm] = useState<RevokeAccessForm>({
    reason: '',
    lockoutDurationDays: undefined,
  });

  const roles = ['Student', 'Professor', 'Administrator'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getAllUsers();
      setUsers(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setError(null);
      setSuccess(null);
      await adminApi.createUser(createUserForm);
      setSuccess('User created successfully');
      setCreateDialogOpen(false);
      setCreateUserForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phonePrefix: '+355',
        phoneNumber: '',
        role: 'Student',
      });
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleEditUser = async () => {
    try {
      setError(null);
      setSuccess(null);
      const updateData: UpdateUserRequest = {
        firstName: editUserForm.firstName,
        lastName: editUserForm.lastName,
        email: editUserForm.email,
        phonePrefix: editUserForm.phonePrefix,
        phoneNumber: editUserForm.phoneNumber,
        role: editUserForm.role,
        profilePictureUrl: editUserForm.profilePictureUrl,
      };
      await adminApi.updateUser(editingUserId, updateData);
      setSuccess('User updated successfully');
      setEditDialogOpen(false);
      setEditingUserId('');
      setEditUserForm({
        firstName: '',
        lastName: '',
        email: '',
        phonePrefix: '+355',
        phoneNumber: '',
        role: 'Student',
      });
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUserId(user.id);
    setEditUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phonePrefix: user.phoneNumber.split(' ')[0] || '+355',
      phoneNumber: user.phoneNumber.split(' ').slice(1).join(' ') || '',
      role: user.roles[0] || 'Student',
      profilePictureUrl: '',
    });
    setEditDialogOpen(true);
  };

  const handleRevokeAccess = async () => {
    try {
      setError(null);
      setSuccess(null);
      await adminApi.revokeUserAccess(selectedUserId, revokeForm);
      setSuccess('User access revoked successfully');
      setRevokeDialogOpen(false);
      setSelectedUserId('');
      setRevokeForm({ reason: '', lockoutDurationDays: undefined });
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to revoke user access');
    }
  };

  const handleRestoreAccess = async (userId: string) => {
    try {
      setError(null);
      setSuccess(null);
      await adminApi.restoreUserAccess(userId);
      setSuccess('User access restored successfully');
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to restore user access');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await adminApi.deleteUser(userId);
      setSuccess('User deleted successfully');
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const openRevokeDialog = (userId: string) => {
    setSelectedUserId(userId);
    setRevokeDialogOpen(true);
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    return phoneNumber || 'N/A';
  };

  const formatLockoutEnd = (lockoutEnd: string | null) => {
    if (!lockoutEnd) return 'Not locked';
    const date = new Date(lockoutEnd);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const isUserLocked = (user: User) => {
    return user.lockoutEnabled && user.lockoutEnd && new Date(user.lockoutEnd) > new Date();
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" color="text.primary">
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create User
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Email Confirmed</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatPhoneNumber(user.phoneNumber)}</TableCell>
                  <TableCell>
                    {user.roles.map((role) => (
                      <Chip
                        key={role}
                        label={role}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={isUserLocked(user) ? 'Locked' : user.status}
                      color={isUserLocked(user) ? 'error' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.emailConfirmed ? 'Yes' : 'No'}
                      color={user.emailConfirmed ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit User">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => openEditDialog(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {isUserLocked(user) ? (
                        <Tooltip title="Restore Access">
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => handleRestoreAccess(user.id)}
                          >
                            <RestoreIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Revoke Access">
                          <IconButton
                            color="warning"
                            size="small"
                            onClick={() => openRevokeDialog(user.id)}
                          >
                            <BlockIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete User">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="First Name"
              value={createUserForm.firstName}
              onChange={(e) => setCreateUserForm({ ...createUserForm, firstName: e.target.value })}
              required
            />
            <TextField
              label="Last Name"
              value={createUserForm.lastName}
              onChange={(e) => setCreateUserForm({ ...createUserForm, lastName: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={createUserForm.email}
              onChange={(e) => setCreateUserForm({ ...createUserForm, email: e.target.value })}
              required
            />
            <TextField
              label="Password"
              type="password"
              value={createUserForm.password}
              onChange={(e) => setCreateUserForm({ ...createUserForm, password: e.target.value })}
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: '40%' }}>
                <CountryPrefixDropdown
                  value={createUserForm.phonePrefix}
                  onChange={(value) => setCreateUserForm({ ...createUserForm, phonePrefix: value })}
                  label="Phone Prefix"
                  fullWidth={false}
                />
              </Box>
              <TextField
                label="Phone Number"
                value={createUserForm.phoneNumber}
                onChange={(e) => setCreateUserForm({ ...createUserForm, phoneNumber: e.target.value })}
                sx={{ width: '60%' }}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={createUserForm.role}
                label="Role"
                onChange={(e) => setCreateUserForm({ ...createUserForm, role: e.target.value })}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Profile Picture URL (Optional)"
              value={createUserForm.profilePictureUrl || ''}
              onChange={(e) => setCreateUserForm({ ...createUserForm, profilePictureUrl: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateUser} 
            variant="contained"
            disabled={!createUserForm.firstName || !createUserForm.lastName || !createUserForm.email || !createUserForm.password}
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="First Name"
              value={editUserForm.firstName}
              onChange={(e) => setEditUserForm({ ...editUserForm, firstName: e.target.value })}
              required
            />
            <TextField
              label="Last Name"
              value={editUserForm.lastName}
              onChange={(e) => setEditUserForm({ ...editUserForm, lastName: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={editUserForm.email}
              onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: '40%' }}>
                <CountryPrefixDropdown
                  value={editUserForm.phonePrefix}
                  onChange={(value) => setEditUserForm({ ...editUserForm, phonePrefix: value })}
                  label="Phone Prefix"
                  fullWidth={false}
                />
              </Box>
              <TextField
                label="Phone Number"
                value={editUserForm.phoneNumber}
                onChange={(e) => setEditUserForm({ ...editUserForm, phoneNumber: e.target.value })}
                sx={{ width: '60%' }}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editUserForm.role}
                label="Role"
                onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Profile Picture URL (Optional)"
              value={editUserForm.profilePictureUrl || ''}
              onChange={(e) => setEditUserForm({ ...editUserForm, profilePictureUrl: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleEditUser} 
            variant="contained"
            disabled={!editUserForm.firstName || !editUserForm.lastName || !editUserForm.email}
          >
            Update User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Revoke Access Dialog */}
      <Dialog open={revokeDialogOpen} onClose={() => setRevokeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Revoke User Access</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Reason (Optional)"
              multiline
              rows={3}
              value={revokeForm.reason || ''}
              onChange={(e) => setRevokeForm({ ...revokeForm, reason: e.target.value })}
            />
            <TextField
              label="Lockout Duration (Days, leave empty for permanent)"
              type="number"
              value={revokeForm.lockoutDurationDays || ''}
              onChange={(e) => setRevokeForm({ 
                ...revokeForm, 
                lockoutDurationDays: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              helperText="Leave empty for permanent lockout"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRevokeDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRevokeAccess} variant="contained" color="warning">
            Revoke Access
          </Button>
        </DialogActions>
      </Dialog>

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
    </Container>
  );
}; 