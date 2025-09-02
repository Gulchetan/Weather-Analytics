import axios from 'axios';

// API Configuration for Open-Meteo (free weather API)
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const GEO_API_URL = process.env.REACT_APP_GEO_API_URL || 'http://ip-api.com/json';
const WEATHER_API_TIMEOUT = parseInt(process.env.REACT_APP_WEATHER_API_TIMEOUT) || 10000;
const GEO_API_TIMEOUT = parseInt(process.env.REACT_APP_GEO_API_TIMEOUT) || 5000;

// Create axios instance for Open-Meteo weather API
const weatherApi = axios.create({
  baseURL: WEATHER_BASE_URL,
  timeout: WEATHER_API_TIMEOUT,
});

// Create axios instance for Open-Meteo geocoding API
const geocodingApi = axios.create({
  baseURL: GEOCODING_BASE_URL,
  timeout: WEATHER_API_TIMEOUT,
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

// Helper function to get coordinates for a city using Open-Meteo Geocoding API
const getCityCoordinates = async (cityName) => {
  try {
    console.log('Getting coordinates for city:', cityName);
    const response = await geocodingApi.get('/search', {
      params: {
        name: cityName,
        count: 1,
        language: 'en',
        format: 'json'
      }
    });
    
    if (response.data && response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      return {
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
        country: result.country,
        admin1: result.admin1,
        timezone: result.timezone
      };
    } else {
      throw new Error(`City "${cityName}" not found`);
    }
  } catch (error) {
    throw new Error(`Failed to get coordinates for ${cityName}: ${error.message}`);
  }
};

// Helper function to map Open-Meteo weather codes to descriptions
const getWeatherDescription = (weatherCode) => {
  const weatherCodes = {
    0: { main: 'Clear', description: 'Clear sky', icon: '01d' },
    1: { main: 'Clear', description: 'Mainly clear', icon: '01d' },
    2: { main: 'Clouds', description: 'Partly cloudy', icon: '02d' },
    3: { main: 'Clouds', description: 'Overcast', icon: '03d' },
    45: { main: 'Fog', description: 'Fog', icon: '50d' },
    48: { main: 'Fog', description: 'Depositing rime fog', icon: '50d' },
    51: { main: 'Drizzle', description: 'Light drizzle', icon: '09d' },
    53: { main: 'Drizzle', description: 'Moderate drizzle', icon: '09d' },
    55: { main: 'Drizzle', description: 'Dense drizzle', icon: '09d' },
    56: { main: 'Drizzle', description: 'Light freezing drizzle', icon: '09d' },
    57: { main: 'Drizzle', description: 'Dense freezing drizzle', icon: '09d' },
    61: { main: 'Rain', description: 'Slight rain', icon: '10d' },
    63: { main: 'Rain', description: 'Moderate rain', icon: '10d' },
    65: { main: 'Rain', description: 'Heavy rain', icon: '10d' },
    66: { main: 'Rain', description: 'Light freezing rain', icon: '13d' },
    67: { main: 'Rain', description: 'Heavy freezing rain', icon: '13d' },
    71: { main: 'Snow', description: 'Slight snow fall', icon: '13d' },
    73: { main: 'Snow', description: 'Moderate snow fall', icon: '13d' },
    75: { main: 'Snow', description: 'Heavy snow fall', icon: '13d' },
    77: { main: 'Snow', description: 'Snow grains', icon: '13d' },
    80: { main: 'Rain', description: 'Slight rain showers', icon: '09d' },
    81: { main: 'Rain', description: 'Moderate rain showers', icon: '09d' },
    82: { main: 'Rain', description: 'Violent rain showers', icon: '09d' },
    85: { main: 'Snow', description: 'Slight snow showers', icon: '13d' },
    86: { main: 'Snow', description: 'Heavy snow showers', icon: '13d' },
    95: { main: 'Thunderstorm', description: 'Thunderstorm', icon: '11d' },
    96: { main: 'Thunderstorm', description: 'Thunderstorm with slight hail', icon: '11d' },
    99: { main: 'Thunderstorm', description: 'Thunderstorm with heavy hail', icon: '11d' }
  };
  
  return weatherCodes[weatherCode] || { main: 'Unknown', description: 'Unknown weather', icon: '01d' };
};

// Helper function to convert Open-Meteo data to OpenWeatherMap-like format
const convertToOpenWeatherFormat = (openMeteoData, cityInfo) => {
  const current = openMeteoData.current;
  const weatherInfo = getWeatherDescription(current.weather_code);
  
  return {
    name: cityInfo.name,
    main: {
      temp: Math.round(current.temperature_2m * 10) / 10,
      humidity: current.relative_humidity_2m,
      pressure: current.surface_pressure,
      feels_like: Math.round(current.apparent_temperature * 10) / 10,
    },
    wind: {
      speed: Math.round(current.wind_speed_10m * 10) / 10,
      deg: current.wind_direction_10m,
    },
    weather: [{
      main: weatherInfo.main,
      description: weatherInfo.description,
      icon: weatherInfo.icon,
    }],
    visibility: current.visibility || 10000,
    clouds: {
      all: current.cloud_cover || 0,
    },
    dt: Math.floor(new Date(current.time).getTime() / 1000),
    sys: {
      country: cityInfo.country,
      sunrise: current.sunrise ? Math.floor(new Date(current.sunrise).getTime() / 1000) : Date.now() / 1000 - 3600,
      sunset: current.sunset ? Math.floor(new Date(current.sunset).getTime() / 1000) : Date.now() / 1000 + 3600,
    },
    coord: {
      lon: cityInfo.longitude,
      lat: cityInfo.latitude,
    },
    timezone: cityInfo.timezone,
  };
};

export const weatherService = {
  // Debug function to check API configuration
  checkApiConfiguration: () => {
    const config = {
      apiProvider: 'Open-Meteo',
      weatherBaseUrl: WEATHER_BASE_URL,
      geocodingBaseUrl: GEOCODING_BASE_URL,
      geoApiUrl: GEO_API_URL,
      timeout: WEATHER_API_TIMEOUT,
      features: [
        'Free API (no key required)',
        'High accuracy weather data',
        'Hourly and daily forecasts',
        'Global coverage',
        'Real-time data'
      ]
    };
    console.log('Weather Service Configuration:', config);
    return config;
  },

  // Test API connection
  testApiConnection: async () => {
    try {
      console.log('Testing Open-Meteo API connection with London...');
      const coords = await getCityCoordinates('London');
      
      await weatherApi.get('/forecast', {
        params: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          current: 'temperature_2m,relative_humidity_2m,weather_code',
          timezone: 'auto'
        }
      });
      
      return {
        success: true,
        message: 'Open-Meteo API connection successful',
        data: `${coords.name}, ${coords.country}`,
        usingMockData: false,
        provider: 'Open-Meteo'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        usingMockData: false,
        provider: 'Open-Meteo',
        instructions: [
          'Open-Meteo is a free API service',
          'No API key required',
          'Check your internet connection',
          'Visit https://open-meteo.com for more information'
        ]
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
      
      const response = await weatherApi.get('/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'weather_code',
            'surface_pressure',
            'wind_speed_10m',
            'wind_direction_10m',
            'cloud_cover',
            'visibility'
          ].join(','),
          timezone: 'auto'
        }
      });
      
      console.log('Successfully fetched weather data from Open-Meteo API');
      
      // Convert Open-Meteo format to match expected format
      const cityInfo = {
        name: 'Your Location',
        country: 'Unknown',
        latitude: lat,
        longitude: lon,
        timezone: response.data.timezone
      };
      
      return convertToOpenWeatherFormat(response.data, cityInfo);
    } catch (error) {
      console.error('Open-Meteo API error:', error.message);
      throw new Error(`Failed to fetch weather data: ${error.message}`);
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
      
      // Get coordinates for the city
      const cityInfo = await getCityCoordinates(normalizedCity);
      console.log('Found coordinates:', cityInfo);
      
      // Get weather data using coordinates
      const response = await weatherApi.get('/forecast', {
        params: {
          latitude: cityInfo.latitude,
          longitude: cityInfo.longitude,
          current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'weather_code',
            'surface_pressure',
            'wind_speed_10m',
            'wind_direction_10m',
            'cloud_cover',
            'visibility'
          ].join(','),
          timezone: 'auto'
        }
      });
      
      console.log('Successfully fetched weather data from Open-Meteo API for:', normalizedCity);
      return convertToOpenWeatherFormat(response.data, cityInfo);
    } catch (error) {
      console.error('Weather API error:', error.message);
      if (error.message.includes('not found')) {
        throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
      }
      // If it's a validation error, throw it as is
      if (!error.response) {
        throw error;
      }
      throw new Error(`Failed to fetch weather data for ${city}: ${error.message}`);
    }
  },

  // Get weather forecast for a city (7 days)
  getWeatherForecast: async (city) => {
    try {
      // Validate city name first
      const validation = weatherService.validateCityName(city);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      const normalizedCity = validation.normalizedName;
      
      console.log('Fetching forecast data for city:', normalizedCity);
      
      // Get coordinates for the city
      const cityInfo = await getCityCoordinates(normalizedCity);
      console.log('Found coordinates for forecast:', cityInfo);
      
      // Get 7-day hourly forecast from Open-Meteo
      const response = await weatherApi.get('/forecast', {
        params: {
          latitude: cityInfo.latitude,
          longitude: cityInfo.longitude,
          hourly: [
            'temperature_2m',
            'relative_humidity_2m',
            'weather_code',
            'surface_pressure',
            'wind_speed_10m',
            'wind_direction_10m'
          ].join(','),
          timezone: 'auto',
          forecast_days: 7
        }
      });
      
      console.log('Successfully fetched forecast data from Open-Meteo API for:', normalizedCity);
      
      // Convert to OpenWeatherMap-like 5-day forecast format (3-hour intervals)
      const hourlyData = response.data.hourly;
      const forecast = {
        city: { 
          name: cityInfo.name,
          country: cityInfo.country,
          coord: {
            lat: cityInfo.latitude,
            lon: cityInfo.longitude
          }
        },
        list: [],
      };
      
      // Take every 3rd hour to simulate 3-hour intervals (like OpenWeatherMap)
      for (let i = 0; i < hourlyData.time.length && forecast.list.length < 40; i += 3) {
        const weatherInfo = getWeatherDescription(hourlyData.weather_code[i]);
        
        forecast.list.push({
          dt: Math.floor(new Date(hourlyData.time[i]).getTime() / 1000),
          main: {
            temp: Math.round(hourlyData.temperature_2m[i] * 10) / 10,
            humidity: hourlyData.relative_humidity_2m[i],
            pressure: hourlyData.surface_pressure[i],
          },
          weather: [{
            main: weatherInfo.main,
            description: weatherInfo.description,
            icon: weatherInfo.icon,
          }],
          wind: {
            speed: Math.round(hourlyData.wind_speed_10m[i] * 10) / 10,
            deg: hourlyData.wind_direction_10m[i],
          },
          dt_txt: new Date(hourlyData.time[i]).toISOString().replace('T', ' ').slice(0, 19)
        });
      }
      
      return forecast;
    } catch (error) {
      console.error('Weather forecast API error:', error.message);
      if (error.message.includes('not found')) {
        throw new Error(`City "${city}" not found for forecast. Please check the spelling and try again.`);
      }
      // If it's a validation error, throw it as is
      if (!error.response) {
        throw error;
      }
      throw new Error(`Failed to fetch forecast data for ${city}: ${error.message}`);
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