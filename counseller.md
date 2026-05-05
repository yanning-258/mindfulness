# MINDfulness — Counsellor Dashboard (Separate Web App)

## Project Context
This is the COUNSELLOR-FACING side of MINDfulness, a university mental health platform.
It is a SEPARATE web app from the student app, but shares the SAME SQLite database (mindfulness.db).

There are 3 parts to the full system (you are only building Part 2 & 3):
1. Student App (already built separately) — student journaling, mood tracking, chatbot
2. **Counsellor Dashboard** (YOU ARE BUILDING THIS) — overview of all students, risk scores
3. **Student Profile Page** (YOU ARE BUILDING THIS) — detailed view per student

The SHARED DATABASE (SQLite) is the integration point.
- This app READS from: `students`, `journal_entries`, `mood_logs`, `risk_scores`
- This app WRITES to: nothing (read-only for prototype)

---

## Tech Stack (MATCH the student app)
- **Frontend:** React + Tailwind CSS
- **Backend:** Python FastAPI
- **Database:** SQLite — same `mindfulness.db` file (read-only access)
- **ORM:** SQLAlchemy
- **Charts:** Recharts (npm package) for the Score Over Time line chart
- **No authentication** — hardcode as counsellor view

---

## Database Schema (READ FROM — do not modify)

Tables available (created by student app):
- `students` — id, name, email, university, major, year, country
- `journal_entries` — id, student_id, text, timestamp, word_count
- `mood_logs` — id, student_id, date, emoji, mood_label
- `risk_scores` — id, student_id, phq9_score, gad7_score, suicidal_score, overall_status, computed_at

Seed the following students and risk scores if database is empty:

**Students:**
- id=1, name="Angela Beckett", major="Business Analytics", year="Postgraduate (Masters)", country="Spain", CID="01234567"
- id=2, name="Ben Robertson", major="Computer Science", year="Undergraduate (Year 3)", country="UK", CID="02345678"
- id=3, name="Tom Holland", major="Physics", year="Undergraduate (Year 2)", country="UK", CID="03456789"
- id=4, name="Zendaya Coleman", major="Medicine", year="Undergraduate (Year 4)", country="USA", CID="04567890"
- id=5, name="Anthony Stark", major="Mechanical Engineering", year="Postgraduate (PhD)", country="USA", CID="05678901"

**Risk Scores (latest per student):**
- Angela: phq9=15, gad7=5, suicidal=60, status="Suicidal"
- Ben: phq9=5, gad7=20, suicidal=20, status="Anxiety"
- Tom: phq9=5, gad7=15, suicidal=10, status="Anxiety"
- Zendaya: phq9=18, gad7=7, suicidal=10, status="Depression"
- Anthony: phq9=25, gad7=8, suicidal=10, status="Depression"

**Historical scores for Angela (for Score Over Time chart):**
- 2020 Jan: suicidal=8, phq9=5, gad7=3
- 2022 Feb: suicidal=9, phq9=7, gad7=5
- 2023 Mar: suicidal=13, phq9=10, gad7=4
- 2024 Apr: suicidal=15, phq9=12, gad7=5
- 2025 May: suicidal=16, phq9=15, gad7=5

**Journal entries for Angela (seed 3 entries):**
- "I failed machine learning today, I want to kill myself! Ahhhh How can I be so stupid!!!" — Mar 13 2025 13:20
- "Am I not the right material to be an AI engineer? I am so stressed about machine learning." — Mar 13 2025 13:20
- "Why does nobody understand me? I might as well just hang myself on the noose." — Mar 13 2025 13:20

**Mood logs for Angela (seed past 7 days):**
- Mon: 😬, Tue: 😕, Wed: 😣, Thu: 😖, Fri: 😭, Sat: 😭, Sun: 😶

---

## PAGE 1: Counsellor Dashboard (`/`)

