import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiBarChart2, 
  FiMenu, 
  FiBell, 
  FiSearch,
  FiHome,
  FiFileText,
  FiSettings,
  FiInfo,
  FiMessageCircle
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const SidebarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: ${props => props.isOpen ? '0' : '-250px'};
  width: 250px;
  height: 100vh;
  background: ${props => props.theme.colors.surface};
  box-shadow: ${props => props.theme.colors.cardShadow};
  transition: left 0.3s ease;
  z-index: ${props => props.theme.zIndex.fixed};
  border-right: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    width: 100%;
    left: ${props => props.isOpen ? '0' : '-100%'};
  }
`;

const Header = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  margin: 0;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  
  &:hover {
    background: ${props => props.theme.colors.borderLight};
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: ${props => props.theme.spacing.md} 0;
`;

const NavItem = styled.li`
  margin: ${props => props.theme.spacing.xs} 0;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text};
  text-decoration: none;
  font-weight: ${props => props.isActive ? props.theme.fontWeights.semibold : props.theme.fontWeights.normal};
  background: ${props => props.isActive ? props.theme.colors.borderLight : 'transparent'};
  border-right: ${props => props.isActive ? `3px solid ${props.theme.colors.primary}` : 'none'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.borderLight};
    color: ${props => props.theme.colors.primary};
  }
  
  svg {
    margin-right: ${props => props.theme.spacing.md};
    font-size: 1.2rem;
  }
`;

const TopBar = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: ${props => props.sidebarOpen ? '250px' : '0'};
  height: 60px;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.lg};
  z-index: ${props => props.theme.zIndex.sticky};
  transition: left 0.3s ease;
  
  @media (max-width: 768px) {
    left: 0;
  }
`;

const NotificationButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
  position: relative;
  
  &:hover {
    background: ${props => props.theme.colors.borderLight};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background: ${props => props.theme.colors.error};
  color: white;
  border-radius: ${props => props.theme.borderRadius.full};
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: ${props => props.theme.zIndex.modal - 10};
  display: ${props => props.show ? 'block' : 'none'};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const Navbar = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar, notifications } = useApp();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/analytics', label: 'Weather Analytics', icon: FiBarChart2 },
    { path: '/search', label: 'City Search', icon: FiSearch },
    { path: '/reports', label: 'Reports', icon: FiFileText },
    { path: '/chatbot', label: 'AI Assistant', icon: FiMessageCircle },
    { path: '/settings', label: 'Settings', icon: FiSettings },
    { path: '/about', label: 'About', icon: FiInfo },
  ];

  return (
    <>
      <TopBar sidebarOpen={sidebarOpen}>
        <MenuButton onClick={toggleSidebar}>
          <FiMenu />
        </MenuButton>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <NotificationButton>
            <FiBell />
            {notifications.length > 0 && (
              <NotificationBadge>{notifications.length}</NotificationBadge>
            )}
          </NotificationButton>
        </div>
      </TopBar>
      
      <Overlay show={sidebarOpen} onClick={toggleSidebar} />
      
      <SidebarContainer isOpen={sidebarOpen}>
        <Header>
          <Logo>Weather Pro</Logo>
        </Header>
        
        <NavList>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavItem key={item.path}>
                <NavLink 
                  to={item.path} 
                  isActive={location.pathname === item.path}
                  onClick={() => window.innerWidth <= 768 && toggleSidebar()}
                >
                  <Icon />
                  {item.label}
                </NavLink>
              </NavItem>
            );
          })}
        </NavList>
      </SidebarContainer>
    </>
  );
};

export default Navbar;