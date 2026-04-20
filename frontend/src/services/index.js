import api from './api';

// Authentication
export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', {
      token,
      new_password: newPassword
    });
    return response.data;
  },
};

// User
export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/user/password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/user/account');
    return response.data;
  },
};

// Predictions
export const predictionService = {
  create: async (data) => {
    const response = await api.post('/predictions', data);
    return response.data;
  },

  upload: async (formData) => {
    const response = await api.post('/predictions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async (params) => {
    const response = await api.get('/predictions', { params });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/predictions/${id}`);
    return response.data;
  },

  clear: async () => {
    const response = await api.delete('/predictions/clear');
    return response.data;
  },

  export: async () => {
    const response = await api.get('/predictions/export', {
      responseType: 'blob'
    });
    return response.data;
  },
};

// Admin
export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUser: async (userId, data) => {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getAllPredictions: async (params) => {
    const response = await api.get('/admin/predictions', { params });
    return response.data;
  },
};
