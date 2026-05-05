from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import User

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == body.username).first()
    if not user or user.password != body.password:
        return {"success": False}
    return {
        "success": True,
        "student_id": user.student_id,
        "has_completed_quiz": user.has_completed_quiz,
    }


@router.get("/me")
def me(student_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.student_id == student_id).first()
    return {
        "student_id": user.student_id,
        "username": user.username,
        "has_completed_quiz": user.has_completed_quiz,
        "mindtype_code": user.mindtype_code,
    }
