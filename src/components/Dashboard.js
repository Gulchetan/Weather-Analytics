import React, { useEffect } from 'react';
import styled from 'styled-components';
import { FiUsers, FiCloud, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { userService } from '../services/userService';
import { weatherService } from '../services/weatherService';
import StatsCard from './common/StatsCard';
import Chart from './common/Chart';
import LoadingSkeleton from './common/LoadingSkeleton';

const DashboardContainer = styled.div`
  padding-top: 60px;
  min-height: 100vh;
`;

const WelcomeSection = styled.div`
  background: ${props => props.theme.colors.gradient};
  color: white;
  padding: ${props => props.theme.spacing.xxl};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Dashboard = () => {
  const { 
    users, 
    weather, 
    analytics, 
    loading, 
    errors,
    setLoading, 
    setError, 
    setUsers, 
    setWeather,
    addNotification 
  } = useApp();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch users
      setLoading('users', true);
      try {
        const usersData = await userService.getAllUsers();
        setUsers(usersData);
        addNotification({
          type: 'success',
          message: `Successfully loaded ${usersData.length} users`,
        });
      } catch (error) {
        setError('users', 'Failed to load users');
        addNotification({
          type: 'error',
          message: 'Failed to load user data',
        });
      } finally {
        setLoading('users', false);
      }

      // Fetch weather data (using a default city)
      setLoading('weather', true);
      try {
        const weatherData = await weatherService.getCurrentWeather('London');
        setWeather(weatherData);
      } catch (error) {
        setError('weather', 'Failed to load weather data');
      } finally {
        setLoading('weather', false);
      }
    };

    fetchData();
  }, []);

  const generateChartData = () => {
    if (!users.length) return null;
    
    const domainCounts = users.reduce((acc, user) => {
      const domain = user.email.split('@')[1];
      acc[domain] = (acc[domain] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(domainCounts),
      datasets: [{
        label: 'Users by Email Domain',
        data: Object.values(domainCounts),
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(124, 58, 237, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(37, 99, 235, 1)',
          'rgba(124, 58, 237, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      }]
    };
  };

  const generateActivityData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = months.map(() => Math.floor(Math.random() * 100) + 20);
    
    return {
      labels: months,
      datasets: [{
        label: 'User Activity',
        data,
        borderColor: 'rgba(37, 99, 235, 1)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
      }]
    };
  };

  if (loading.users && loading.weather) {
    return (
      <DashboardContainer>
        <LoadingSkeleton />
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <WelcomeSection>
        <h1>Welcome to Business Intelligence Dashboard</h1>
        <p>Monitor your business metrics, user analytics, and environmental data in real-time</p>
      </WelcomeSection>

      <StatsGrid>
        <StatsCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={FiUsers}
          color="primary"
          change="+12%"
          loading={loading.users}
        />
        <StatsCard
          title="Active Users"
          value={analytics.activeUsers}
          icon={FiActivity}
          color="success"
          change="+8%"
          loading={loading.users}
        />
        <StatsCard
          title="Temperature"
          value={weather?.main?.temp ? `${Math.round(weather.main.temp)}°C` : 'N/A'}
          icon={FiCloud}
          color="info"
          location={weather?.name}
          loading={loading.weather}
        />
        <StatsCard
          title="Conversion Rate"
          value="24.5%"
          icon={FiTrendingUp}
          color="warning"
          change="+3.2%"
        />
      </StatsGrid>

      <ChartsSection>
        <Chart
          title="User Distribution by Email Domain"
          data={generateChartData()}
          type="doughnut"
          loading={loading.users}
        />
        <Chart
          title="User Activity Trend"
          data={generateActivityData()}
          type="line"
          loading={loading.users}
        />
      </ChartsSection>
    </DashboardContainer>
  );
};

export default Dashboard;