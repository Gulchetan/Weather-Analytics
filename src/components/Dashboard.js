import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  TrendingUp, 
  Users, 
  Globe, 
  Activity,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Eye,
  Droplets
} from 'lucide-react';
import StatsCard from './common/StatsCard';
import Chart from './common/Chart';
import LoadingSkeleton from './common/LoadingSkeleton';

const DashboardContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.xxl};
  font-weight: ${props => props.theme.fontWeights.bold};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.lg};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const QuickStatsContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.colors.cardShadow};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const QuickStatItem = styled(motion.div)`
  text-align: center;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const QuickStatIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.primary};
`;

const QuickStatValue = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const QuickStatLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const RecentActivityContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.colors.cardShadow};
`;

const ActivityItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background: ${props => props.theme.colors.borderLight};
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ActivityDescription = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalCities: 0,
    activeUsers: 0,
    weatherRequests: 0,
    systemUptime: '99.9%'
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setDashboardData({
        totalCities: 1247,
        activeUsers: 523,
        weatherRequests: 12459,
        systemUptime: '99.9%'
      });
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const statsCards = [
    {
      title: 'Total Cities',
      value: dashboardData.totalCities.toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: Globe,
      color: '#3B82F6'
    },
    {
      title: 'Active Users',
      value: dashboardData.activeUsers.toLocaleString(),
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: '#10B981'
    },
    {
      title: 'Weather Requests',
      value: dashboardData.weatherRequests.toLocaleString(),
      change: '+23%',
      trend: 'up',
      icon: Cloud,
      color: '#8B5CF6'
    },
    {
      title: 'System Uptime',
      value: dashboardData.systemUptime,
      change: 'Excellent',
      trend: 'up',
      icon: Activity,
      color: '#F59E0B'
    }
  ];

  const quickStats = [
    { icon: Sun, value: '24°C', label: 'Avg Temperature', color: '#F59E0B' },
    { icon: CloudRain, value: '65%', label: 'Humidity', color: '#3B82F6' },
    { icon: Wind, value: '12 km/h', label: 'Wind Speed', color: '#10B981' },
    { icon: Eye, value: '10 km', label: 'Visibility', color: '#8B5CF6' },
    { icon: Droplets, value: '1013 hPa', label: 'Pressure', color: '#EF4444' },
    { icon: Thermometer, value: '18°C', label: 'Feels Like', color: '#F97316' }
  ];

  const recentActivities = [
    {
      icon: Globe,
      color: '#3B82F6',
      title: 'New City Added',
      description: 'Tokyo weather data has been integrated'
    },
    {
      icon: Users,
      color: '#10B981',
      title: 'User Milestone',
      description: '500+ active users this month'
    },
    {
      icon: TrendingUp,
      color: '#8B5CF6',
      title: 'Analytics Update',
      description: 'Weekly weather trends generated'
    },
    {
      icon: Cloud,
      color: '#F59E0B',
      title: 'API Enhancement',
      description: 'Weather forecast accuracy improved'
    }
  ];

  const temperatureData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Average Temperature (°C)',
      data: [15, 18, 22, 25, 28, 32],
      borderColor: '#3B82F6',
      backgroundColor: '#3B82F620',
      tension: 0.4
    }]
  };

  const weatherDistributionData = {
    labels: ['Sunny', 'Cloudy', 'Rainy', 'Windy'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: ['#F59E0B', '#6B7280', '#3B82F6', '#10B981']
    }]
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <LoadingSkeleton />
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>Weather Analytics Dashboard</Title>
        <Subtitle>Real-time insights and comprehensive weather data overview</Subtitle>
      </DashboardHeader>

      <StatsGrid>
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </StatsGrid>

      <QuickStatsContainer>
        <Title style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Current Weather Overview
        </Title>
        <QuickStatsGrid>
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <QuickStatItem
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <QuickStatIcon>
                  <Icon size={24} color={stat.color} />
                </QuickStatIcon>
                <QuickStatValue>{stat.value}</QuickStatValue>
                <QuickStatLabel>{stat.label}</QuickStatLabel>
              </QuickStatItem>
            );
          })}
        </QuickStatsGrid>
      </QuickStatsContainer>

      <ChartsGrid>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Chart
            title="Temperature Trends"
            subtitle="Monthly average temperatures"
            data={temperatureData}
            type="line"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Chart
            title="Weather Distribution"
            subtitle="Current weather conditions"
            data={weatherDistributionData}
            type="doughnut"
          />
        </motion.div>
      </ChartsGrid>

      <RecentActivityContainer>
        <Title style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Recent Activities
        </Title>
        {recentActivities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <ActivityItem
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <ActivityIcon color={activity.color}>
                <Icon size={20} />
              </ActivityIcon>
              <ActivityContent>
                <ActivityTitle>{activity.title}</ActivityTitle>
                <ActivityDescription>{activity.description}</ActivityDescription>
              </ActivityContent>
            </ActivityItem>
          );
        })}
      </RecentActivityContainer>
    </DashboardContainer>
  );
};

export default Dashboard;