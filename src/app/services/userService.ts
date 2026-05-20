import { fetcher } from './api';
import { User } from './types';

export const userService = {
  async getMe(): Promise<User> {
    return fetcher<User>('/api/v1/users/me');
  },

  async updateMe(data: any): Promise<User> {
    return fetcher<User>('/api/v1/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getMyActivities(): Promise<any> {
    return fetcher('/api/v1/users/me/activities');
  },

  async getMyBookmarks(): Promise<any> {
    return fetcher('/api/v1/users/me/bookmarks');
  }
};
