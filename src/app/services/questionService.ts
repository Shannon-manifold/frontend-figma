import { fetcher } from './api';
import { QuestionResponse, QuestionDetailResponse, AnswerResponse, CommentResponse } from './types';

export const questionService = {
  async getQuestions(): Promise<QuestionResponse[]> {
    return fetcher<QuestionResponse[]>('/api/v1/questions');
  },

  async getQuestionDetail(id: number): Promise<QuestionDetailResponse> {
    return fetcher<QuestionDetailResponse>(`/api/v1/questions/${id}`);
  },

  async createQuestion(data: { title: string; description: string; content: string; tags: string[] }): Promise<QuestionDetailResponse> {
    return fetcher<QuestionDetailResponse>('/api/v1/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateQuestion(id: number, data: { title: string; description: string; content: string; tags: string[] }): Promise<QuestionDetailResponse> {
    return fetcher<QuestionDetailResponse>(`/api/v1/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteQuestion(id: number): Promise<void> {
    await fetcher(`/api/v1/questions/${id}`, {
      method: 'DELETE',
    });
  },

  async createAnswer(questionId: number, data: { content: string }): Promise<AnswerResponse> {
    return fetcher<AnswerResponse>(`/api/v1/questions/${questionId}/answers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async acceptAnswer(answerId: number): Promise<AnswerResponse> {
    return fetcher<AnswerResponse>(`/api/v1/questions/answers/${answerId}/accept`, {
      method: 'POST',
    });
  },

  async toggleQuestionLike(questionId: number): Promise<number> {
    return fetcher<number>(`/api/v1/questions/${questionId}/like`, {
      method: 'POST',
    });
  },

  async toggleAnswerLike(answerId: number): Promise<number> {
    return fetcher<number>(`/api/v1/questions/answers/${answerId}/like`, {
      method: 'POST',
    });
  },

  async toggleBookmark(questionId: number): Promise<string> {
    return fetcher<string>(`/api/v1/questions/${questionId}/bookmarks`, {
      method: 'POST',
    });
  },

  async getAnswerComments(answerId: number): Promise<CommentResponse[]> {
    return fetcher<CommentResponse[]>(`/api/v1/questions/answers/${answerId}/comments`);
  },

  async createAnswerComment(answerId: number, content: string): Promise<CommentResponse> {
    return fetcher<CommentResponse>(`/api/v1/questions/answers/${answerId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }
};
