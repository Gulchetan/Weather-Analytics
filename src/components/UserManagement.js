import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiMail, FiPhone, FiMapPin, FiGlobe } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { userService } from '../services/userService';
import LoadingSkeleton from './common/LoadingSkeleton';

const Container = styled.div`
  padding-top: 60px;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.textDark};
  margin: 0;
  flex: 1;
`;

const SearchContainer = styled.div`
  position: relative;
  min-width: 300px;
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  padding-left: 3rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.md};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textLight};
  font-size: 1.2rem;
`;

const AddButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.colors.cardShadow};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${props => props.theme.colors.cardShadowHover};
    transform: translateY(-4px);
  }
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  color: ${props => props.theme.colors.textDark};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
`;

const Username = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin: 0;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  color: ${props => props.color || props.theme.colors.textLight};
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'edit': return 'rgba(37, 99, 235, 0.1)';
        case 'delete': return 'rgba(239, 68, 68, 0.1)';
        default: return props.theme.colors.borderLight;
      }
    }};
    color: ${props => {
      switch (props.variant) {
        case 'edit': return props.theme.colors.primary;
        case 'delete': return props.theme.colors.error;
        default: return props.theme.colors.textDark;
      }
    }};
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.sm};
  
  svg {
    color: ${props => props.theme.colors.textLight};
    flex-shrink: 0;
  }
  
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Company = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.borderLight};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textLight};
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textLight};
  grid-column: 1 / -1;
`;

const UserManagement = () => {
  const { users, loading, errors, setLoading, setError, setUsers, addNotification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (users.length === 0) {
        setLoading('users', true);
        try {
          const usersData = await userService.getAllUsers();
          setUsers(usersData);
          addNotification({
            type: 'success',
            message: `Successfully loaded ${usersData.length} users`,
          });
        } catch (error) {
          setError('users', error.message);
          addNotification({
            type: 'error',
            message: 'Failed to load users',
          });
        } finally {
          setLoading('users', false);
        }
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm]);

  const handleEdit = (user) => {
    addNotification({
      type: 'info',
      message: `Edit functionality for ${user.name} - Coming soon!`,
    });
  };

  const handleDelete = (user) => {
    addNotification({
      type: 'warning',
      message: `Delete functionality for ${user.name} - Coming soon!`,
    });
  };

  const handleAdd = () => {
    addNotification({
      type: 'info',
      message: 'Add user functionality - Coming soon!',
    });
  };

  if (loading.users) {
    return <LoadingSkeleton />;
  }

  if (errors.users) {
    return (
      <Container>
        <div className="error">
          <h2>Error Loading Users</h2>
          <p>{errors.users}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>User Management</Title>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search users by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        <AddButton onClick={handleAdd}>
          <FiPlus />
          Add User
        </AddButton>
      </Header>

      <UsersGrid>
        {filteredUsers.length === 0 ? (
          <EmptyState>
            <h3>No users found</h3>
            <p>Try adjusting your search criteria</p>
          </EmptyState>
        ) : (
          filteredUsers.map(user => (
            <UserCard key={user.id}>
              <UserHeader>
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <Username>@{user.username}</Username>
                </UserInfo>
                <Actions>
                  <ActionButton 
                    variant="edit" 
                    onClick={() => handleEdit(user)}
                    title="Edit user"
                  >
                    <FiEdit />
                  </ActionButton>
                  <ActionButton 
                    variant="delete" 
                    onClick={() => handleDelete(user)}
                    title="Delete user"
                  >
                    <FiTrash2 />
                  </ActionButton>
                </Actions>
              </UserHeader>
              
              <UserDetails>
                <DetailItem>
                  <FiMail />
                  <span>{user.email}</span>
                </DetailItem>
                <DetailItem>
                  <FiPhone />
                  <span>{user.phone}</span>
                </DetailItem>
                <DetailItem>
                  <FiMapPin />
                  <span>{user.address.city}, {user.address.zipcode}</span>
                </DetailItem>
                <DetailItem>
                  <FiGlobe />
                  <span>{user.website}</span>
                </DetailItem>
              </UserDetails>
              
              <Company>
                {user.company.name}
              </Company>
            </UserCard>
          ))
        )}
      </UsersGrid>
    </Container>
  );
};

export default UserManagement;