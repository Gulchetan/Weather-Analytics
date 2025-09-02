import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import WeatherAnalytics from './components/WeatherAnalytics';
import CitySearch from './components/CitySearch';
import Reports from './components/Reports';
import Chatbot from './components/Chatbot';
import Settings from './components/Settings';
import About from './components/About';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <GlobalStyle />
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<WeatherAnalytics />} />
                <Route path="/search" element={<CitySearch />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            
            {/* Floating Chatbot */}
            <Chatbot isFloating={true} />
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: theme.colors.surface,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  boxShadow: theme.colors.cardShadow,
                },
                success: {
                  iconTheme: {
                    primary: theme.colors.success,
                    secondary: 'white',
                  },
                },
                error: {
                  iconTheme: {
                    primary: theme.colors.error,
                    secondary: 'white',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
