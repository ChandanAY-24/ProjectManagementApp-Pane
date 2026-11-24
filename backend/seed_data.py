from .database import SessionLocal, engine, Base
from .models import Project, Task, TeamMember, FocusSession, CalendarEvent
from datetime import datetime, timedelta

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if data already exists
    if db.query(Project).count() > 0:
        db.close()
        return

    # 1. Team Members
    members = [
        TeamMember(
            id="member-1",
            name="Elena Rostova",
            role="Design Director & Spatial UI Lead",
            department="Product Design",
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
            email="elena@glassflow.studio",
            timezone="UTC+1 (Paris)",
            status="active",
            weekly_capacity_hours=40,
            allocated_hours=34,
            skills="Design Systems, Spatial Audio, WebGL, Ergonomics",
            focus_tag="Leading Vision 2.0 Sprint"
        ),
        TeamMember(
            id="member-2",
            name="Marcus Chen",
            role="Principal Full-Stack Architect",
            department="Core Engineering",
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
            email="marcus@glassflow.studio",
            timezone="UTC-7 (San Francisco)",
            status="in_focus",
            weekly_capacity_hours=40,
            allocated_hours=38,
            skills="FastAPI, SQLite, Vite, Rust, WebSockets",
            focus_tag="Deep Work: Database Concurrency"
        ),
        TeamMember(
            id="member-3",
            name="Siddharth Rao",
            role="Frontend & Micro-interactions Specialist",
            department="Creative Tech",
            avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80",
            email="siddharth@glassflow.studio",
            timezone="UTC+5:30 (Bengaluru)",
            status="active",
            weekly_capacity_hours=40,
            allocated_hours=28,
            skills="TypeScript, Framer Motion, Tailwind, Canvas 2D",
            focus_tag="Polishing Focus Capsule"
        ),
        TeamMember(
            id="member-4",
            name="Amara Okafor",
            role="Lead Brand & Motion Designer",
            department="Brand Experience",
            avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80",
            email="amara@glassflow.studio",
            timezone="UTC+0 (London)",
            status="in_meeting",
            weekly_capacity_hours=35,
            allocated_hours=30,
            skills="3D Shaders, Lottie, Figma, Brand Strategy",
            focus_tag="Reviewing Design Tokens"
        ),
        TeamMember(
            id="member-5",
            name="Kai Lindqvist",
            role="Systems & Security Engineer",
            department="Infrastructure",
            avatar="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80",
            email="kai@glassflow.studio",
            timezone="UTC+2 (Helsinki)",
            status="offline",
            weekly_capacity_hours=40,
            allocated_hours=18,
            skills="Zero-Trust, CI/CD, Docker, Observability",
            focus_tag="On Call Rotation"
        ),
    ]
    db.add_all(members)

    # 2. Projects
    projects = [
        Project(
            id="proj-1",
            title="Liquid Glass Design System 3.0",
            description="Developing tokenized translucent UI primitives, backdrop filters, specular highlights, and chromatic aberration effects for enterprise apps.",
            category="Design Systems",
            color="cyan",
            status="active",
            progress=72,
            lead_name="Elena Rostova",
            lead_avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
            due_date="2026-12-15"
        ),
        Project(
            id="proj-2",
            title="Neural Real-time Telemetry Engine",
            description="High-frequency telemetry stream with asynchronous SQLite buffering, sub-millisecond task syncing, and team status broadcasting.",
            category="Core Platform",
            color="violet",
            status="active",
            progress=58,
            lead_name="Marcus Chen",
            lead_avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
            due_date="2027-01-20"
        ),
        Project(
            id="proj-3",
            title="Spatial Audio & Focus Capsule",
            description="Floating micro-capsule with binaural frequency generation, Pomodoro intervals, circadian lighting tint, and session milestone confetti.",
            category="Focus Experience",
            color="emerald",
            status="active",
            progress=85,
            lead_name="Siddharth Rao",
            lead_avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80",
            due_date="2026-11-30"
        ),
        Project(
            id="proj-4",
            title="Global Studio Brand Relaunch",
            description="Comprehensive brand guidelines, interactive 3D web showcase, typography revamp, and custom iconography set.",
            category="Brand Strategy",
            color="amber",
            status="planning",
            progress=30,
            lead_name="Amara Okafor",
            lead_avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80",
            due_date="2027-02-28"
        )
    ]
    db.add_all(projects)

    # 3. Tasks
    tasks = [
        # Backlog
        Task(
            id="task-101",
            project_id="proj-1",
            title="Define Dynamic Refraction CSS Custom Properties",
            description="Map CSS variables for border luminance, noise overlays, and variable blur thresholds across light/dark ambient modes.",
            status="backlog",
            priority="medium",
            assignee_name="Elena Rostova",
            assignee_avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
            assignee_role="Design Director",
            estimate_hours=6.0,
            spent_hours=0.0,
            due_date="2026-12-05",
            order=0,
            tags="DesignTokens,CSS,Refraction"
        ),
        Task(
            id="task-102",
            project_id="proj-4",
            title="Storyboard 3D Interactive Hero Canvas",
            description="Create 3D keyframe sequences for the hero scene showcasing frosted crystal typography and interactive pointer deflection.",
            status="backlog",
            priority="low",
            assignee_name="Amara Okafor",
            assignee_avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80",
            assignee_role="Brand Lead",
            estimate_hours=8.0,
            spent_hours=1.0,
            due_date="2026-12-10",
            order=1,
            tags="3D,Motion,Hero"
        ),
        Task(
            id="task-103",
            project_id="proj-2",
            title="Benchmark WAL mode concurrent readers vs writers",
            description="Stress-test SQLite Write-Ahead Logging under 500 parallel transactions per second with timeout retry logic.",
            status="backlog",
            priority="high",
            assignee_name="Kai Lindqvist",
            assignee_avatar="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80",
            assignee_role="Systems Eng",
            estimate_hours=5.0,
            spent_hours=0.0,
            due_date="2026-12-08",
            order=2,
            tags="SQLite,WAL,Performance"
        ),

        # In Progress
        Task(
            id="task-201",
            project_id="proj-3",
            title="Implement Focus Capsule Floating Dock",
            description="Build compact pill dock with active countdown display, animated breathing pulse ring, and quick duration toggles (15m, 25m, 50m).",
            status="in_progress",
            priority="urgent",
            assignee_name="Siddharth Rao",
            assignee_avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80",
            assignee_role="Frontend Specialist",
            estimate_hours=7.0,
            spent_hours=4.5,
            due_date="2026-11-28",
            order=0,
            tags="Focus,Capsule,UI"
        ),
        Task(
            id="task-202",
            project_id="proj-1",
            title="Glassmorphic Kanban Drag & Drop Reordering",
            description="Enable smooth native HTML5 and touch drag mechanics with ghost preview cards and optimistic column reassignment.",
            status="in_progress",
            priority="high",
            assignee_name="Elena Rostova",
            assignee_avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
            assignee_role="Design Director",
            estimate_hours=10.0,
            spent_hours=6.0,
            due_date="2026-11-29",
            order=1,
            tags="Kanban,DragDrop,Animation"
        ),
        Task(
            id="task-203",
            project_id="proj-2",
            title="FastAPI REST Endpoints for Omnibar Search",
            description="Expose unified keyword and fuzzy indexing across projects, tasks, team members, and events for Cmd+K palette.",
            status="in_progress",
            priority="medium",
            assignee_name="Marcus Chen",
            assignee_avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
            assignee_role="Architect",
            estimate_hours=4.0,
            spent_hours=2.5,
            due_date="2026-11-27",
            order=2,
            tags="Search,FastAPI,CmdK"
        ),

        # In Review
        Task(
            id="task-301",
            project_id="proj-1",
            title="Interactive Team Capacity Heatmap Grid",
            description="Calculate real-time workload percentage and display glass status indicators (optimal, near-capacity, over-allocated).",
            status="in_review",
            priority="high",
            assignee_name="Elena Rostova",
            assignee_avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
            assignee_role="Design Director",
            estimate_hours=8.0,
            spent_hours=7.5,
            due_date="2026-11-26",
            order=0,
            tags="Team,Capacity,Workload"
        ),
        Task(
            id="task-302",
            project_id="proj-2",
            title="SQLite Database Migration & Seed Fixtures",
            description="Ensure automated table verification and idempotent mock datasets upon server startup.",
            status="in_review",
            priority="medium",
            assignee_name="Marcus Chen",
            assignee_avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
            assignee_role="Architect",
            estimate_hours=3.0,
            spent_hours=3.0,
            due_date="2026-11-25",
            order=1,
            tags="Database,FastAPI,Seed"
        ),

        # Done
        Task(
            id="task-401",
            project_id="proj-3",
            title="Circadian Backdrop Lighting & Wallpaper Switcher",
            description="Integrated 6 high-definition gradient themes (Aurora Deep, Cyber Twilight, Sunset Solstice, Liquid Emerald, Midnight Obsidian, Frosted Mist).",
            status="done",
            priority="medium",
            assignee_name="Siddharth Rao",
            assignee_avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80",
            assignee_role="Frontend Specialist",
            estimate_hours=5.0,
            spent_hours=5.0,
            due_date="2026-11-22",
            order=0,
            tags="Theming,Gradients,Glass"
        ),
        Task(
            id="task-402",
            project_id="proj-1",
            title="Multi-month Studio Calendar View",
            description="Monthly and weekly agenda views with categorized event badges and fast event scheduling popover.",
            status="done",
            priority="medium",
            assignee_name="Amara Okafor",
            assignee_avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80",
            assignee_role="Brand Lead",
            estimate_hours=6.0,
            spent_hours=5.5,
            due_date="2026-11-23",
            order=1,
            tags="Calendar,Schedule,Events"
        ),
    ]
    db.add_all(tasks)

    # 4. Focus Sessions
    now = datetime.utcnow()
    focus_sessions = [
        FocusSession(
            id="focus-1",
            task_id="task-201",
            task_title="Implement Focus Capsule Floating Dock",
            duration_minutes=25,
            session_type="pomodoro",
            completed=True,
            notes="Designed the SVG progress ring and pulse easing.",
            timestamp=now - timedelta(hours=3)
        ),
        FocusSession(
            id="focus-2",
            task_id="task-202",
            task_title="Glassmorphic Kanban Drag & Drop Reordering",
            duration_minutes=50,
            session_type="deep_work",
            completed=True,
            notes="Solved smooth drop indicator transitions.",
            timestamp=now - timedelta(hours=1)
        ),
        FocusSession(
            id="focus-3",
            task_id="task-401",
            task_title="Circadian Backdrop Lighting & Wallpaper Switcher",
            duration_minutes=25,
            session_type="pomodoro",
            completed=True,
            notes="Added 6 preset themes and local storage persistence.",
            timestamp=now - timedelta(days=1)
        )
    ]
    db.add_all(focus_sessions)

    # 5. Calendar Events
    today_str = datetime.now().strftime("%Y-%m-%d")
    tomorrow_str = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    next_week_str = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
    
    events = [
        CalendarEvent(
            id="event-1",
            title="Design System 3.0 Sprint Review & Crit",
            description="Deep dive on specular lighting tokens and frosted card accessibility contrast.",
            date=today_str,
            start_time="11:00",
            end_time="12:00",
            category="review",
            attendees="Elena Rostova, Amara Okafor, Siddharth Rao",
            project_id="proj-1"
        ),
        CalendarEvent(
            id="event-2",
            title="FastAPI + SQLite Concurrency Demo",
            description="Reviewing transaction rollback handlers and connection pool limits.",
            date=today_str,
            start_time="15:30",
            end_time="16:30",
            category="sprint",
            attendees="Marcus Chen, Kai Lindqvist",
            project_id="proj-2"
        ),
        CalendarEvent(
            id="event-3",
            title="Focus Capsule Soundscapes Polish",
            description="Finalizing binaural sound generator and completion chimes.",
            date=tomorrow_str,
            start_time="10:00",
            end_time="11:30",
            category="focus",
            attendees="Siddharth Rao, Elena Rostova",
            project_id="proj-3"
        ),
        CalendarEvent(
            id="event-4",
            title="Studio All-Hands: Q4 Milestones",
            description="Company-wide roadmap sharing, capacity rebalancing, and celebration.",
            date=next_week_str,
            start_time="16:00",
            end_time="17:30",
            category="milestone",
            attendees="All Studio Members",
            project_id=None
        )
    ]
    db.add_all(events)

    db.commit()
    db.close()
    print("GlassFlow database seeded successfully.")

if __name__ == "__main__":
    seed_database()
