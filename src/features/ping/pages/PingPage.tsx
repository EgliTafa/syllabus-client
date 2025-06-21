import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Grid,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { usePing } from '../hooks/usePing';
import { useAuth } from '../../auth/hooks/useAuth';
import { HealthCheckItem } from '../core/_models';
import { useTranslation } from 'react-i18next';

export const PingPage = () => {
  const {
    pingData,
    authenticatedPingData,
    healthCheckData,
    isLoading,
    error,
    clearError,
    ping,
    authenticatedPing,
    healthCheck,
    periodicResults,
    periodicConfig,
    startPeriodicPing,
    stopPeriodicPing,
    updatePeriodicConfig,
    clearPeriodicResults,
    isPeriodicRunning,
  } = usePing();
  
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'manual' | 'periodic' | 'health'>('manual');
  const { t } = useTranslation();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handlePing = async () => {
    try {
      await ping();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleAuthenticatedPing = async () => {
    try {
      await authenticatedPing();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleHealthCheck = async () => {
    try {
      await healthCheck();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handlePeriodicToggle = () => {
    if (isPeriodicRunning) {
      stopPeriodicPing();
    } else {
      startPeriodicPing({ enabled: true });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'unhealthy':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderHealthCheckItem = (item: HealthCheckItem) => (
    <Box key={item.name} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          {item.name}
        </Typography>
        <Chip 
          label={t(`ping.${item.status.toLowerCase()}`, item.status)} 
          color={getStatusColor(item.status) as any}
          size="small"
        />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {item.message}
      </Typography>
      {item.responseTime > 0 && (
        <Typography variant="caption" color="text.secondary">
          {t('ping.responseTime')}: {item.responseTime}ms
        </Typography>
      )}
    </Box>
  );

  const renderPeriodicResults = () => (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('ping.time')}</TableCell>
            <TableCell>{t('ping.status')}</TableCell>
            <TableCell>{t('ping.endpoint')}</TableCell>
            <TableCell>{t('ping.responseTime')}</TableCell>
            <TableCell>{t('ping.message')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {periodicResults.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.timestamp.toLocaleTimeString()}</TableCell>
              <TableCell>
                <Chip 
                  label={t(result.success ? 'ping.success' : 'ping.failed')} 
                  color={result.success ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>{periodicConfig.endpoint}</TableCell>
              <TableCell>{result.responseTime}ms</TableCell>
              <TableCell>
                {result.success 
                  ? t('ping.ok') 
                  : result.error ? result.error : t('ping.unknownError')
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('ping.title')}
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        {t('ping.adminInfo')}
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Tab Navigation */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant={activeTab === 'manual' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('manual')}
          sx={{ mr: 1 }}
        >
          {t('ping.manualTests')}
        </Button>
        <Button
          variant={activeTab === 'health' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('health')}
          sx={{ mr: 1 }}
        >
          {t('ping.healthCheck')}
        </Button>
        <Button
          variant={activeTab === 'periodic' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('periodic')}
        >
          {t('ping.periodic')}
        </Button>
      </Box>

      {/* Manual Tests Tab */}
      {activeTab === 'manual' && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* Public Ping */}
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Public API Ping
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Test basic API connectivity without authentication.
              </Typography>
              
              {pingData && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Message:</strong> {pingData.message}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Version:</strong> {pingData.version}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Timestamp:</strong> {formatTimestamp(pingData.timestamp)}
                  </Typography>
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button 
                onClick={handlePing} 
                disabled={isLoading}
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={16} /> : null}
              >
                {isLoading ? 'Pinging...' : 'Ping API'}
              </Button>
            </CardActions>
          </Card>

          {/* Authenticated Ping */}
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Authenticated API Ping
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Test API connectivity with authentication.
              </Typography>
              
              {authenticatedPingData && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Message:</strong> {authenticatedPingData.message}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Version:</strong> {authenticatedPingData.version}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Timestamp:</strong> {formatTimestamp(authenticatedPingData.timestamp)}
                  </Typography>
                  {authenticatedPingData.userId && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>User ID:</strong> {authenticatedPingData.userId}
                    </Typography>
                  )}
                  {authenticatedPingData.userEmail && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>User Email:</strong> {authenticatedPingData.userEmail}
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button 
                onClick={handleAuthenticatedPing} 
                disabled={isLoading}
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={16} /> : null}
              >
                {isLoading ? 'Pinging...' : 'Ping Authenticated API'}
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}

      {/* Health Check Tab */}
      {activeTab === 'health' && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  System Health Check
                </Typography>
                {healthCheckData && (
                  <Chip 
                    label={healthCheckData.status} 
                    color={getStatusColor(healthCheckData.status) as any}
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Comprehensive health check of all system components including database, memory, and uptime.
              </Typography>
              
              {healthCheckData && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Overall Status:</strong> {healthCheckData.status}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Version:</strong> {healthCheckData.version}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Timestamp:</strong> {formatTimestamp(healthCheckData.timestamp)}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Component Status
                  </Typography>
                  
                  {healthCheckData.checks.map(renderHealthCheckItem)}
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button 
                onClick={handleHealthCheck} 
                disabled={isLoading}
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={16} /> : null}
              >
                {isLoading ? 'Checking...' : 'Perform Health Check'}
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}

      {/* Periodic Monitoring Tab */}
      {activeTab === 'periodic' && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Periodic Monitoring
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Continuously monitor API health at regular intervals.
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isPeriodicRunning}
                        onChange={handlePeriodicToggle}
                        disabled={isLoading}
                      />
                    }
                    label="Enable Periodic Monitoring"
                  />
                </Box>
                
                <Box>
                  <TextField
                    label="Interval (seconds)"
                    type="number"
                    value={periodicConfig.interval}
                    onChange={(e) => updatePeriodicConfig({ interval: parseInt(e.target.value) || 30 })}
                    disabled={isPeriodicRunning}
                    fullWidth
                    inputProps={{ min: 5, max: 3600 }}
                  />
                </Box>
                
                <Box>
                  <FormControl fullWidth>
                    <InputLabel>Endpoint</InputLabel>
                    <Select
                      value={periodicConfig.endpoint}
                      onChange={(e) => updatePeriodicConfig({ endpoint: e.target.value as any })}
                      disabled={isPeriodicRunning}
                      label="Endpoint"
                    >
                      <MenuItem value="ping">Public Ping</MenuItem>
                      <MenuItem value="auth">Authenticated Ping</MenuItem>
                      <MenuItem value="health">Health Check</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={periodicConfig.autoAlert}
                        onChange={(e) => updatePeriodicConfig({ autoAlert: e.target.checked })}
                        disabled={isPeriodicRunning}
                      />
                    }
                    label="Auto Alert on Issues"
                  />
                </Box>
              </Box>

              {isPeriodicRunning && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Periodic monitoring is active. Checking {periodicConfig.endpoint} every {periodicConfig.interval} seconds.
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button 
                  onClick={handlePeriodicToggle}
                  variant={isPeriodicRunning ? 'outlined' : 'contained'}
                  color={isPeriodicRunning ? 'error' : 'primary'}
                >
                  {isPeriodicRunning ? 'Stop Monitoring' : 'Start Monitoring'}
                </Button>
                <Button 
                  onClick={clearPeriodicResults}
                  variant="outlined"
                  disabled={periodicResults.length === 0}
                >
                  Clear Results
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Monitoring Results ({periodicResults.length})
              </Typography>
              
              {periodicResults.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No results yet. Start monitoring to see results here.
                </Typography>
              ) : (
                renderPeriodicResults()
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Status Summary */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Connection Status
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Typography variant="body2">
            <strong>Public API:</strong> {pingData ? '✅ Connected' : '❌ Not tested'}
          </Typography>
          <Typography variant="body2">
            <strong>Authenticated API:</strong> {authenticatedPingData ? '✅ Connected' : '❌ Not tested'}
          </Typography>
          <Typography variant="body2">
            <strong>Health Check:</strong> {healthCheckData ? `✅ ${healthCheckData.status}` : '❌ Not tested'}
          </Typography>
          <Typography variant="body2">
            <strong>Authentication Status:</strong> {isAuthenticated ? '✅ Logged in' : '❌ Not logged in'}
          </Typography>
          <Typography variant="body2">
            <strong>Admin Status:</strong> {isAdmin() ? '✅ Administrator' : '❌ Not administrator'}
          </Typography>
          <Typography variant="body2">
            <strong>Periodic Monitoring:</strong> {isPeriodicRunning ? '✅ Active' : '❌ Inactive'}
          </Typography>
          <Typography variant="body2">
            <strong>Last Test:</strong> {pingData || authenticatedPingData || healthCheckData ? 'Just now' : 'Never'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}; 