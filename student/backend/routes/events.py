from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional
from database import get_db
from models import Event

router = APIRouter(prefix="/events", tags=["events"])


class EventResponse(BaseModel):
    id: int
    title: str
    date: date
    time: str
    venue: str
    description: Optional[str] = None
    registration_url: Optional[str] = None

    class Config:
        from_attributes = True


@router.get("", response_model=list[EventResponse])
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).order_by(Event.date.asc()).all()
