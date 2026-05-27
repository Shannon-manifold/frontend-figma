import { fetcher } from './api';
import { NotificationResponse } from './types';

export const notificationService = {
  async getNotifications(): Promise<NotificationResponse[]> {
    return fetcher<NotificationResponse[]>('/api/v1/notifications');
  },

  async readNotification(id: number): Promise<void> {
    await fetcher(`/api/v1/notifications/${id}/read`, {
      method: 'POST',
    });
  },

  async readAllNotifications(): Promise<void> {
    await fetcher('/api/v1/notifications/read-all', {
      method: 'POST',
    });
  }
};
