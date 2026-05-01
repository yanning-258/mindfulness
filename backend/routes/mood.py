from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import date, timedelta
from database import get_db
from models import MoodLog

router = APIRouter(prefix="/mood", tags=["mood"])

STUDENT_ID = 1


class MoodCreate(BaseModel):
    emoji: str
    mood_label: str


class MoodResponse(BaseModel):
    id: int
    date: date
    emoji: str
    mood_label: str

    class Config:
        from_attributes = True


@router.post("", response_model=MoodResponse, status_code=201)
def log_mood(body: MoodCreate, db: Session = Depends(get_db)):
    today = date.today()
    existing = (
        db.query(MoodLog)
        .filter(MoodLog.student_id == STUDENT_ID, MoodLog.date == today)
        .first()
    )
    if existing:
        existing.emoji = body.emoji
        existing.mood_label = body.mood_label
        db.commit()
        db.refresh(existing)
        return existing

    entry = MoodLog(
        student_id=STUDENT_ID,
        date=today,
        emoji=body.emoji,
        mood_label=body.mood_label,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("", response_model=list[MoodResponse])
def get_moods(db: Session = Depends(get_db)):
    week_ago = date.today() - timedelta(days=6)
    return (
        db.query(MoodLog)
        .filter(MoodLog.student_id == STUDENT_ID, MoodLog.date >= week_ago)
        .order_by(MoodLog.date.asc())
        .all()
    )
