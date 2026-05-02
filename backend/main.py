from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from routes import journal, mood, scores, events, chat
from seed import seed

Base.metadata.create_all(bind=engine)
seed()

app = FastAPI(title="MINDfulness API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(journal.router)
app.include_router(mood.router)
app.include_router(scores.router)
app.include_router(events.router)
app.include_router(chat.router)


@app.get("/")
def root():
    return {"message": "MINDfulness API is running"}
