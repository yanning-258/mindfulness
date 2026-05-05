# MINDfulness — Analytics Engine Integration Guide

This document describes every connection point between the analytics/model repo and the MINDfulness app (student + counsellor). Drop this file into your analytics repo as context for Claude Code.

---

## System Overview

There are three separate repos/apps that share one SQLite database:

```
analytics repo          →  writes risk scores
    ↕
mindfulness.db  (SQLite, single file — the integration point)
    ↕
student app  (reads scores, writes journal/mood)
counsellor app (reads everything, writes nothing)
```

---

## The Shared Database File

**Canonical location:** `mindfulness/student/backend/mindfulness.db`

The counsellor backend resolves the path at runtime:
```python
# counsellor/backend/database.py
DB_PATH = os.path.abspath(os.path.join(BASE_DIR, '..', '..', 'student', 'backend', 'mindfulness.db'))
```

Your analytics engine must point to this same file. Recommended pattern:
```python
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.abspath(os.path.join(BASE_DIR, '..', 'mindfulness', 'student', 'backend', 'mindfulness.db'))
DATABASE_URL = f"sqlite:///{DB_PATH}"
```

Adjust the relative path depending on where your analytics repo sits on disk relative to this repo.

---

## What the Analytics Engine Must READ

### `journal_entries` table

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER PK | |
| `student_id` | INTEGER | FK → students.id |
| `text` | TEXT | Full journal entry — primary NLP input |
| `timestamp` | DATETIME | UTC, format `YYYY-MM-DD HH:MM:SS` |
| `word_count` | INTEGER | Pre-computed by student app |

Fetch all unprocessed entries per student, or all entries since the last `computed_at` timestamp in `risk_scores`.

### `mood_logs` table

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER PK | |
| `student_id` | INTEGER | FK → students.id |
| `date` | DATE | Format `YYYY-MM-DD` |
| `emoji` | TEXT | e.g. `😭`, `😬`, `😕` |
| `mood_label` | TEXT | e.g. `"Sad"`, `"Anxious"`, `"Stressed"` |

Unique constraint on `(student_id, date)` — one mood per student per day.

### `students` table

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER PK | |
| `name` | TEXT | |
| `email` | TEXT | |
| `university` | TEXT | |
| `major` | TEXT | |
| `year` | TEXT | e.g. `"Postgraduate (Masters)"` |
| `country` | TEXT | |

---

## What the Analytics Engine Must WRITE

### `risk_scores` table — the only table the analytics engine writes to

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INTEGER PK | auto-increment | |
| `student_id` | INTEGER | FK → students.id | |
| `phq9_score` | INTEGER | 0–27 | PHQ-9 depression scale |
| `gad7_score` | INTEGER | 0–21 | GAD-7 anxiety scale |
| `suicidal_score` | INTEGER | 0–100 | Custom suicidal risk score |
| `overall_status` | TEXT | see values below | Human-readable status label |
| `computed_at` | DATETIME | UTC | Timestamp of this computation run |

**`overall_status` values recognised by the apps:**

| Value | Student app bar colour | Counsellor badge colour |
|-------|----------------------|------------------------|
| `"Normal"` | Green | Green |
| `"Anxiety"` | Pink (GAD-7 dominant) | Blue |
| `"Depression"` | Blue (PHQ-9 dominant) | Dark/black |
| `"Suicidal"` | Red | Red |
| `"Needs Attention"` | Amber (legacy — avoid for new writes) | — |
| `"Historical"` | (ignored by student app) | Used for chart history |

**Important:** The student app reads the **single latest row** per student (ordered by `computed_at DESC`). Insert a new row per run — do not update existing rows. This preserves the full history used by the counsellor's Score Over Time chart.

**Insert pattern:**
```python
from datetime import datetime
new_score = RiskScore(
    student_id=student_id,
    phq9_score=phq9,
    gad7_score=gad7,
    suicidal_score=suicidal,
    overall_status=status,   # one of the values above
    computed_at=datetime.utcnow(),
)
db.add(new_score)
db.commit()
```

