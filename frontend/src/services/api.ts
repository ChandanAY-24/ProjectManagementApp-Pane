import { Project, Task, TeamMember, FocusSession, FocusSummary, CalendarEvent, SearchItem } from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Health
  checkHealth: () => fetchJson<{ status: string; app: string; version: string; metrics: any }>('/health'),

  // Projects
  getProjects: () => fetchJson<Project[]>('/projects'),
  getProject: (id: string) => fetchJson<Project>(`/projects/${id}`),
  createProject: (data: Partial<Project>) => fetchJson<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateProject: (id: string, data: Partial<Project>) => fetchJson<Project>(`/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteProject: (id: string) => fetchJson<{ message: string; id: string }>(`/projects/${id}`, {
    method: 'DELETE'
  }),

  // Tasks
  getTasks: (params?: { status?: string; project_id?: string; priority?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.project_id) query.append('project_id', params.project_id);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString();
    return fetchJson<Task[]>(`/tasks${queryString ? `?${queryString}` : ''}`);
  },
  createTask: (data: Partial<Task>) => fetchJson<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateTask: (id: string, data: Partial<Task>) => fetchJson<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  moveTask: (id: string, status: string, order: number) => fetchJson<Task>('/tasks/move', {
    method: 'POST',
    body: JSON.stringify({ id, status, order })
  }),
  deleteTask: (id: string) => fetchJson<{ message: string; id: string }>(`/tasks/${id}`, {
    method: 'DELETE'
  }),

  // Team
  getTeam: () => fetchJson<TeamMember[]>('/team'),
  createTeamMember: (data: Partial<TeamMember>) => fetchJson<TeamMember>('/team', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateTeamMember: (id: string, data: Partial<TeamMember>) => fetchJson<TeamMember>(`/team/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  // Focus
  getFocusSessions: (limit = 20) => fetchJson<FocusSession[]>(`/focus?limit=${limit}`),
  createFocusSession: (data: Partial<FocusSession>) => fetchJson<FocusSession>('/focus', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getFocusSummary: () => fetchJson<FocusSummary>('/focus/summary'),

  // Calendar
  getCalendarEvents: (startDate?: string, endDate?: string) => {
    const query = new URLSearchParams();
    if (startDate) query.append('start_date', startDate);
    if (endDate) query.append('end_date', endDate);
    const queryString = query.toString();
    return fetchJson<CalendarEvent[]>(`/calendar${queryString ? `?${queryString}` : ''}`);
  },
  createCalendarEvent: (data: Partial<CalendarEvent>) => fetchJson<CalendarEvent>('/calendar', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateCalendarEvent: (id: string, data: Partial<CalendarEvent>) => fetchJson<CalendarEvent>(`/calendar/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteCalendarEvent: (id: string) => fetchJson<{ message: string; id: string }>(`/calendar/${id}`, {
    method: 'DELETE'
  }),

  // Search
  searchGlobal: (query: string) => fetchJson<SearchItem[]>(`/search?q=${encodeURIComponent(query)}`),

  // Seed / Reset
  resetSeedData: () => fetchJson<{ message: string }>('/seed', { method: 'POST' })
};
