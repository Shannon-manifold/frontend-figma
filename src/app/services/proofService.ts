import { fetcher } from './api';
import { ProofResponse, ProofDetailResponse, CommentResponse } from './types';

export const proofService = {
  async getAllProofs(): Promise<ProofResponse[]> {
    return fetcher<ProofResponse[]>('/api/proofs');
  },

  async getProofDetail(id: number): Promise<ProofDetailResponse> {
    return fetcher<ProofDetailResponse>(`/api/proofs/${id}`);
  },

  async createProof(data: any): Promise<ProofDetailResponse> {
    return fetcher<ProofDetailResponse>('/api/proofs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async toggleLike(id: number): Promise<ProofDetailResponse> {
    return fetcher<ProofDetailResponse>(`/api/proofs/${id}/like`, {
      method: 'POST',
    });
  },

  async toggleBookmark(id: number): Promise<string> {
    return fetcher<string>(`/api/proofs/${id}/bookmarks`, {
      method: 'POST',
    });
  },

  async updateProof(id: number, data: any): Promise<ProofDetailResponse> {
    return fetcher<ProofDetailResponse>(`/api/proofs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProof(id: number): Promise<void> {
    await fetcher(`/api/proofs/${id}`, {
      method: 'DELETE',
    });
  },

  async verifyProof(id: number): Promise<ProofDetailResponse> {
    return fetcher<ProofDetailResponse>(`/api/proofs/${id}/verify`, {
      method: 'POST',
    });
  },

  async getComments(proofId: number): Promise<CommentResponse[]> {
    return fetcher<CommentResponse[]>(`/api/proofs/${proofId}/comments`);
  },

  async createComment(proofId: number, content: string): Promise<CommentResponse> {
    return fetcher<CommentResponse>(`/api/proofs/${proofId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }
};
