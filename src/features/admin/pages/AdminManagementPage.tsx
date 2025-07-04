import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { RoleManagementPage } from './RoleManagementPage';
import { UserManagementPage } from './UserManagementPage';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

export const AdminManagementPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          Admin Management
        </Typography>

        <Paper sx={{ bgcolor: 'background.paper' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="admin management tabs"
              sx={{
                '& .MuiTab-root': {
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <Tab label="User Management" {...a11yProps(0)} />
              <Tab label="Role Assignment" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <UserManagementPage />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <RoleManagementPage />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
}; 