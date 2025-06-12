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
  const [endYear, setEndYear] = useState<string>('');

  // Generate years from 2020 to current year + 5
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear + 5 - 2020 + 1 },
    (_, i) => (2020 + i).toString()
  );

  useEffect(() => {
    if (value) {
      const [start, end] = value.split('-');
      setStartYear(start);
      setEndYear(end);
    }
  }, [value]);

  const handleStartYearChange = (event: SelectChangeEvent) => {
    const newStartYear = event.target.value;
    setStartYear(newStartYear);
    if (endYear) {
      onChange(`${newStartYear}-${endYear}`);
    }
  };

  const handleEndYearChange = (event: SelectChangeEvent) => {
    const newEndYear = event.target.value;
    setEndYear(newEndYear);
    if (startYear) {
      onChange(`${startYear}-${newEndYear}`);
    }
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
            <MenuItem 
              key={year} 
              value={year}
              disabled={endYear ? parseInt(year) >= parseInt(endYear) : false}
            >
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth disabled={disabled}>
        <InputLabel>End Year</InputLabel>
        <Select
          value={endYear}
          label="End Year"
          onChange={handleEndYearChange}
        >
          {years.map((year) => (
            <MenuItem 
              key={year} 
              value={year}
              disabled={startYear ? parseInt(year) <= parseInt(startYear) : false}
            >
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}; 