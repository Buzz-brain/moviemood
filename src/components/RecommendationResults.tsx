import React from 'react';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import { Recommendation } from '../types/types';
import { Sparkles, RotateCcw, TrendingUp } from 'lucide-react';

interface RecommendationResultsProps {
  recommendations: Recommendation[];
  onReset: () => void;
}

const RecommendationResults: React.FC<RecommendationResultsProps> = ({
  recommendations,
  onReset
}) => {
  const averageScore = recommendations.length > 0 
    ? Math.round(recommendations.reduce((sum, rec) => sum + rec.score, 0) / recommendations.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <h2 className="text-4xl font-bold text-white">
            Your Perfect Movie Matches
          </h2>
          <Sparkles className="w-8 h-8 text-purple-400" />
        </div>
        
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Our AI expert analyzed your preferences through 15+ intelligent rules and found {recommendations.length} perfect matches
        </p>

        {/* Stats */}
        <motion.div 
          className="flex items-center justify-center space-x-8 text-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">
              Avg Score: <span className="text-green-400 font-semibold">{averageScore}%</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300">
              Total Matches: <span className="text-purple-400 font-semibold">{recommendations.length}</span>
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Movies Grid */}
      {recommendations.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {recommendations.map((recommendation, index) => (
            <MovieCard 
              key={recommendation.movie.id}
              recommendation={recommendation}
              index={index}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 py-16"
        >
          <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-white">No Perfect Matches Found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Try adjusting your preferences or selecting different genres to find movies that match your mood.
          </p>
        </motion.div>
      )}

      {/* Reset Button */}
      <motion.div 
        className="flex justify-center pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={onReset}
          className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
          <span>Try Different Preferences</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default RecommendationResults;