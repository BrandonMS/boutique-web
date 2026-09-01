import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authService = {
  register: (email, password, firstName, lastName, phoneNumber, address) =>
    apiClient.post('/auth/register', { email, password, firstName, lastName, phoneNumber, address }),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getProfile: () => apiClient.get('/auth/profile'),
};

// Products
export const productService = {
  getProducts: (category = null) => apiClient.get('/products', { params: { category } }),
  getProductById: (id) => apiClient.get(`/products/${id}`),
};

// Orders
export const orderService = {
  createOrder: (items, shippingAddress, idempotencyKey) =>
    apiClient.post('/orders', { items, shippingAddress }, { headers: { 'Idempotency-Key': idempotencyKey } }),
  getOrders: () => apiClient.get('/orders'),
};

// Banners
export const bannerService = {
  getBanners: () => apiClient.get('/campaigns/public/banners'),
};

export default apiClient;
