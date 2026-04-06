import api from './api';

export const authService = {
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },
  getMe: async () => {
    return await api.get('/auth/me');
  },
  changePassword: async (data) => {
    return await api.post('/auth/change-password', data);
  },
  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  }
};
