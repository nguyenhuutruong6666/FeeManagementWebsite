import api from './api';

export const unitService = {
  getAll: async () => {
    return await api.get('/units');
  },
  getBrands: async () => {
    return await api.get('/units/brands');
  },
  create: async (data) => {
    return await api.post('/units', data);
  }
};
