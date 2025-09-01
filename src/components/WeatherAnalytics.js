import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { 
  FiThermometer, 
  FiDroplet, 
  FiWind, 
  FiSun,
  FiCloud,
  FiCloudRain,
  FiEye,
  FiMapPin,
  FiRefreshCw,
  FiSearch,
  FiX
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { weatherService } from '../services/weatherService';
import StatsCard from './common/StatsCard';
import Chart from './common/Chart';
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
  position: relative;
`;

const RefreshButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.xl};
  right: ${props => props.theme.spacing.lg};
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.3);
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  transition: all 0.3s ease;
  
  &:hover {
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

const LastUpdate = styled.div`
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
  margin-top: ${props => props.theme.spacing.sm};
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

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
  color: rgba(255,255,255,0.8);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  padding: 0 ${props => props.theme.spacing.lg};
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xl};
  padding: 0 ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  background: ${props => props.active ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'};
  border: 2px solid ${props => props.active ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  
  &:hover {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.4);
    transform: translateY(-1px);
  }
`;

const ContentSection = styled.div`
  padding: 0 ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TrendsContainer = styled.div`
  background: rgba(255,255,255,0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
`;

const TrendsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.15);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.sm};
  border: 2px solid rgba(255,255,255,0.2);
  transition: all 0.3s ease;
  min-width: 250px;
  
  &:focus-within {
    border-color: rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.2);
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  font-size: ${props => props.theme.fontSizes.sm};
  padding: ${props => props.theme.spacing.xs};
  flex: 1;
  outline: none;
  
  &::placeholder {
    color: rgba(255,255,255,0.6);
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  transition: all 0.3s ease;
  margin-left: ${props => props.theme.spacing.xs};
  
  &:hover {
    color: rgba(255,255,255,0.9);
  }
`;

const TrendsTitle = styled.h2`
  color: white;
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  text-align: center;
`;

const TrendsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const TrendCard = styled.div`
  background: rgba(255,255,255,0.15);
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(5px);
`;

const TrendCity = styled.h4`
  color: white;
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const TrendValue = styled.p`
  color: rgba(255,255,255,0.9);
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
`;

const TrendCondition = styled.p`
  color: rgba(255,255,255,0.7);
  margin: ${props => props.theme.spacing.xs} 0 0 0;
  font-size: 0.9rem;
`;

const WeatherAnalytics = () => {
  const { loading, setLoading, addNotification } = useApp();
  const [userLocation, setUserLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weatherAnalytics, setWeatherAnalytics] = useState(null);
  const [weatherTrends, setWeatherTrends] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTrends, setFilteredTrends] = useState(null);

  const filterTabs = [
    { key: 'all', label: 'Overview', icon: FiEye },
    { key: 'hot', label: 'Hot', icon: FiSun },
    { key: 'cold', label: 'Cold', icon: FiThermometer },
    { key: 'rainy', label: 'Rainy', icon: FiCloudRain },
    { key: 'windy', label: 'Windy', icon: FiWind },
    { key: 'humid', label: 'Humid', icon: FiDroplet },
    { key: 'clear', label: 'Clear', icon: FiSun },
    { key: 'cloudy', label: 'Cloudy', icon: FiCloud },
  ];

  // Refresh all weather data
  const refreshWeatherData = useCallback(async (showNotification = true) => {
    setLoading('weather', true);
    setRefreshing(true);
    
    try {
      // Get user location
      const location = await weatherService.getUserLocation();
      setUserLocation(location);
      
      // Get current weather for user location
      const weather = await weatherService.getCurrentWeatherByCoords(location.lat, location.lon);
      setCurrentWeather(weather);
      
      // Get weather analytics
      const analytics = await weatherService.getWeatherAnalytics();
      setWeatherAnalytics(analytics);
      
      // Get initial trends with current filter
      const trends = await weatherService.getWeatherTrends('all'); // Always start with 'all' filter
      setWeatherTrends(trends);
      
      setLastUpdate(new Date());
      
      if (showNotification) {
        addNotification({
          type: 'success',
          message: `Weather analytics refreshed for ${location.city}`,
        });
      }
    } catch (error) {
      if (showNotification) {
        addNotification({
          type: 'error',
          message: 'Failed to refresh weather analytics',
        });
      }
    } finally {
      setLoading('weather', false);
      setRefreshing(false);
    }
  }, [setLoading, addNotification]); // Removed activeFilter from dependencies

  useEffect(() => {
    refreshWeatherData(true);
    
    // Set up auto-refresh every 10 minutes for analytics
    const interval = setInterval(() => {
      refreshWeatherData(false); // Don't show notification for auto-refresh
    }, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array - only run once on mount

  // Separate effect for filter changes - only update trends, not all data
  useEffect(() => {
    const fetchTrends = async () => {
      if (weatherAnalytics) {
        try {
          const trends = await weatherService.getWeatherTrends(activeFilter);
          setWeatherTrends(trends);
          setFilteredTrends(trends); // Initialize filtered trends
        } catch (error) {
          console.error('Failed to fetch weather trends:', error);
        }
      }
    };

    fetchTrends();
  }, [activeFilter, weatherAnalytics]); // Only run when filter changes or analytics are loaded

  // Filter trends based on search term
  useEffect(() => {
    if (!weatherTrends || !weatherTrends.data) {
      setFilteredTrends(weatherTrends);
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredTrends(weatherTrends);
      return;
    }

    const filtered = { ...weatherTrends };
    
    if (activeFilter === 'all' || !Array.isArray(weatherTrends.data)) {
      // For 'all' filter or non-array data, we don't filter the overview data
      setFilteredTrends(weatherTrends);
    } else {
      // Filter the city data based on search term
      const searchLower = searchTerm.toLowerCase();
      filtered.data = weatherTrends.data.filter(item => 
        item.city && item.city.toLowerCase().includes(searchLower)
      );
      setFilteredTrends(filtered);
    }
  }, [weatherTrends, searchTerm, activeFilter]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  const generateTemperatureChart = () => {
    if (!weatherAnalytics?.hotPlaces && !weatherAnalytics?.coldPlaces) return null;
    
    const hotCities = weatherAnalytics.hotPlaces.slice(0, 5).map(place => place.city);
    const hotTemps = weatherAnalytics.hotPlaces.slice(0, 5).map(place => place.temp);
    const coldCities = weatherAnalytics.coldPlaces.slice(0, 5).map(place => place.city);
    const coldTemps = weatherAnalytics.coldPlaces.slice(0, 5).map(place => place.temp);
    
    return {
      labels: [...hotCities, ...coldCities],
      datasets: [{
        label: 'Temperature (°C)',
        data: [...hotTemps, ...coldTemps],
        backgroundColor: [
          ...hotTemps.map(() => 'rgba(255, 99, 132, 0.8)'),
          ...coldTemps.map(() => 'rgba(54, 162, 235, 0.8)')
        ],
        borderColor: [
          ...hotTemps.map(() => 'rgba(255, 99, 132, 1)'),
          ...coldTemps.map(() => 'rgba(54, 162, 235, 1)')
        ],
        borderWidth: 2,
      }]
    };
  };

  const generateConditionsChart = () => {
    if (!weatherAnalytics?.weatherConditions) return null;
    
    return {
      labels: Object.keys(weatherAnalytics.weatherConditions),
      datasets: [{
        label: 'Weather Conditions',
        data: Object.values(weatherAnalytics.weatherConditions),
        backgroundColor: [
          'rgba(255, 206, 84, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
        ],
        borderColor: [
          'rgba(255, 206, 84, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 2,
      }]
    };
  };

  const renderTrendData = () => {
    if (!filteredTrends?.data) return null;

    if (activeFilter === 'all') {
      // Render overview stats
      return (
        <TrendsList>
          <TrendCard>
            <TrendCity>
              <FiThermometer />
              Average Temperature
            </TrendCity>
            <TrendValue>{filteredTrends.data.averageTemperature}°C</TrendValue>
          </TrendCard>
          <TrendCard>
            <TrendCity>
              <FiDroplet />
              Average Humidity
            </TrendCity>
            <TrendValue>{filteredTrends.data.averageHumidity}%</TrendValue>
          </TrendCard>
          <TrendCard>
            <TrendCity>
              <FiWind />
              Average Wind Speed
            </TrendCity>
            <TrendValue>{filteredTrends.data.averageWindSpeed} m/s</TrendValue>
          </TrendCard>
          <TrendCard>
            <TrendCity>
              <FiMapPin />
              Cities Monitored
            </TrendCity>
            <TrendValue>{filteredTrends.data.citiesCount}</TrendValue>
          </TrendCard>
        </TrendsList>
      );
    }

    // Check if we have any filtered results - ensure data is an array
    if (!Array.isArray(filteredTrends.data)) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.7)' }}>
          <p>No trend data available for this filter.</p>
        </div>
      );
    }

    const hasResults = filteredTrends.data.length > 0;
    
    if (!hasResults && searchTerm.trim()) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.7)' }}>
          <FiSearch size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>No cities found matching "{searchTerm}"</p>
          <p>Try a different search term or clear the search to see all results.</p>
        </div>
      );
    }

    // Render filtered trend data
    return (
      <TrendsList>
        {filteredTrends.data.slice(0, 12).map((item, index) => (
          <TrendCard key={index}>
            <TrendCity>
              <FiMapPin />
              {item.city}
            </TrendCity>
            <TrendValue>
              {item.temp && `${item.temp}°C`}
              {item.windSpeed && `${item.windSpeed} m/s`}
              {item.humidity && `${item.humidity}%`}
            </TrendValue>
            <TrendCondition>{item.condition}</TrendCondition>
          </TrendCard>
        ))}
      </TrendsList>
    );
  };

  if (loading.weather) {
    return (
      <Container>
        <LoadingSkeleton />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <RefreshButton 
          onClick={() => refreshWeatherData(true)}
          disabled={refreshing}
          className={refreshing ? 'refreshing' : ''}
        >
          <FiRefreshCw />
          Refresh
        </RefreshButton>
        <Title>Weather Analytics Dashboard</Title>
        <Subtitle>Real-time environmental data and weather trends worldwide</Subtitle>
        {userLocation && (
          <LocationInfo>
            <FiMapPin />
            <span>{userLocation.city}, {userLocation.country}</span>
          </LocationInfo>
        )}
        {lastUpdate && (
          <LastUpdate>
            Last updated: {lastUpdate.toLocaleTimeString()}
          </LastUpdate>
        )}
      </Header>

      <StatsGrid>
        {currentWeather && (
          <>
            <StatsCard
              title="Current Temperature"
              value={`${Math.round(currentWeather.main.temp)}°C`}
              icon={FiThermometer}
              color="primary"
              change={`Feels like ${Math.round(currentWeather.main.feels_like)}°C`}
            />
            <StatsCard
              title="Humidity"
              value={`${currentWeather.main.humidity}%`}
              icon={FiDroplet}
              color="info"
              change="Current level"
            />
            <StatsCard
              title="Wind Speed"
              value={`${Math.round(currentWeather.wind.speed)} m/s`}
              icon={FiWind}
              color="success"
              change={`${Math.round(currentWeather.wind.deg)}° direction`}
            />
            <StatsCard
              title="Conditions"
              value={currentWeather.weather[0].main}
              icon={FiCloud}
              color="warning"
              change={currentWeather.weather[0].description}
            />
          </>
        )}
      </StatsGrid>

      <FilterTabs>
        {filterTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <FilterTab
              key={tab.key}
              active={activeFilter === tab.key}
              onClick={() => setActiveFilter(tab.key)}
            >
              <Icon />
              {tab.label}
            </FilterTab>
          );
        })}
      </FilterTabs>

      <ContentSection>
        <ChartsGrid>
          <Chart
            title="Temperature Distribution"
            data={generateTemperatureChart()}
            type="bar"
            loading={loading.weather}
          />
          <Chart
            title="Weather Conditions"
            data={generateConditionsChart()}
            type="doughnut"
            loading={loading.weather}
          />
        </ChartsGrid>

        <TrendsContainer>
          <TrendsHeader>
            <TrendsTitle>{filteredTrends?.title || 'Weather Trends'}</TrendsTitle>
            {activeFilter !== 'all' && (
              <SearchContainer>
                <FiSearch size={16} />
                <SearchInput
                  type="text"
                  placeholder="Search cities..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <ClearButton onClick={clearSearch}>
                    <FiX size={16} />
                  </ClearButton>
                )}
              </SearchContainer>
            )}
          </TrendsHeader>
          {renderTrendData()}
        </TrendsContainer>
      </ContentSection>
    </Container>
  );
};

export default WeatherAnalytics;