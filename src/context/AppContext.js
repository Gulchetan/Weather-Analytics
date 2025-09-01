import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  weather: null,
  userLocation: null,
  weatherAnalytics: null,
  loading: {
    weather: false,
    analytics: false,
  },
  errors: {
    weather: null,
    analytics: null,
  },
  notifications: [],
  theme: 'light',
  sidebarOpen: true,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.value,
        },
      };
    
    case 'SET_USER_LOCATION':
      return {
        ...state,
        userLocation: action.payload,
      };
    
    case 'SET_WEATHER_ANALYTICS':
      return {
        ...state,
        weatherAnalytics: action.payload,
      };
    
    case 'SET_WEATHER':
      return {
        ...state,
        weather: action.payload,
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: Date.now() }],
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = (key, value) => {
    dispatch({ type: 'SET_LOADING', payload: { key, value } });
  };

  const setError = (key, value) => {
    dispatch({ type: 'SET_ERROR', payload: { key, value } });
  };

  const setUserLocation = (location) => {
    dispatch({ type: 'SET_USER_LOCATION', payload: location });
  };

  const setWeatherAnalytics = (analytics) => {
    dispatch({ type: 'SET_WEATHER_ANALYTICS', payload: analytics });
  };

  const setWeather = (weather) => {
    dispatch({ type: 'SET_WEATHER', payload: weather });
  };

  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id || Date.now() });
    }, 5000);
  };

  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    localStorage.setItem('theme', theme);
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const value = {
    ...state,
    setLoading,
    setError,
    setUserLocation,
    setWeatherAnalytics,
    setWeather,
    addNotification,
    removeNotification,
    toggleSidebar,
    setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;