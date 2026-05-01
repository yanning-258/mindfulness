from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from routes import journal, mood, scores

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MINDfulness API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(journal.router)
app.include_router(mood.router)
app.include_router(scores.router)


@app.get("/")
def root():
    return {"message": "MINDfulness API is running"}
