from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from datetime import datetime
import os

# Database URL - using SQLite for development, can be changed to PostgreSQL for production
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fitness_planner.db")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class HealthPlan(Base):
    __tablename__ = "health_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    age = Column(Integer)
    gender = Column(String)
    height = Column(Float)
    weight = Column(Float)
    activity_level = Column(String)
    fitness_goal = Column(String)
    bmi = Column(Float)
    bmr = Column(Float)
    tdee = Column(Float)
    daily_calories = Column(Integer)
    protein_grams = Column(Integer)
    carbs_grams = Column(Integer)
    fat_grams = Column(Integer)
    water_intake = Column(String)
    sleep_recommendation = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    current_weight = Column(Float)
    current_height = Column(Float)
    notes = Column(Text)
    recorded_at = Column(DateTime, default=datetime.utcnow)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
