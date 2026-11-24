from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
import os

from .database import engine, get_db, Base
from .models import Project, Task, TeamMember, FocusSession, CalendarEvent
from .schemas import (
    ProjectResponse, ProjectCreate, ProjectUpdate,
    TaskResponse, TaskCreate, TaskUpdate, TaskMove,
    TeamMemberResponse, TeamMemberCreate, TeamMemberUpdate,
    FocusSessionResponse, FocusSessionCreate, FocusSummary,
    CalendarEventResponse, CalendarEventCreate, CalendarEventUpdate,
    SearchItem
)
from .seed_data import seed_database

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GlassFlow API",
    description="Production-grade asynchronous project management and focus telemetry API",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server & production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    # Automatically seed the database on initial startup
    seed_database()

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    project_count = db.query(Project).count()
    task_count = db.query(Task).count()
    member_count = db.query(TeamMember).count()
    return {
        "status": "healthy",
        "app": "GlassFlow",
        "version": "1.0.0",
        "database": "sqlite",
        "metrics": {
            "projects": project_count,
            "tasks": task_count,
            "team_members": member_count
        }
    }

# ----------------- PROJECTS -----------------
@app.get("/api/projects", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.created_at.desc()).all()

@app.post("/api/projects", response_model=ProjectResponse, status_code=201)
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(**project_in.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@app.get("/api/projects/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.patch("/api/projects/{project_id}", response_model=ProjectResponse)
def update_project(project_id: str, project_in: ProjectUpdate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
    
    db.commit()
    db.refresh(project)
    return project

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.query(Task).filter(Task.project_id == project_id).delete()
    db.delete(project)
    db.commit()
    return {"message": "Project and associated tasks deleted", "id": project_id}

# ----------------- TASKS -----------------
@app.get("/api/tasks", response_model=List[TaskResponse])
def get_tasks(
    status: Optional[str] = None,
    project_id: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Task)
    if status:
        query = query.filter(Task.status == status)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if priority:
        query = query.filter(Task.priority == priority)
    if search:
        query = query.filter(
            (Task.title.ilike(f"%{search}%")) |
            (Task.description.ilike(f"%{search}%")) |
            (Task.tags.ilike(f"%{search}%"))
        )
    return query.order_by(Task.order.asc(), Task.created_at.desc()).all()

@app.post("/api/tasks", response_model=TaskResponse, status_code=201)
def create_task(task_in: TaskCreate, db: Session = Depends(get_db)):
    last_task = (
        db.query(Task)
        .filter(Task.status == task_in.status)
        .order_by(Task.order.desc())
        .first()
    )
    new_order = (last_task.order + 1) if last_task else 0
    
    task_dict = task_in.model_dump()
    task_dict["order"] = new_order
    task = Task(**task_dict)
    
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@app.patch("/api/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, task_in: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    db.commit()
    db.refresh(task)
    return task

@app.post("/api/tasks/move", response_model=TaskResponse)
def move_task(move_in: TaskMove, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == move_in.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.status = move_in.status
    task.order = move_in.order
    db.commit()
    db.refresh(task)
    return task

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted", "id": task_id}

# ----------------- TEAM MEMBERS -----------------
@app.get("/api/team", response_model=List[TeamMemberResponse])
def get_team(db: Session = Depends(get_db)):
    return db.query(TeamMember).order_by(TeamMember.name.asc()).all()

@app.post("/api/team", response_model=TeamMemberResponse, status_code=201)
def create_team_member(member_in: TeamMemberCreate, db: Session = Depends(get_db)):
    member = TeamMember(**member_in.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

@app.patch("/api/team/{member_id}", response_model=TeamMemberResponse)
def update_team_member(member_id: str, member_in: TeamMemberUpdate, db: Session = Depends(get_db)):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    update_data = member_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(member, field, value)
    
    db.commit()
    db.refresh(member)
    return member

# ----------------- FOCUS SESSIONS -----------------
@app.get("/api/focus", response_model=List[FocusSessionResponse])
def get_focus_sessions(limit: int = 20, db: Session = Depends(get_db)):
    return db.query(FocusSession).order_by(FocusSession.timestamp.desc()).limit(limit).all()

@app.post("/api/focus", response_model=FocusSessionResponse, status_code=201)
def create_focus_session(session_in: FocusSessionCreate, db: Session = Depends(get_db)):
    session = FocusSession(**session_in.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@app.get("/api/focus/summary", response_model=FocusSummary)
def get_focus_summary(db: Session = Depends(get_db)):
    sessions = db.query(FocusSession).all()
    today = date.today()
    
    today_minutes = sum(
        s.duration_minutes for s in sessions 
        if s.timestamp.date() == today and s.completed
    )
    completed_sessions = sum(1 for s in sessions if s.completed)
    
    return FocusSummary(
        today_minutes=today_minutes,
        completed_sessions=completed_sessions,
        streak_days=3,
        total_sessions=len(sessions)
    )

# ----------------- CALENDAR EVENTS -----------------
@app.get("/api/calendar", response_model=List[CalendarEventResponse])
def get_calendar_events(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CalendarEvent)
    if start_date:
        query = query.filter(CalendarEvent.date >= start_date)
    if end_date:
        query = query.filter(CalendarEvent.date <= end_date)
    return query.order_by(CalendarEvent.date.asc(), CalendarEvent.start_time.asc()).all()

@app.post("/api/calendar", response_model=CalendarEventResponse, status_code=201)
def create_calendar_event(event_in: CalendarEventCreate, db: Session = Depends(get_db)):
    event = CalendarEvent(**event_in.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@app.patch("/api/calendar/{event_id}", response_model=CalendarEventResponse)
def update_calendar_event(event_id: str, event_in: CalendarEventUpdate, db: Session = Depends(get_db)):
    event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)
    
    db.commit()
    db.refresh(event)
    return event

@app.delete("/api/calendar/{event_id}")
def delete_calendar_event(event_id: str, db: Session = Depends(get_db)):
    event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return {"message": "Event deleted", "id": event_id}

# ----------------- GLOBAL OMNIBAR SEARCH (Cmd+K) -----------------
@app.get("/api/search", response_model=List[SearchItem])
def search_global(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    term = f"%{q.lower()}%"
    results: List[SearchItem] = []

    # Search Projects
    projects = (
        db.query(Project)
        .filter(
            (Project.title.ilike(term)) |
            (Project.description.ilike(term)) |
            (Project.category.ilike(term))
        )
        .limit(5)
        .all()
    )
    for p in projects:
        results.append(SearchItem(
            id=p.id,
            type="project",
            title=p.title,
            subtitle=f"{p.category} • Lead: {p.lead_name}",
            meta=f"{p.progress}% completed",
            badge=p.color
        ))

    # Search Tasks
    tasks = (
        db.query(Task)
        .filter(
            (Task.title.ilike(term)) |
            (Task.description.ilike(term)) |
            (Task.tags.ilike(term)) |
            (Task.assignee_name.ilike(term))
        )
        .limit(8)
        .all()
    )
    for t in tasks:
        results.append(SearchItem(
            id=t.id,
            type="task",
            title=t.title,
            subtitle=f"Status: {t.status.replace('_', ' ').capitalize()} • Assigned to {t.assignee_name}",
            meta=f"{t.priority.capitalize()} priority • {t.estimate_hours}h",
            badge=t.priority
        ))

    # Search Team Members
    members = (
        db.query(TeamMember)
        .filter(
            (TeamMember.name.ilike(term)) |
            (TeamMember.role.ilike(term)) |
            (TeamMember.department.ilike(term)) |
            (TeamMember.skills.ilike(term))
        )
        .limit(5)
        .all()
    )
    for m in members:
        results.append(SearchItem(
            id=m.id,
            type="member",
            title=m.name,
            subtitle=f"{m.role} • {m.department}",
            meta=f"Capacity: {m.allocated_hours}/{m.weekly_capacity_hours}h ({m.status})",
            badge=m.status
        ))

    # Search Calendar Events
    events = (
        db.query(CalendarEvent)
        .filter(
            (CalendarEvent.title.ilike(term)) |
            (CalendarEvent.description.ilike(term)) |
            (CalendarEvent.category.ilike(term))
        )
        .limit(5)
        .all()
    )
    for e in events:
        results.append(SearchItem(
            id=e.id,
            type="event",
            title=e.title,
            subtitle=f"{e.date} at {e.start_time}-{e.end_time}",
            meta=f"Category: {e.category}",
            badge=e.category
        ))

    return results

# ----------------- RE-SEED DATABASE -----------------
@app.post("/api/seed")
def reset_seed_data(db: Session = Depends(get_db)):
    db.query(FocusSession).delete()
    db.query(CalendarEvent).delete()
    db.query(Task).delete()
    db.query(Project).delete()
    db.query(TeamMember).delete()
    db.commit()
    seed_database()
    return {"message": "Database reset and seeded with default demo datasets successfully"}

# ----------------- STATIC SPA SERVING -----------------
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

if os.path.exists(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")
    
    pane_dir = os.path.join(FRONTEND_DIST, "pane")
    if os.path.exists(pane_dir):
        app.mount("/pane", StaticFiles(directory=pane_dir), name="pane")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
