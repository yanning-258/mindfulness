from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from datetime import date as DateType, timedelta
from database import get_db
from models import Student, JournalEntry, MoodLog, RiskScore

router = APIRouter(prefix="/student", tags=["student"])


class StudentProfile(BaseModel):
    id: int
    name: str
    email: str
    major: str
    year: str
    country: str
    cid: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class ScorePoint(BaseModel):
    phq9_score: int
    gad7_score: int
    suicidal_score: int
    overall_status: str
    computed_at: str


class JournalItem(BaseModel):
    id: int
    text: str
    timestamp: str
    word_count: int


class MoodItem(BaseModel):
    date: DateType
    emoji: str
    mood_label: str
    model_config = ConfigDict(from_attributes=True)


@router.get("/{student_id}", response_model=StudentProfile)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.get("/{student_id}/scores", response_model=List[ScorePoint])
def get_scores(student_id: int, db: Session = Depends(get_db)):
    scores = (
        db.query(RiskScore)
        .filter(RiskScore.student_id == student_id)
        .order_by(RiskScore.computed_at.asc())
        .all()
    )
    return [
        ScorePoint(
            phq9_score=s.phq9_score,
            gad7_score=s.gad7_score,
            suicidal_score=s.suicidal_score,
            overall_status=s.overall_status,
            computed_at=s.computed_at.strftime("%Y %b"),
        )
        for s in scores
    ]


@router.get("/{student_id}/journal", response_model=List[JournalItem])
def get_journal(student_id: int, db: Session = Depends(get_db)):
    entries = (
        db.query(JournalEntry)
        .filter(JournalEntry.student_id == student_id)
        .order_by(JournalEntry.timestamp.desc())
        .all()
    )
    return [
        JournalItem(
            id=e.id,
            text=e.text,
            timestamp=e.timestamp.strftime("%d %b %Y, %H:%M"),
            word_count=e.word_count,
        )
        for e in entries
    ]


@router.get("/{student_id}/mood", response_model=List[MoodItem])
def get_mood(student_id: int, db: Session = Depends(get_db)):
    week_ago = DateType.today() - timedelta(days=6)
    return (
        db.query(MoodLog)
        .filter(MoodLog.student_id == student_id, MoodLog.date >= week_ago)
        .order_by(MoodLog.date.asc())
        .all()
    )
