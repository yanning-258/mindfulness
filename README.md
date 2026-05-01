# MINDfulness — Student Well-being App

Student-facing web application for the MINDfulness university mental health platform. Built for Imperial College London.

## System Overview

This is **Part 1** of a 3-part system:

| Part | Description | Status |
|------|-------------|--------|
| **Student App** (this repo) | Dashboard, journaling, mood tracking, Mia chatbot, events | ✅ Built |
| Analytics Engine | Reads journals, runs ML models, writes risk scores to DB | teammate |
| Counsellor Dashboard | Views student risk scores and trends | teammate |

The shared SQLite database (`mindfulness.db`) is the integration point between all three parts.

---

## Tech Stack

- **Frontend:** React 18 + Tailwind CSS 3 + Vite
- **Backend:** Python FastAPI + Uvicorn
- **Database:** SQLite via SQLAlchemy ORM
- **AI Chatbot:** Google Gemini API (`gemini-2.5-flash`)

---

## Features

- **Single-page dashboard** — everything visible at once, no nav clutter
- **Events calendar** — monthly grid with colour-coded event dots and click-to-view popups
- **Mood tracker** — 7-day emoji strip, click any day to log or change mood via modal picker
- **Journal** — yellow sticky-note textarea, past entries modal, full journal history page with stats
- **Status score card** — reads PHQ-9, GAD-7, suicidal risk scores written by the analytics engine
- **Chat with Mia** — full-page Gemini-powered mental health chatbot with conversation history

---

## Prerequisites

- Python 3.11+
- Node.js 18+
- A Google Gemini API key ([aistudio.google.com](https://aistudio.google.com))

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/yanning-258/mindfulness.git
cd mindfulness
```

### 2. Backend

```bash
cd backend
pip install -r ../requirements.txt
python seed.py        # creates mindfulness.db and seeds Angela + events + risk score
```

### 3. Environment variables

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Frontend

```bash
cd frontend
npm install
```

---

## Running Locally

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
python -m uvicorn main:app --port 8000 --reload
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/scores` | Latest risk score for Angela |
| POST | `/journal` | Save a new journal entry |
| GET | `/journal` | All journal entries, newest first |
| POST | `/mood` | Log or update mood for a specific date |
| GET | `/mood` | Mood logs for the past 7 days |
| GET | `/events` | All upcoming mental health events |
| POST | `/chat` | Send message to Mia (Gemini), get reply |

---

## Database Schema

Shared with teammates — do not rename or remove columns.

| Table | Written by | Read by |
|-------|-----------|---------|
| `students` | seed.py | all parts |
| `journal_entries` | student app | analytics engine |
| `mood_logs` | student app | student app |
| `risk_scores` | analytics engine | student app, dashboard |
| `events` | seed.py | student app |
| `chat_logs` | student app | student app |

---

## Project Structure

```
mindfulness/
├── backend/
│   ├── main.py          # FastAPI app + CORS + router registration
│   ├── database.py      # SQLite engine + session factory
│   ├── models.py        # SQLAlchemy models for all 6 tables
│   ├── seed.py          # Creates DB and inserts demo data
│   └── routes/
│       ├── journal.py
│       ├── mood.py
│       ├── scores.py
│       ├── events.py
│       └── chat.py      # Gemini API integration
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx          # Main dashboard
│       │   ├── Chat.jsx          # Full-page Mia chat
│       │   ├── JournalMore.jsx   # Journal history + stats
│       │   └── MoodStats.jsx     # Mood stats (placeholder)
│       └── components/
│           ├── Header.jsx
│           ├── EventsCalendar.jsx
│           ├── MoodTracker.jsx
│           ├── MoodCircle.jsx
│           ├── MoodPickerModal.jsx
│           ├── JournalSection.jsx
│           ├── PastEntriesModal.jsx
│           ├── DailyQuote.jsx
│           └── StatusScore.jsx
├── .env                 # GEMINI_API_KEY (not committed)
├── requirements.txt
└── README.md
```

---

## Demo Student

The app is hardcoded to demo student **Angela Beckett** (student_id = 1):

- Email: angela.beckett@imperial.ac.uk
- University: Imperial College London
- Major: Business Analytics (Postgraduate)

---

## Notes

- `mindfulness.db` is gitignored — run `python seed.py` after cloning
- `.env` is gitignored — add your Gemini API key manually
- Risk scores are seeded for the prototype; in production the analytics engine writes them
- Chat history is kept in React state only — it resets on page refresh (by design for prototype)