---

## How Each App Reads Risk Scores

### Student app — `student/backend/routes/scores.py`

Fetches the single most recent score for `STUDENT_ID = 1`:
```python
db.query(RiskScore)
  .filter(RiskScore.student_id == STUDENT_ID)
  .order_by(RiskScore.computed_at.desc())
  .first()
```

Exposes via `GET /scores` → `{ phq9_score, gad7_score, suicidal_score, overall_status, computed_at }`.

The student dashboard bar background colour is then determined by whichever score has the highest proportional value (score/max). The `overall_status` string drives the badge label.

### Counsellor app — `counsellor/backend/routes/dashboard.py`

Reads all students with their latest score (subquery on `computed_at`) for the scoreboard. Also reads **all** historical rows for `GET /student/:id/scores` to populate the Score Over Time line chart — so every row the analytics engine inserts becomes a chart data point.

---

## SQLAlchemy Model to Copy

Use this exact model in your analytics repo (matches both apps):

```python
from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"
    id            = Column(Integer, primary_key=True)
    name          = Column(String)
    email         = Column(String)
    university    = Column(String)
    major         = Column(String)
    year          = Column(String)
    country       = Column(String)

class JournalEntry(Base):
    __tablename__ = "journal_entries"
    id            = Column(Integer, primary_key=True)
    student_id    = Column(Integer, ForeignKey("students.id"))
    text          = Column(Text)
    timestamp     = Column(DateTime)
    word_count    = Column(Integer)

class MoodLog(Base):
    __tablename__ = "mood_logs"
    id            = Column(Integer, primary_key=True)
    student_id    = Column(Integer, ForeignKey("students.id"))
    date          = Column(Date)
    emoji         = Column(String)
    mood_label    = Column(String)
    __table_args__ = (UniqueConstraint("student_id", "date"),)

class RiskScore(Base):
    __tablename__ = "risk_scores"
    id             = Column(Integer, primary_key=True)
    student_id     = Column(Integer, ForeignKey("students.id"))
    phq9_score     = Column(Integer)
    gad7_score     = Column(Integer)
    suicidal_score = Column(Integer)
    overall_status = Column(String)
    computed_at    = Column(DateTime)
```

Do **not** call `Base.metadata.create_all()` in the analytics engine — the student app owns schema creation.

---

## Suggested Analytics Engine Run Loop

```python
# Pseudocode — adapt to your model
for student in db.query(Student).all():
    journals = db.query(JournalEntry).filter(JournalEntry.student_id == student.id).all()
    moods    = db.query(MoodLog).filter(MoodLog.student_id == student.id).all()

    phq9, gad7, suicidal, status = your_model.predict(journals, moods)

    db.add(RiskScore(
        student_id=student.id,
        phq9_score=phq9,
        gad7_score=gad7,
        suicidal_score=suicidal,
        overall_status=status,
        computed_at=datetime.utcnow(),
    ))

db.commit()
```

Run this as a cron job, a one-shot script, or triggered via a webhook — the apps will pick up the new scores on next page load automatically.

---

## Avoiding SQLite Write Conflicts

SQLite only supports one writer at a time. The analytics engine and the student app both write to the same file. To avoid `database is locked` errors:

- Run the analytics engine as a **batch job** (not a long-running server) so it holds the write lock only briefly
- Use `connect_args={"timeout": 30}` in your SQLAlchemy engine to wait up to 30 s for the lock
- The counsellor app is read-only so it never conflicts

```python
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False, "timeout": 30})
```

---

## Ports Summary (nothing to configure — just for awareness)

| App | Backend port | Frontend port |
|-----|-------------|---------------|
| Student app | 8000 | 5173 |
| Counsellor app | 8001 | 5174 |
| Analytics engine | no server needed | — |
