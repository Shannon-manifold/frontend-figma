import { fetcher } from './api';
import { TutorialResponse, TutorialDetailResponse } from './types';

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

  async completeStep(tutorialId: number, stepId: number): Promise<void> {
    await fetcher(`/api/tutorials/${tutorialId}/steps/${stepId}/complete`, {
      method: 'POST',
    });
  }
};
