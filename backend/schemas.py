from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# --- Project Schemas ---
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = ""
    category: Optional[str] = "General"
    color: Optional[str] = "cyan"
    status: Optional[str] = "active"
    progress: Optional[int] = 0
    lead_name: Optional[str] = "Elena Rostova"
    lead_avatar: Optional[str] = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
    due_date: Optional[str] = "2026-12-31"

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    lead_name: Optional[str] = None
    lead_avatar: Optional[str] = None
    due_date: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Task Schemas ---
class TaskBase(BaseModel):
    project_id: str
    title: str
    description: Optional[str] = ""
    status: Optional[str] = "backlog"
    priority: Optional[str] = "medium"
    assignee_name: Optional[str] = "Unassigned"
    assignee_avatar: Optional[str] = ""
    assignee_role: Optional[str] = ""
    estimate_hours: Optional[float] = 4.0
    spent_hours: Optional[float] = 0.0
    due_date: Optional[str] = ""
    order: Optional[int] = 0
    tags: Optional[str] = ""

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    project_id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee_name: Optional[str] = None
    assignee_avatar: Optional[str] = None
    assignee_role: Optional[str] = None
    estimate_hours: Optional[float] = None
    spent_hours: Optional[float] = None
    due_date: Optional[str] = None
    order: Optional[int] = None
    tags: Optional[str] = None

class TaskMove(BaseModel):
    id: str
    status: str
    order: int

class TaskResponse(TaskBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Team Member Schemas ---
class TeamMemberBase(BaseModel):
    name: str
    role: str
    department: Optional[str] = "Engineering"
    avatar: Optional[str] = ""
    email: Optional[str] = ""
    timezone: Optional[str] = "UTC+1"
    status: Optional[str] = "active"
    weekly_capacity_hours: Optional[int] = 40
    allocated_hours: Optional[int] = 0
    skills: Optional[str] = ""
    focus_tag: Optional[str] = "Available for sync"

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    avatar: Optional[str] = None
    email: Optional[str] = None
    timezone: Optional[str] = None
    status: Optional[str] = None
    weekly_capacity_hours: Optional[int] = None
    allocated_hours: Optional[int] = None
    skills: Optional[str] = None
    focus_tag: Optional[str] = None

class TeamMemberResponse(TeamMemberBase):
    id: str

    class Config:
        from_attributes = True

# --- Focus Session Schemas ---
class FocusSessionCreate(BaseModel):
    task_id: Optional[str] = None
    task_title: Optional[str] = None
    duration_minutes: int = 25
    session_type: Optional[str] = "pomodoro"
    completed: Optional[bool] = True
    notes: Optional[str] = None

class FocusSessionResponse(FocusSessionCreate):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True

class FocusSummary(BaseModel):
    today_minutes: int
    completed_sessions: int
    streak_days: int
    total_sessions: int

# --- Calendar Event Schemas ---
class CalendarEventBase(BaseModel):
    title: str
    description: Optional[str] = ""
    date: str  # YYYY-MM-DD
    start_time: Optional[str] = "10:00"
    end_time: Optional[str] = "11:00"
    category: Optional[str] = "meeting"
    attendees: Optional[str] = ""
    project_id: Optional[str] = None

class CalendarEventCreate(CalendarEventBase):
    pass

class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    category: Optional[str] = None
    attendees: Optional[str] = None
    project_id: Optional[str] = None

class CalendarEventResponse(CalendarEventBase):
    id: str

    class Config:
        from_attributes = True

# --- Search Result Schema ---
class SearchItem(BaseModel):
    id: str
    type: str  # project, task, member, event
    title: str
    subtitle: str
    meta: Optional[str] = None
    badge: Optional[str] = None
