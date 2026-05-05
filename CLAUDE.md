# CLAUDE.md — MINDfulness

## Project Overview

**MINDfulness** is a student-facing mental health web app built for Imperial College London. It is Part 1 of a 3-part system:

- **Part 1 (this repo):** Student-facing app — journalling, mood tracking, chatbot, events calendar, risk score display
- **Part 2 (separate):** Analytics engine — reads journal/mood data, writes risk scores to the shared DB
- **Part 3 (separate):** Counsellor dashboard — reads risk scores and student data

All three parts share a single SQLite database (`mindfulness.db`) as the integration point.

**Demo user:** Angela Beckett (ID=1), Masters in Business Analytics at Imperial College London. All endpoints are currently hardcoded to `STUDENT_ID = 1`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI 0.115, Python 3.11+, Uvicorn |
| Database | SQLite via SQLAlchemy 2.0 ORM |
| AI/Chat | Google Gemini 2.5-flash (`google-generativeai`) |
| Frontend | React 19, React Router 7, Vite 8 |
| Styling | Tailwind CSS 3.4 + PostCSS + autoprefixer |
| Config | python-dotenv |

---

## Directory Structure

```
mindfulness/
├── CLAUDE.md
├── README.md
├── requirements.txt          # Root-level Python deps (install from here)
├── backend/
│   ├── main.py               # FastAPI app, CORS, router registration
│   ├── database.py           # SQLite engine, SessionLocal, Base
│   ├── models.py             # SQLAlchemy ORM models (6 tables)
│   ├── seed.py               # DB seeding script — run once before first launch
│   ├── requirements.txt      # Backend deps (same as root requirements.txt)
│   └── routes/
│       ├── journal.py        # POST /journal, GET /journal
│       ├── mood.py           # POST /mood, GET /mood
│       ├── scores.py         # GET /scores
│       ├── events.py         # GET /events
│       └── chat.py           # POST /chat (Gemini integration)
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx            # React Router — 4 routes
        ├── api.js             # Base URL config (VITE_API_URL or localhost:8000)
        ├── pages/
        │   ├── Home.jsx       # Main dashboard (2-column layout)
        │   ├── Chat.jsx       # Full-page Gemini chatbot
        │   ├── JournalMore.jsx
        │   └── MoodStats.jsx  # Placeholder
        └── components/
            ├── Header.jsx
            ├── EventsCalendar.jsx
            ├── MoodTracker.jsx
            ├── MoodCircle.jsx
            ├── MoodPickerModal.jsx
            ├── JournalSection.jsx
            ├── PastEntriesModal.jsx
            ├── DailyQuote.jsx
            └── StatusScore.jsx
```

---

## Dev Setup

### Environment Variables

Create a `.env` file in the project root (gitignored):

```
GEMINI_API_KEY=your_api_key_here
```

For frontend API URL (optional, defaults to `http://localhost:8000`):

```
VITE_API_URL=http://localhost:8000
```

### Run Backend

```bash
cd backend
pip install -r ../requirements.txt
python seed.py                                      # First time only — creates DB and seeds demo data
python -m uvicorn main:app --port 8000 --reload
```

FastAPI docs available at: `http://localhost:8000/docs`

### Run Frontend

```bash
cd frontend
npm install
npm run dev                                         # Starts Vite dev server on :5173
```

---

## Database Schema

Six SQLAlchemy models in `backend/models.py`:

| Table | Written By | Read By |
|-------|-----------|---------|
| `students` | seed.py | All parts |
| `journal_entries` | Student app | Analytics engine |
| `mood_logs` | Student app | Student app |
| `risk_scores` | Analytics engine | Student app, dashboard |
| `events` | seed.py | Student app |
| `chat_logs` | Student app | Student app |

**Key constraints:**
- `mood_logs` has a unique constraint on `(student_id, date)` — one mood per day; mood endpoints upsert
- `risk_scores` is written by the external analytics engine, not this app

---

## API Endpoints

All endpoints hardcoded to `STUDENT_ID = 1`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/scores` | Latest risk scores (PHQ-9, GAD-7, suicidal) |
| POST | `/journal` | `{text}` → saves entry, returns `{id, text, timestamp, word_count}` |
| GET | `/journal` | All entries newest-first |
| POST | `/mood` | `{emoji, mood_label, date?}` → upserts today's mood |
| GET | `/mood` | Last 7 days of mood logs, oldest-first |
| GET | `/events` | All events sorted by date |
| POST | `/chat` | `{message, history?}` → Gemini reply; history is client-side state array |

---

## Frontend Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Dashboard — calendar, mood tracker, journal, daily quote, risk scores |
| `/chat` | Chat | Full-page Mia (Gemini) chatbot |
| `/journal-more` | JournalMore | Full journal history with stats |
| `/mood-stats` | MoodStats | Placeholder |

**Home layout:** 2-column — Left 60% (calendar, mood, journal), Right 40% (daily quote, status scores).

---

## Key Patterns & Conventions

### Backend
- **FastAPI dependency injection:** `Depends(get_db)` for DB sessions on all route handlers
- **Pydantic schemas:** Response models use `model_config = ConfigDict(from_attributes=True)`
- **Seed pattern:** `seed.py` checks if student ID=1 exists before inserting, safe to re-run
- **Chat is stateless:** History array sent by client on every request; backend does not persist per-message
- **CORS:** `allow_origins=["*"]` — open for development, restrict before production

### Frontend
- **No global state library** — plain `useState`/`useEffect` throughout
- **API abstraction:** All fetch calls use `API_BASE` from `src/api.js`
- **Tailwind only:** No custom CSS files (except `index.css` for resets)
- **Modal pattern:** Fixed overlay with `stopPropagation`, click-outside closes
- **Chat history:** Client-side state array — intentionally resets on page refresh in prototype
- **Dates:** ISO format `YYYY-MM-DD` passed to API; displayed with `toLocaleDateString()`

---

## Risk Score Display Logic

`StatusScore.jsx` reads from `/scores` and applies badge colors:
- **Green** → "Normal"
- **Amber** → "Needs Attention"  
- **Red** → "High Risk"

Scores are computed externally by the analytics engine (Part 2). The seeded demo values are: PHQ-9=15, GAD-7=5, Suicidal=60, Status="Needs Attention".

---

## Gemini Chat (Mia)

- Model: `gemini-2.5-flash`
- System prompt enforces mental health support persona with safe crisis handling
- Rate limit / quota errors return a graceful fallback message instead of crashing
- Chat logs are saved to `chat_logs` table for record-keeping but not used for history reconstruction (history lives in client state)

---

## What Is NOT Yet Implemented

- Student authentication (replace hardcoded `STUDENT_ID = 1` with real auth)
- Analytics engine (Part 2) — risk score computation
- Counsellor dashboard (Part 3)
- `MoodStats` page content
- Persistent chat history across page refreshes
- Any tests (no pytest or Vitest setup)

---

## Production Checklist (Before Deploying)

- [ ] Restrict CORS `allow_origins` to specific frontend domain
- [ ] Add student authentication (JWT or session-based)
- [ ] Replace SQLite with PostgreSQL
- [ ] Move `VITE_API_URL` to production env config
- [ ] Add structured logging
- [ ] Write backend tests (pytest) and frontend tests (Vitest)
- [ ] Confirm risk score schema with analytics team (schema change pending per latest commit)