### Header:
- Left: "Welcome, Counsellor!" (white text)
- Right: "Imperial College London" + "Student Well-being Center" (right-aligned)
- Background: light purple (#c4b5fd or #a78bfa), full width, rounded bottom corners

### Section 1: Two-column layout

**LEFT — Overall Statistics card:**
- Title: "OVERALL STATISTICS" (bold, centered)
- 5 numbers in a row:
  - Normal: **1504**
  - Anxiety: **200**
  - Depression: **100**
  - Suicidal: **30**
  - Total Students: **1834** (larger font, bold)
- White card, rounded corners, subtle shadow
- Read these counts from `risk_scores` table grouped by overall_status

**RIGHT — Upcoming Counselling Sessions card:**
- Title: "UPCOMING COUNSELLING SESSIONS" (bold, centered)
- Table with columns: Date time | Venue | (button)
- Hardcode 2 sessions:
  - April 20 2026 14:00 | LCBS 300 | [Student Profile] button
  - April 22 2026 16:30 | LCBS 300 | [Student Profile] button
- "Student Profile" buttons: light purple background (#e9d5ff), rounded, clicking navigates to `/student/1`
- White card, rounded corners, subtle shadow

### Section 2: Live Risk Scoreboard

- Section title: "LIVE RISK SCOREBOARD" with a database/scoreboard icon on the left (purple circle with icon)
- Column headers: (avatar) | Name | PHQ-9 (out of 27) | GAD-7 (out of 21) | Suicidal Score (out of 100) | Status | (button)
- One row per student, sorted by risk (Suicidal first, then Depression, then Anxiety, then Normal)
- Each row:
  - **Avatar**: colored circle with student initials (e.g. "AB" for Angela Beckett) — color varies per student
  - **Name**: First name, Last name
  - **PHQ-9 score**
  - **GAD-7 score**
  - **Suicidal Score**
  - **Status badge**: colored pill/tag:
    - "Suicidal" → red background (#ef4444), white text
    - "Anxiety" → blue background (#3b82f6), white text
    - "Depression" → dark/black background (#1f2937), white text
    - "Normal" → green background (#22c55e), white text
  - **"Student Profile" button**: light purple (#e9d5ff), rounded, clicking navigates to `/student/{id}`
- Thin divider line between rows
- White card, rounded corners, subtle shadow

---

## PAGE 2: Student Profile (`/student/:id`)

### Header:
- Left: student avatar (circular profile picture placeholder — use a colored circle with initials or a generic avatar icon) + student name (e.g. "Angela, Beckett") in large text
- Right: "Imperial College London" + "Student Well-being Center"
- Background: light purple (#c4b5fd), full width

### Section 1: Two-column card (Profile + Summary)

**LEFT — Profile:**
- Title: "PROFILE" (bold)
- CID: 01234567
- Major: Business Analytics
- Year: Postgraduate (Masters)
- Country: Spain

**RIGHT — Summary:**
- Title: "SUMMARY" (bold)
- AI-generated summary text (hardcode for prototype):
  "Recent journal entries reflect significant emotional distress, negative self-perception, and hopelessness."
- **Last action**: "Check-in sent (Mar 10, 2026); no response received."
- **Recommendation**: "Immediate follow-up; consider escalation to counselling."
- Both "Last action" and "Recommendation" labels in bold

### Section 2: Two-column layout (Chart + Journal)

**LEFT — Score Over Time:**
- Title: "SCORE OVER TIME" (bold)
- Tab switcher below title: [Suicidal] [PHQ-9] [GAD-7]
  - Active tab has colored background (orange for Suicidal, matching color for others)
  - Clicking a tab switches which score is shown on the chart
- Line chart using **Recharts**:
  - X-axis: dates (2020 Jan, 2022 Feb, 2023 Mar, 2024 Apr, 2025)
  - Y-axis: score (0 to 20, increments of 5)
  - Line color: orange (#f97316) for Suicidal, blue for PHQ-9, green for GAD-7
  - Smooth curved line with dots at data points
  - Tooltip on hover showing exact score
- Read historical data from `risk_scores` table for this student_id

**RIGHT — Journal:**
- Title: "JOURNAL" (bold)
- Weekly emoji strip (Mon–Sun) showing mood_logs for this student (same as student app display)
- Scrollable list of journal entries below:
  - Each entry: text (truncated to 2 lines) + timestamp (right-aligned, grey)
  - Entries sorted by timestamp descending
  - Scrollable container (max height ~200px with overflow-y: scroll)
  - Thin scrollbar visible on right
- Read from `journal_entries` table for this student_id

### Back Navigation:
- "← Back to Dashboard" link at top left (below header) to return to `/`

---

## Color Palette:
- Header purple: #c4b5fd or #a78bfa
- Button purple: #e9d5ff (light), #7c3aed (dark)
- Status red (Suicidal): #ef4444
- Status blue (Anxiety): #3b82f6
- Status black (Depression): #1f2937
- Status green (Normal): #22c55e
- Background: #f5f3ff (very light purple-white) or #fafafa
- Card background: white (#ffffff)
- Text: #111827 (dark grey)

---

## File Structure:
counsellor-dashboard/
├── backend/
│ ├── main.py
│ ├── models.py # SQLAlchemy models (same as student app)
│ ├── database.py # Points to shared mindfulness.db
│ ├── routes/
│ │ ├── dashboard.py # GET /stats, GET /students, GET /sessions
│ │ └── student.py # GET /student/:id (profile, scores, journal, mood)
│ └── seed.py # Seeds students + scores if DB is empty
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx # Main counsellor dashboard
│ │ │ └── StudentProfile.jsx # Individual student view
│ │ ├── components/
│ │ │ ├── Header.jsx # Purple header (reusable)
│ │ │ ├── StatsCard.jsx # Overall statistics
│ │ │ ├── SessionsCard.jsx # Upcoming sessions
│ │ │ ├── RiskScoreboard.jsx # Live risk scoreboard table
│ │ │ ├── ScoreChart.jsx # Recharts line chart with tab switcher
│ │ │ ├── JournalPanel.jsx # Emoji strip + journal entries list
│ │ │ └── MoodStrip.jsx # 7-day emoji display (read-only)
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── package.json
│ └── tailwind.config.js
├── mindfulness.db # Symlink or copy of shared database
├── requirements.txt
└── README.md


---

## API Endpoints:

### Dashboard:
- `GET /stats` → returns counts grouped by status (Normal, Anxiety, Depression, Suicidal, Total)
- `GET /students` → returns all students with their latest risk_score, sorted by risk level
- `GET /sessions` → returns hardcoded upcoming counselling sessions

### Student Profile:
- `GET /student/:id` → returns student profile info
- `GET /student/:id/scores` → returns all historical risk_scores for chart
- `GET /student/:id/journal` → returns all journal_entries sorted by timestamp desc
- `GET /student/:id/mood` → returns mood_logs for past 7 days

---

## Build Order — Build in phases, wait for confirmation before continuing:

### Phase 1: Backend setup + seed data
- FastAPI project structure
- SQLAlchemy models (same schema as student app)
- seed.py to populate students, risk_scores, journal_entries, mood_logs
- All API endpoints
- Test all endpoints with curl

### Phase 2: Counsellor Dashboard page (`/`)
- Header component (purple)
- Overall Statistics card
- Upcoming Counselling Sessions card
- Live Risk Scoreboard table with status badges and Student Profile buttons

### Phase 3: Student Profile page (`/student/:id`)
- Profile + Summary card
- Score Over Time chart (Recharts) with tab switcher (Suicidal / PHQ-9 / GAD-7)
- Journal panel (emoji strip + scrollable journal entries)
- Back navigation

### Phase 4: Polish
- Responsive layout
- Hover states on buttons and rows
- README with setup instructions

---

## Important Notes:
- This is READ-ONLY — do not build any write/edit functionality
- The student app is built separately — this dashboard only reads from the shared database
- For prototype: all data is seeded/hardcoded, no real analytics pipeline yet
- The Score Over Time chart uses Recharts — install with: `npm install recharts`
- MoodStrip component is DISPLAY ONLY (no click interaction — that's only in the student app)

---

START WITH PHASE 1 — Backend setup + seed data.
Stop after Phase 1 and wait for my confirmation before continuing.
