import type { Test, TestListItem, Session, UpdateSessionRequest } from './types';

// Use environment variable for production, empty string for local development (uses proxy)
const API_BASE = import.meta.env.VITE_API_URL || '';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// Test endpoints

export async function getTests(): Promise<TestListItem[]> {
  return fetchJSON<TestListItem[]>(`/api/tests`);
}

export async function getTest(id: string): Promise<Test> {
  return fetchJSON<Test>(`/api/tests/${id}`);
}

// Session endpoints

export async function createSession(testId: string): Promise<Session> {
  return fetchJSON<Session>(`/api/sessions`, {
    method: 'POST',
    body: JSON.stringify({ testId }),
  });
}

export async function getSession(id: string): Promise<Session> {
  return fetchJSON<Session>(`/api/sessions/${id}`);
}

export async function updateSession(id: string, data: UpdateSessionRequest): Promise<Session> {
  return fetchJSON<Session>(`/api/sessions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
