import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public API endpoints
export const publicAPI = {
  // Get menu items
  getMenu: () => api.get('/menu'),
  
  // Place an order
  placeOrder: (tableNumber, items) => api.post('/order', { tableNumber, items }),
  
  // Get orders for a table
  getTableOrders: (tableNumber) => api.get(`/order/${tableNumber}`),
};

// Admin API endpoints
export const adminAPI = {
  // Login
  login: (username, password) => api.post('/admin/login', { username, password }),
  
  // Get all orders
  getOrders: () => api.get('/admin/orders'),
  
  // Update order status
  updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),
  
  // Menu management
  getMenuItems: () => api.get('/admin/menu'),
  addMenuItem: (item) => api.post('/admin/menu', item),
  updateMenuItem: (id, item) => api.put(`/admin/menu/${id}`, item),
  deleteMenuItem: (id) => api.delete(`/admin/menu/${id}`),
};

export default api; 