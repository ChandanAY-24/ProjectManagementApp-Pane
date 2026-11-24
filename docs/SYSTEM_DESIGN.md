# System Design & Architecture Document: GlassFlow

## 1. Executive Summary

**GlassFlow** is a modern, production-ready, full-stack project management and focus telemetry workspace built for creative teams, engineering squads, and design studios. Built around a fluid, multi-layered liquid glass aesthetic (glassmorphism), GlassFlow integrates real-time task coordination (Kanban with drag-and-drop), spatial focus timer capsule with synthesis soundscapes, studio-wide calendar scheduling, team workload capacity tracking, and instantaneous keyboard-driven omnibar search (`⌘K`).

---

## 2. High-Level Design (HLD)

### 2.1 System Architecture Overview

The system follows a decoupled Single Page Application (SPA) and REST API architecture backed by SQLite with persistent connection pooling and automatic seed bootstrapping.

```mermaid
graph TD
    Client["Frontend Client: Vite 8 + React 19 + TypeScript + Tailwind CSS Glass Tokens"] -->|HTTP REST / JSON| Server["Backend API: FastAPI + Uvicorn"]
    Server -->|SQLAlchemy ORM| DB[("SQLite Database: glassflow.db")]

    subgraph Frontend Subsystems
        Router["View Router (Kanban, Calendar, Team, Projects, Analytics)"]
        Capsule["Top Focus Island Capsule (Web Audio Synthesizer)"]
        Omnibar["Cmd+K Command Palette"]
        DragDrop["Native Drag & Drop Engine"]
        ThemeEngine["Atmosphere Wallpaper Engine"]
    end

    subgraph Backend Services
        HealthSvc["Health & Telemetry Service"]
        ProjectsSvc["Projects & Milestones Service"]
        TasksSvc["Tasks & Reordering Engine"]
        TeamSvc["Team Capacity & Availability Service"]
        FocusSvc["Focus Session Logging & Analytics"]
        CalendarSvc["Studio Event Scheduling"]
        SearchSvc["Unified Global Omnibar Indexer"]
    end

    Router --> ProjectsSvc
    Router --> TasksSvc
    Router --> TeamSvc
    Router --> CalendarSvc
    Router --> FocusSvc
    Omnibar --> SearchSvc
```

---

## 3. Low-Level Design (LLD)

### 3.1 Data Flow Diagram (DFD - Level 1)

```mermaid
flowchart TD
    User([Studio Operator]) <-->|Interacts with Glass UI| UI[Presentation Layer]
    UI <-->|Actions & Filters| State[Client Reactive State]
    State <-->|Async REST API Calls| Controller[FastAPI Endpoints]
    Controller <-->|CRUD & Transaction Handlers| Repo[Data Access Layer / SQLAlchemy]
    Repo <-->|SQL Queries| DB[(SQLite Storage Engine)]
```

