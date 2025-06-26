import { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Program } from '../core/_models';
import { programsApi } from '../api/programsApi';

interface ProgramSelectProps {
  value: number | '';
  onChange: (value: number) => void;
  disabled?: boolean;
  departmentId?: number; // Optional filter by department
  academicYear?: string; // Optional filter by academic year
}

export const ProgramSelect = ({ 
  value, 
  onChange, 
  disabled = false, 
  departmentId,
  academicYear 
}: ProgramSelectProps) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await programsApi.list();
        let filteredPrograms = response;

        // Apply filters if provided
        if (departmentId) {
          filteredPrograms = filteredPrograms.filter((p: Program) => p.departmentId === departmentId);
        }
        if (academicYear) {
          filteredPrograms = filteredPrograms.filter((p: Program) => p.academicYear === academicYear);
        }

        setPrograms(filteredPrograms);
      } catch (err: any) {
        setError(err.message || 'Failed to load programs');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [departmentId, academicYear]);

  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedValue = event.target.value as number;
    onChange(selectedValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel>Program</InputLabel>
        <Select
          value={value}
          label="Program"
          onChange={handleChange}
        >
          {programs.map((program) => (
            <MenuItem key={program.id} value={program.id}>
              {program.name} - {program.departmentName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {value && (
        <Box mt={1}>
          <strong>Academic Year:</strong> {programs.find(p => p.id === value)?.academicYear || 'N/A'}
        </Box>
      )}
    </Box>
  );
}; 