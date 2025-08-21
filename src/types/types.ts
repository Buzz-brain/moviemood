export interface UserPreferences {
  mood: string;
  genres: string[];
  duration: string;
  audience: string;
  occasion: string;
  intent: string;
  ratingPreference: string;
  decade: string;
  energyLevel: string;
  timeOfDay: string;
}

export interface Movie {
  id: string;
  title: string;
  genres: string[];
  duration: number;
  rating: string;
  decade: string;
  director: string;
  cast: string[];
  plot: string;
  tags: string[];
  moodFit: string[];
  poster: string;
  imdbRating: number;
  occasions: string[];
  energyLevel: string[];
  timeOfDay: string[];
  rewatchability: number;
}

export interface Recommendation {
  movie: Movie;
  score: number;
  reasons: string[];
  firedRules: string[];
}

export interface RuleResult {
  weight: number;
  explanation: string;
  ruleName: string;
}