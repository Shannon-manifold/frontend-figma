import { fetcher } from './api';

export const blogService = {
  async getBlogs(): Promise<any[]> {
    return fetcher<any[]>('/api/v1/blogs');
  },

  async getBlogDetail(id: number): Promise<any> {
    return fetcher<any>(`/api/v1/blogs/${id}`);
  },

  async createBlog(data: any): Promise<any> {
    return fetcher<any>('/api/v1/blogs', {
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
