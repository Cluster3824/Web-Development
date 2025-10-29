import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'http://localhost:8082/api' : '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Enhanced error messages
    if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error. Please check your connection and try again.';
    } else if (error.response?.status === 500) {
      error.message = 'Server error. Please try again later.';
    } else if (error.response?.status === 403) {
      error.message = 'Access denied. You do not have permission to perform this action.';
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  logout: (refreshToken) => API.post('/auth/logout', { refreshToken }),
  refresh: (refreshToken) => API.post('/auth/refresh', { refreshToken }),
  getMe: () => API.get('/auth/me'),
};

// Books API calls
export const booksAPI = {
  getAllBooks: (params = {}) => {
    const { page = 0, size = 12, sortBy = 'createdAt', sortDir = 'desc' } = params;
    return API.get(`/books?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  },
  getAllBooksSimple: () => API.get('/books/simple'),
  getBookById: (id) => API.get(`/books/${id}`),
  createBook: (bookData) => API.post('/books', bookData),
  updateBook: (id, bookData) => API.put(`/books/${id}`, bookData),
  deleteBook: (id) => API.delete(`/books/${id}`),
  searchBooks: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return API.get(`/books/search?${queryParams.toString()}`);
  },
  getTopRatedBooks: (limit = 10) => API.get(`/books/top-rated?limit=${limit}`),
  getGenres: () => API.get('/books/genres'),
};

// Reviews API calls
export const reviewsAPI = {
  getAllReviews: () => API.get('/reviews'),
  getReviewsByBook: (bookId) => API.get(`/reviews/book/${bookId}`),
  createReview: (reviewData) => API.post('/reviews', reviewData),
  updateReview: (id, reviewData) => API.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => API.delete(`/reviews/${id}`),
};

// Admin API calls
export const adminAPI = {
  getAllUsers: () => API.get('/admin/users'),
  banUser: (userId) => API.put(`/admin/users/${userId}/ban`),
  unbanUser: (userId) => API.put(`/admin/users/${userId}/unban`),
  deleteUser: (userId) => API.delete(`/admin/users/${userId}`),
  getStats: () => API.get('/admin/stats'),
  searchUsers: (query) => API.get(`/admin/users/search?query=${encodeURIComponent(query)}`),
  updateUserRole: (userId, role) => API.put(`/admin/users/${userId}/role`, { role }),
  getUserDetails: (userId) => API.get(`/admin/users/${userId}/details`),
};

export default API;