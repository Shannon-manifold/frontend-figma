import { fetcher } from './api';
import { BlogPostResponse, BlogPostDetailResponse, CommentResponse } from './types';

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
  },

  async getComments(blogId: number): Promise<CommentResponse[]> {
    return fetcher<CommentResponse[]>(`/api/v1/blogs/${blogId}/comments`);
  },

  async createComment(blogId: number, content: string): Promise<CommentResponse> {
    return fetcher<CommentResponse>(`/api/v1/blogs/${blogId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }
};
