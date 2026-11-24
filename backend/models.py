from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey
from datetime import datetime
import uuid
from .database import Base

def generate_id(prefix=""):
    return f"{prefix}{uuid.uuid4().hex[:8]}"

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: generate_id("proj-"))
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    category = Column(String, default="General")
    color = Column(String, default="cyan")  # cyan, violet, emerald, amber, rose, sky
    status = Column(String, default="active")  # active, planning, completed, on-hold
    progress = Column(Integer, default=0)
    lead_name = Column(String, default="Elena Rostova")
    lead_avatar = Column(String, default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80")
    due_date = Column(String, default="2026-12-31")
    created_at = Column(DateTime, default=datetime.utcnow)

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, default=lambda: generate_id("task-"))
    project_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    status = Column(String, default="backlog")  # backlog, in_progress, in_review, done
    priority = Column(String, default="medium")  # low, medium, high, urgent
    assignee_name = Column(String, default="Unassigned")
    assignee_avatar = Column(String, default="")
    assignee_role = Column(String, default="")
    estimate_hours = Column(Float, default=4.0)
    spent_hours = Column(Float, default=0.0)
    due_date = Column(String, default="")
    order = Column(Integer, default=0)
    tags = Column(String, default="")  # comma separated
    created_at = Column(DateTime, default=datetime.utcnow)

class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(String, primary_key=True, default=lambda: generate_id("member-"))
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    department = Column(String, default="Engineering")
    avatar = Column(String, default="")
    email = Column(String, default="")
    timezone = Column(String, default="UTC+1")
    status = Column(String, default="active")  # active, in_focus, in_meeting, offline
    weekly_capacity_hours = Column(Integer, default=40)
    allocated_hours = Column(Integer, default=0)
    skills = Column(String, default="")  # comma separated
    focus_tag = Column(String, default="Available for sync")

class FocusSession(Base):
    __tablename__ = "focus_sessions"

    id = Column(String, primary_key=True, default=lambda: generate_id("focus-"))
    task_id = Column(String, nullable=True)
    task_title = Column(String, nullable=True)
    duration_minutes = Column(Integer, default=25)
    session_type = Column(String, default="pomodoro")  # pomodoro, deep_work, sprint, break
    completed = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(String, primary_key=True, default=lambda: generate_id("event-"))
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    date = Column(String, nullable=False)  # YYYY-MM-DD
    start_time = Column(String, default="10:00")
    end_time = Column(String, default="11:00")
    category = Column(String, default="meeting")  # sprint, meeting, milestone, focus, review
    attendees = Column(String, default="")  # comma separated
    project_id = Column(String, nullable=True)
