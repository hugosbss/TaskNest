const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Erro na requisicao');
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return request<{ accessToken: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: { email: string; password: string }) {
  return request<{ accessToken: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getTasks(token: string) {
  return request<
    Array<{
      id: string;
      title: string;
      description?: string | null;
      status: string;
      createdAt: string;
      completedAt?: string | null;
    }>
  >('/tasks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createTask(
  token: string,
  payload: { title: string; description?: string; status?: string },
) {
  return request('/tasks', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateTask(
  token: string,
  id: string,
  payload: { title?: string; description?: string; status?: string },
) {
  return request(`/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(token: string, id: string) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function saveToken(token: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `token=${token}; path=/`;
  localStorage.setItem('token', token);
}

export function clearToken() {
  if (typeof document === 'undefined') return;
  document.cookie = 'token=; Max-Age=0; path=/';
  localStorage.removeItem('token');
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}
