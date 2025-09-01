import React from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

const Container = styled.div`
  padding-top: 60px;
  min-height: 100vh;
`;

const SkeletonCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.colors.cardShadow};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingSkeleton = () => {
  return (
    <Container>
      {/* Welcome Section */}
      <SkeletonCard>
        <Skeleton height={40} style={{ marginBottom: '1rem' }} />
        <Skeleton height={20} width="60%" />
      </SkeletonCard>

      {/* Stats Cards */}
      <StatsGrid>
        {[1, 2, 3, 4].map(i => (
          <SkeletonCard key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <Skeleton width={80} height={16} style={{ marginBottom: '1rem' }} />
                <Skeleton width={60} height={32} style={{ marginBottom: '0.5rem' }} />
                <Skeleton width={40} height={14} />
              </div>
              <Skeleton circle width={48} height={48} />
            </div>
          </SkeletonCard>
        ))}
      </StatsGrid>

      {/* Charts */}
      <ChartsGrid>
        {[1, 2].map(i => (
          <SkeletonCard key={i} style={{ height: '400px' }}>
            <Skeleton width={200} height={24} style={{ marginBottom: '2rem' }} />
            <div style={{ height: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Skeleton height={20} />
              <Skeleton height={40} />
              <Skeleton height={60} />
              <Skeleton height={40} />
              <Skeleton height={30} />
              <Skeleton height={50} />
            </div>
          </SkeletonCard>
        ))}
      </ChartsGrid>
    </Container>
  );
};

export default LoadingSkeleton;