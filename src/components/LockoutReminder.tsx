import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertTitle,
  Box,
  Typography,
} from '@mui/material';
import { Block as BlockIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export const LockoutReminder: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);

  // Don't show if user is not authenticated
  if (!user) {
    return null;
  }

  // Don't show if user is not locked out
  if (!user.lockoutEnabled) {
    return null;
  }

  // Check if temporary lockout has expired
  if (user.lockoutEnd) {
    const lockoutEndDate = new Date(user.lockoutEnd);
    const now = new Date();
    if (lockoutEndDate <= now) {
      return null; // Lockout has expired
    }
  }

  const formatLockoutEnd = (lockoutEnd: string) => {
    const date = new Date(lockoutEnd);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getLockoutMessage = () => {
    if (user.lockoutEnd) {
      const formattedDate = formatLockoutEnd(user.lockoutEnd);
      return `Your account has been temporarily locked. You can only view content but cannot make any changes. Lockout ends on: ${formattedDate}`;
    } else {
      return 'Your account has been permanently locked. You can only view content but cannot make any changes. Please contact an administrator.';
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Alert
        severity="error"
        icon={<BlockIcon />}
      >
        <AlertTitle>{t('lockout.title')}</AlertTitle>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {getLockoutMessage()}
        </Typography>
        {user.lockoutReason && (
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            <strong>Reason:</strong> {user.lockoutReason}
          </Typography>
        )}
      </Alert>
    </Box>
  );
}; 