from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models import JournalEntry

router = APIRouter(prefix="/journal", tags=["journal"])

STUDENT_ID = 1


class JournalCreate(BaseModel):
    text: str


class JournalResponse(BaseModel):
    id: int
    text: str
    timestamp: datetime
    word_count: int

    class Config:
        from_attributes = True


@router.post("", response_model=JournalResponse, status_code=201)
def create_entry(body: JournalCreate, db: Session = Depends(get_db)):
    entry = JournalEntry(
        student_id=STUDENT_ID,
        text=body.text,
        timestamp=datetime.utcnow(),
        word_count=len(body.text.split()),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("", response_model=list[JournalResponse])
def get_entries(db: Session = Depends(get_db)):
    return (
        db.query(JournalEntry)
        .filter(JournalEntry.student_id == STUDENT_ID)
        .order_by(JournalEntry.timestamp.desc())
        .all()
    )
