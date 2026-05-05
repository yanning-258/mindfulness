from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models import RiskScore

router = APIRouter(prefix="/scores", tags=["scores"])

STUDENT_ID = 1


class ScoreResponse(BaseModel):
    id: int
    phq9_score: int
    gad7_score: int
    suicidal_score: int
    overall_status: str
    computed_at: datetime

    class Config:
        from_attributes = True


@router.get("", response_model=ScoreResponse)
def get_latest_score(db: Session = Depends(get_db)):
    score = (
        db.query(RiskScore)
        .filter(RiskScore.student_id == STUDENT_ID)
        .order_by(RiskScore.computed_at.desc())
        .first()
    )
    if not score:
        raise HTTPException(status_code=404, detail="No risk score found")
    return score
