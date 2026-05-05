import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime, date, timedelta
from sqlalchemy import text
from database import engine, SessionLocal
from models import Base, Student, JournalEntry, MoodLog, RiskScore


STUDENTS_DATA = [
    {"id": 1, "name": "Angela Beckett",  "email": "angela.beckett@imperial.ac.uk",  "university": "Imperial College London", "major": "Business Analytics",      "year": "Postgraduate (Masters)",     "country": "Spain", "cid": "01234567"},
    {"id": 2, "name": "Ben Robertson",   "email": "ben.robertson@imperial.ac.uk",   "university": "Imperial College London", "major": "Computer Science",         "year": "Undergraduate (Year 3)",     "country": "UK",    "cid": "02345678"},
    {"id": 3, "name": "Tom Holland",     "email": "tom.holland@imperial.ac.uk",     "university": "Imperial College London", "major": "Physics",                  "year": "Undergraduate (Year 2)",     "country": "UK",    "cid": "03456789"},
    {"id": 4, "name": "Zendaya Coleman", "email": "zendaya.coleman@imperial.ac.uk", "university": "Imperial College London", "major": "Medicine",                 "year": "Undergraduate (Year 4)",     "country": "USA",   "cid": "04567890"},
    {"id": 5, "name": "Anthony Stark",   "email": "anthony.stark@imperial.ac.uk",   "university": "Imperial College London", "major": "Mechanical Engineering",   "year": "Postgraduate (PhD)",         "country": "USA",   "cid": "05678901"},
]

OTHER_RISK_SCORES = [
    {"student_id": 2, "phq9": 5,  "gad7": 20, "suicidal": 20, "status": "Anxiety"},
    {"student_id": 3, "phq9": 5,  "gad7": 15, "suicidal": 10, "status": "Anxiety"},
    {"student_id": 4, "phq9": 18, "gad7": 7,  "suicidal": 10, "status": "Depression"},
    {"student_id": 5, "phq9": 25, "gad7": 8,  "suicidal": 10, "status": "Depression"},
]

ANGELA_HISTORY = [
    {"year": 2020, "month": 1, "suicidal": 8,  "phq9": 5,  "gad7": 3},
    {"year": 2022, "month": 2, "suicidal": 9,  "phq9": 7,  "gad7": 5},
    {"year": 2023, "month": 3, "suicidal": 13, "phq9": 10, "gad7": 4},
    {"year": 2024, "month": 4, "suicidal": 15, "phq9": 12, "gad7": 5},
    {"year": 2025, "month": 5, "suicidal": 16, "phq9": 15, "gad7": 5},
]

ANGELA_JOURNALS = [
    {"text": "I failed machine learning today, I want to kill myself! Ahhhh How can I be so stupid!!!", "timestamp": datetime(2025, 3, 13, 13, 20, 0)},
    {"text": "Am I not the right material to be an AI engineer? I am so stressed about machine learning.", "timestamp": datetime(2025, 3, 13, 13, 22, 0)},
    {"text": "Why does nobody understand me? I might as well just hang myself on the noose.", "timestamp": datetime(2025, 3, 13, 13, 25, 0)},
]

# Mon=😬 Tue=😕 Wed=😣 Thu=😖 Fri=😭 Sat=😭 Sun=😶
WEEKDAY_MOODS = {
    0: ("😬", "Anxious"),
    1: ("😕", "Confused"),
    2: ("😣", "Stressed"),
    3: ("😖", "Distressed"),
    4: ("😭", "Sad"),
    5: ("😭", "Sad"),
    6: ("😶", "Numb"),
}


def get_angela_moods():
    today = date.today()
    return [
        {"date": today - timedelta(days=6 - i), **dict(zip(("emoji", "mood_label"), WEEKDAY_MOODS[(today - timedelta(days=6 - i)).weekday()]))}
        for i in range(7)
    ]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Add cid column if not present (safe to re-run)
        try:
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE students ADD COLUMN cid TEXT"))
                conn.commit()
        except Exception:
            pass

        # Seed / update students
        for s in STUDENTS_DATA:
            existing = db.query(Student).filter(Student.id == s["id"]).first()
            if not existing:
                db.add(Student(
                    id=s["id"], name=s["name"], email=s["email"],
                    university=s["university"], major=s["major"],
                    year=s["year"], country=s["country"], cid=s["cid"],
                ))
            elif not existing.cid:
                existing.cid = s["cid"]
        db.commit()

        # Angela's current risk score: promote "Needs Attention" → "Suicidal" or insert fresh
        angela_old = db.query(RiskScore).filter(
            RiskScore.student_id == 1,
            RiskScore.overall_status == "Needs Attention",
        ).first()
        angela_suicidal = db.query(RiskScore).filter(
            RiskScore.student_id == 1,
            RiskScore.overall_status == "Suicidal",
        ).first()
        if angela_old and not angela_suicidal:
            angela_old.overall_status = "Suicidal"
            angela_old.phq9_score = 15
            angela_old.gad7_score = 5
            angela_old.suicidal_score = 60
        elif not angela_suicidal:
            db.add(RiskScore(
                student_id=1, phq9_score=15, gad7_score=5,
                suicidal_score=60, overall_status="Suicidal",
                computed_at=datetime.utcnow(),
            ))
        db.commit()

        # Other students' risk scores
        for rs in OTHER_RISK_SCORES:
            if not db.query(RiskScore).filter(RiskScore.student_id == rs["student_id"]).first():
                db.add(RiskScore(
                    student_id=rs["student_id"],
                    phq9_score=rs["phq9"], gad7_score=rs["gad7"],
                    suicidal_score=rs["suicidal"], overall_status=rs["status"],
                    computed_at=datetime(2026, 3, 1, 12, 0, 0),
                ))
        db.commit()

        # Angela's historical risk scores
        for h in ANGELA_HISTORY:
            ts = datetime(h["year"], h["month"], 1, 12, 0, 0)
            if not db.query(RiskScore).filter(
                RiskScore.student_id == 1,
                RiskScore.computed_at == ts,
            ).first():
                db.add(RiskScore(
                    student_id=1,
                    phq9_score=h["phq9"], gad7_score=h["gad7"],
                    suicidal_score=h["suicidal"], overall_status="Historical",
                    computed_at=ts,
                ))
        db.commit()

        # Angela's journal entries (keyed on distinctive text)
        if not db.query(JournalEntry).filter(
            JournalEntry.student_id == 1,
            JournalEntry.text.like("%I failed machine learning%"),
        ).first():
            for j in ANGELA_JOURNALS:
                db.add(JournalEntry(
                    student_id=1, text=j["text"],
                    timestamp=j["timestamp"],
                    word_count=len(j["text"].split()),
                ))
            db.commit()

        # Angela's mood logs for the past 7 days
        for mood in get_angela_moods():
            if not db.query(MoodLog).filter(
                MoodLog.student_id == 1,
                MoodLog.date == mood["date"],
            ).first():
                db.add(MoodLog(
                    student_id=1, date=mood["date"],
                    emoji=mood["emoji"], mood_label=mood["mood_label"],
                ))
        db.commit()

        print("Counsellor seed complete.")
    except Exception as e:
        db.rollback()
        print(f"Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
