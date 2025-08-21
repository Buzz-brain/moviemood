import axios from 'axios';
import { UserPreferences, Recommendation } from '../types/types';

const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  getRecommendations: async (preferences: UserPreferences): Promise<Recommendation[]> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/recommendations`, preferences);
      return response.data.recommendations;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  getOptions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/options`);
      return response.data;
    } catch (error) {
      console.error('Error fetching options:', error);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
};