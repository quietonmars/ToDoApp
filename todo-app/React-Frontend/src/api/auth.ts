import api from './api';

export const register = (username: string, password: string) => {
  return api.post('auth/register/', { username, password });
};

export const login = (username: string, password: string) => {
  return api.post('auth/login/', { username, password });
};

export const logout = () => {
  return api.post('auth/logout/');
};

export const checkAuth = () => {
  return api.get('auth/check/');
};

export const checkAuthStatus = async () => {
  try {
    const response = await api.get('auth/check/');
    return response.data;
  } catch (error) {
    throw error;
  }
};