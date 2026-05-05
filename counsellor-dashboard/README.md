# MINDfulness — Counsellor Dashboard

Counsellor-facing web application for the MINDfulness university mental health platform. Read-only view of student risk scores, journal entries, and mood data.

## System Overview

This is **Part 3** of a 3-part system. All parts share the same SQLite database (`mindfulness.db`).

| Part | Description | Status |
|------|-------------|--------|
| **Student App** | Dashboard, journalling, mood tracking, Mia chatbot | ✅ Done |
| **Analytics Engine** | Reads journals/moods, writes risk scores | In progress |
| **Counsellor Dashboard** (this repo) | Views student risk scores, trends, journals | ✅ Done |

---

## Prerequisites

- Python 3.11+
- Node.js 18+
- The **student app must be set up first** — this dashboard reads from the shared `mindfulness.db` it creates

---

## Setup

### 1. Clone into the same parent folder as the student app

This dashboard resolves the shared database via a relative path:
```
mindfulness/
├── backend/                ← student app backend (owns mindfulness.db)
├── frontend/               ← student app frontend
└── counsellor-dashboard/   ← this repo
```

### 2. Install backend dependencies

```bash
cd counsellor-dashboard
pip install -r requirements.txt
```

### 3. Install frontend dependencies

```bash
cd counsellor-dashboard/frontend
npm install
```

---

## Running Locally

The counsellor backend runs on **port 8001** and the frontend on **port 5174** so they don't clash with the student app.

**Terminal 1 — Counsellor backend**
```bash
cd counsellor-dashboard/backend
python -m uvicorn main:app --port 8001 --reload
```

On first start, the backend automatically:
- Adds a `cid` column to the `students` table
- Seeds students 2–5 (Ben, Tom, Zendaya, Anthony) if not present
- Upgrades Angela's status from "Needs Attention" → "Suicidal"
- Seeds historical risk score data for Angela's chart
- Seeds journal entries and mood logs for Angela

**Terminal 2 — Counsellor frontend**
```bash
cd counsellor-dashboard/frontend
npm run dev
```

Open **http://localhost:5174** in your browser.

> The Vite dev server proxies all API requests to `http://localhost:8001` — no environment variables needed for local development.

---

## Pages

### Dashboard (`/`)
- **Overall Statistics** — live counts of students by risk status
- **Upcoming Counselling Sessions** — hardcoded schedule with links to student profiles
- **Live Risk Scoreboard** — all students sorted by severity (Suicidal → Depression → Anxiety → Normal), with PHQ-9 / GAD-7 / Suicidal Score columns and status badges

### Student Profile (`/student/:id`)
- **Profile card** — CID, Major, Year, Country
- **Summary card** — AI-generated summary, last action, recommendation
- **Score Over Time chart** — Recharts line chart with Suicidal / PHQ-9 / GAD-7 tab switcher, full historical data
- **Journal panel** — 7-day read-only mood strip + scrollable journal entries

---

## API Endpoints

Base URL: `http://localhost:8001`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Student counts grouped by risk status |
| GET | `/students` | All students with latest risk scores, sorted by severity |
| GET | `/sessions` | Upcoming counselling sessions (hardcoded) |
| GET | `/student/:id` | Student profile (name, CID, major, year, country) |
| GET | `/student/:id/scores` | All historical risk scores for the chart |
| GET | `/student/:id/journal` | Journal entries, newest first |
| GET | `/student/:id/mood` | Mood logs for the past 7 days |

Interactive docs available at **http://localhost:8001/docs**.

---

## Project Structure

```
counsellor-dashboard/
├── requirements.txt
├── backend/
│   ├── main.py           # FastAPI app, CORS, auto-seed on startup
│   ├── database.py       # Points to shared ../../backend/mindfulness.db
│   ├── models.py         # SQLAlchemy models (read-only, matches student app schema)
│   ├── seed.py           # Seeds counsellor-specific data (safe to re-run)
│   └── routes/
│       ├── dashboard.py  # /stats, /students, /sessions
│       └── student.py    # /student/:id and sub-routes
└── frontend/
    ├── vite.config.js    # Proxy config — port 5174, proxies to 8001
    └── src/
        ├── pages/
        │   ├── Dashboard.jsx       # Main counsellor view
        │   └── StudentProfile.jsx  # Per-student detail view
        └── components/
            ├── Header.jsx          # Purple header (reused across pages)
            ├── StatsCard.jsx       # Overall statistics
            ├── SessionsCard.jsx    # Upcoming sessions table
            ├── RiskScoreboard.jsx  # Student risk table
            ├── ScoreChart.jsx      # Recharts line chart + tab switcher
            ├── JournalPanel.jsx    # Mood strip + journal entries
            └── MoodStrip.jsx       # 7-day read-only emoji display
```

---

## Notes

- This dashboard is **read-only** — it never writes to the database
- Risk scores are written by the analytics engine (Part 2); seeded values are placeholders
- The Summary card content is hardcoded for the prototype
- `mindfulness.db` is owned by the student app backend — run the student app first
