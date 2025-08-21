import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Users, Calendar, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Recommendation } from '../types/types';

interface MovieCardProps {
  recommendation: Recommendation;
  index: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ recommendation, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { movie, score, reasons, firedRules } = recommendation;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-amber-500';
    if (score >= 40) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Perfect Match';
    if (score >= 60) return 'Great Match';
    if (score >= 40) return 'Good Match';
    return 'Decent Match';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        type: "spring",
        stiffness: 120
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden group"
    >
      {/* Movie Poster & Basic Info */}
      <div className="relative overflow-hidden">
        <div className="aspect-[16/9] bg-gradient-to-br from-purple-900/30 to-pink-900/30 relative overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Score Badge */}
          <motion.div 
            className={`absolute top-4 right-4 px-4 py-2 rounded-full bg-gradient-to-r ${getScoreColor(score)} text-white font-bold text-sm shadow-lg`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
          >
            {score}% {getScoreLabel(score)}
          </motion.div>

          {/* Movie Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.h3 
              className="text-2xl font-bold text-white mb-2 line-clamp-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 + 0.2 }}
            >
              {movie.title}
            </motion.h3>
            
            <motion.div 
              className="flex items-center space-x-4 text-sm text-gray-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 + 0.3 }}
            >
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{movie.imdbRating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{movie.duration}min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{movie.decade}</span>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-2 mt-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 + 0.4 }}
            >
              {movie.genres.slice(0, 3).map((genre, genreIndex) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-200"
                >
                  {genre}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="p-6">
        <motion.p 
          className="text-gray-300 text-sm mb-4 line-clamp-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.15 + 0.5 }}
        >
          {movie.plot}
        </motion.p>

        {/* Director & Cast */}
        <motion.div 
          className="space-y-2 mb-4 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 + 0.6 }}
        >
          <div>
            <span className="text-gray-400">Director:</span>
            <span className="text-white ml-2 font-medium">{movie.director}</span>
          </div>
          <div>
            <span className="text-gray-400">Cast:</span>
            <span className="text-white ml-2">{movie.cast.slice(0, 2).join(', ')}</span>
          </div>
        </motion.div>

        {/* Expand Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl text-purple-300 hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-300 group/button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="w-4 h-4 group-hover/button:text-purple-200 transition-colors" />
          <span className="font-medium">
            {isExpanded ? 'Hide' : 'Why This Movie?'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Expanded Explanation */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="border-t border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-pink-900/20"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
                <h4 className="text-lg font-semibold text-white">
                  AI Recommendation Analysis
                </h4>
              </div>

              <div className="space-y-3">
                {reasons.map((reason, reasonIndex) => (
                  <motion.div
                    key={reasonIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reasonIndex * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg border border-purple-500/10"
                  >
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-300 text-sm leading-relaxed">{reason}</p>
                  </motion.div>
                ))}
              </div>

              <div className="pt-3 border-t border-purple-500/10">
                <p className="text-xs text-gray-400 mb-2">
                  Rules fired: {firedRules.length} / 15 total rules
                </p>
                <div className="flex flex-wrap gap-1">
                  {firedRules.slice(0, 8).map((rule, ruleIndex) => (
                    <motion.span
                      key={rule}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: ruleIndex * 0.05 }}
                      className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-300"
                    >
                      {rule}
                    </motion.span>
                  ))}
                  {firedRules.length > 8 && (
                    <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-400">
                      +{firedRules.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MovieCard;