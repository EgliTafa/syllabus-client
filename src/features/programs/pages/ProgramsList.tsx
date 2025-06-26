import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { programsApi } from '../api/programsApi';
import { Program } from '../core/_models';
import { useTranslation } from 'react-i18next';

export const ProgramsList = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      const response = await programsApi.list();
      setPrograms(response);
    } catch (err: any) {
      setError(err.message || 'Failed to load programs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (programId: number) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await programsApi.delete(programId);
        fetchPrograms(); // Refresh the list
      } catch (err: any) {
        setError(err.message || 'Failed to delete program');
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Programs</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/programs/create')}
        >
          Create Program
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {programs.map((program) => (
          <Box 
            key={program.id}
            sx={{ 
              flex: '1 1 300px',
              minWidth: '300px',
              maxWidth: '400px'
            }}
          >
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" gutterBottom sx={{ flex: 1 }}>
                    {program.name}
                  </Typography>
                  <Box>
                    <Tooltip title="Edit Program">
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/programs/${program.id}/edit`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Program">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(program.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                <Typography color="textSecondary" gutterBottom>
                  {program.description}
                </Typography>
                
                <Box display="flex" gap={1} mb={2}>
                  <Chip 
                    label={program.academicYear} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                  <Chip 
                    label={program.departmentName} 
                    size="small" 
                    color="secondary" 
                    variant="outlined"
                  />
                </Box>
                
                <Typography variant="body2" color="textSecondary">
                  Created: {new Date(program.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}; 