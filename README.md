# MINDfulness — Student Well-being App

Student-facing web application for the MINDfulness university mental health platform, built for Imperial College London.

## System Overview

This is **Part 1** of a 3-part system. All three parts share a single SQLite database (`mindfulness.db`) as the integration point.

| Part | Description | Status |
|------|-------------|--------|
| **Student App** (this repo) | Dashboard, journalling, mood tracking, Mia chatbot, events calendar | ✅ Done |
| **Analytics Engine** | Reads journal/mood data, runs models, writes risk scores to DB | In progress |
| **Counsellor Dashboard** | Views student risk scores and trends | In progress |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Tailwind CSS 3 + Vite 8 |
| Backend | Python FastAPI + Uvicorn |
| Database | SQLite via SQLAlchemy ORM |
| AI Chatbot | Google Gemini API (`gemini-2.5-flash`) |

---

## Prerequisites

- Python 3.11+
- Node.js 18+
- A free Google Gemini API key — [aistudio.google.com](https://aistudio.google.com)

---

## Setup

### 1. Clone the repo

```bash
git clone <repo-url>
cd mindfulness
```

### 2. Environment variables

```bash
cp .env.example .env
```

Open `.env` and replace `your_gemini_api_key_here` with your actual key. The chat feature (Mia) won't work without it, but the rest of the app will.

### 3. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 4. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

---

## Running Locally

Open **two terminals** from the project root:

**Terminal 1 — Backend**
```bash
cd backend
python -m uvicorn main:app --port 8000 --reload
```

The first run automatically creates `mindfulness.db` and seeds it with demo data (Angela Beckett, 5 events, sample risk scores).

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

> The Vite dev server proxies all API requests to `http://localhost:8000`, so no extra environment variables are needed for local development.

---

## Project Structure

```
mindfulness/
├── .env                    # Your secrets (gitignored — copy from .env.example)
├── .env.example            # Template — commit this, not .env
├── requirements.txt        # Python dependencies
├── backend/
│   ├── main.py             # FastAPI app, CORS, router registration, auto-seed on startup
│   ├── database.py         # SQLite engine and session factory
│   ├── models.py           # SQLAlchemy models (6 tables)
│   ├── seed.py             # Creates DB and inserts demo data (safe to re-run)
│   └── routes/
│       ├── journal.py      # POST /journal, GET /journal
│       ├── mood.py         # POST /mood, GET /mood
│       ├── scores.py       # GET /scores
│       ├── events.py       # GET /events
│       └── chat.py         # POST /chat — Gemini integration
└── frontend/
    ├── vite.config.js      # Vite + dev proxy config
    └── src/
        ├── api.js          # API base URL (empty = relative, proxied by Vite)
        ├── pages/
        │   ├── Home.jsx            # Main dashboard
        │   ├── Chat.jsx            # Full-page Mia chatbot
        │   ├── JournalMore.jsx     # Journal history + stats
        │   └── MoodStats.jsx       # Placeholder
        └── components/
            ├── Header.jsx
            ├── EventsCalendar.jsx
            ├── MoodTracker.jsx
            ├── MoodPickerModal.jsx
            ├── MoodCircle.jsx
            ├── JournalSection.jsx
            ├── PastEntriesModal.jsx
            ├── DailyQuote.jsx
            └── StatusScore.jsx
```

---

## API Endpoints

Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/scores` | Latest PHQ-9, GAD-7, and suicidal risk scores |
| POST | `/journal` | Save a journal entry — body: `{ text }` |
| GET | `/journal` | All journal entries, newest first |
| POST | `/mood` | Log or update mood — body: `{ emoji, mood_label, date? }` |
| GET | `/mood` | Mood logs for the past 7 days |
| GET | `/events` | All seeded events, sorted by date |
| POST | `/chat` | Send message to Mia — body: `{ message, history? }` |

FastAPI auto-generates interactive docs at **http://localhost:8000/docs**.

---

## Database Schema

Shared with the analytics engine and counsellor dashboard — do not rename or remove columns without coordinating with the team.

| Table | Written by | Read by |
|-------|-----------|---------|
| `students` | `seed.py` | all parts |
| `journal_entries` | student app | analytics engine |
| `mood_logs` | student app | student app |
| `risk_scores` | analytics engine | student app, counsellor dashboard |
| `events` | `seed.py` | student app |
| `chat_logs` | student app | student app |

---

## Demo Data

The seed script loads one demo student:

| Field | Value |
|-------|-------|
| Name | Angela Beckett |
| Email | angela.beckett@imperial.ac.uk |
| University | Imperial College London |
| Major | Business Analytics (Postgraduate Masters) |

All API endpoints are currently hardcoded to `student_id = 1` (Angela). Authentication is not implemented yet.

---

## Notes

- `mindfulness.db` is gitignored. It is created automatically when the backend starts for the first time.
- `.env` is gitignored. Always copy from `.env.example`.
- Risk scores in the seeded DB are placeholder values (`PHQ-9=15, GAD-7=5, Suicidal=60`). In the full system, the analytics engine overwrites these.
- Chat history lives in React state only and resets on page refresh — intentional for the prototype.
