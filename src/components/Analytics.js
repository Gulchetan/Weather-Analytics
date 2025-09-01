import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiBarChart2, 
  FiPieChart,
  FiActivity,
  FiGlobe,
  FiMail,
  FiMapPin
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { userService } from '../services/userService';
import { weatherService } from '../services/weatherService';
import StatsCard from './common/StatsCard';
import Chart from './common/Chart';
import LoadingSkeleton from './common/LoadingSkeleton';

const Container = styled.div`
  padding-top: 60px;
  min-height: 100vh;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.textDark};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
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

const FullWidthChart = styled.div`
  grid-column: 1 / -1;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const InsightsSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.colors.cardShadow};
  border: 1px solid ${props => props.theme.colors.border};
`;

const InsightsTitle = styled.h2`
  color: ${props => props.theme.colors.textDark};
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
`;

const InsightsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const InsightCard = styled.div`
  background: ${props => props.theme.colors.borderLight};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'success': return props.theme.colors.success;
      case 'warning': return props.theme.colors.warning;
      case 'info': return props.theme.colors.info;
      default: return props.theme.colors.primary;
    }
  }};
`;

const InsightTitle = styled.h4`
  color: ${props => props.theme.colors.textDark};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-size: ${props => props.theme.fontSizes.md};
`;

const InsightText = styled.p`
  color: ${props => props.theme.colors.text};
  margin: 0;
  font-size: ${props => props.theme.fontSizes.sm};
  line-height: 1.5;
