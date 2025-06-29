import { useEffect, useState } from 'react';
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
import { programsApi } from '../api/programsApi';

interface ProgramAcademicYear {
  id: number;
  academicYear: string;
  program: {
    id: number;
    name: string;
    departmentName: string;
  };
}

interface ProgramSelectProps {
  value: number | '';
  onChange: (value: number) => void;
  disabled?: boolean;
  departmentId?: number;
}

export const ProgramSelect = ({ value, onChange, disabled, departmentId }: ProgramSelectProps) => {
  const [programAcademicYears, setProgramAcademicYears] = useState<ProgramAcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Fetch all program academic years (implement this API call in your backend/frontend service)
    programsApi.getAllProgramAcademicYears(departmentId)
      .then(setProgramAcademicYears)
      .catch(() => setError('Failed to load programs'))
      .finally(() => setLoading(false));
  }, [departmentId]);

  const handleChange = (event: SelectChangeEvent<number>) => {
    onChange(Number(event.target.value));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel>Program & Academic Year</InputLabel>
        <Select
          value={value}
          label="Program & Academic Year"
          onChange={handleChange}
        >
          {programAcademicYears.map((pay) => (
            <MenuItem key={pay.id} value={pay.id}>
              {pay.program.name} - {pay.academicYear} ({pay.program.departmentName})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}; 