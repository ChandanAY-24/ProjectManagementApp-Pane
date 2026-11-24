# GlassFlow 🌌

> **Spatial Project Management & Focus Telemetry Workspace**  
> *A production-ready full-stack application built with FastAPI, SQLite, React 19, Vite, and modern liquid glassmorphism.*

---

## ✨ Features

- 📋 **Fluid Kanban Board**: Responsive 4-column board (Backlog, In Progress, In Review, Completed) with native drag-and-drop mechanics, ghost preview feedback, column filters, priority badges, and estimated vs. spent hours tracking.
- ⏱️ **Floating Focus Capsule**: Top-docked focus pill with interactive circular countdown dial, breathing pulse animation, Pomodoro presets (15m, 25m, 50m), session logging, and confetti celebration upon completion.
- 🎵 **Web Audio Ambient Soundscapes**: Built-in, zero-bandwidth browser audio synthesizer offering 10Hz Alpha Waves (binaural focus tone), Gentle Rain Stream, and Warm White Noise, alongside harmonic completion chimes.
- 📅 **Studio Calendar**: Monthly matrix grid and daily agenda drawer for scheduling design crits, sprint reviews, team syncs, focus blocks, and milestone releases.
- 👥 **Team Workload Capacity Directory**: Live availability badges (*Available*, *In Focus*, *In Meeting*, *Offline*), weekly capacity allocation meters (`38h/40h`), department filters, and live focus tags.
- 🚀 **Projects & Roadmaps**: Studio initiative tracker with dynamic progress bars, discipline categorization, and project lead avatars.
- 📊 **Studio Analytics**: Real-time telemetry displaying daily focus minutes logged, consecutive streak days, task velocity, priority distribution, and studio load factors.
- 🔍 **Global Omnibar (`⌘K` / `Ctrl+K`)**: Rapid debounced search across all tasks, projects, teammates, and events, coupled with instant studio quick-actions.
- 🎨 **Atmospheric Glassmorphic Themes**: 5 switchable ambient wallpaper themes (*Aurora Deep*, *Cyber Twilight*, *Liquid Emerald*, *Sunset Solstice*, *Obsidian Minimal*) driven by pure CSS variables and frosted translucent backdrops.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8 with `@tailwindcss/vite`
- **Styling**: Tailwind CSS + Custom CSS Liquid Glass Tokens (Backdrop Blur, Specular Borders, Glowing Gradients)
- **Icons**: Lucide React
- **Audio Engine**: Native HTML5 Web Audio API Synthesizer
- **Celebration FX**: Canvas Confetti

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **Server**: Uvicorn ASGI
- **ORM / Storage**: SQLAlchemy 2.0 + SQLite (`glassflow.db`)
- **Data Validation**: Pydantic v2
- **CORS & SPA Support**: Configured for both development proxying and unified production static file delivery

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ (Node 20+ or 24 recommended)
- `npm` or `pnpm`

---

### 1. Backend Setup & Run

From the root directory:

```bash
# Activate virtual environment (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Or run with virtualenv python directly
.\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt

# Run FastAPI backend with Uvicorn
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

The FastAPI backend will automatically seed `glassflow.db` on initial boot and become available at `http://127.0.0.1:8000`.  
- Interactive API Docs (Swagger): `http://127.0.0.1:8000/docs`
- Redoc Documentation: `http://127.0.0.1:8000/redoc`

---

### 2. Frontend Setup & Run (Development)

In a separate terminal:

```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite dev server with proxy to backend
npm run dev
```

Open `http://localhost:5173` in your browser. The Vite development server automatically proxies `/api` calls to `http://127.0.0.1:8000`.

---

### 3. Production Unified Build & Serve

You can build the frontend and serve everything directly from FastAPI:

```bash
# Build frontend static assets into frontend/dist
cd frontend
npm run build
cd ..

# Run FastAPI - it will automatically serve the SPA at http://localhost:8000
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘K` or `Ctrl+K` | Open / Close Studio Omnibar Search & Quick Actions |
| `Escape` | Dismiss Omnibar or active modal |
| `↑` / `↓` | Navigate Omnibar search results |
| `Enter` | Select search item / Execute studio action |

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health status and studio metrics count |
| `GET` / `POST` | `/api/projects` | List projects / Create new project |
| `PATCH` / `DELETE` | `/api/projects/{id}` | Update project / Delete project and cascade tasks |
| `GET` / `POST` | `/api/tasks` | List tasks (filtered by project, status, priority) / Create task |
| `PATCH` / `DELETE` | `/api/tasks/{id}` | Update task status or details / Delete task |
| `POST` | `/api/tasks/move` | Drag-and-drop batch status and order reordering |
| `GET` / `POST` | `/api/team` | Team member directory / Create member |
| `PATCH` | `/api/team/{id}` | Adjust workload capacity hours or availability status |
| `GET` / `POST` | `/api/focus` | Focus session logs / Record completed focus sprint |
| `GET` | `/api/focus/summary` | Today's focus minutes, completed sessions, and streak count |
| `GET` / `POST` | `/api/calendar` | List events by date range / Schedule new calendar event |
| `PATCH` / `DELETE` | `/api/calendar/{id}` | Update event / Delete calendar event |
| `GET` | `/api/search?q={query}` | Global search across tasks, projects, members, and events |
| `POST` | `/api/seed` | Reset and reload studio demo fixtures |

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
