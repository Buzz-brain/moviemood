import { useState } from 'react';
import { UserPreferences, Recommendation } from '../types/types';
import { api } from '../utils/api';

export const useMovieRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (preferences: UserPreferences) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await api.getRecommendations(preferences);
      setRecommendations(results);
    } catch (err) {
      setError('Failed to get movie recommendations. Please try again.');
      console.error('Recommendation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearRecommendations = () => {
    setRecommendations([]);
    setError(null);
  };

  return {
    recommendations,
    loading,
    error,
    getRecommendations,
    clearRecommendations
  };
};