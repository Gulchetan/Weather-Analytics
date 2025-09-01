import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.background};
    overflow-x: hidden;
  }

  .App {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    padding: 2rem;
    margin-left: 250px;
    transition: margin-left 0.3s ease;
    
    @media (max-width: 768px) {
      margin-left: 0;
      padding: 1rem;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  input {
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  .error {
    color: ${props => props.theme.colors.error};
    text-align: center;
    padding: 2rem;
    background-color: ${props => props.theme.colors.errorBg};
    border-radius: 8px;
    margin: 1rem 0;
  }

  .success {
    color: ${props => props.theme.colors.success};
    text-align: center;
    padding: 1rem;
    background-color: ${props => props.theme.colors.successBg};
    border-radius: 8px;
    margin: 1rem 0;
  }
`;

export default GlobalStyle;