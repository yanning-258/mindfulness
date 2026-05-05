from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from routes import dashboard, student
from seed import seed

Base.metadata.create_all(bind=engine)
seed()

app = FastAPI(title="MINDfulness Counsellor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(student.router)


@app.get("/")
def root():
    return {"message": "MINDfulness Counsellor API is running"}
