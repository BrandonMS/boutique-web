import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://10.0.0.67:3000'}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message, 'URL:', API_BASE_URL);
    return Promise.reject(error);
  }
);

// Inventory sync hook
let inventoryEventSource = null;

export const setupInventorySync = (onUpdate) => {
  if (inventoryEventSource) {
    inventoryEventSource.close();
  }

  try {
    inventoryEventSource = new EventSource(`${API_BASE_URL}/products/events`);
    
    inventoryEventSource.addEventListener('inventory-updated', () => {
      console.log('Inventory updated from server');
      onUpdate();
    });

    inventoryEventSource.addEventListener('error', (error) => {
      console.error('SSE connection error:', error);
      inventoryEventSource?.close();
    });
  } catch (err) {
    console.error('Failed to setup inventory sync:', err);
  }
};

export const closeInventorySync = () => {
  if (inventoryEventSource) {
    inventoryEventSource.close();
    inventoryEventSource = null;
  }
};

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
  createOrder: (items, shippingAddress, merchantId, accessToken) =>
    apiClient.post('/orders', { items, shippingAddress, merchantId, accessToken }),
  getOrders: () => apiClient.get('/orders'),
};

// Banners
export const bannerService = {
  getBanners: () => apiClient.get('/campaigns/public/banners'),
};

// Sync
export const syncService = {
  syncFromClover: () => apiClient.post('/products/sync'),
};

export default apiClient;