### 3.2 Database Schema & Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    PROJECT ||--o{ TASK : contains
    TEAM_MEMBER ||--o{ TASK : assigned_to
    TASK ||--o{ FOCUS_SESSION : tracks
    PROJECT ||--o{ CALENDAR_EVENT : references

    PROJECT {
        string id PK "e.g. proj-1"
        string title "Project Title"
        string description "Scope & Goals"
        string category "Design Systems / Platform / Focus / Brand"
        string color "cyan / violet / emerald / amber / rose"
        string status "active / planning / completed / on-hold"
        int progress "0-100 percentage"
        string lead_name "Project Lead"
        string lead_avatar "URL"
        string due_date "YYYY-MM-DD"
        datetime created_at
    }

    TASK {
        string id PK "e.g. task-101"
        string project_id FK
        string title "Task Summary"
        string description "Details and Criteria"
        string status "backlog / in_progress / in_review / done"
        string priority "low / medium / high / urgent"
        string assignee_name
        string assignee_avatar
        string assignee_role
        float estimate_hours
        float spent_hours
        string due_date
        int order "Ordering index"
        string tags "Comma-separated"
        datetime created_at
    }

    TEAM_MEMBER {
        string id PK "e.g. member-1"
        string name "Member Name"
        string role "Discipline Title"
        string department "Product / Core Eng / Creative / Brand"
        string avatar "URL"
        string email
        string timezone
        string status "active / in_focus / in_meeting / offline"
        int weekly_capacity_hours "Default 40"
        int allocated_hours "Current workload"
        string skills "CSV"
        string focus_tag "Current live activity"
    }

    FOCUS_SESSION {
        string id PK "e.g. focus-1"
        string task_id FK
        string task_title
        int duration_minutes "15, 25, 50"
        string session_type "pomodoro / deep_work / sprint"
        boolean completed
        string notes
        datetime timestamp
    }

    CALENDAR_EVENT {
        string id PK "e.g. event-1"
        string title "Event Name"
        string description
        string date "YYYY-MM-DD"
        string start_time "HH:MM"
        string end_time "HH:MM"
        string category "sprint / meeting / milestone / focus / review"
        string attendees "CSV list"
        string project_id FK
    }
```

---

## 4. Key Subsystems & Design Decisions

### 4.1 Liquid Glassmorphic Theme Engine

- **CSS Custom Properties**: Dynamic theme switching between 5 curated atmospheric presets (`Aurora Deep`, `Cyber Twilight`, `Liquid Emerald`, `Sunset Solstice`, `Obsidian Minimal`).
- **Specular Border Highlights**: Multi-layered backdrop filters with variable blur (`blur(16px)` to `blur(20px)`), subtle translucent gradient borders (`border-white/10` to `border-white/30`), and soft radial glow illumination.
- **Micro-Interactions**: Easing cubic-bezier transitions (`cubic-bezier(0.16, 1, 0.3, 1)`) on card hovers and dock elements.

### 4.2 Floating Focus Capsule with Web Audio Synthesis

- **Zero External Audio Dependencies**: Ambient audio generates directly via the HTML5 Web Audio API:
  - _10Hz Alpha Waves_: Dual sine wave oscillators (210 Hz and 220 Hz) for binaural frequency synchrony.
  - _Rain Stream_: Pink-noise randomized buffer with dynamic bandpass filtering (1200 Hz, Q: 1.0).
  - _Warm White Noise_: Lowpass filtered (800 Hz) random noise buffer.
  - _Celestial Completion Chime_: Multi-tonal harmonic chords (C5, E5, G5, C6) triggered with exponential gain decay.
- **Progress Ring & Confetti**: SVG circular progress indicator with dashoffset interpolation and celebratory multi-colored confetti bursts upon session completion.

### 4.3 Native Drag-and-Drop Kanban Board

- Standard HTML5 Drag and Drop events (`onDragStart`, `onDragOver`, `onDragLeave`, `onDrop`) optimized for 60fps performance without heavy external library bloat.
- Column re-ordering and status mutation persist immediately via backend REST endpoints (`/api/tasks/move` and `/api/tasks/{id}`).

### 4.4 Global Omnibar (`⌘K` / `Ctrl+K`)

- Omnipresent modal search indexing projects, tasks, team members, and calendar events with client-side debounce (180ms) and keyboard arrow navigation.
- Built-in shortcuts for theme switching, focus session triggering, task creation, and database re-seeding.

---

## 5. Security & Deployment Topology

- **Unified Full-Stack Deployment**: FastAPI serves API endpoints on `/api/*` and acts as an SPA fallback static file server for `frontend/dist/`.
- **Zero-Config Development**: Dual server support with Vite dev proxy (`localhost:5173` -> `localhost:8000`) for hot-module reloading during development.
- **Data Persistence**: Local SQLite file (`glassflow.db`) with automatic table creation and idempotent seed data generation on initial boot.
