import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertTitle,
  Button,
  Box,
  Snackbar,
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import { authApi } from '../features/auth/api/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export const EmailConfirmationReminder: React.FC = () => {
  const { t } = useTranslation();
  const [isResending, setIsResending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const user = useSelector((state: RootState) => state.auth.user);

  // Don't show if user is not authenticated or email is already confirmed
  if (!user || user.emailConfirmed) {
    return null;
  }

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      setShowError(false);
      await authApi.resendEmailConfirmation(user.email);
      setShowSuccess(true);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || t('emailConfirmation.failedToResend'));
      setShowError(true);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Alert
          severity="warning"
          icon={<EmailIcon />}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleResendEmail}
              disabled={isResending}
            >
              {isResending ? t('emailConfirmation.resending') : t('emailConfirmation.resendButton')}
            </Button>
          }
        >
          <AlertTitle>{t('emailConfirmation.title')}</AlertTitle>
          {t('emailConfirmation.message')}
        </Alert>
      </Box>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        message={t('emailConfirmation.resent')}
      />

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />
    </>
  );
}; 