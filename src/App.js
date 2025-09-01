import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import Navbar from './components/Navbar';
import WeatherAnalytics from './components/WeatherAnalytics';
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
                <Route path="/" element={<WeatherAnalytics />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
