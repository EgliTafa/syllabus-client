import { useState, useCallback } from 'react';
import { pingApi } from '../api/pingApi';
import { PingResponse, AuthenticatedPingResponse } from '../core/_models';

export const usePing = () => {
  const [pingData, setPingData] = useState<PingResponse | null>(null);
  const [authenticatedPingData, setAuthenticatedPingData] = useState<AuthenticatedPingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            errorMessage = 'Authentication required';
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

  return {
    pingData,
    authenticatedPingData,
    isLoading,
    error,
    clearError,
    ping,
    authenticatedPing,
  };
}; 