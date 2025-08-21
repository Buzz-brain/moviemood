class MovieRules {
  constructor() {
    this.rules = [
      {
        name: "Mood-Genre Harmony",
        condition: (preferences, movie) => {
          const moodGenreMap = {
            happy: ["Comedy", "Animation", "Adventure", "Musical"],
            sad: ["Drama", "Romance"],
            excited: ["Action", "Thriller", "Adventure", "Sci-Fi"],
            relaxed: ["Comedy", "Romance", "Drama"],
            contemplative: ["Drama", "Sci-Fi", "Biography", "Documentary"],
            scared: ["Horror", "Thriller"],
            romantic: ["Romance", "Drama", "Musical"],
            nostalgic: ["Family", "Animation", "Biography"],
            energetic: ["Action", "Adventure", "Musical"],
            melancholic: ["Drama", "Romance", "Biography"]
          };
          
          const preferredGenres = moodGenreMap[preferences.mood] || [];
          return preferredGenres.some(genre => movie.genres.includes(genre));
        },
        weight: (preferences, movie) => {
          if (movie.moodFit.includes(preferences.mood)) return 10;
          return 5;
        },
        explanation: (preferences, movie) => 
          `Perfect mood match: This ${movie.genres.join(', ')} film aligns with your ${preferences.mood} mood`
      },

      {
        name: "Genre Preference Match",
        condition: (preferences, movie) => {
          return preferences.genres.some(genre => movie.genres.includes(genre));
        },
        weight: (preferences, movie) => {
          const matchCount = preferences.genres.filter(genre => movie.genres.includes(genre)).length;
          return matchCount * 8;
        },
        explanation: (preferences, movie) => {
          const matches = preferences.genres.filter(genre => movie.genres.includes(genre));
          return `Genre match: Contains your preferred genres - ${matches.join(', ')}`;
        }
      },

      {
        name: "Duration Sweet Spot",
        condition: (preferences, movie) => {
          const durationMap = {
            "short": [60, 100],
            "medium": [90, 140],
            "long": [120, 200],
            "epic": [150, 300]
          };
          
          const [min, max] = durationMap[preferences.duration] || [0, 300];
          return movie.duration >= min && movie.duration <= max;
        },
        weight: (preferences, movie) => {
          const perfectDuration = {
            "short": movie.duration <= 100,
            "medium": movie.duration >= 90 && movie.duration <= 140,
            "long": movie.duration >= 120 && movie.duration <= 180,
            "epic": movie.duration >= 150
          };
          
          return perfectDuration[preferences.duration] ? 12 : 6;
        },
        explanation: (preferences, movie) => 
          `Perfect length: ${movie.duration} minutes fits your ${preferences.duration} movie preference`
      },

      {
        name: "Audience Compatibility",
        condition: (preferences, movie) => {
          const audienceRatingMap = {
            "solo": ["G", "PG", "PG-13", "R"],
            "family": ["G", "PG", "PG-13"],
            "kids": ["G", "PG"],
            "adults": ["PG-13", "R"],
            "mature": ["R"]
          };
          
          return audienceRatingMap[preferences.audience]?.includes(movie.rating);
        },
        weight: (preferences, movie) => {
          if (preferences.audience === "family" && movie.rating === "G") return 15;
          if (preferences.audience === "kids" && movie.rating === "G") return 20;
          if (preferences.audience === "adults" && movie.rating === "R") return 12;
          return 8;
        },
        explanation: (preferences, movie) => 
          `Audience perfect: ${movie.rating} rating is ideal for ${preferences.audience} viewing`
      },

      {
        name: "Occasion Appropriateness",
        condition: (preferences, movie) => {
          return movie.occasions.includes(preferences.occasion);
        },
        weight: (preferences, movie) => 15,
        explanation: (preferences, movie) => 
          `Perfect occasion: Specially suited for ${preferences.occasion}`
      },

      {
        name: "Intent Alignment",
        condition: (preferences, movie) => {
          const intentMap = {
            "entertainment": movie.genres.some(g => ["Action", "Comedy", "Adventure", "Animation"].includes(g)),
            "education": movie.genres.some(g => ["Biography", "Documentary", "Drama", "History"].includes(g)),
            "relaxation": movie.genres.some(g => ["Comedy", "Romance", "Family", "Animation"].includes(g)),
            "inspiration": movie.imdbRating >= 8.0 || movie.tags.some(t => ["inspiring", "uplifting", "powerful"].includes(t)),
            "escape": movie.genres.some(g => ["Sci-Fi", "Fantasy", "Adventure", "Action"].includes(g)),
            "romance": movie.genres.includes("Romance") || movie.moodFit.includes("romantic")
          };
          
          return intentMap[preferences.intent] || false;
        },
        weight: (preferences, movie) => 10,
        explanation: (preferences, movie) => 
          `Intent match: Perfect for your goal of ${preferences.intent}`
      },

      {
        name: "Rating Preference",
        condition: (preferences, movie) => {
          const ratingThresholds = {
            "any": 0,
            "good": 7.0,
            "great": 8.0,
            "masterpiece": 8.5
          };
          
          return movie.imdbRating >= (ratingThresholds[preferences.ratingPreference] || 0);
        },
        weight: (preferences, movie) => {
          if (preferences.ratingPreference === "masterpiece" && movie.imdbRating >= 8.5) return 15;
          if (preferences.ratingPreference === "great" && movie.imdbRating >= 8.0) return 12;
          if (preferences.ratingPreference === "good" && movie.imdbRating >= 7.0) return 8;
          return 5;
        },
        explanation: (preferences, movie) => 
          `Quality assured: ${movie.imdbRating}/10 rating meets your ${preferences.ratingPreference} standards`
      },

      {
        name: "Decade Nostalgia",
        condition: (preferences, movie) => {
          return preferences.decade === "any" || movie.decade === preferences.decade;
        },
        weight: (preferences, movie) => {
          if (preferences.decade === "any") return 2;
          return movie.decade === preferences.decade ? 8 : 0;
        },
        explanation: (preferences, movie) => 
          preferences.decade === "any" ? 
            `Timeless appeal: Great ${movie.decade} cinema` :
            `Era perfect: Classic ${preferences.decade} filmmaking at its finest`
      },

      {
        name: "Energy Level Match",
        condition: (preferences, movie) => {
          return movie.energyLevel.includes(preferences.energyLevel);
        },
        weight: (preferences, movie) => 12,
        explanation: (preferences, movie) => 
          `Energy perfect: Matches your ${preferences.energyLevel} energy level perfectly`
      },

      {
        name: "Time of Day Suitability",
        condition: (preferences, movie) => {
          return movie.timeOfDay.includes(preferences.timeOfDay);
        },
        weight: (preferences, movie) => 8,
        explanation: (preferences, movie) => 
          `Timing ideal: Perfect for ${preferences.timeOfDay} viewing`
      },

      {
        name: "High Rewatchability Bonus",
        condition: (preferences, movie) => {
          return movie.rewatchability >= 8;
        },
        weight: (preferences, movie) => movie.rewatchability,
        explanation: (preferences, movie) => 
          `Rewatchable gem: You'll want to see this masterpiece again and again`
      },

      {
        name: "Director's Signature Style",
        condition: (preferences, movie) => {
          const auteurDirectors = [
            "Christopher Nolan", "Wes Anderson", "Quentin Tarantino", 
            "Stanley Kubrick", "Martin Scorsese", "Hayao Miyazaki",
            "Denis Villeneuve", "Bong Joon-ho"
          ];
          return auteurDirectors.includes(movie.director);
        },
        weight: (preferences, movie) => 6,
        explanation: (preferences, movie) => 
          `Auteur excellence: ${movie.director}'s distinctive filmmaking vision`
      },

      {
        name: "Critical Acclaim Bonus",
        condition: (preferences, movie) => {
          return movie.imdbRating >= 8.0 && movie.tags.some(tag => 
            ["masterpiece", "iconic", "groundbreaking", "innovative"].includes(tag.toLowerCase())
          );
        },
        weight: (preferences, movie) => 8,
        explanation: (preferences, movie) => 
          `Critically acclaimed: A recognized cinematic achievement`
      },

      {
        name: "Mood-Energy Synergy",
        condition: (preferences, movie) => {
          const synergyMap = {
            "happy-high": ["Action", "Adventure", "Comedy", "Musical"],
            "sad-low": ["Drama", "Romance"],
            "excited-high": ["Action", "Thriller", "Adventure"],
            "contemplative-medium": ["Drama", "Sci-Fi", "Biography"],
            "relaxed-low": ["Comedy", "Romance", "Family"]
          };
          
          const key = `${preferences.mood}-${preferences.energyLevel}`;
          const synergyGenres = synergyMap[key] || [];
          return synergyGenres.some(genre => movie.genres.includes(genre));
        },
        weight: (preferences, movie) => 7,
        explanation: (preferences, movie) => 
          `Perfect synergy: Mood and energy level create ideal viewing experience`
      },

      {
        name: "Genre Diversity Bonus",
        condition: (preferences, movie) => {
          return movie.genres.length >= 3;
        },
        weight: (preferences, movie) => 4,
        explanation: (preferences, movie) => 
          `Multi-genre appeal: Blends ${movie.genres.join(', ')} for rich storytelling`
      }
    ];
  }

  evaluateMovie(preferences, movie) {
    const results = [];
    let totalScore = 0;

    this.rules.forEach(rule => {
      if (rule.condition(preferences, movie)) {
        const weight = rule.weight(preferences, movie);
        const explanation = rule.explanation(preferences, movie);
        
        results.push({
          weight,
          explanation,
          ruleName: rule.name
        });
        
        totalScore += weight;
      }
    });

    return {
      score: totalScore,
      results,
      reasons: results.map(r => r.explanation),
      firedRules: results.map(r => r.ruleName)
    };
  }

  getRecommendations(preferences, movies) {
    const evaluatedMovies = movies.map(movie => {
      const evaluation = this.evaluateMovie(preferences, movie);
      return {
        movie,
        score: evaluation.score,
        reasons: evaluation.reasons,
        firedRules: evaluation.firedRules
      };
    });

    // Sort by score descending
    return evaluatedMovies
      .filter(recommendation => recommendation.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }
}

export default MovieRules;