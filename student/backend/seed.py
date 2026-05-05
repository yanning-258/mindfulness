import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime, date
from database import engine, SessionLocal
from models import Base, Student, RiskScore, Event


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        if db.query(Student).filter(Student.id == 1).first():
            print("Database already seeded — skipping.")
            return

        angela = Student(
            id=1,
            name="Angela Beckett",
            email="angela.beckett@imperial.ac.uk",
            university="Imperial College London",
            major="Business Analytics",
            year="Postgraduate (Masters)",
            country="Spain",
        )
        db.add(angela)
        db.flush()

        risk = RiskScore(
            student_id=1,
            phq9_score=15,
            gad7_score=5,
            suicidal_score=60,
            overall_status="Needs Attention",
            computed_at=datetime.utcnow(),
        )
        db.add(risk)

        events = [
            Event(
                title="Mental Wellness Session",
                date=date(2026, 4, 26),
                time="14:00",
                venue="LCBS 300",
                description="A group session focused on building mental wellness habits and stress resilience.",
            ),
            Event(
                title="Mindfulness Workshop",
                date=date(2026, 5, 3),
                time="10:00",
                venue="Online",
                description="Guided mindfulness and breathing exercises to help manage academic pressure.",
            ),
            Event(
                title="Counselling Drop-in",
                date=date(2026, 5, 10),
                time="15:00",
                venue="Student Hub",
                description="Drop in for a confidential chat with a qualified university counsellor.",
            ),
            Event(
                title="Peer Support Circle",
                date=date(2026, 5, 17),
                time="13:00",
                venue="Library Room 2B",
                description="A safe space to connect with fellow students and share experiences.",
            ),
            Event(
                title="Sleep & Study Balance Talk",
                date=date(2026, 5, 24),
                time="16:00",
                venue="Business School Atrium",
                description="Expert talk on maintaining healthy sleep routines during exam season.",
            ),
        ]
        db.add_all(events)

        db.commit()
        print("Seed complete. mindfulness.db created with Angela Beckett, risk scores, and 5 events.")

    except Exception as e:
        db.rollback()
        print(f"Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
