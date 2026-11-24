export type TaskStatus = 'backlog' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  status: 'active' | 'planning' | 'completed' | 'on-hold';
  progress: number;
  lead_name: string;
  lead_avatar: string;
  due_date: string;
  created_at?: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_name: string;
  assignee_avatar: string;
  assignee_role: string;
  estimate_hours: number;
  spent_hours: number;
  due_date: string;
  order: number;
  tags: string;
  created_at?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  email: string;
  timezone: string;
  status: 'active' | 'in_focus' | 'in_meeting' | 'offline';
  weekly_capacity_hours: number;
  allocated_hours: number;
  skills: string;
  focus_tag: string;
}

export interface FocusSession {
  id: string;
  task_id?: string;
  task_title?: string;
  duration_minutes: number;
  session_type: 'pomodoro' | 'deep_work' | 'sprint' | 'break';
  completed: boolean;
  notes?: string;
  timestamp: string;
}

export interface FocusSummary {
  today_minutes: number;
  completed_sessions: number;
  streak_days: number;
  total_sessions: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  category: 'sprint' | 'meeting' | 'milestone' | 'focus' | 'review';
  attendees: string;
  project_id?: string;
}

export interface SearchItem {
  id: string;
  type: 'project' | 'task' | 'member' | 'event';
  title: string;
  subtitle: string;
  meta?: string;
  badge?: string;
}

export type ThemePreset = 'aurora' | 'cyber' | 'emerald' | 'sunset' | 'obsidian';
