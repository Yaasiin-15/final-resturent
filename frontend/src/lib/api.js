import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401 && !error.config.url.includes('/auth/signin')) {
      console.warn('Authentication failed, clearing tokens and redirecting to login')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    // Handle bad request errors that might be related to token issues
    if (error.response?.status === 400 && error.response?.data?.errorCode === 'INVALID_ARGUMENT') {
      console.warn('Invalid argument error, possibly related to token:', error.response.data.message)
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/signin', credentials),
  register: (userData) => api.post('/auth/signup', userData),
}

// Menu API
export const menuAPI = {
  getAll: () => api.get('/menu/items'),
  getById: (id) => api.get(`/menu/items/${id}`),
  getByCategory: (category) => api.get(`/menu/items/category/${category}`),
  getAvailable: () => api.get('/menu/items/available'),
  create: (menuItem) => api.post('/menu/items', menuItem),
  update: (id, menuItem) => api.put(`/menu/items/${id}`, menuItem),
  delete: (id) => api.delete(`/menu/items/${id}`),
}

// Table API
export const tableAPI = {
  getAll: () => api.get('/tables'),
  getById: (id) => api.get(`/tables/${id}`),
  getByStatus: (status) => api.get(`/tables/status/${status}`),
  getByCapacity: (capacity) => api.get(`/tables/capacity/${capacity}`),
  create: (table) => api.post('/tables', table),
  update: (id, table) => api.put(`/tables/${id}`, table),
  updateStatus: (id, status) => api.put(`/tables/${id}/status`, status),
  delete: (id) => api.delete(`/tables/${id}`),
}

// Order API
export const orderAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getByStatus: (status) => api.get(`/orders/status/${status}`),
  create: (order) => api.post('/orders', order),
  update: (id, order) => api.put(`/orders/${id}`, order),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, status),
  delete: (id) => api.delete(`/orders/${id}`),
}

// Reservation API
export const reservationAPI = {
  getAll: () => api.get('/reservations'),
  getById: (id) => api.get(`/reservations/${id}`),
  getByStatus: (status) => api.get(`/reservations/status/${status}`),
  create: (reservation) => api.post('/reservations', reservation),
  update: (id, reservation) => api.put(`/reservations/${id}`, reservation),
  updateStatus: (id, status) => api.put(`/reservations/${id}/status`, status),
  delete: (id) => api.delete(`/reservations/${id}`),
}

export { api }
export default api