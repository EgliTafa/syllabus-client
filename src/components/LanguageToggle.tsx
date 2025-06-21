import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const handleChange = (_: any, newLang: string | null) => {
    if (newLang) i18n.changeLanguage(newLang);
  };
  return (
    <ToggleButtonGroup
      value={i18n.language}
      exclusive
      onChange={handleChange}
      size="small"
    >
      <ToggleButton value="sq" aria-label="Albanian">
        <span role="img" aria-label="Albanian flag">🇦🇱</span>
      </ToggleButton>
      <ToggleButton value="en" aria-label="English">
        <span role="img" aria-label="US flag">🇺🇸</span>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}; 