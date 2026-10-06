import type { CurrentUser, Note } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function authHeader(): Record<string, string> {
  const token = localStorage.getItem('auth-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...options.headers,
    },
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.error?.message ?? 'Error en la solicitud');
  }

  return body.data;
}

export function registerUser(
  email: string,
  password: string,
  name: string,
): Promise<CurrentUser> {
  return request<CurrentUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

export function loginUser(
  email: string,
  password: string,
): Promise<{ token: string; user: CurrentUser }> {
  return request<{ token: string; user: CurrentUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const { user } = await request<{ user: CurrentUser }>('/auth/me');
  return user;
}

export function getNotes(): Promise<Note[]> {
  return request<Note[]>('/notes');
}

export function createNote(title: string, body: string): Promise<Note> {
  return request<Note>('/notes', {
    method: 'POST',
    body: JSON.stringify({ title, body }),
  });
}

export function deleteNote(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/notes/${id}`, { method: 'DELETE' });
}
