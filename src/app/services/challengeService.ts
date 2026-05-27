import { fetcher } from './api';
import { ChallengeResponse, ChallengeDetailResponse } from './types';

export const challengeService = {
  async getChallenges(difficulty?: string): Promise<ChallengeResponse[]> {
    const query = difficulty ? `?difficulty=${encodeURIComponent(difficulty)}` : '';
    return fetcher<ChallengeResponse[]>(`/api/v1/challenges${query}`);
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
