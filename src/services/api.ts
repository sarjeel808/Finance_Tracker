
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Expense API endpoints
export const expenseApi = {
  getAll: () => api.get('/expenses'),
  add: (expenseData: any) => api.post('/expenses', expenseData),
  update: (id: string, expenseData: any) => api.put(`/expenses/${id}`, expenseData),
  delete: (id: string) => api.delete(`/expenses/${id}`),
};

// Budget API endpoints
export const budgetApi = {
  getAll: () => api.get('/budgets'),
  add: (budgetData: any) => api.post('/budgets', budgetData),
  update: (id: string, budgetData: any) => api.put(`/budgets/${id}`, budgetData),
  delete: (id: string) => api.delete(`/budgets/${id}`),
  calculateSpent: () => api.get('/budgets/calculate'),
};

// Savings Goal API endpoints
export const savingsApi = {
  getAll: () => api.get('/savings'),
  add: (savingsData: any) => api.post('/savings', savingsData),
  update: (id: string, savingsData: any) => api.put(`/savings/${id}`, savingsData),
  delete: (id: string) => api.delete(`/savings/${id}`),
  contribute: (id: string, amount: number) => api.post(`/savings/${id}/contribute`, { amount }),
};

export default api;
