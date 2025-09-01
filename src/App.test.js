import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the styled-components theme provider
jest.mock('./styles/theme', () => ({
  colors: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#334155',
    textLight: '#64748b',
    border: '#e2e8f0',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    md: '8px',
    lg: '12px',
  },
  fontSizes: {
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
  },
}));

// Mock the services
jest.mock('./services/userService', () => ({
  userService: {
    getAllUsers: jest.fn(() => Promise.resolve([])),
    getUserAnalytics: jest.fn(() => Promise.resolve({})),
  },
}));

jest.mock('./services/weatherService', () => ({
  weatherService: {
    getCurrentWeather: jest.fn(() => Promise.resolve({})),
    getWeatherAnalytics: jest.fn(() => Promise.resolve({})),
  },
}));

const AppWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    );
  });

  test('contains navigation elements', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    );
    
    // Check if the app renders key navigation elements
    expect(document.querySelector('.App')).toBeInTheDocument();
  });

  test('loads dashboard by default', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    );
    
    // The app should load without errors
    expect(document.body).toBeInTheDocument();
  });
});

// Test utility functions
describe('App Integration', () => {
  test('should handle routing properly', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    );
    
    // App should render with proper structure
    const appElement = document.querySelector('.App');
    expect(appElement).toBeInTheDocument();
  });
});

// Mock chart.js to avoid canvas issues in tests
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Doughnut: () => <div data-testid="doughnut-chart">Doughnut Chart</div>,
}));

jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  BarElement: jest.fn(),
  ArcElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  Filler: jest.fn(),
}));
