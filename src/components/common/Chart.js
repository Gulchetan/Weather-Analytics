import React from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import Skeleton from 'react-loading-skeleton';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.colors.cardShadow};
  border: 1px solid ${props => props.theme.colors.border};
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const ChartTitle = styled.h3`
  color: ${props => props.theme.colors.textDark};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  text-align: center;
`;

const ChartWrapper = styled.div`
  flex: 1;
  position: relative;
  min-height: 0; /* Important for flexbox */
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: ${props => props.theme.colors.textLight};
  text-align: center;
`;

const Chart = ({ title, data, type = 'line', loading = false, options = {} }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
      y: {
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
        },
        ticks: {
          color: '#64748b',
        },
      },
    } : {},
    ...options,
  };

  const renderChart = () => {
    if (!data) {
      return (
        <EmptyState>
          <p>No data available</p>
        </EmptyState>
      );
    }

    switch (type) {
      case 'line':
        return <Line data={data} options={defaultOptions} />;
      case 'bar':
        return <Bar data={data} options={defaultOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={defaultOptions} />;
      default:
        return <Line data={data} options={defaultOptions} />;
    }
  };

  return (
    <ChartContainer>
      <ChartTitle>
        {loading ? <Skeleton width={200} /> : title}
      </ChartTitle>
      <ChartWrapper>
        {loading ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton height={20} />
            <Skeleton height={40} />
            <Skeleton height={60} />
            <Skeleton height={40} />
            <Skeleton height={30} />
            <Skeleton height={50} />
          </div>
        ) : (
          renderChart()
        )}
      </ChartWrapper>
    </ChartContainer>
  );
};

export default Chart;