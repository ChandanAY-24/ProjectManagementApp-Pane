# GEMINI & AI AGENT GUIDE: GlassFlow

## Architecture & Codebase Summary

GlassFlow is a full-stack project management and focus telemetry workspace built with:
- **Backend**: FastAPI with SQLAlchemy 2.0 and SQLite (`glassflow.db`) inside `.venv`.
- **Frontend**: Vite with React 19, TypeScript, Tailwind CSS, Lucide icons, and custom liquid glassmorphism tokens.
- **Single-command deployment**: FastAPI serves `/api/*` endpoints and serves the compiled static SPA from `frontend/dist`.

## Project Directory Map

- `backend/main.py`: FastAPI application entrypoint, CORS configuration, CRUD endpoints, and static file mount for SPA fallback.
- `backend/models.py`: SQLAlchemy models (`Project`, `Task`, `TeamMember`, `FocusSession`, `CalendarEvent`).
- `backend/schemas.py`: Pydantic schemas for data validation and API request/response typing.
- `backend/seed_data.py`: Default studio demo fixtures (design system projects, team members, tasks, and focus sessions).
- `backend/database.py`: SQLite engine and session maker.
- `frontend/src/App.tsx`: Main React application managing state, routing tabs, and modals.
- `frontend/src/components/KanbanBoard.tsx`: 4-column drag-and-drop task workflow board.
- `frontend/src/components/FocusCapsule.tsx`: Floating top-docked timer capsule with animated progress dial and celebration confetti.
- `frontend/src/components/Soundscape.ts`: Native browser Web Audio API synthesizer for 10Hz Alpha Waves, Rain, and White Noise.
- `frontend/src/components/CalendarView.tsx`: Studio calendar for sprint reviews, syncs, and milestones.
- `frontend/src/components/TeamDirectory.tsx`: Real-time capacity meters and availability statuses.
- `frontend/src/components/CommandPalette.tsx`: Global search omnibar triggered via `⌘K` or `Ctrl+K`.
- `frontend/src/components/TaskModal.tsx`: Task creation and editing drawer.
- `frontend/src/index.css`: Glassmorphic styling tokens, theme variables, and blur classes.

## Development Commands

- Run Backend: `.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload`
- Build Frontend: `cd frontend && npm.cmd run build`
- Dev Frontend: `cd frontend && npm.cmd run dev`