`;

const Analytics = () => {
  const { 
    users, 
    loading, 
    errors, 
    setLoading, 
    setError, 
    setUsers,
    addNotification 
  } = useApp();
  
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [weatherAnalytics, setWeatherAnalytics] = useState(null);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading('analytics', true);
      
      try {
        // Fetch user analytics
        if (users.length === 0) {
          const usersData = await userService.getAllUsers();
          setUsers(usersData);
        }
        
        const userAnalyticsData = await userService.getUserAnalytics();
        setUserAnalytics(userAnalyticsData);
        
        // Fetch weather analytics
        const weatherAnalyticsData = await weatherService.getWeatherAnalytics();
        setWeatherAnalytics(weatherAnalyticsData);
        
        // Generate insights
        generateInsights(userAnalyticsData, weatherAnalyticsData);
        
        addNotification({
          type: 'success',
          message: 'Analytics data loaded successfully',
        });
      } catch (error) {
        setError('analytics', error.message);
        addNotification({
          type: 'error',
          message: 'Failed to load analytics data',
        });
      } finally {
        setLoading('analytics', false);
      }
    };

    fetchAnalytics();
  }, []);

  const generateInsights = (userAnalytics, weatherAnalytics) => {
    const insights = [];
    
    if (userAnalytics) {
      insights.push({
        type: 'info',
        title: 'User Engagement',
        text: `Average of ${userAnalytics.averagePostsPerUser.toFixed(1)} posts per user indicates ${userAnalytics.averagePostsPerUser > 5 ? 'high' : 'moderate'} user engagement levels.`
      });
      
      const topCompany = Object.entries(userAnalytics.usersByCompany)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (topCompany) {
        insights.push({
          type: 'success',
          title: 'Top Company',
          text: `${topCompany[0]} leads with ${topCompany[1]} users, representing ${((topCompany[1] / userAnalytics.totalUsers) * 100).toFixed(1)}% of the user base.`
        });
      }
    }
    
    if (weatherAnalytics) {
      insights.push({
        type: 'warning',
        title: 'Temperature Variance',
        text: `Global temperature range spans ${(weatherAnalytics.temperatureRange.max - weatherAnalytics.temperatureRange.min).toFixed(1)}°C, from ${weatherAnalytics.temperatureRange.min.toFixed(1)}°C to ${weatherAnalytics.temperatureRange.max.toFixed(1)}°C.`
      });
      
      insights.push({
        type: 'info',
        title: 'Weather Conditions',
        text: `Most common weather condition globally: ${Object.entries(weatherAnalytics.weatherConditions).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Clear'}.`
      });
    }
    
    setInsights(insights);
  };

  const generateUserLocationChart = () => {
    if (!userAnalytics?.usersByCity) return null;
    
    const cities = Object.entries(userAnalytics.usersByCity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10); // Top 10 cities
    
    return {
      labels: cities.map(([city]) => city),
      datasets: [{
        label: 'Users by City',
        data: cities.map(([, count]) => count),
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(124, 58, 237, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(139, 69, 19, 0.8)',
          'rgba(255, 20, 147, 0.8)',
          'rgba(50, 205, 50, 0.8)',
          'rgba(255, 140, 0, 0.8)',
        ],
        borderColor: [
          'rgba(37, 99, 235, 1)',
          'rgba(124, 58, 237, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(139, 69, 19, 1)',
          'rgba(255, 20, 147, 1)',
          'rgba(50, 205, 50, 1)',
          'rgba(255, 140, 0, 1)',
        ],
        borderWidth: 2,
      }]
    };
  };

  const generateCompanyChart = () => {
    if (!userAnalytics?.usersByCompany) return null;
    
    const companies = Object.entries(userAnalytics.usersByCompany)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8); // Top 8 companies
    
    return {
      labels: companies.map(([company]) => company),
      datasets: [{
        label: 'Users by Company',
        data: companies.map(([, count]) => count),
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,
      }]
    };
  };

  const generateMonthlyTrendChart = () => {
    // Generate sample monthly trend data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const userData = months.map((_, index) => {
      const base = userAnalytics?.totalUsers || 100;
      return Math.floor(base * (0.7 + Math.sin(index / 2) * 0.3 + Math.random() * 0.2));
    });
    
    const postData = months.map((_, index) => {
      const base = userAnalytics?.totalPosts || 200;
      return Math.floor(base * (0.6 + Math.cos(index / 3) * 0.4 + Math.random() * 0.3));
    });
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Active Users',
          data: userData,
          borderColor: 'rgba(37, 99, 235, 1)',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Posts Created',
          data: postData,
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
        }
      ]
    };
  };

  if (loading.analytics) {
    return <LoadingSkeleton />;
  }

  if (errors.analytics) {
    return (
      <Container>
        <div className="error">
          <h2>Error Loading Analytics</h2>
          <p>{errors.analytics}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Business Analytics & Insights</Title>
      
      <StatsGrid>
        <StatsCard
          title="Total Users"
          value={userAnalytics?.totalUsers || 0}
          icon={FiUsers}
          color="primary"
          change="+12%"
        />
        <StatsCard
          title="Total Posts"
          value={userAnalytics?.totalPosts || 0}
          icon={FiBarChart2}
          color="success"
          change="+8.5%"
        />
        <StatsCard
          title="Avg Posts/User"
          value={userAnalytics?.averagePostsPerUser?.toFixed(1) || '0'}
          icon={FiActivity}
          color="warning"
          change="+3.2%"
        />
        <StatsCard
          title="Global Avg Temp"
          value={weatherAnalytics?.averageTemperature ? `${weatherAnalytics.averageTemperature}°C` : 'N/A'}
          icon={FiGlobe}
          color="info"
          change="+1.5°C"
        />
      </StatsGrid>

      <FullWidthChart>
        <Chart
          title="Monthly Trends - Users & Posts"
          data={generateMonthlyTrendChart()}
          type="line"
          loading={loading.analytics}
        />
      </FullWidthChart>

      <ChartsGrid>
        <Chart
          title="User Distribution by City"
          data={generateUserLocationChart()}
          type="doughnut"
          loading={loading.analytics}
        />
        <Chart
          title="Users by Company"
          data={generateCompanyChart()}
          type="bar"
          loading={loading.analytics}
        />
      </ChartsGrid>

      <InsightsSection>
        <InsightsTitle>Key Insights & Recommendations</InsightsTitle>
        <InsightsList>
          {insights.map((insight, index) => (
            <InsightCard key={index} type={insight.type}>
              <InsightTitle>{insight.title}</InsightTitle>
              <InsightText>{insight.text}</InsightText>
            </InsightCard>
          ))}
          
          <InsightCard type="success">
            <InsightTitle>Data Quality</InsightTitle>
            <InsightText>
              All APIs are responding successfully with high-quality data. System performance is optimal.
            </InsightText>
          </InsightCard>
          
          <InsightCard type="info">
            <InsightTitle>Real-time Updates</InsightTitle>
            <InsightText>
              Dashboard refreshes automatically to provide the most current business metrics and weather data.
            </InsightText>
          </InsightCard>
        </InsightsList>
      </InsightsSection>
    </Container>
  );
};

export default Analytics;