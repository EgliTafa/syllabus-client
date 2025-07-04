import { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

interface AcademicYearSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const AcademicYearSelect = ({ value, onChange, disabled = false }: AcademicYearSelectProps) => {
  const [startYear, setStartYear] = useState<string>('');

  // Generate years from 2020 to current year + 5
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear + 5 - 2020 + 1 },
    (_, i) => (2020 + i).toString()
  );

  useEffect(() => {
    if (value) {
      const [start] = value.split('-');
      setStartYear(start);
    }
  }, [value]);

  const handleStartYearChange = (event: SelectChangeEvent) => {
    const newStartYear = event.target.value;
    setStartYear(newStartYear);
    const endYear = (parseInt(newStartYear) + 3).toString();
    onChange(`${newStartYear}-${endYear}`);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel>Start Year</InputLabel>
        <Select
          value={startYear}
          label="Start Year"
          onChange={handleStartYearChange}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year} - {parseInt(year) + 3}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}; 