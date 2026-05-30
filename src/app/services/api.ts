const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('accessToken');
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized (e.g., redirect to login or refresh token)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // window.location.href = '/login';
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }

  // For 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
