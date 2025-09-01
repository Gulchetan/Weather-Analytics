import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error occurred');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout');
    }
    throw new Error('Network error occurred');
  }
);

export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  },

  // Get posts by user
  getUserPosts: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/posts`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user posts: ${error.message}`);
    }
  },

  // Get all posts
  getAllPosts: async () => {
    try {
      const response = await api.get('/posts');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }
  },

  // Create a new user (simulation)
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  // Update user (simulation)
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  },

  // Delete user (simulation)
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  },

  // Get user analytics
  getUserAnalytics: async () => {
    try {
      const users = await userService.getAllUsers();
      const posts = await userService.getAllPosts();
      
      const analytics = {
        totalUsers: users.length,
        totalPosts: posts.length,
        averagePostsPerUser: posts.length / users.length,
        usersByCompany: users.reduce((acc, user) => {
          const company = user.company.name;
          acc[company] = (acc[company] || 0) + 1;
          return acc;
        }, {}),
        usersByCity: users.reduce((acc, user) => {
          const city = user.address.city;
          acc[city] = (acc[city] || 0) + 1;
          return acc;
        }, {}),
      };
      
      return analytics;
    } catch (error) {
      throw new Error(`Failed to fetch user analytics: ${error.message}`);
    }
  },
};

export default userService;