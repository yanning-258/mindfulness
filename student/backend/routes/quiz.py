from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import User

router = APIRouter(prefix="/quiz", tags=["quiz"])

MINDTYPES = {
    "ATM": {
        "name": "The Generous Lover", "animal": "Pig", "emoji": "🐷", "color": "#f9a8d4",
        "traits": [
            {"emoji": "💳", "label": "Generous"}, {"emoji": "💞", "label": "Gift-giver"},
            {"emoji": "😅", "label": "Chaotic"}, {"emoji": "🤗", "label": "People-pleaser"},
            {"emoji": "✨", "label": "Magnetic"}, {"emoji": "😭", "label": "Overwhelmed"}
        ],
        "quote": "You give love like a vending machine — endlessly."
    },
    "ZZZ": {
        "name": "The Unbothered One", "animal": "Cow", "emoji": "🐮", "color": "#bbf7d0",
        "traits": [
            {"emoji": "😴", "label": "Unbothered"}, {"emoji": "🌿", "label": "Chill"},
            {"emoji": "🤷", "label": "Go-with-flow"}, {"emoji": "💤", "label": "Sleep-lover"},
            {"emoji": "🧘", "label": "Peaceful"}, {"emoji": "😶", "label": "Hard to read"}
        ],
        "quote": "Stress? Never heard of her."
    },
    "404": {
        "name": "The Chaos Gremlin", "animal": "Raccoon", "emoji": "🦝", "color": "#e9d5ff",
        "traits": [
            {"emoji": "🌙", "label": "Night owl"}, {"emoji": "🗑️", "label": "Dumpster diver"},
            {"emoji": "⚡", "label": "Impulsive"}, {"emoji": "😈", "label": "Chaotic"},
            {"emoji": "🎲", "label": "Unpredictable"}, {"emoji": "🤌", "label": "Somehow survives"}
        ],
        "quote": "Submitted at 11:59pm. Got a distinction."
    },
    "TOFU": {
        "name": "The Soft Overthinker", "animal": "Sheep", "emoji": "🐑", "color": "#fef3c7",
        "traits": [
            {"emoji": "💭", "label": "Overthinks"}, {"emoji": "🥺", "label": "Sensitive"},
            {"emoji": "📖", "label": "Studious"}, {"emoji": "😰", "label": "Anxious"},
            {"emoji": "🤍", "label": "Kind"}, {"emoji": "🌧️", "label": "Feels deeply"}
        ],
        "quote": "You felt that email was passive aggressive. It was."
    },
    "MAIN": {
        "name": "The Delusional Optimist", "animal": "Fox", "emoji": "🦊", "color": "#fed7aa",
        "traits": [
            {"emoji": "✨", "label": "Main character"}, {"emoji": "🌈", "label": "Optimistic"},
            {"emoji": "🎭", "label": "Dramatic"}, {"emoji": "💅", "label": "Confident"},
            {"emoji": "🚀", "label": "Dreamer"}, {"emoji": "😅", "label": "Delusional"}
        ],
        "quote": "It will work out. It always does. (It doesn't.)"
    }
}


class QuizSubmitRequest(BaseModel):
    student_id: int
    mindtype_code: str


@router.post("/submit")
def submit_quiz(body: QuizSubmitRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.student_id == body.student_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.mindtype_code = body.mindtype_code
    user.has_completed_quiz = True
    db.commit()
    return {"success": True}


@router.get("/result")
def get_result(student_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.student_id == student_id).first()
    if not user or not user.mindtype_code:
        raise HTTPException(status_code=404, detail="No result found")
    mindtype = MINDTYPES.get(user.mindtype_code)
    if not mindtype:
        raise HTTPException(status_code=404, detail="Unknown mindtype code")
    return {
        "mindtype_code": user.mindtype_code,
        "mindtype_name": mindtype["name"],
        "animal": mindtype["animal"],
        "emoji": mindtype["emoji"],
        "color": mindtype["color"],
        "traits": mindtype["traits"],
        "quote": mindtype["quote"],
    }
