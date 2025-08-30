from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json

from app.database import get_db, HealthPlan
from app.models import UserDataRequest, HealthPlanResponse, Message
from app.utils.health_calculator import HealthCalculator
from app.utils.data import FITNESS_DATA

router = APIRouter()

@router.post("/health-plans/generate", response_model=HealthPlanResponse, status_code=status.HTTP_201_CREATED)
async def generate_health_plan(
    user_data: UserDataRequest,
    db: Session = Depends(get_db)
):
    """
    Generate a personalized health plan based on user input.
    
    This endpoint calculates BMI, BMR, TDEE, and provides comprehensive
    recommendations for nutrition, exercise, and lifestyle.
    """
    try:
        # Initialize health calculator
        calculator = HealthCalculator()
        
        # Generate health plan
        health_plan = calculator.generate_health_plan(user_data.dict())
        
        # Save to database (optional - for analytics)
        db_health_plan = HealthPlan(
            user_id=None,  # Will be linked when user authentication is implemented
            age=user_data.age,
            gender=user_data.gender,
            height=user_data.height,
            weight=user_data.weight,
            activity_level=user_data.activity_level,
            fitness_goal=user_data.fitness_goal,
            bmi=health_plan["metrics"]["bmi"]["value"],
            bmr=health_plan["metrics"]["bmr"],
            tdee=health_plan["metrics"]["tdee"],
            daily_calories=health_plan["dailyCalories"],
            protein_grams=health_plan["macros"]["protein"]["grams"],
            carbs_grams=health_plan["macros"]["carbs"]["grams"],
            fat_grams=health_plan["macros"]["fat"]["grams"],
            water_intake=health_plan["waterIntake"],
            sleep_recommendation=health_plan["sleepRecommendation"]
        )
        
        db.add(db_health_plan)
        db.commit()
        db.refresh(db_health_plan)
        
        return HealthPlanResponse(
            user_data=user_data,
            metrics=health_plan["metrics"],
            daily_calories=health_plan["dailyCalories"],
            macros=health_plan["macros"],
            water_intake=health_plan["waterIntake"],
            sleep_recommendation=health_plan["sleepRecommendation"],
            activity_recommendations=health_plan["activityRecommendations"],
            timeline_estimates=health_plan["timelineEstimates"],
            nutrients=health_plan["nutrients"],
            health_tips=health_plan["healthTips"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating health plan: {str(e)}"
        )

@router.get("/health-plans", response_model=List[HealthPlanResponse])
async def get_health_plans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve health plans from the database.
    This endpoint will be enhanced with user authentication.
    """
    health_plans = db.query(HealthPlan).offset(skip).limit(limit).all()
    
    # Convert database records to response models
    # This is a simplified version - in production, you'd want proper user linking
    return []

@router.get("/health-plans/{plan_id}", response_model=HealthPlanResponse)
async def get_health_plan(
    plan_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific health plan by ID.
    """
    health_plan = db.query(HealthPlan).filter(HealthPlan.id == plan_id).first()
    
    if not health_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health plan not found"
        )
    
    # Convert database record to response model
    # This would require reconstructing the full plan from stored data
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Retrieving stored health plans not yet implemented"
    )

@router.delete("/health-plans/{plan_id}", response_model=Message)
async def delete_health_plan(
    plan_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a health plan by ID.
    """
    health_plan = db.query(HealthPlan).filter(HealthPlan.id == plan_id).first()
    
    if not health_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health plan not found"
        )
    
    db.delete(health_plan)
    db.commit()
    
    return Message(message="Health plan deleted successfully")

@router.get("/health-plans/analytics/summary")
async def get_health_plans_analytics(db: Session = Depends(get_db)):
    """
    Get analytics summary of generated health plans.
    """
    total_plans = db.query(HealthPlan).count()
    
    # Get goal distribution
    goals = db.query(HealthPlan.fitness_goal).all()
    goal_distribution = {}
    for goal in goals:
        goal_distribution[goal[0]] = goal_distribution.get(goal[0], 0) + 1
    
    # Get average metrics
    avg_bmi = db.query(HealthPlan.bmi).filter(HealthPlan.bmi.isnot(None)).scalar()
    avg_calories = db.query(HealthPlan.daily_calories).filter(HealthPlan.daily_calories.isnot(None)).scalar()
    
    return {
        "total_plans_generated": total_plans,
        "goal_distribution": goal_distribution,
        "average_bmi": round(avg_bmi, 2) if avg_bmi else None,
        "average_daily_calories": round(avg_calories, 0) if avg_calories else None
    }
