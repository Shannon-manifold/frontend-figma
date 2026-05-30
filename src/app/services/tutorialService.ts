import { fetcher } from './api';
import { TutorialResponse, TutorialDetailResponse, VerifyResponse } from './types';

export const tutorialService = {
  async getAllTutorials(): Promise<TutorialResponse[]> {
    return fetcher<TutorialResponse[]>('/api/tutorials');
  },

  async getTutorialDetail(id: number): Promise<TutorialDetailResponse> {
    return fetcher<TutorialDetailResponse>(`/api/tutorials/${id}`);
  },

  async getMyProgress(): Promise<any> {
    return fetcher('/api/users/me/tutorials/progress');
  },

  async verifyStep(tutorialId: number, stepId: number, code: string): Promise<VerifyResponse> {
    return fetcher<VerifyResponse>(`/api/tutorials/${tutorialId}/steps/${stepId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  async completeStep(tutorialId: number, stepId: number): Promise<void> {
    await fetcher(`/api/tutorials/${tutorialId}/steps/${stepId}/complete`, {
      method: 'POST',
    });
  },

  async toggleBookmark(tutorialId: number): Promise<string> {
    return fetcher<string>(`/api/tutorials/${tutorialId}/bookmarks`, {
      method: 'POST',
    });
  }
};
