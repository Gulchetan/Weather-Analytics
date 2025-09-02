import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { 
  FiSearch, 
  FiX, 
  FiMapPin, 
  FiThermometer, 
  FiDroplet, 
  FiWind, 
  FiEye,
  FiDisc,
  FiSunrise,
  FiSunset,
  FiClock,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { weatherService } from '../services/weatherService';
import LoadingSkeleton from './common/LoadingSkeleton';

const Container = styled.div`
  padding-top: 60px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const Header = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  color: white;
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: 2.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  color: rgba(255,255,255,0.9);
  font-size: 1.2rem;
  margin: 0;
`;

const SearchSection = styled.div`
  max-width: 600px;
  margin: 0 auto ${props => props.theme.spacing.xl} auto;
  padding: 0 ${props => props.theme.spacing.lg};
  position: relative;
`;

const SearchContainer = styled.div`
  position: relative;
  background: rgba(255,255,255,0.15);
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid rgba(255,255,255,0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:focus-within {
    border-color: rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.2);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  }
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  gap: ${props => props.theme.spacing.sm};
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  font-size: ${props => props.theme.fontSizes.lg};
  padding: ${props => props.theme.spacing.sm};
  flex: 1;
  outline: none;
  
  &::placeholder {
    color: rgba(255,255,255,0.6);
  }
`;

const SearchButton = styled.button`
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: rgba(255,255,255,0.3);
    border-color: rgba(255,255,255,0.5);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  transition: all 0.3s ease;
  border-radius: ${props => props.theme.borderRadius.sm};
  
  &:hover {
    color: rgba(255,255,255,0.9);
    background: rgba(255,255,255,0.1);
  }
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255,255,255,0.95);
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid rgba(255,255,255,0.3);
`;

const SuggestionItem = styled.div`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }
`;

const ValidationMessage = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSizes.sm};
  
  ${props => props.type === 'error' && `
    background: rgba(244, 67, 54, 0.2);
    border: 1px solid rgba(244, 67, 54, 0.4);
    color: #ffcdd2;
  `}
  
  ${props => props.type === 'success' && `
    background: rgba(76, 175, 80, 0.2);
    border: 1px solid rgba(76, 175, 80, 0.4);
    color: #c8e6c9;
  `}
`;

const WeatherCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255,255,255,0.15);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
`;

const WeatherHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  position: relative;
`;

const RefreshButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: rgba(255,255,255,0.3);
    border-color: rgba(255,255,255,0.5);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  &.refreshing {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const CityName = styled.h2`
  color: white;
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
`;

const WeatherDescription = styled.p`
  color: rgba(255,255,255,0.9);
  font-size: 1.2rem;
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  text-transform: capitalize;
`;

const Temperature = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin: ${props => props.theme.spacing.md} 0;
`;

const FeelsLike = styled.p`
  color: rgba(255,255,255,0.8);
  margin: 0;
  font-size: 1.1rem;
`;

const LastUpdate = styled.div`
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  margin-top: ${props => props.theme.spacing.sm};
  text-align: center;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.xl};
`;

const DetailCard = styled.div`
  background: rgba(255,255,255,0.1);
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(5px);
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  color: white;
`;

const DetailTitle = styled.h4`
  margin: 0;
  font-size: 1.1rem;
`;

const DetailValue = styled.p`
  color: rgba(255,255,255,0.9);
  margin: 0;
  font-size: 1.3rem;
  font-weight: bold;
`;

const DetailSubtext = styled.p`
  color: rgba(255,255,255,0.7);
  margin: ${props => props.theme.spacing.xs} 0 0 0;
  font-size: 0.9rem;
`;

