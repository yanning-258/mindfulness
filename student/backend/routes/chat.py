from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import google.generativeai as genai
import os
from database import get_db
from models import ChatLog

router = APIRouter(prefix="/chat", tags=["chat"])

STUDENT_ID = 1

SYSTEM_PROMPT = """You are Mia, a warm, empathetic mental health companion chatbot for university students.
You are supportive, non-judgmental, and encouraging. You listen actively and ask thoughtful follow-up questions.
You do NOT diagnose mental health conditions or replace professional help.
If a student expresses serious distress, mentions self-harm, or uses words like "suicide", "kill myself", "end it all", gently encourage them to speak to a counsellor and say:
"I'm really glad you're talking to me, but I think it would help to speak with a counsellor who can support you better. Please reach out to your university counselling service. You are not alone, and people care about you."
Keep responses warm, concise (2-4 sentences), and conversational."""


def _get_model():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=SYSTEM_PROMPT,
    )


class HistoryItem(BaseModel):
    role: str   # "user" or "model"
    text: str


class ChatRequest(BaseModel):
    message: str
    history: List[HistoryItem] = []


class ChatResponse(BaseModel):
    reply: str


@router.post("", response_model=ChatResponse)
def chat(body: ChatRequest, db: Session = Depends(get_db)):
    model = _get_model()

    gemini_history = [
        {"role": item.role, "parts": [item.text]}
        for item in body.history
    ]

    try:
        chat_session = model.start_chat(history=gemini_history)
        response = chat_session.send_message(body.message)
        reply = response.text
    except Exception as e:
        err = str(e)
        if "429" in err or "quota" in err.lower() or "ResourceExhausted" in err:
            reply = "I'm taking a short rest right now — the API quota has been reached. Please try again later! 🐾"
        else:
            reply = "Sorry, I ran into a technical issue. Please try again in a moment."

    now = datetime.utcnow()
    db.add(ChatLog(student_id=STUDENT_ID, message=body.message, sender="student", timestamp=now))
    db.add(ChatLog(student_id=STUDENT_ID, message=reply, sender="mia", timestamp=now))
    db.commit()

    return {"reply": reply}
