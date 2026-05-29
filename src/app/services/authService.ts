import { fetcher } from './api';
import { LoginResponse, RegisterResponse } from './types';

export const authService = {
  async login(credentials: any): Promise<LoginResponse> {
    const data = await fetcher<LoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },

  async register(registrationData: any): Promise<RegisterResponse> {
    return fetcher<RegisterResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
};
