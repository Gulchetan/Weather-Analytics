const theme = {
  colors: {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    primaryLight: '#3b82f6',
    secondary: '#7c3aed',
    secondaryDark: '#6d28d9',
    secondaryLight: '#8b5cf6',
    success: '#10b981',
    successDark: '#059669',
    warning: '#f59e0b',
    warningDark: '#d97706',
    error: '#ef4444',
    errorDark: '#dc2626',
    info: '#06b6d4',
    infoDark: '#0891b2',
    
    // Background colors
    background: '#f8fafc',
    backgroundDark: '#f1f5f9',
    surface: '#ffffff',
    surfaceDark: '#f8fafc',
    overlay: 'rgba(0, 0, 0, 0.1)',
    overlayDark: 'rgba(0, 0, 0, 0.3)',
    
    // Text colors
    text: '#334155',
    textSecondary: '#64748b',
    textLight: '#94a3b8',
    textDark: '#1e293b',
    
    // Border colors
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    borderDark: '#cbd5e1',
    
    // State backgrounds
    successBg: '#ecfdf5',
    errorBg: '#fef2f2',
    warningBg: '#fffbeb',
    infoBg: '#f0f9ff',
    
    // Gradients
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientPrimary: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    gradientSecondary: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    
    // Shadows
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowLight: 'rgba(0, 0, 0, 0.05)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',
    cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    cardShadowHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    cardShadowLarge: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%',
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    xxxl: '2rem',
  },
  
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  animations: {
    fadeIn: 'fadeIn 0.3s ease-in-out',
    slideUp: 'slideUp 0.3s ease-in-out',
    slideDown: 'slideDown 0.3s ease-in-out',
    scaleIn: 'scaleIn 0.2s ease-in-out',
  },
};

export default theme;