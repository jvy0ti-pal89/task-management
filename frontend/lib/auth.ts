import api, { setAccessToken } from './api';

export interface LoginResponse {
  accessToken: string;
}

export const authService = {
  register: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/register', { email, password });
    setAccessToken(response.data.accessToken);
    return response.data;
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    setAccessToken(response.data.accessToken);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },

  refreshToken: async (): Promise<LoginResponse> => {
    const response = await api.post('/auth/refresh');
    setAccessToken(response.data.accessToken);
    return response.data;
  },
};
