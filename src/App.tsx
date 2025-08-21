import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Sparkles } from 'lucide-react';
import PreferenceForm from './components/PreferenceForm';
import RecommendationResults from './components/RecommendationResults';
import LoadingAnimation from './components/LoadingAnimation';
import { useMovieRecommendations } from './hooks/useMovieRecommendations';
import { UserPreferences } from './types/types';

function App() {
  const [showResults, setShowResults] = useState(false);
  const { recommendations, loading, error, getRecommendations, clearRecommendations } = useMovieRecommendations();

  const handlePreferencesSubmit = async (preferences: UserPreferences) => {
    setShowResults(false);
    await getRecommendations(preferences);
    if (!error) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    clearRecommendations();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(120,119,198,0.3),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.3),transparent_70%)]" />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 pt-8 pb-4"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Film className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MovieMood</h1>
                <p className="text-sm text-gray-300">AI-Powered Movie Expert</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-16"
              >
                <LoadingAnimation />
              </motion.div>
            )}

            {!loading && !showResults && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-8"
              >
                <PreferenceForm onSubmit={handlePreferencesSubmit} loading={loading} />
              </motion.div>
            )}

            {!loading && showResults && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-8"
              >
                <RecommendationResults 
                  recommendations={recommendations} 
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed bottom-8 right-8 max-w-sm bg-red-900/90 backdrop-blur-xl border border-red-500/50 text-red-100 p-4 rounded-xl shadow-2xl"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-200">Something went wrong</h4>
                    <p className="text-sm text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 py-8 text-center text-gray-400"
      >
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm">
            Powered by advanced AI inference engine with 15+ intelligent rules
          </span>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        <p className="text-xs">
          © 2025 MovieMood Expert System - Find your perfect movie match
        </p>
      </motion.footer>
    </div>
  );
}

export default App;