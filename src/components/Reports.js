import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp,
  BarChart3,
  FileText,
  PieChart,
  LineChart,
  Users,
  Globe
} from 'lucide-react';
import Chart from './common/Chart';
import LoadingSkeleton from './common/LoadingSkeleton';

const ReportsContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
`;

const ReportsHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.xl};
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.md};
  }
`;

const HeaderContent = styled.div`
  flex: 1;
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

const ControlsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.primary 
    ? `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.primaryDark})`
    : props.theme.colors.surface};
  color: ${props => props.primary ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.primary ? 'transparent' : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${props => props.theme.fontWeights.semibold};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.primary 
      ? props.theme.colors.primary + '40'
      : props.theme.colors.shadow};
  }
`;

const FiltersContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.colors.cardShadow};
`;

const FilterRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const FilterLabel = styled.label`
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
`;

const FilterSelect = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ReportCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.colors.cardShadow};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ReportTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.bold};
  margin: 0;
`;

const ReportIcon = styled.div`
  color: ${props => props.theme.colors.primary};
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SummaryCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.colors.cardShadow};
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
`;

const SummaryIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.md} auto;
`;

const SummaryValue = styled.div`
  font-size: ${props => props.theme.fontSizes.xxl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const SummaryLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.textSecondary};
`;

const ExportContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.colors.cardShadow};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ExportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const ExportOption = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.borderLight};
    transform: translateY(-2px);
  }
`;

const Reports = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('temperature');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const summaryData = [
    {
      icon: Globe,
      color: '#3B82F6',
      value: '1,247',
      label: 'Cities Monitored'
    },
    {
      icon: Users,
      color: '#10B981',
      value: '523',
      label: 'Active Users'
    },
    {
      icon: BarChart3,
      color: '#8B5CF6',
      value: '12,459',
      label: 'API Requests'
    },
    {
      icon: TrendingUp,
      color: '#F59E0B',
      value: '98.7%',
      label: 'Accuracy Rate'
    }
  ];

  const temperatureData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Temperature (°C)',
      data: [22, 25, 23, 26, 24, 27, 25],
      borderColor: '#3B82F6',
      backgroundColor: '#3B82F620',
      tension: 0.4
    }]
  };

  const humidityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Humidity (%)',
      data: [65, 70, 68, 72, 69, 74, 71],
      backgroundColor: '#10B981',
      borderColor: '#10B981',
    }]
  };

  const weatherDistributionData = {
    labels: ['Sunny', 'Cloudy', 'Rainy', 'Windy', 'Stormy'],
    datasets: [{
      data: [40, 25, 20, 10, 5],
      backgroundColor: ['#F59E0B', '#6B7280', '#3B82F6', '#10B981', '#EF4444']
    }]
  };

  const usageData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'API Calls',
      data: [1200, 1900, 3000, 5000, 4200, 6000],
      borderColor: '#8B5CF6',
      backgroundColor: '#8B5CF620',
      tension: 0.4
    }]
  };

  const handleExport = (format) => {
    // Simulate export functionality
    console.log(`Exporting report as ${format}`);
    // In a real application, this would trigger the actual export
  };

  if (isLoading) {
    return (
      <ReportsContainer>
        <LoadingSkeleton />
      </ReportsContainer>
    );
  }

  return (
    <ReportsContainer>
      <ReportsHeader>
        <HeaderContent>
          <Title>Weather Reports & Analytics</Title>
          <Subtitle>Comprehensive insights and detailed weather data analysis</Subtitle>
        </HeaderContent>
        
        <ControlsContainer>
          <ControlButton primary>
            <Download size={18} />
            Export Report
          </ControlButton>
          <ControlButton>
            <Calendar size={18} />
            Schedule
          </ControlButton>
          <ControlButton>
            <Filter size={18} />
            Advanced Filters
          </ControlButton>
        </ControlsContainer>
      </ReportsHeader>

      <FiltersContainer>
        <FilterRow>
          <FilterGroup>
            <FilterLabel>Time Period</FilterLabel>
            <FilterSelect 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">This Year</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Primary Metric</FilterLabel>
            <FilterSelect 
              value={selectedMetric} 
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="pressure">Pressure</option>
              <option value="wind">Wind Speed</option>
              <option value="precipitation">Precipitation</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Region</FilterLabel>
            <FilterSelect>
              <option value="global">Global</option>
              <option value="na">North America</option>
              <option value="eu">Europe</option>
              <option value="asia">Asia</option>
              <option value="oceania">Oceania</option>
            </FilterSelect>
          </FilterGroup>
        </FilterRow>
      </FiltersContainer>

      <SummaryGrid>
        {summaryData.map((item, index) => {
          const Icon = item.icon;
          return (
            <SummaryCard
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <SummaryIcon color={item.color}>
                <Icon size={28} />
              </SummaryIcon>
              <SummaryValue>{item.value}</SummaryValue>
              <SummaryLabel>{item.label}</SummaryLabel>
            </SummaryCard>
          );
        })}
      </SummaryGrid>

      <ReportsGrid>
        <ReportCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ReportHeader>
            <ReportTitle>Temperature Trends</ReportTitle>
            <ReportIcon>
              <LineChart size={24} />
            </ReportIcon>
          </ReportHeader>
          <Chart
            data={temperatureData}
            type="line"
            height={300}
          />
        </ReportCard>

        <ReportCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ReportHeader>
            <ReportTitle>Humidity Levels</ReportTitle>
            <ReportIcon>
              <BarChart3 size={24} />
            </ReportIcon>
          </ReportHeader>
          <Chart
            data={humidityData}
            type="bar"
            height={300}
          />
        </ReportCard>

        <ReportCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ReportHeader>
            <ReportTitle>Weather Distribution</ReportTitle>
            <ReportIcon>
              <PieChart size={24} />
            </ReportIcon>
          </ReportHeader>
          <Chart
            data={weatherDistributionData}
            type="doughnut"
            height={300}
          />
        </ReportCard>

        <ReportCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ReportHeader>
            <ReportTitle>API Usage Trends</ReportTitle>
            <ReportIcon>
              <TrendingUp size={24} />
            </ReportIcon>
          </ReportHeader>
          <Chart
            data={usageData}
            type="line"
            height={300}
          />
        </ReportCard>
      </ReportsGrid>

      <ExportContainer>
        <ReportTitle>Export Options</ReportTitle>
        <Subtitle style={{ marginTop: '0.5rem' }}>
          Download detailed reports in your preferred format
        </Subtitle>
        
        <ExportGrid>
          <ExportOption
            onClick={() => handleExport('pdf')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText size={32} color="#EF4444" />
            <span>PDF Report</span>
          </ExportOption>
          
          <ExportOption
            onClick={() => handleExport('excel')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart3 size={32} color="#10B981" />
            <span>Excel Data</span>
          </ExportOption>
          
          <ExportOption
            onClick={() => handleExport('csv')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText size={32} color="#3B82F6" />
            <span>CSV Export</span>
          </ExportOption>
          
          <ExportOption
            onClick={() => handleExport('json')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText size={32} color="#8B5CF6" />
            <span>JSON Data</span>
          </ExportOption>
        </ExportGrid>
      </ExportContainer>
    </ReportsContainer>
  );
};

export default Reports;