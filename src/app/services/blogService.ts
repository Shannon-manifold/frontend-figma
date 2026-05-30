import { fetcher } from './api';
import { BlogPostResponse, BlogPostDetailResponse } from './types';

export const blogService = {
  async getBlogs(): Promise<BlogPostResponse[]> {
    return fetcher<BlogPostResponse[]>('/api/v1/blogs');
  },

  async getBlogDetail(id: number): Promise<BlogPostDetailResponse> {
    return fetcher<BlogPostDetailResponse>(`/api/v1/blogs/${id}`);
  },

  async createBlog(data: any): Promise<BlogPostDetailResponse> {
    return fetcher<BlogPostDetailResponse>('/api/v1/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async toggleBookmark(id: number): Promise<string> {
    return fetcher<string>(`/api/v1/blogs/${id}/bookmarks`, {
      method: 'POST',
    });
  }
};
