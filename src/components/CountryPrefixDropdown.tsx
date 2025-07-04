import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText
} from '@mui/material';
import { sortedCountryPrefixes, CountryPrefix } from '../utils/countryPrefixes';

interface CountryPrefixDropdownProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  fullWidth?: boolean;
}

export const CountryPrefixDropdown: React.FC<CountryPrefixDropdownProps> = ({
  value,
  onChange,
  error = false,
  helperText,
  disabled = false,
  required = false,
  label = 'Phone Prefix',
  fullWidth = true
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl 
      fullWidth={fullWidth} 
      error={error} 
      disabled={disabled}
      required={required}
    >
      <InputLabel id="country-prefix-label">{label}</InputLabel>
      <Select
        labelId="country-prefix-label"
        id="country-prefix-select"
        value={value}
        label={label}
        onChange={handleChange}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300
            }
          }
        }}
      >
        {sortedCountryPrefixes.map((country: CountryPrefix) => (
          <MenuItem key={country.code} value={country.prefix}>
            {country.name} ({country.prefix})
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}; 