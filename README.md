# MINDfulness

University mental health platform for Imperial College London.

## What's in this repo

```
mindfulness/
├── student/      → Student-facing app    (React UI on :5173, FastAPI on :8000)
└── counsellor/   → Counsellor dashboard  (React UI on :5174, FastAPI on :8001)
```

Both apps share a single SQLite database at `student/backend/mindfulness.db`.
**Always start the student backend first** — it creates the database.

---

## Prerequisites

Make sure you have these installed before anything else:

| Tool | Version | Check with |
|------|---------|------------|
| Python | 3.11+ | `python --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |

---

## One-time Setup (do this once after cloning)

### 1. Clone the repo

```bash
git clone <repo-url>
cd mindfulness
```

### 2. Create your `.env` file

```bash
cp .env.example .env
```

Open `.env` and paste in your Gemini API key:

```
GEMINI_API_KEY=your_actual_key_here
```

Get a free key at [aistudio.google.com](https://aistudio.google.com).
The key is only needed for the **Mia chatbot** in the student app. Everything else works without it.

### 3. Install Python dependencies

```bash
pip install -r student/requirements.txt
pip install -r counsellor/requirements.txt
```

### 4. Install frontend dependencies

```bash
cd student/frontend && npm install && cd ../..
cd counsellor/frontend && npm install && cd ../..
```

---

## Running the apps

You need **4 terminals** to run both apps at once, or **2 terminals** if you only need one app.

### Student App

**Terminal 1 — Student backend**
```bash
cd student/backend
python -m uvicorn main:app --port 8000 --reload
```
> First run creates `mindfulness.db` and seeds demo data automatically.

**Terminal 2 — Student frontend**
```bash
cd student/frontend
npm run dev
```
Open **http://localhost:5173**

---

### Counsellor Dashboard

> Start the student backend first so the database exists.

**Terminal 3 — Counsellor backend**
```bash
cd counsellor/backend
python -m uvicorn main:app --port 8001 --reload
```
> First run seeds the extra students, risk scores, journal entries, and mood data.

**Terminal 4 — Counsellor frontend**
```bash
cd counsellor/frontend
npm run dev
```
Open **http://localhost:5174**

---

## Port summary

| App | What | URL |
|-----|------|-----|
| Student | Frontend | http://localhost:5173 |
| Student | Backend API | http://localhost:8000 |
| Student | API docs (Swagger) | http://localhost:8000/docs |
| Counsellor | Frontend | http://localhost:5174 |
| Counsellor | Backend API | http://localhost:8001 |
| Counsellor | API docs (Swagger) | http://localhost:8001/docs |

---

## Common issues

**`ModuleNotFoundError` on backend start**
→ Make sure you ran `pip install -r student/requirements.txt` (or `counsellor/requirements.txt`).

**Mia chatbot says "quota" or doesn't respond**
→ Your `.env` file is missing or the `GEMINI_API_KEY` is invalid. Check it at the repo root.

**Counsellor dashboard shows no students**
→ Start the student backend first so the database is created, then start the counsellor backend.

**Port already in use**
→ Something else is on that port. Kill it with `lsof -ti:8000 | xargs kill` (replace `8000` with the port).

**Frontend shows blank / can't reach API**
→ Make sure both the frontend AND the backend for that app are running at the same time.

---

## Database

The database file `student/backend/mindfulness.db` is gitignored — it does not exist after a fresh clone. It is created automatically the first time you start the student backend.

If you need to reset to a clean state:
```bash
rm student/backend/mindfulness.db
# then restart the student backend — it re-creates and re-seeds automatically
```

---

## Repo structure in full

```
mindfulness/
├── .env                          # Your secrets — gitignored, copy from .env.example
├── .env.example                  # Template — shows what env vars are needed
│
├── student/
│   ├── requirements.txt          # Python packages for the student backend
│   ├── backend/
│   │   ├── main.py               # FastAPI app entry point
│   │   ├── database.py           # SQLite connection (creates mindfulness.db here)
│   │   ├── models.py             # Database table definitions
│   │   ├── seed.py               # Demo data (Angela, events, risk scores)
│   │   └── routes/               # journal.py  mood.py  scores.py  events.py  chat.py
│   └── frontend/
│       ├── vite.config.js        # Dev server — proxies API calls to :8000
│       └── src/
│           ├── pages/            # Home.jsx  Chat.jsx  JournalMore.jsx  MoodStats.jsx
│           └── components/       # Header, Calendar, MoodTracker, Journal, etc.
│
└── counsellor/
    ├── requirements.txt          # Python packages for the counsellor backend
    ├── backend/
    │   ├── main.py               # FastAPI app entry point
    │   ├── database.py           # Points to student/backend/mindfulness.db
    │   ├── models.py             # Same table definitions (read-only)
    │   ├── seed.py               # Seeds extra students, history, journals, moods
    │   └── routes/               # dashboard.py  student.py
    └── frontend/
        ├── vite.config.js        # Dev server — proxies API calls to :8001
        └── src/
            ├── pages/            # Dashboard.jsx  StudentProfile.jsx
            └── components/       # Header, StatsCard, RiskScoreboard, ScoreChart, etc.
```
