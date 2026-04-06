import api from './api';

export const policyService = {
  getAll: async () => {
    return await api.get('/fee-policies');
  },
  getById: async (id) => {
    return await api.get(`/fee-policies/${id}`);
  },
  create: async (data) => {
    return await api.post('/fee-policies', data);
  },
  update: async (id, data) => {
    return await api.put(`/fee-policies/${id}`, data);
  },
  delete: async (id) => {
    return await api.delete(`/fee-policies/${id}`);
  }
};
