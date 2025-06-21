import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Block as BlockIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { adminApi, UpdateUserRequest } from '../api/adminApi';
import { CountryPrefixDropdown, ProfilePictureUpload } from '../../../components';
import { decodeToken } from '../../../utils/jwtUtils';
import { authApi } from '../../auth/api/authApi';

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
  profilePictureUrl?: string;
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
  const { t } = useTranslation();
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

  // Get current user info from JWT
  const token = localStorage.getItem('token');
  const currentUser = token ? decodeToken(token) : null;
  const currentUserId = currentUser?.sub || currentUser?.id || '';
  const currentUserEmail = currentUser?.email || '';

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
      setError(err.response?.data?.message || t('userManagement.failedToFetch'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setError(null);
      setSuccess(null);
      await adminApi.createUser(createUserForm);
      setSuccess(t('userManagement.userCreated'));
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
      setError(err.response?.data?.message || t('userManagement.failedToCreate'));
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
      setSuccess(t('userManagement.userUpdated'));
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
      setError(err.response?.data?.message || t('userManagement.failedToUpdate'));
    }
  };

  const openEditDialog = (user: User) => {
    // Parse phone number: backend sends it as "prefix+number" (e.g., "+355123456789")
    let phonePrefix = '+355'; // Default to Albania
    let phoneNumber = '';
    
    if (user.phoneNumber) {
      // Try to find a known prefix in the phone number
      const knownPrefixes = ['+355', '+1', '+44', '+33', '+49', '+39', '+34', '+30', '+31', '+32', '+43', '+45', '+46', '+47', '+48', '+351', '+352', '+353', '+354', '+356', '+357', '+358', '+359', '+36', '+370', '+371', '+372', '+373', '+374', '+375', '+376', '+377', '+378', '+380', '+381', '+382', '+383', '+385', '+386', '+387', '+389', '+420', '+421', '+423'];
      
      for (const prefix of knownPrefixes) {
        if (user.phoneNumber.startsWith(prefix)) {
          phonePrefix = prefix;
          phoneNumber = user.phoneNumber.substring(prefix.length);
          break;
        }
      }
      
      // If no known prefix found, assume it's just a number
      if (!phoneNumber) {
        phoneNumber = user.phoneNumber;
      }
    }

    setEditingUserId(user.id);
    setEditUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phonePrefix: phonePrefix,
      phoneNumber: phoneNumber,
      role: user.roles[0] || 'Student',
      profilePictureUrl: user.profilePictureUrl || '',
    });
    setEditDialogOpen(true);
  };

  const handleRevokeAccess = async () => {
    try {
      setError(null);
      setSuccess(null);
      await adminApi.revokeUserAccess(selectedUserId, revokeForm);
      setSuccess(t('userManagement.accessRevoked'));
      setRevokeDialogOpen(false);
      setSelectedUserId('');
      setRevokeForm({ reason: '', lockoutDurationDays: undefined });
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || t('userManagement.failedToRevoke'));
    }
  };

  const handleRestoreAccess = async (userId: string) => {
    try {
      setError(null);
      setSuccess(null);
      await adminApi.restoreUserAccess(userId);
      setSuccess(t('userManagement.accessRestored'));
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || t('userManagement.failedToRestore'));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm(t('userManagement.deleteConfirmation'))) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await adminApi.deleteUser(userId);
      setSuccess(t('userManagement.userDeleted'));
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || t('userManagement.failedToDelete'));
    }
  };

  const openRevokeDialog = (userId: string) => {
    setSelectedUserId(userId);
    setRevokeDialogOpen(true);
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    return phoneNumber || t('userManagement.nA');
  };

  const formatLockoutEnd = (lockoutEnd: string | null) => {
    if (!lockoutEnd) return t('userManagement.notLocked');
    const date = new Date(lockoutEnd);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const isUserLocked = (user: User) => {
    return user.lockoutEnabled && user.lockoutEnd && new Date(user.lockoutEnd) > new Date();
  };

  // Filter out the current user from the users list
  const filteredUsers = users.filter(
    (user) => user.id !== currentUserId && user.email !== currentUserEmail
  );

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

  const handleCreateProfilePictureUpload = async (file: File): Promise<string> => {
    const imageUrl = await handleProfilePictureUpload(file);
    setCreateUserForm(prev => ({
      ...prev,
      profilePictureUrl: imageUrl
    }));
    return imageUrl;
  };

  const handleEditProfilePictureUpload = async (file: File): Promise<string> => {
    const imageUrl = await handleProfilePictureUpload(file);
    setEditUserForm(prev => ({
      ...prev,
      profilePictureUrl: imageUrl
    }));
    return imageUrl;
  };

  const handleCreateProfilePictureRemove = () => {
    setCreateUserForm(prev => ({
      ...prev,
      profilePictureUrl: ''
    }));
  };

  const handleEditProfilePictureRemove = () => {
    setEditUserForm(prev => ({
      ...prev,
      profilePictureUrl: ''
    }));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" color="text.primary">
          {t('userManagement.title')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          {t('userManagement.createUser')}
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
                <TableCell>{t('userManagement.profilePicture')}</TableCell>
                <TableCell>{t('userManagement.name')}</TableCell>
                <TableCell>{t('userManagement.email')}</TableCell>
                <TableCell>{t('userManagement.phoneNumber')}</TableCell>
                <TableCell>{t('userManagement.roles')}</TableCell>
                <TableCell>{t('userManagement.status')}</TableCell>
                <TableCell>{t('userManagement.emailConfirmed')}</TableCell>
                <TableCell>{t('userManagement.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar
                      src={user.profilePictureUrl || undefined}
                      alt={`${user.firstName} ${user.lastName}`}
                      sx={{ width: 40, height: 40 }}
                    >
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </Avatar>
                  </TableCell>
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
                      label={isUserLocked(user) ? t('userManagement.locked') : user.status}
                      color={isUserLocked(user) ? 'error' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.emailConfirmed ? t('userManagement.yes') : t('userManagement.no')}
                      color={user.emailConfirmed ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title={t('userManagement.editUser')}>
                        <span>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => openEditDialog(user)}
                          >
                            <EditIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      {isUserLocked(user) ? (
                        <Tooltip title={t('userManagement.restoreAccess')}>
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => handleRestoreAccess(user.id)}
                          >
                            <RestoreIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title={t('userManagement.revokeAccess')}>
                          <IconButton
                            color="warning"
                            size="small"
                            onClick={() => openRevokeDialog(user.id)}
                          >
                            <BlockIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={t('userManagement.deleteUser')}>
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
        <DialogTitle>{t('userManagement.createUser')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label={t('userManagement.firstName')}
              value={createUserForm.firstName}
              onChange={(e) => setCreateUserForm({ ...createUserForm, firstName: e.target.value })}
              required
            />
            <TextField
              label={t('userManagement.lastName')}
              value={createUserForm.lastName}
              onChange={(e) => setCreateUserForm({ ...createUserForm, lastName: e.target.value })}
              required
            />
            <TextField
              label={t('userManagement.email')}
              type="email"
              value={createUserForm.email}
              onChange={(e) => setCreateUserForm({ ...createUserForm, email: e.target.value })}
              required
            />
            <TextField
              label={t('userManagement.password')}
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
                  label={t('userManagement.phonePrefix')}
                  fullWidth={false}
                />
              </Box>
              <TextField
                label={t('userManagement.phoneNumber')}
                value={createUserForm.phoneNumber}
                onChange={(e) => setCreateUserForm({ ...createUserForm, phoneNumber: e.target.value })}
                sx={{ width: '60%' }}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>{t('userManagement.role')}</InputLabel>
              <Select
                value={createUserForm.role}
                label={t('userManagement.role')}
                onChange={(e) => setCreateUserForm({ ...createUserForm, role: e.target.value })}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ProfilePictureUpload
              currentImageUrl={createUserForm.profilePictureUrl || undefined}
              onImageUpload={handleCreateProfilePictureUpload}
              onImageRemove={handleCreateProfilePictureRemove}
              disabled={false}
              size="medium"
              showPreview={false}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleCreateUser} 
            variant="contained"
            disabled={!createUserForm.firstName || !createUserForm.lastName || !createUserForm.email || !createUserForm.password}
          >
            {t('userManagement.createUser')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('userManagement.editUser')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label={t('userManagement.firstName')}
              value={editUserForm.firstName}
              onChange={(e) => setEditUserForm({ ...editUserForm, firstName: e.target.value })}
              required
            />
            <TextField
              label={t('userManagement.lastName')}
              value={editUserForm.lastName}
              onChange={(e) => setEditUserForm({ ...editUserForm, lastName: e.target.value })}
              required
            />
            <TextField
              label={t('userManagement.email')}
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
                  label={t('userManagement.phonePrefix')}
                  fullWidth={false}
                />
              </Box>
              <TextField
                label={t('userManagement.phoneNumber')}
                value={editUserForm.phoneNumber}
                onChange={(e) => setEditUserForm({ ...editUserForm, phoneNumber: e.target.value })}
                sx={{ width: '60%' }}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>{t('userManagement.role')}</InputLabel>
              <Select
                value={editUserForm.role}
                label={t('userManagement.role')}
                onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ProfilePictureUpload
              currentImageUrl={editUserForm.profilePictureUrl || undefined}
              onImageUpload={handleEditProfilePictureUpload}
              onImageRemove={handleEditProfilePictureRemove}
              disabled={false}
              size="medium"
              showPreview={false}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleEditUser} 
            variant="contained"
            disabled={!editUserForm.firstName || !editUserForm.lastName || !editUserForm.email}
          >
            {t('userManagement.updateUser')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Revoke Access Dialog */}
      <Dialog open={revokeDialogOpen} onClose={() => setRevokeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('userManagement.revokeAccess')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label={t('userManagement.reason')}
              multiline
              rows={3}
              value={revokeForm.reason || ''}
              onChange={(e) => setRevokeForm({ ...revokeForm, reason: e.target.value })}
            />
            <TextField
              label={t('userManagement.lockoutDuration')}
              type="number"
              value={revokeForm.lockoutDurationDays || ''}
              onChange={(e) => setRevokeForm({ 
                ...revokeForm, 
                lockoutDurationDays: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              helperText={t('userManagement.lockoutDurationHelp')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRevokeDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleRevokeAccess} variant="contained" color="warning">
            {t('userManagement.revokeAccess')}
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