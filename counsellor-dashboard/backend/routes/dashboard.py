from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from pydantic import BaseModel
from database import get_db
from models import Student, RiskScore

router = APIRouter(tags=["dashboard"])

RISK_ORDER = {"Suicidal": 0, "Depression": 1, "Anxiety": 2, "Normal": 3}
AVATAR_COLORS = ["#7c3aed", "#2563eb", "#059669", "#dc2626", "#d97706", "#0891b2", "#be185d"]


def get_initials(name: str) -> str:
    parts = name.split()
    return (parts[0][0] + parts[-1][0]).upper() if len(parts) >= 2 else name[:2].upper()


def latest_scores_subquery(db: Session):
    subq = (
        db.query(
            RiskScore.student_id,
            func.max(RiskScore.computed_at).label("max_at"),
        )
        .group_by(RiskScore.student_id)
        .subquery()
    )
    return (
        db.query(RiskScore)
        .join(
            subq,
            (RiskScore.student_id == subq.c.student_id) &
            (RiskScore.computed_at == subq.c.max_at),
        )
        .all()
    )


class StatsResponse(BaseModel):
    normal: int
    anxiety: int
    depression: int
    suicidal: int
    total: int


class StudentRow(BaseModel):
    id: int
    name: str
    phq9_score: int
    gad7_score: int
    suicidal_score: int
    overall_status: str
    initials: str
    color: str


class CounsellingSession(BaseModel):
    date: str
    time: str
    venue: str
    student_id: int


@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    counts = {"Normal": 0, "Anxiety": 0, "Depression": 0, "Suicidal": 0}
    for score in latest_scores_subquery(db):
        if score.overall_status in counts:
            counts[score.overall_status] += 1
    return StatsResponse(
        normal=counts["Normal"],
        anxiety=counts["Anxiety"],
        depression=counts["Depression"],
        suicidal=counts["Suicidal"],
        total=sum(counts.values()),
    )


@router.get("/students", response_model=List[StudentRow])
def get_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    score_map = {s.student_id: s for s in latest_scores_subquery(db)}

    rows = []
    for i, student in enumerate(students):
        score = score_map.get(student.id)
        if not score:
            continue
        rows.append(StudentRow(
            id=student.id,
            name=student.name,
            phq9_score=score.phq9_score,
            gad7_score=score.gad7_score,
            suicidal_score=score.suicidal_score,
            overall_status=score.overall_status,
            initials=get_initials(student.name),
            color=AVATAR_COLORS[i % len(AVATAR_COLORS)],
        ))

    rows.sort(key=lambda r: RISK_ORDER.get(r.overall_status, 99))
    return rows


@router.get("/sessions", response_model=List[CounsellingSession])
def get_sessions():
    return [
        CounsellingSession(date="April 20 2026", time="14:00", venue="LCBS 300", student_id=1),
        CounsellingSession(date="April 22 2026", time="16:30", venue="LCBS 300", student_id=1),
    ]
