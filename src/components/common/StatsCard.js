import React from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.colors.cardShadow};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    box-shadow: ${props => props.theme.colors.cardShadowHover};
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Title = styled.h3`
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  background: ${props => {
    switch (props.color) {
      case 'primary': return props.theme.colors.primary;
      case 'success': return props.theme.colors.success;
      case 'warning': return props.theme.colors.warning;
      case 'error': return props.theme.colors.error;
      case 'info': return props.theme.colors.info;
      default: return props.theme.colors.primary;
    }
  }};
`;

const ValueContainer = styled.div`
  margin: ${props => props.theme.spacing.md} 0;
`;

const Value = styled.div`
  font-size: ${props => props.theme.fontSizes.xxxl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.textDark};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Change = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.change?.startsWith('+') ? props.theme.colors.success : props.theme.colors.error};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const Location = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textLight};
  margin-top: ${props => props.theme.spacing.xs};
`;

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary', 
  change, 
  location, 
  loading = false 
}) => {
  return (
    <Card>
      <Header>
        <div>
          <Title>{loading ? <Skeleton width={80} /> : title}</Title>
          <ValueContainer>
            <Value>
              {loading ? <Skeleton width={60} /> : value}
            </Value>
            {change && (
              <Change change={change}>
                {loading ? <Skeleton width={40} /> : change}
              </Change>
            )}
            {location && (
              <Location>
                {loading ? <Skeleton width={50} /> : location}
              </Location>
            )}
          </ValueContainer>
        </div>
        <IconContainer color={color}>
          {loading ? <Skeleton circle width={48} height={48} /> : <Icon />}
        </IconContainer>
      </Header>
    </Card>
  );
};

export default StatsCard;