import axios from 'axios';

// API Configuration from environment variables
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'demo_key';
const BASE_URL = process.env.REACT_APP_WEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';
const GEO_API_URL = process.env.REACT_APP_GEO_API_URL || 'http://ip-api.com/json';
const WEATHER_API_TIMEOUT = parseInt(process.env.REACT_APP_WEATHER_API_TIMEOUT) || 10000;
const GEO_API_TIMEOUT = parseInt(process.env.REACT_APP_GEO_API_TIMEOUT) || 5000;

// Function to check if API key is valid
const isValidApiKey = (key) => {
  if (!key || key === 'demo_key' || key === '') return false;
  // OpenWeatherMap API keys are typically 32 characters long and alphanumeric
  if (key.length !== 32) return false;
  return /^[a-f0-9]{32}$/i.test(key);
};

// Create axios instance for weather API
const weatherApi = axios.create({
  baseURL: BASE_URL,
  timeout: WEATHER_API_TIMEOUT,
  params: {
    appid: API_KEY,
    units: 'metric', // Use Celsius
  },
});

// Create axios instance for IP geolocation
const geoApi = axios.create({
  baseURL: GEO_API_URL,
  timeout: GEO_API_TIMEOUT,
});

// Helper function to get default cities from environment
const getDefaultCities = () => {
  const envCities = process.env.REACT_APP_DEFAULT_CITIES;
  if (envCities) {
    return envCities.split(',').map(city => city.trim());
  }
  return ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Berlin', 'Moscow', 'Cairo', 'Mumbai', 'Beijing'];
};

// For demo purposes, we'll create mock weather data when API key is not available
const generateMockWeatherData = (city) => {
  const cities = {
    'London': { temp: 15, humidity: 65, windSpeed: 12, description: 'Partly cloudy' },
    'New York': { temp: 22, humidity: 58, windSpeed: 8, description: 'Sunny' },
    'Tokyo': { temp: 18, humidity: 72, windSpeed: 6, description: 'Light rain' },
    'Paris': { temp: 16, humidity: 60, windSpeed: 10, description: 'Overcast' },
    'Sydney': { temp: 25, humidity: 45, windSpeed: 15, description: 'Clear' },
  };
  
  const defaultData = { temp: 20, humidity: 50, windSpeed: 10, description: 'Moderate' };
  const cityData = cities[city] || defaultData;
  
  return {
    name: city,
    main: {
      temp: cityData.temp + (Math.random() - 0.5) * 4, // Add some variation
      humidity: cityData.humidity + Math.floor((Math.random() - 0.5) * 20),
      pressure: 1013 + Math.floor((Math.random() - 0.5) * 40),
      feels_like: cityData.temp + (Math.random() - 0.5) * 6,
    },
    wind: {
      speed: cityData.windSpeed + (Math.random() - 0.5) * 8,
      deg: Math.floor(Math.random() * 360),
    },
    weather: [{
      main: cityData.description.split(' ')[0],
      description: cityData.description,
      icon: '01d',
    }],
    visibility: 10000,
    clouds: {
      all: Math.floor(Math.random() * 100),
    },
    dt: Date.now() / 1000,
    sys: {
      country: 'Demo',
      sunrise: Date.now() / 1000 - 3600,
      sunset: Date.now() / 1000 + 3600,
    },
    coord: {
      lon: (Math.random() - 0.5) * 360,
      lat: (Math.random() - 0.5) * 180,
    },
  };
};

