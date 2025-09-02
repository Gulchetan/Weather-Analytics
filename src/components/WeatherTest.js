import React, { useState, useEffect } from 'react';
import weatherService from '../services/weatherService';

const WeatherTest = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiConfig, setApiConfig] = useState(null);

  useEffect(() => {
    // Check API configuration on mount
    const config = weatherService.checkApiConfiguration();
    setApiConfig(config);
  }, []);

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await weatherService.testApiConnection();
      console.log('API Test Result:', result);
      if (result.success) {
        alert('✅ API connection successful!');
      } else {
        alert(`❌ API connection failed: ${result.error}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city = 'London') => {
    setLoading(true);
    setError(null);
    setWeather(null);
    
    try {
      const data = await weatherService.getCurrentWeather(city);
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Weather Service Test</h2>
      
      {/* API Configuration */}
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>API Configuration</h3>
        {apiConfig && (
          <div>
            <p><strong>Provider:</strong> {apiConfig.apiProvider || 'Open-Meteo'}</p>
            <p><strong>Weather API:</strong> {apiConfig.weatherBaseUrl}</p>
            <p><strong>Geocoding API:</strong> {apiConfig.geocodingBaseUrl}</p>
            <p><strong>Features:</strong></p>
            <ul>
              {(apiConfig.features || []).map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}\n      </div>

      {/* Test Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testApiConnection} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 15px' }}
        >
          Test API Connection
        </button>
        <button 
          onClick={() => fetchWeather('London')} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 15px' }}
        >
          Get London Weather
        </button>
        <button 
          onClick={() => fetchWeather('New York')} 
          disabled={loading}
          style={{ padding: '10px 15px' }}
        >
          Get New York Weather
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
          Loading...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ padding: '10px', backgroundColor: '#ffebee', borderRadius: '5px', color: '#c62828' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Weather Data */}
      {weather && (
        <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '5px', marginTop: '10px' }}>
          <h3>Weather Data for {weather.name}</h3>
          <p><strong>Temperature:</strong> {Math.round(weather.main.temp)}°C</p>
          <p><strong>Feels Like:</strong> {Math.round(weather.main.feels_like)}°C</p>
          <p><strong>Description:</strong> {weather.weather[0].description}</p>
          <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
          <p><strong>Wind Speed:</strong> {Math.round(weather.wind.speed)} m/s</p>
          <p><strong>Pressure:</strong> {weather.main.pressure} hPa</p>
          
          <details style={{ marginTop: '10px' }}>
            <summary>Raw Data (Click to expand)</summary>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(weather, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default WeatherTest;