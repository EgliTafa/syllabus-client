import { useState, useEffect } from 'react';
import { Program } from '../core/_models';
import { programsApi } from '../api/programsApi';

export const usePrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await programsApi.list();
      setPrograms(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch programs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return {
    programs,
    isLoading,
    error,
    refetch: fetchPrograms
  };
}; 