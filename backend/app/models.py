from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"

class ActivityLevel(str, Enum):
    sedentary = "sedentary"
    lightly_active = "lightly-active"
    moderately_active = "moderately-active"
    very_active = "very-active"
    extremely_active = "extremely-active"

class FitnessGoal(str, Enum):
    weight_loss = "weight-loss"
    weight_gain = "weight-gain"
    lean_body = "lean-body"

# Request Models
class UserDataRequest(BaseModel):
    age: int = Field(..., ge=13, le=120, description="Age in years (13-120)")
    gender: Gender = Field(..., description="User gender")
    height: float = Field(..., ge=100, le=250, description="Height in cm (100-250)")
    weight: float = Field(..., ge=30, le=300, description="Weight in kg (30-300)")
    activity_level: ActivityLevel = Field(..., description="Activity level")
    fitness_goal: FitnessGoal = Field(..., description="Fitness goal")

    @validator('age')
    def validate_age(cls, v):
        if v < 13 or v > 120:
            raise ValueError('Age must be between 13 and 120 years')
        return v

    @validator('height')
    def validate_height(cls, v):
        if v < 100 or v > 250:
            raise ValueError('Height must be between 100 and 250 cm')
        return v

    @validator('weight')
    def validate_weight(cls, v):
        if v < 30 or v > 300:
            raise ValueError('Weight must be between 30 and 300 kg')
        return v

class UserCreate(BaseModel):
    email: str = Field(..., description="User email address")
    username: str = Field(..., min_length=3, max_length=50, description="Username")
    password: str = Field(..., min_length=8, description="Password")

class UserLogin(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="Password")

class ProgressUpdate(BaseModel):
    current_weight: float = Field(..., ge=30, le=300, description="Current weight in kg")
    current_height: Optional[float] = Field(None, ge=100, le=250, description="Current height in cm")
    notes: Optional[str] = Field(None, max_length=1000, description="Progress notes")

# Response Models
class HealthMetrics(BaseModel):
    bmi: float = Field(..., description="Body Mass Index")
    bmi_category: str = Field(..., description="BMI category")
    bmr: float = Field(..., description="Basal Metabolic Rate")
    tdee: float = Field(..., description="Total Daily Energy Expenditure")

class Macronutrients(BaseModel):
    protein_grams: int = Field(..., description="Protein in grams")
    protein_percentage: int = Field(..., description="Protein percentage")
    carbs_grams: int = Field(..., description="Carbohydrates in grams")
    carbs_percentage: int = Field(..., description="Carbohydrates percentage")
    fat_grams: int = Field(..., description="Fat in grams")
    fat_percentage: int = Field(..., description="Fat percentage")

class ActivityRecommendations(BaseModel):
    cardio: List[str] = Field(..., description="Cardio recommendations")
    strength: List[str] = Field(..., description="Strength training recommendations")
    flexibility: List[str] = Field(..., description="Flexibility and recovery recommendations")

class TimelineEstimates(BaseModel):
    safe_rate: str = Field(..., description="Safe rate of progress")
    typical_duration: str = Field(..., description="Typical duration for results")
    milestones: List[str] = Field(..., description="Progress milestones")

class HealthPlanResponse(BaseModel):
    user_data: UserDataRequest = Field(..., description="User input data")
    metrics: HealthMetrics = Field(..., description="Health metrics")
    daily_calories: int = Field(..., description="Daily calorie target")
    macros: Macronutrients = Field(..., description="Macronutrient breakdown")
    water_intake: str = Field(..., description="Water intake recommendation")
    sleep_recommendation: str = Field(..., description="Sleep recommendation")
    activity_recommendations: ActivityRecommendations = Field(..., description="Activity recommendations")
    timeline_estimates: TimelineEstimates = Field(..., description="Timeline estimates")
    nutrients: dict = Field(..., description="Important nutrients information")
    health_tips: List[str] = Field(..., description="General health tips")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Plan creation timestamp")

class UserResponse(BaseModel):
    id: int = Field(..., description="User ID")
    email: str = Field(..., description="User email")
    username: str = Field(..., description="Username")
    is_active: bool = Field(..., description="User active status")
    created_at: datetime = Field(..., description="Account creation date")

class ProgressResponse(BaseModel):
    id: int = Field(..., description="Progress entry ID")
    user_id: int = Field(..., description="User ID")
    current_weight: float = Field(..., description="Current weight")
    current_height: Optional[float] = Field(None, description="Current height")
    notes: Optional[str] = Field(None, description="Progress notes")
    recorded_at: datetime = Field(..., description="Recording timestamp")

class Token(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")

class Message(BaseModel):
    message: str = Field(..., description="Response message")

class ErrorResponse(BaseModel):
    detail: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Error code")
