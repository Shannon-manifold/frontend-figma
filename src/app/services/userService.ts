import { fetcher } from './api';
import { User, UserResponse } from './types';

export const userService = {
  async getMe(): Promise<User> {
    return fetcher<User>('/api/v1/users/me');
  },

  async updateMe(data: any): Promise<UserResponse> {
    return fetcher<UserResponse>('/api/v1/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getMyActivities(): Promise<any> {
    return fetcher('/api/v1/users/me/activities');
  },

  async getMyBookmarks(): Promise<any> {
    return fetcher('/api/v1/users/me/bookmarks');
  },

  async getContributors(): Promise<UserResponse[]> {
    return fetcher<UserResponse[]>('/api/v1/users');
  },

  async getUserProfile(userId: number): Promise<UserResponse> {
    return fetcher<UserResponse>(`/api/v1/users/${userId}`);
  },

  async deleteMe(): Promise<void> {
    await fetcher('/api/v1/users/me', {
      method: 'DELETE',
    });
  }
};

