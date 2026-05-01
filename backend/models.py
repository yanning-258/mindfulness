from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    university = Column(String)
    major = Column(String)
    year = Column(String)
    country = Column(String)

    journal_entries = relationship("JournalEntry", back_populates="student")
    mood_logs = relationship("MoodLog", back_populates="student")
    risk_scores = relationship("RiskScore", back_populates="student")
    chat_logs = relationship("ChatLog", back_populates="student")


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    text = Column(Text, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    word_count = Column(Integer, nullable=False)

    student = relationship("Student", back_populates="journal_entries")


class MoodLog(Base):
    __tablename__ = "mood_logs"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    date = Column(Date, nullable=False)
    emoji = Column(String, nullable=False)
    mood_label = Column(String, nullable=False)

    __table_args__ = (UniqueConstraint("student_id", "date", name="uq_student_date"),)

    student = relationship("Student", back_populates="mood_logs")


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    phq9_score = Column(Integer)   # 0-27 depression
    gad7_score = Column(Integer)   # 0-21 anxiety
    suicidal_score = Column(Integer)  # 0-100
    overall_status = Column(String)
    computed_at = Column(DateTime)

    student = relationship("Student", back_populates="risk_scores")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    time = Column(String)
    venue = Column(String)
    description = Column(Text)


class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    message = Column(Text, nullable=False)
    sender = Column(String, nullable=False)  # "student" or "mia"
    timestamp = Column(DateTime, nullable=False)

    student = relationship("Student", back_populates="chat_logs")
