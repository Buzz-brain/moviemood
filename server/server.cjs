const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const MovieRules = require('./engine/Rules').default;

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the frontend build (dist) directory
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Load movie data
const moviesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'movies.json'), 'utf8'));
const movieRules = new MovieRules();

// API endpoint for recommendations
app.post('/api/recommendations', (req, res) => {
  try {
    const preferences = req.body;
    
    // Validate preferences
    if (!preferences.mood || !preferences.genres || !Array.isArray(preferences.genres)) {
      return res.status(400).json({ 
        error: 'Invalid preferences. Mood and genres array are required.' 
      });
    }

    const recommendations = movieRules.getRecommendations(preferences, moviesData);
    
    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ 
      error: 'Internal server error while generating recommendations' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    moviesLoaded: moviesData.length,
    rulesCount: movieRules.rules.length
  });
});

// Get all available options for the UI
app.get('/api/options', (req, res) => {
  res.json({
    moods: [
      'happy', 'sad', 'excited', 'relaxed', 'contemplative', 
      'scared', 'romantic', 'nostalgic', 'energetic', 'melancholic'
    ],
    genres: [
      'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 
      'Crime', 'Drama', 'Family', 'Horror', 'Musical', 'Mystery', 
      'Romance', 'Sci-Fi', 'Thriller'
    ],
    durations: [
      { value: 'short', label: 'Short (60-100 min)' },
      { value: 'medium', label: 'Medium (90-140 min)' },
      { value: 'long', label: 'Long (120-200 min)' },
      { value: 'epic', label: 'Epic (150+ min)' }
    ],
    audiences: [
      { value: 'solo', label: 'Just me' },
      { value: 'family', label: 'Family friendly' },
      { value: 'kids', label: 'Kids' },
      { value: 'adults', label: 'Adults only' },
      { value: 'mature', label: 'Mature audiences' }
    ],
    occasions: [
      'date night', 'family night', 'movie night', 'solo viewing', 
      'group viewing', 'casual viewing', 'serious viewing'
    ],
    intents: [
      { value: 'entertainment', label: 'Pure entertainment' },
      { value: 'education', label: 'Learn something' },
      { value: 'relaxation', label: 'Relax and unwind' },
      { value: 'inspiration', label: 'Get inspired' },
      { value: 'escape', label: 'Escape reality' },
      { value: 'romance', label: 'Romance and love' }
    ],
    ratingPreferences: [
      { value: 'any', label: 'Any rating is fine' },
      { value: 'good', label: 'Good movies (7.0+)' },
      { value: 'great', label: 'Great movies (8.0+)' },
      { value: 'masterpiece', label: 'Masterpieces only (8.5+)' }
    ],
    decades: [
      { value: 'any', label: 'Any decade' },
      { value: '2020s', label: '2020s' },
      { value: '2010s', label: '2010s' },
      { value: '2000s', label: '2000s' },
      { value: '1990s', label: '1990s' },
      { value: '1980s', label: '1980s' }
    ],
    energyLevels: [
      { value: 'low', label: 'Low energy, chill' },
      { value: 'medium', label: 'Medium energy' },
      { value: 'high', label: 'High energy' },
      { value: 'very high', label: 'Very high energy' }
    ],
    timesOfDay: [
      { value: 'morning', label: 'Morning' },
      { value: 'afternoon', label: 'Afternoon' },
      { value: 'evening', label: 'Evening' },
      { value: 'night', label: 'Late night' }
    ]
  });
});


// Fallback: serve index.html for any non-API route (SPA support)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API route not found' });
  } else if (fs.existsSync(path.join(distPath, 'index.html'))) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.status(404).send('Frontend not built. Please run npm run build.');
  }
});

app.listen(port, () => {
  console.log(`🎬 MovieMood Expert System running on port ${port}`);
  console.log(`🎯 Loaded ${moviesData.length} movies`);
  console.log(`🧠 Initialized ${movieRules.rules.length} inference rules`);
});