import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Avatar,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Paper,
  useTheme,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  onImageUpload: (file: File) => Promise<string>;
  onImageRemove?: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  showPreview?: boolean;
  className?: string;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImageUrl,
  onImageUpload,
  onImageRemove,
  disabled = false,
  size = 'medium',
  showPreview = true,
  className,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const getAvatarSize = () => {
    switch (size) {
      case 'small':
        return 80;
      case 'large':
        return 150;
      default:
        return 120;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError(t('profilePicture.invalidFileType'));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('profilePicture.fileTooLarge'));
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const imageUrl = await onImageUpload(file);
      
      // Clear preview after successful upload
      setPreviewUrl(null);
    } catch (err: any) {
      setError(err.message || t('profilePicture.uploadFailed'));
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <Box className={className}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          border: `2px dashed ${theme.palette.divider}`,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover,
          },
        }}
        onClick={handleClick}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={displayImageUrl || undefined}
            sx={{
              width: getAvatarSize(),
              height: getAvatarSize(),
              fontSize: getAvatarSize() * 0.4,
              border: `3px solid ${theme.palette.primary.main}`,
            }}
          >
            {!displayImageUrl && <PhotoCameraIcon sx={{ fontSize: getAvatarSize() * 0.4 }} />}
          </Avatar>
          
          {isUploading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {displayImageUrl ? t('profilePicture.currentImage') : t('profilePicture.noImage')}
          </Typography>
          
          <Typography variant="caption" color="text.secondary">
            {t('profilePicture.supportedFormats')}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            {t('profilePicture.maxSize')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            disabled={disabled || isUploading}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            size="small"
          >
            {isUploading ? t('profilePicture.uploading') : t('profilePicture.upload')}
          </Button>

          {displayImageUrl && onImageRemove && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              disabled={disabled || isUploading}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              size="small"
            >
              {t('profilePicture.remove')}
            </Button>
          )}
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {showPreview && previewUrl && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {t('profilePicture.previewMode')}
        </Alert>
      )}
    </Box>
  );
}; 