import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // We will retrieve the token from zustand state by importing it
    // To avoid circular dependency during init, we parse localStorage
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state && state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (e) {
        console.error('Error parsing token from storage');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle global errors like 401 Unauthorized here
    if (error.response && error.response.status === 401) {
        // use authStore logout method
    }
    return Promise.reject(error.response?.data || { message: 'Lỗi kết nối máy chủ' });
  }
);

export default api;