const CitySearch = () => {
  const { loading, setLoading, addNotification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [lastSearchedCity, setLastSearchedCity] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationMessage, setValidationMessage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const searchInputRef = useRef(null);

  // Get city suggestions when user types
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const citySuggestions = weatherService.getCitySuggestions(searchTerm, 8);
      setSuggestions(citySuggestions);
      setShowSuggestions(citySuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Handle input change with validation
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Real-time validation
    if (value.length > 0) {
      const validation = weatherService.validateCityName(value);
      if (!validation.valid) {
        setValidationMessage({ type: 'error', message: validation.error });
      } else {
        setValidationMessage(null);
      }
    } else {
      setValidationMessage(null);
    }
  };

  // Search for weather data
  const searchWeather = useCallback(async (cityName = searchTerm) => {
    if (!cityName.trim()) {
      setValidationMessage({ type: 'error', message: 'Please enter a city name' });
      return;
    }

    const validation = weatherService.validateCityName(cityName);
    if (!validation.valid) {
      setValidationMessage({ type: 'error', message: validation.error });
      return;
    }

    setLoading('search', true);
    setValidationMessage(null);
    setShowSuggestions(false);

    try {
      const data = await weatherService.getCurrentWeather(cityName.trim());
      setWeatherData(data);
      setLastSearchedCity(data.name);
      setLastUpdate(new Date());
      setValidationMessage({ 
        type: 'success', 
        message: `Weather data loaded for ${data.name}` 
      });
      
      addNotification({
        type: 'success',
        message: `Weather details loaded for ${data.name}`,
      });
      
      // Clear validation message after 3 seconds
      setTimeout(() => {
        setValidationMessage(null);
      }, 3000);
    } catch (error) {
      setValidationMessage({ type: 'error', message: error.message });
      addNotification({
        type: 'error',
        message: `Failed to get weather for ${cityName}`,
      });
    } finally {
      setLoading('search', false);
    }
  }, [searchTerm, setLoading, addNotification]);

  // Refresh current city weather
  const refreshWeather = useCallback(async () => {
    if (!lastSearchedCity) return;
    
    setIsRefreshing(true);
    try {
      await searchWeather(lastSearchedCity);
    } finally {
      setIsRefreshing(false);
    }
  }, [lastSearchedCity, searchWeather]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    searchWeather();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setTimeout(() => {
      searchWeather(suggestion);
    }, 100);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setValidationMessage(null);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <Header>
        <Title>City Weather Search</Title>
        <Subtitle>Get detailed weather information for any city worldwide</Subtitle>
      </Header>

      <SearchSection ref={searchInputRef}>
        <form onSubmit={handleSubmit}>
          <SearchContainer>
            <SearchInputContainer>
              <FiSearch size={20} color="rgba(255,255,255,0.7)" />
              <SearchInput
                type="text"
                placeholder="Enter city name (e.g., London, New York, Tokyo...)"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={loading.search}
              />
              {searchTerm && (
                <ClearButton
                  type="button"
                  onClick={clearSearch}
                  title="Clear search"
                >
                  <FiX size={16} />
                </ClearButton>
              )}
              <SearchButton
                type="submit"
                disabled={loading.search || !searchTerm.trim()}
                title="Search weather"
              >
                {loading.search ? 'Searching...' : 'Search'}
              </SearchButton>
            </SearchInputContainer>
            
            {showSuggestions && suggestions.length > 0 && (
              <SuggestionsContainer>
                {suggestions.map((suggestion, index) => (
                  <SuggestionItem
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <FiMapPin size={14} />
                    {suggestion}
                  </SuggestionItem>
                ))}
              </SuggestionsContainer>
            )}
          </SearchContainer>
        </form>

        {validationMessage && (
          <ValidationMessage type={validationMessage.type}>
            {validationMessage.type === 'error' ? (
              <FiAlertCircle size={16} />
            ) : (
              <FiCheckCircle size={16} />
            )}
            {validationMessage.message}
          </ValidationMessage>
        )}
      </SearchSection>

      {loading.search && (
        <div style={{ padding: '0 20px' }}>
          <LoadingSkeleton />
        </div>
      )}

      {weatherData && !loading.search && (
        <div style={{ padding: '0 20px' }}>
          <WeatherCard>
            <WeatherHeader>
              <RefreshButton
                onClick={refreshWeather}
                disabled={isRefreshing}
                className={isRefreshing ? 'refreshing' : ''}
                title="Refresh weather data"
              >
                <FiRefreshCw size={16} />
                Refresh
              </RefreshButton>
              
              <CityName>
                <FiMapPin size={24} />
                {weatherData.name}
                {weatherData.sys.country && `, ${weatherData.sys.country}`}
              </CityName>
              
              <WeatherDescription>
                {weatherData.weather[0].description}
              </WeatherDescription>
              
              <Temperature>
                {Math.round(weatherData.main.temp)}°C
              </Temperature>
              
              <FeelsLike>
                Feels like {Math.round(weatherData.main.feels_like)}°C
              </FeelsLike>
              
              {lastUpdate && (
                <LastUpdate>
                  <FiClock size={14} style={{ marginRight: '4px' }} />
                  Last updated: {lastUpdate.toLocaleString()}
                </LastUpdate>
              )}
            </WeatherHeader>

            <DetailsGrid>
              <DetailCard>
                <DetailHeader>
                  <FiThermometer size={20} />
                  <DetailTitle>Temperature</DetailTitle>
                </DetailHeader>
                <DetailValue>{Math.round(weatherData.main.temp)}°C</DetailValue>
                <DetailSubtext>
                  Min: {Math.round(weatherData.main.temp_min || weatherData.main.temp)}°C | 
                  Max: {Math.round(weatherData.main.temp_max || weatherData.main.temp)}°C
                </DetailSubtext>
              </DetailCard>

              <DetailCard>
                <DetailHeader>
                  <FiDroplet size={20} />
                  <DetailTitle>Humidity</DetailTitle>
                </DetailHeader>
                <DetailValue>{weatherData.main.humidity}%</DetailValue>
                <DetailSubtext>
                  {weatherData.main.humidity > 70 ? 'High humidity' : 
                   weatherData.main.humidity > 40 ? 'Moderate humidity' : 'Low humidity'}
                </DetailSubtext>
              </DetailCard>

              <DetailCard>
                <DetailHeader>
                  <FiWind size={20} />
                  <DetailTitle>Wind</DetailTitle>
                </DetailHeader>
                <DetailValue>{Math.round(weatherData.wind.speed)} m/s</DetailValue>
                <DetailSubtext>
                  Direction: {weatherData.wind.deg}° 
                  {weatherData.wind.deg && ` (${Math.round(weatherData.wind.deg)}°)`}
                </DetailSubtext>
              </DetailCard>

              <DetailCard>
                <DetailHeader>
                  <FiDisc size={20} />
                  <DetailTitle>Pressure</DetailTitle>
                </DetailHeader>
                <DetailValue>{weatherData.main.pressure} hPa</DetailValue>
                <DetailSubtext>
                  {weatherData.main.pressure > 1013 ? 'High pressure' : 'Low pressure'}
                </DetailSubtext>
              </DetailCard>

              <DetailCard>
                <DetailHeader>
                  <FiEye size={20} />
                  <DetailTitle>Visibility</DetailTitle>
                </DetailHeader>
                <DetailValue>{Math.round(weatherData.visibility / 1000)} km</DetailValue>
                <DetailSubtext>
                  {weatherData.visibility > 8000 ? 'Excellent visibility' : 
                   weatherData.visibility > 5000 ? 'Good visibility' : 'Poor visibility'}
                </DetailSubtext>
              </DetailCard>

              <DetailCard>
                <DetailHeader>
                  <FiSunrise size={20} />
                  <DetailTitle>Sun Times</DetailTitle>
                </DetailHeader>
                <DetailValue>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <FiSunrise size={16} />
                    {formatTime(weatherData.sys.sunrise)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiSunset size={16} />
                    {formatTime(weatherData.sys.sunset)}
                  </div>
                </DetailValue>
                <DetailSubtext>
                  Timezone: {weatherData.timezone || 'UTC'}
                </DetailSubtext>
              </DetailCard>
            </DetailsGrid>
          </WeatherCard>
        </div>
      )}
    </Container>
  );
};

export default CitySearch;