import { useState, useCallback, useEffect, useRef } from 'react';
import { pingApi } from '../api/pingApi';
import { 
  PingResponse, 
  AuthenticatedPingResponse, 
  HealthCheckResponse, 
  PeriodicPingConfig 
} from '../core/_models';
import { PeriodicPingService, PingResult } from '../services/PeriodicPingService';

export const usePing = () => {
  const [pingData, setPingData] = useState<PingResponse | null>(null);
  const [authenticatedPingData, setAuthenticatedPingData] = useState<AuthenticatedPingResponse | null>(null);
  const [healthCheckData, setHealthCheckData] = useState<HealthCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [periodicResults, setPeriodicResults] = useState<PingResult[]>([]);
  const [periodicConfig, setPeriodicConfig] = useState<PeriodicPingConfig>({
    enabled: false,
    interval: 30,
    endpoint: 'health',
    autoAlert: true,
  });

  const periodicServiceRef = useRef<PeriodicPingService | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const ping = useCallback(async () => {
    try {
      setIsLoading(true);
      clearError();
      const response = await pingApi.ping();
      setPingData(response);
      return response;
    } catch (err: any) {
      let errorMessage = 'Failed to ping API';

      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = 'Authentication required. Please log in.';
            break;
          case 403:
            errorMessage = 'Access denied. Administrator role required.';
            break;
          case 404:
            errorMessage = 'API endpoint not found';
            break;
          case 500:
            errorMessage = 'Server error occurred';
            break;
          default:
            errorMessage = err.response.data?.message || 'Failed to ping API';
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      } else {
        errorMessage = err.message || 'Failed to ping API';
      }

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clearError]);

  const authenticatedPing = useCallback(async () => {
    try {
      setIsLoading(true);
      clearError();
      const response = await pingApi.authenticatedPing();
      setAuthenticatedPingData(response);
      return response;
    } catch (err: any) {
      let errorMessage = 'Failed to ping authenticated API';

      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = 'Authentication required. Please log in.';
            break;
          case 403:
            errorMessage = 'Access denied. Administrator role required.';
            break;
          case 404:
            errorMessage = 'API endpoint not found';
            break;
          case 500:
            errorMessage = 'Server error occurred';
            break;
          default:
            errorMessage = err.response.data?.message || 'Failed to ping authenticated API';
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      } else {
        errorMessage = err.message || 'Failed to ping authenticated API';
      }

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clearError]);

  const healthCheck = useCallback(async () => {
    try {
      setIsLoading(true);
      clearError();
      const response = await pingApi.healthCheck();
      setHealthCheckData(response);
      return response;
    } catch (err: any) {
      let errorMessage = 'Failed to perform health check';

      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = 'Authentication required. Please log in.';
            break;
          case 403:
            errorMessage = 'Access denied. Administrator role required.';
            break;
          case 404:
            errorMessage = 'Health check endpoint not found';
            break;
          case 500:
            errorMessage = 'Server error occurred';
            break;
          case 503:
            errorMessage = 'Service unavailable - health check failed';
            break;
          default:
            errorMessage = err.response.data?.message || 'Failed to perform health check';
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      } else {
        errorMessage = err.message || 'Failed to perform health check';
      }

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clearError]);

  // Periodic pinging functionality
  const startPeriodicPing = useCallback((config?: Partial<PeriodicPingConfig>) => {
    const newConfig = { ...periodicConfig, ...config };
    setPeriodicConfig(newConfig);

    if (periodicServiceRef.current) {
      periodicServiceRef.current.stop();
    }

    periodicServiceRef.current = new PeriodicPingService(
      newConfig,
      (result: PingResult) => {
        setPeriodicResults(prev => [result, ...prev.slice(0, 49)]); // Keep last 50 results
      },
      (errorMessage: string) => {
        setError(errorMessage);
      }
    );

    periodicServiceRef.current.start();
  }, [periodicConfig]);

  const stopPeriodicPing = useCallback(() => {
    if (periodicServiceRef.current) {
      periodicServiceRef.current.stop();
      periodicServiceRef.current = null;
    }
    setPeriodicConfig(prev => ({ ...prev, enabled: false }));
  }, []);

  const updatePeriodicConfig = useCallback((newConfig: Partial<PeriodicPingConfig>) => {
    setPeriodicConfig(prev => ({ ...prev, ...newConfig }));
    
    if (periodicServiceRef.current) {
      periodicServiceRef.current.updateConfig(newConfig);
    }
  }, []);

  const clearPeriodicResults = useCallback(() => {
    setPeriodicResults([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (periodicServiceRef.current) {
        periodicServiceRef.current.stop();
      }
    };
  }, []);

  return {
    // Basic ping functionality
    pingData,
    authenticatedPingData,
    healthCheckData,
    isLoading,
    error,
    clearError,
    ping,
    authenticatedPing,
    healthCheck,
    
    // Periodic ping functionality
    periodicResults,
    periodicConfig,
    startPeriodicPing,
    stopPeriodicPing,
    updatePeriodicConfig,
    clearPeriodicResults,
    isPeriodicRunning: periodicServiceRef.current?.isRunning() || false,
  };
}; 