export const weatherService = {
  // Debug function to check API configuration
  checkApiConfiguration: () => {
    const config = {
      hasApiKey: !!API_KEY && API_KEY !== 'demo_key' && API_KEY !== '',
      isValidKey: isValidApiKey(API_KEY),
      apiKeyPrefix: API_KEY ? API_KEY.substring(0, 8) + '...' : 'Not set',
      baseUrl: BASE_URL,
      geoApiUrl: GEO_API_URL,
      timeout: WEATHER_API_TIMEOUT,
      recommendation: !isValidApiKey(API_KEY) ? [
        'Get a valid API key from https://openweathermap.org/api',
        'Update REACT_APP_WEATHER_API_KEY in .env file',
        'Restart development server'
      ] : ['API key looks good!']
    };
    console.log('Weather Service Configuration:', config);
    return config;
  },

  // Test API connection
  testApiConnection: async () => {
    try {
      if (!isValidApiKey(API_KEY)) {
        return {
          success: false,
          error: 'No valid API key configured or invalid key format',
          usingMockData: true,
          instructions: [
            'Visit https://openweathermap.org/api',
            'Sign up for a free account',
            'Get your API key',
            'Update REACT_APP_WEATHER_API_KEY in .env file',
            'Restart the development server'
          ]
        };
      }

      console.log('Testing API connection with London...');
      const response = await weatherApi.get('/weather', {
        params: { q: 'London' }
      });
      
      return {
        success: true,
        message: 'API connection successful',
        data: response.data.name,
        usingMockData: false
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
        usingMockData: true,
        instructions: error.response?.status === 401 ? [
          'Your API key is invalid',
          'Visit https://openweathermap.org/api',
          'Get a valid API key',
          'Update REACT_APP_WEATHER_API_KEY in .env file',
          'Restart the development server'
        ] : []
      };
    }
  },
  // Get user's location based on IP
  getUserLocation: async () => {
    try {
      console.log('Attempting to get user location via IP geolocation...');
      const response = await geoApi.get('/');
      
      if (response.data && response.data.status === 'success') {
        console.log('Successfully retrieved location:', response.data.city, response.data.country);
        return {
          city: response.data.city,
          country: response.data.country,
          lat: response.data.lat,
          lon: response.data.lon,
          timezone: response.data.timezone,
        };
      } else {
        throw new Error('Invalid response from geolocation service');
      }
    } catch (error) {
      console.warn('IP geolocation failed:', error.message);
      console.log('Using default location: London, United Kingdom');
      // Fallback to default location
      return {
        city: 'London',
        country: 'United Kingdom',
        lat: 51.5074,
        lon: -0.1278,
        timezone: 'Europe/London',
      };
    }
  },

  // Get current weather by coordinates
  getCurrentWeatherByCoords: async (lat, lon) => {
    try {
      console.log('Fetching weather data for coordinates:', lat, lon);
      console.log('Using API key:', API_KEY ? API_KEY.substring(0, 8) + '...' : 'No API key');
      console.log('API key is valid:', isValidApiKey(API_KEY));
      
      if (!isValidApiKey(API_KEY)) {
        console.warn('No valid API key provided or invalid key format. Using mock weather data for demo purposes.');
        console.log('To use real weather data:');
        console.log('1. Visit https://openweathermap.org/api');
        console.log('2. Sign up for a free account');
        console.log('3. Get your API key');
        console.log('4. Update REACT_APP_WEATHER_API_KEY in your .env file');
        console.log('5. Restart the development server');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateMockWeatherData('Your Location');
      }
      
      const response = await weatherApi.get('/weather', {
        params: { lat, lon }
      });
      console.log('Successfully fetched weather data from API');
      return response.data;
    } catch (error) {
      console.error('Weather API error:', error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key in the .env file.');
      }
      throw new Error(`Failed to fetch weather data: ${error.response?.data?.message || error.message}`);
    }
  },
  // Normalize city name for consistent searching
  normalizeCityName: (city) => {
    if (!city || typeof city !== 'string') {
      return '';
    }
    return city.trim().toLowerCase().replace(/\s+/g, ' ');
  },

  // Validate city name input
  validateCityName: (city) => {
    if (!city || typeof city !== 'string') {
      return { valid: false, error: 'City name is required' };
    }
    
    const trimmed = city.trim();
    if (trimmed.length === 0) {
      return { valid: false, error: 'City name cannot be empty' };
    }
    
    if (trimmed.length < 2) {
      return { valid: false, error: 'City name must be at least 2 characters long' };
    }
    
    if (trimmed.length > 100) {
      return { valid: false, error: 'City name is too long' };
    }
    
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const validCityPattern = /^[a-zA-Z\s\-'.,]+$/;
    if (!validCityPattern.test(trimmed)) {
      return { valid: false, error: 'City name contains invalid characters' };
    }
    
    return { valid: true, normalizedName: trimmed };
  },

  // Get current weather for a city
  getCurrentWeather: async (city) => {
    try {
      // Validate city name first
      const validation = weatherService.validateCityName(city);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      const normalizedCity = validation.normalizedName;
      
      console.log('Fetching weather data for city:', normalizedCity);
      console.log('Using API key:', API_KEY ? API_KEY.substring(0, 8) + '...' : 'No API key');
      console.log('API key is valid:', isValidApiKey(API_KEY));
      
      // If no API key or invalid key, return mock data
      if (!isValidApiKey(API_KEY)) {
        console.warn('No valid API key provided or invalid key format. Using mock weather data for demo purposes.');
        console.log('To use real weather data:');
        console.log('1. Visit https://openweathermap.org/api');
        console.log('2. Sign up for a free account');
        console.log('3. Get your API key');
        console.log('4. Update REACT_APP_WEATHER_API_KEY in your .env file');
        console.log('5. Restart the development server');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        return generateMockWeatherData(normalizedCity);
      }
      
      const response = await weatherApi.get('/weather', {
        params: { q: normalizedCity }
      });
      console.log('Successfully fetched weather data from API for:', normalizedCity);
      return response.data;
    } catch (error) {
      console.error('Weather API error:', error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key in the .env file.');
      }
      if (error.response?.status === 404) {
        throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
      }
      // If it's a validation error, throw it as is
      if (!error.response) {
        throw error;
      }
      throw new Error(`Failed to fetch weather data for ${city}: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get weather forecast for a city (5 days)
  getWeatherForecast: async (city) => {
    try {
      // Validate city name first
      const validation = weatherService.validateCityName(city);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      const normalizedCity = validation.normalizedName;
      
      console.log('Fetching forecast data for city:', normalizedCity);
      console.log('Using API key:', API_KEY ? API_KEY.substring(0, 8) + '...' : 'No API key');
      console.log('API key is valid:', isValidApiKey(API_KEY));
      
      if (!isValidApiKey(API_KEY)) {
        console.warn('No valid API key provided or invalid key format. Using mock forecast data for demo purposes.');
        console.log('To use real weather data:');
        console.log('1. Visit https://openweathermap.org/api');
        console.log('2. Sign up for a free account');
        console.log('3. Get your API key');
        console.log('4. Update REACT_APP_WEATHER_API_KEY in your .env file');
        console.log('5. Restart the development server');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate 5-day mock forecast
        const forecast = {
          city: { name: normalizedCity },
          list: [],
        };
        
        for (let i = 0; i < 40; i++) { // 5 days * 8 forecasts per day (3-hour intervals)
          const baseTemp = 20 + Math.sin(i / 8) * 10; // Daily temperature cycle
          forecast.list.push({
            dt: Date.now() / 1000 + i * 3 * 3600, // 3-hour intervals
            main: {
              temp: baseTemp + (Math.random() - 0.5) * 6,
              humidity: 50 + Math.floor((Math.random() - 0.5) * 40),
              pressure: 1013 + Math.floor((Math.random() - 0.5) * 40),
            },
            weather: [{
              main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
              description: 'Weather forecast',
              icon: '01d',
            }],
            wind: {
              speed: 5 + Math.random() * 10,
            },
          });
        }
        
        return forecast;
      }
      
      const response = await weatherApi.get('/forecast', {
        params: { q: normalizedCity }
      });
      console.log('Successfully fetched forecast data from API for:', normalizedCity);
      return response.data;
    } catch (error) {
      console.error('Weather forecast API error:', error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key in the .env file.');
      }
      if (error.response?.status === 404) {
        throw new Error(`City "${city}" not found for forecast. Please check the spelling and try again.`);
      }
      // If it's a validation error, throw it as is
      if (!error.response) {
        throw error;
      }
      throw new Error(`Failed to fetch forecast data for ${city}: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get weather for multiple cities
  getMultipleCitiesWeather: async (cities) => {
    try {
      const weatherPromises = cities.map(city => 
        weatherService.getCurrentWeather(city)
      );
      
      const results = await Promise.allSettled(weatherPromises);
      
      return results.map((result, index) => ({
        city: cities[index],
        weather: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch multiple cities weather: ${error.message}`);
    }
  },

  // Get weather analytics with filters
  getWeatherAnalytics: async (cities = getDefaultCities(), filters = {}) => {
    try {
      const weatherData = await weatherService.getMultipleCitiesWeather(cities);
      
      const analytics = {
        averageTemperature: 0,
        averageHumidity: 0,
        averageWindSpeed: 0,
        citiesCount: weatherData.length,
        weatherConditions: {},
        temperatureRange: { min: Infinity, max: -Infinity },
        // Weather trend filters
        hotPlaces: [],
        coldPlaces: [],
        rainyPlaces: [],
        windyPlaces: [],
        humidPlaces: [],
        clearPlaces: [],
        cloudyPlaces: [],
      };
      
      let validDataCount = 0;
      
      weatherData.forEach(({ city, weather }) => {
        if (weather && weather.main) {
          validDataCount++;
          analytics.averageTemperature += weather.main.temp;
          analytics.averageHumidity += weather.main.humidity;
          analytics.averageWindSpeed += weather.wind.speed;
          
          // Track temperature range
          analytics.temperatureRange.min = Math.min(analytics.temperatureRange.min, weather.main.temp);
          analytics.temperatureRange.max = Math.max(analytics.temperatureRange.max, weather.main.temp);
          
          // Count weather conditions
          const condition = weather.weather[0].main;
          analytics.weatherConditions[condition] = (analytics.weatherConditions[condition] || 0) + 1;
          
          // Categorize places by weather characteristics
          const temp = weather.main.temp;
          const humidity = weather.main.humidity;
          const windSpeed = weather.wind.speed;
          const condition_lower = condition.toLowerCase();
          
          // Temperature-based categories
          if (temp > 25) {
            analytics.hotPlaces.push({ city, temp: Math.round(temp), condition });
          } else if (temp < 10) {
            analytics.coldPlaces.push({ city, temp: Math.round(temp), condition });
          }
          
          // Weather condition categories
          if (condition_lower.includes('rain') || condition_lower.includes('drizzle') || condition_lower.includes('thunderstorm')) {
            analytics.rainyPlaces.push({ city, temp: Math.round(temp), condition, humidity });
          }
          
          if (windSpeed > 10) {
            analytics.windyPlaces.push({ city, windSpeed: Math.round(windSpeed), condition });
          }
          
          if (humidity > 70) {
            analytics.humidPlaces.push({ city, humidity, temp: Math.round(temp), condition });
          }
          
          if (condition_lower.includes('clear') || condition_lower.includes('sunny')) {
            analytics.clearPlaces.push({ city, temp: Math.round(temp), condition });
          }
          
          if (condition_lower.includes('cloud') || condition_lower.includes('overcast')) {
            analytics.cloudyPlaces.push({ city, temp: Math.round(temp), condition });
          }
        }
      });
      
      if (validDataCount > 0) {
        analytics.averageTemperature = Math.round(analytics.averageTemperature / validDataCount * 10) / 10;
        analytics.averageHumidity = Math.round(analytics.averageHumidity / validDataCount);
        analytics.averageWindSpeed = Math.round(analytics.averageWindSpeed / validDataCount * 10) / 10;
      }
      
      // Sort each category by relevant metric
      analytics.hotPlaces.sort((a, b) => b.temp - a.temp);
      analytics.coldPlaces.sort((a, b) => a.temp - b.temp);
      analytics.windyPlaces.sort((a, b) => b.windSpeed - a.windSpeed);
      analytics.humidPlaces.sort((a, b) => b.humidity - a.humidity);
      
      return analytics;
    } catch (error) {
      throw new Error(`Failed to fetch weather analytics: ${error.message}`);
    }
  },

  // Get search suggestions for city names
  getCitySuggestions: (input, limit = 5) => {
    if (!input || input.length < 2) {
      return [];
    }
    
    const commonCities = [
      'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Berlin', 'Moscow', 'Cairo', 'Mumbai', 'Beijing',
      'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas',
      'Madrid', 'Barcelona', 'Rome', 'Milan', 'Naples', 'Amsterdam', 'Brussels', 'Vienna', 'Prague',
      'Warsaw', 'Stockholm', 'Copenhagen', 'Oslo', 'Helsinki', 'Dublin', 'Edinburgh', 'Manchester',
      'Liverpool', 'Glasgow', 'Cardiff', 'Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary',
      'Mexico City', 'Guadalajara', 'Monterrey', 'São Paulo', 'Rio de Janeiro', 'Buenos Aires',
      'Lima', 'Bogotá', 'Santiago', 'Caracas', 'Bangkok', 'Singapore', 'Manila', 'Jakarta',
      'Kuala Lumpur', 'Hong Kong', 'Seoul', 'Taipei', 'Shanghai', 'Guangzhou', 'Shenzhen',
      'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur',
      'Dubai', 'Abu Dhabi', 'Doha', 'Kuwait City', 'Riyadh', 'Jeddah', 'Tel Aviv', 'Jerusalem',
      'Istanbul', 'Ankara', 'Athens', 'Thessaloniki', 'Sofia', 'Bucharest', 'Budapest', 'Zagreb',
      'Ljubljana', 'Bratislava', 'Vilnius', 'Riga', 'Tallinn', 'Minsk', 'Kiev', 'Lviv',
      'Casablanca', 'Algiers', 'Tunis', 'Lagos', 'Accra', 'Nairobi', 'Addis Ababa', 'Cape Town',
      'Johannesburg', 'Durban', 'Perth', 'Adelaide', 'Brisbane', 'Melbourne', 'Auckland', 'Wellington'
    ];
    
    const searchTerm = input.toLowerCase();
    const suggestions = commonCities
      .filter(city => city.toLowerCase().includes(searchTerm))
      .slice(0, limit);
    
    return suggestions;
  },

  // Enhanced city search with suggestions
  searchCities: async (query, options = {}) => {
    const { includeSuggestions = true, limit = 10 } = options;
    
    const validation = weatherService.validateCityName(query);
    if (!validation.valid) {
      return {
        error: validation.error,
        suggestions: includeSuggestions ? weatherService.getCitySuggestions(query) : []
      };
    }
    
    try {
      const weatherData = await weatherService.getCurrentWeather(query);
      return {
        success: true,
        data: weatherData,
        suggestions: []
      };
    } catch (error) {
      return {
        error: error.message,
        suggestions: includeSuggestions ? weatherService.getCitySuggestions(query, limit) : []
      };
    }
  },

  // Get weather trends for specific filter type
  getWeatherTrends: async (filterType = 'all', cities = getDefaultCities()) => {
    try {
      const analytics = await weatherService.getWeatherAnalytics(cities);
      
      switch (filterType) {
        case 'hot':
          return {
            title: 'Hottest Places',
            data: analytics.hotPlaces,
            metric: 'temperature',
            unit: '°C'
          };
        case 'cold':
          return {
            title: 'Coldest Places',
            data: analytics.coldPlaces,
            metric: 'temperature', 
            unit: '°C'
          };
        case 'rainy':
          return {
            title: 'Rainy Places',
            data: analytics.rainyPlaces,
            metric: 'humidity',
            unit: '%'
          };
        case 'windy':
          return {
            title: 'Windiest Places',
            data: analytics.windyPlaces,
            metric: 'windSpeed',
            unit: 'm/s'
          };
        case 'humid':
          return {
            title: 'Most Humid Places',
            data: analytics.humidPlaces,
            metric: 'humidity',
            unit: '%'
          };
        case 'clear':
          return {
            title: 'Clear Weather Places',
            data: analytics.clearPlaces,
            metric: 'temperature',
            unit: '°C'
          };
        case 'cloudy':
          return {
            title: 'Cloudy Places',
            data: analytics.cloudyPlaces,
            metric: 'temperature',
            unit: '°C'
          };
        default:
          return {
            title: 'Weather Overview',
            data: analytics,
            metric: 'general',
            unit: ''
          };
      }
    } catch (error) {
      throw new Error(`Failed to fetch weather trends: ${error.message}`);
    }
  },
};

export default weatherService;