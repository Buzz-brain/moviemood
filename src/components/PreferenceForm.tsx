import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPreferences } from '../types/types';
import { Sparkles, Clock, Users, Calendar, Target, Star, Zap, Sun } from 'lucide-react';
import { api } from '../utils/api';

interface PreferenceFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  loading: boolean;
}

const PreferenceForm: React.FC<PreferenceFormProps> = ({ onSubmit, loading }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    mood: '',
    genres: [],
    duration: '',
    audience: '',
    occasion: '',
    intent: '',
    ratingPreference: '',
    decade: '',
    energyLevel: '',
    timeOfDay: ''
  });

  const [options, setOptions] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data = await api.getOptions();
        setOptions(data);
      } catch (error) {
        console.error('Failed to load options:', error);
      }
    };
    
    loadOptions();
  }, []);

  const handleGenreToggle = (genre: string) => {
    setPreferences(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preferences.mood && preferences.genres.length > 0) {
      onSubmit(preferences);
    }
  };

  const isFormValid = () => {
    return preferences.mood && 
           preferences.genres.length > 0 && 
           preferences.duration && 
           preferences.audience &&
           preferences.occasion &&
           preferences.intent &&
           preferences.ratingPreference &&
           preferences.decade &&
           preferences.energyLevel &&
           preferences.timeOfDay;
  };

  const steps = [
    { icon: Sparkles, title: "What's your mood?", key: 'mood' },
    { icon: Calendar, title: "Pick your genres", key: 'genres' },
    { icon: Clock, title: "How long?", key: 'duration' },
    { icon: Users, title: "Who's watching?", key: 'audience' },
    { icon: Target, title: "What's the occasion?", key: 'occasion' },
    { icon: Target, title: "What's your goal?", key: 'intent' },
    { icon: Star, title: "Quality preference?", key: 'ratingPreference' },
    { icon: Calendar, title: "Preferred decade?", key: 'decade' },
    { icon: Zap, title: "Energy level?", key: 'energyLevel' },
    { icon: Sun, title: "Time of day?", key: 'timeOfDay' }
  ];

  if (!options.moods) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-purple-500/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 p-8 text-center">
          <motion.h1 
            className="text-4xl font-bold text-white mb-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            🎬 MovieMood Expert
          </motion.h1>
          <p className="text-purple-100">Tell us what you're feeling, we'll find your perfect movie</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Mood Selection */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">What's your mood?</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {options.moods?.map((mood: string, index: number) => (
                <motion.button
                  key={mood}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, mood }))}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                    preferences.mood === mood
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  {mood}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Genre Selection */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">Pick your genres</h3>
              <span className="text-sm text-gray-400">({preferences.genres.length} selected)</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {options.genres?.map((genre: string, index: number) => (
                <motion.button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreToggle(genre)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    preferences.genres.includes(genre)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.03 }}
                >
                  {genre}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Duration */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">How long do you want to watch?</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {options.durations?.map((duration: any, index: number) => (
                <motion.button
                  key={duration.value}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, duration: duration.value }))}
                  className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    preferences.duration === duration.value
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  {duration.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Audience */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">Who's watching?</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {options.audiences?.map((audience: any, index: number) => (
                <motion.button
                  key={audience.value}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, audience: audience.value }))}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    preferences.audience === audience.value
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  {audience.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Quick Settings Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Occasion */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-purple-400" />
                <h4 className="text-lg font-medium text-white">Occasion</h4>
              </div>
              <select
                value={preferences.occasion}
                onChange={(e) => setPreferences(prev => ({ ...prev, occasion: e.target.value }))}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              >
                <option value="">Select occasion...</option>
                {options.occasions?.map((occasion: string) => (
                  <option key={occasion} value={occasion} className="capitalize">
                    {occasion}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Intent */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-purple-400" />
                <h4 className="text-lg font-medium text-white">Goal</h4>
              </div>
              <select
                value={preferences.intent}
                onChange={(e) => setPreferences(prev => ({ ...prev, intent: e.target.value }))}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              >
                <option value="">What's your goal...</option>
                {options.intents?.map((intent: any) => (
                  <option key={intent.value} value={intent.value}>
                    {intent.label}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          {/* More Settings Row */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Rating Preference */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-medium text-white">Quality</h4>
              </div>
              <select
                value={preferences.ratingPreference}
                onChange={(e) => setPreferences(prev => ({ ...prev, ratingPreference: e.target.value }))}
                className="w-full p-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
              >
                <option value="">Quality...</option>
                {options.ratingPreferences?.map((rating: any) => (
                  <option key={rating.value} value={rating.value}>
                    {rating.label}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Decade */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-medium text-white">Era</h4>
              </div>
              <select
                value={preferences.decade}
                onChange={(e) => setPreferences(prev => ({ ...prev, decade: e.target.value }))}
                className="w-full p-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
              >
                <option value="">Era...</option>
                {options.decades?.map((decade: any) => (
                  <option key={decade.value} value={decade.value}>
                    {decade.label}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Energy Level */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-medium text-white">Energy</h4>
              </div>
              <select
                value={preferences.energyLevel}
                onChange={(e) => setPreferences(prev => ({ ...prev, energyLevel: e.target.value }))}
                className="w-full p-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
              >
                <option value="">Energy...</option>
                {options.energyLevels?.map((energy: any) => (
                  <option key={energy.value} value={energy.value}>
                    {energy.label}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Time of Day */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-medium text-white">Time</h4>
              </div>
              <select
                value={preferences.timeOfDay}
                onChange={(e) => setPreferences(prev => ({ ...prev, timeOfDay: e.target.value }))}
                className="w-full p-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
              >
                <option value="">Time...</option>
                {options.timesOfDay?.map((time: any) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.div 
            className="pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              type="submit"
              disabled={!isFormValid() || loading}
              className={`w-full p-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isFormValid() && !loading
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={isFormValid() && !loading ? { scale: 1.02, y: -2 } : {}}
              whileTap={isFormValid() && !loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Finding Your Perfect Movie...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <Sparkles className="w-5 h-5" />
                  <span>Get My Movie Recommendations</span>
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default PreferenceForm;