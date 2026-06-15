import { fetcher } from './api';
import { ChallengeResponse, ChallengeDetailResponse, ChallengeCreateRequest } from './types';

export const challengeService = {
  async getChallenges(difficulty?: string): Promise<ChallengeResponse[]> {
    const query = difficulty ? `?difficulty=${encodeURIComponent(difficulty)}` : '';
    return fetcher<ChallengeResponse[]>(`/api/v1/challenges${query}`);
  },

  async createChallenge(data: ChallengeCreateRequest): Promise<ChallengeDetailResponse> {
    return fetcher<ChallengeDetailResponse>('/api/v1/challenges', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getChallengeDetail(id: number): Promise<ChallengeDetailResponse> {
    return fetcher<ChallengeDetailResponse>(`/api/v1/challenges/${id}`);
  },

  async sponsorChallenge(id: number): Promise<ChallengeDetailResponse> {
    return fetcher<ChallengeDetailResponse>(`/api/v1/challenges/${id}/sponsor`, {
      method: 'POST',
    });
  }
};
