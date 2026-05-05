from sqlalchemy import Column, Integer, String, Text, Date, DateTime
from database import Base


class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    university = Column(String)
    major = Column(String)
    year = Column(String)
    country = Column(String)
    cid = Column(String, nullable=True)


class JournalEntry(Base):
    __tablename__ = "journal_entries"
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer)
    text = Column(Text)
    timestamp = Column(DateTime)
    word_count = Column(Integer)


class MoodLog(Base):
    __tablename__ = "mood_logs"
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer)
    date = Column(Date)
    emoji = Column(String)
    mood_label = Column(String)


class RiskScore(Base):
    __tablename__ = "risk_scores"
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer)
    phq9_score = Column(Integer)
    gad7_score = Column(Integer)
    suicidal_score = Column(Integer)
    overall_status = Column(String)
    computed_at = Column(DateTime)
