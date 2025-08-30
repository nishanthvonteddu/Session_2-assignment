from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict, Any
from datetime import datetime, timedelta

from app.database import get_db, HealthPlan, UserProgress
from app.models import Message

router = APIRouter()

@router.get("/analytics/overview")
async def get_analytics_overview(db: Session = Depends(get_db)):
    """
    Get comprehensive analytics overview.
    """
    try:
        # Total health plans generated
        total_plans = db.query(HealthPlan).count()
        
        # Plans generated today
        today = datetime.utcnow().date()
        plans_today = db.query(HealthPlan).filter(
            func.date(HealthPlan.created_at) == today
        ).count()
        
        # Plans generated this week
        week_ago = datetime.utcnow() - timedelta(days=7)
        plans_this_week = db.query(HealthPlan).filter(
            HealthPlan.created_at >= week_ago
        ).count()
        
        # Goal distribution
        goal_stats = db.query(
            HealthPlan.fitness_goal,
            func.count(HealthPlan.id).label('count')
        ).group_by(HealthPlan.fitness_goal).all()
        
        goal_distribution = {goal: count for goal, count in goal_stats}
        
        # Average metrics
        avg_metrics = db.query(
            func.avg(HealthPlan.bmi).label('avg_bmi'),
            func.avg(HealthPlan.daily_calories).label('avg_calories'),
            func.avg(HealthPlan.bmr).label('avg_bmr')
        ).first()
        
        # Gender distribution
        gender_stats = db.query(
            HealthPlan.gender,
            func.count(HealthPlan.id).label('count')
        ).group_by(HealthPlan.gender).all()
        
        gender_distribution = {gender: count for gender, count in gender_stats}
        
        # Age group distribution
        age_groups = db.query(
            func.case(
                (HealthPlan.age < 25, '18-24'),
                (HealthPlan.age < 35, '25-34'),
                (HealthPlan.age < 45, '35-44'),
                (HealthPlan.age < 55, '45-54'),
                (HealthPlan.age < 65, '55-64'),
                else_='65+'
            ).label('age_group'),
            func.count(HealthPlan.id).label('count')
        ).group_by('age_group').all()
        
        age_distribution = {age_group: count for age_group, count in age_groups}
        
        return {
            "total_plans_generated": total_plans,
            "plans_today": plans_today,
            "plans_this_week": plans_this_week,
            "goal_distribution": goal_distribution,
            "gender_distribution": gender_distribution,
            "age_distribution": age_distribution,
            "average_metrics": {
                "bmi": round(avg_metrics.avg_bmi, 2) if avg_metrics.avg_bmi else None,
                "daily_calories": round(avg_metrics.avg_calories, 0) if avg_metrics.avg_calories else None,
                "bmr": round(avg_metrics.avg_bmr, 0) if avg_metrics.avg_bmr else None
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating analytics: {str(e)}"
        )

@router.get("/analytics/goals/{goal_type}")
async def get_goal_analytics(
    goal_type: str,
    db: Session = Depends(get_db)
):
    """
    Get analytics for a specific fitness goal.
    """
    valid_goals = ["weight-loss", "weight-gain", "lean-body"]
    
    if goal_type not in valid_goals:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid goal type. Must be one of: {valid_goals}"
        )
    
    try:
        # Get plans for specific goal
        goal_plans = db.query(HealthPlan).filter(
            HealthPlan.fitness_goal == goal_type
        ).all()
        
        if not goal_plans:
            return {
                "goal_type": goal_type,
                "total_plans": 0,
                "average_metrics": {},
                "insights": []
            }
        
        # Calculate averages
        total_plans = len(goal_plans)
        avg_bmi = sum(plan.bmi for plan in goal_plans if plan.bmi) / total_plans
        avg_calories = sum(plan.daily_calories for plan in goal_plans if plan.daily_calories) / total_plans
        avg_bmr = sum(plan.bmr for plan in goal_plans if plan.bmr) / total_plans
        
        # Generate insights
        insights = []
        
        if goal_type == "weight-loss":
            if avg_calories < 2000:
                insights.append("Most users are targeting aggressive calorie deficits")
            elif avg_calories > 2500:
                insights.append("Users are taking a more moderate approach to weight loss")
            
            if avg_bmi > 30:
                insights.append("Many users are in the obese category, focusing on sustainable weight loss")
        
        elif goal_type == "weight-gain":
            if avg_calories > 3000:
                insights.append("Users are targeting significant calorie surpluses for muscle gain")
            else:
                insights.append("Users are taking a conservative approach to weight gain")
        
        elif goal_type == "lean-body":
            if avg_bmi < 25:
                insights.append("Most users are already in healthy BMI range")
            insights.append("Users are focusing on body composition rather than weight changes")
        
        return {
            "goal_type": goal_type,
            "total_plans": total_plans,
            "average_metrics": {
                "bmi": round(avg_bmi, 2),
                "daily_calories": round(avg_calories, 0),
                "bmr": round(avg_bmr, 0)
            },
            "insights": insights
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating goal analytics: {str(e)}"
        )

@router.get("/analytics/trends")
async def get_trends_analytics(db: Session = Depends(get_db)):
    """
    Get trends over time.
    """
    try:
        # Get plans from last 30 days
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        # Daily plan generation trend
        daily_trends = db.query(
            func.date(HealthPlan.created_at).label('date'),
            func.count(HealthPlan.id).label('count')
        ).filter(
            HealthPlan.created_at >= thirty_days_ago
        ).group_by(
            func.date(HealthPlan.created_at)
        ).order_by(
            func.date(HealthPlan.created_at)
        ).all()
        
        # Goal trends over time
        goal_trends = db.query(
            func.date(HealthPlan.created_at).label('date'),
            HealthPlan.fitness_goal,
            func.count(HealthPlan.id).label('count')
        ).filter(
            HealthPlan.created_at >= thirty_days_ago
        ).group_by(
            func.date(HealthPlan.created_at),
            HealthPlan.fitness_goal
        ).order_by(
            func.date(HealthPlan.created_at)
        ).all()
        
        # Process goal trends
        goal_trend_data = {}
        for date, goal, count in goal_trends:
            if goal not in goal_trend_data:
                goal_trend_data[goal] = {}
            goal_trend_data[goal][str(date)] = count
        
        return {
            "daily_trends": [
                {"date": str(date), "count": count}
                for date, count in daily_trends
            ],
            "goal_trends": goal_trend_data,
            "period": "last_30_days"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating trends: {str(e)}"
        )

@router.get("/analytics/insights")
async def get_insights(db: Session = Depends(get_db)):
    """
    Get AI-generated insights from the data.
    """
    try:
        insights = []
        
        # Total plans
        total_plans = db.query(HealthPlan).count()
        
        if total_plans == 0:
            return {"insights": ["No data available for insights"]}
        
        # Most popular goal
        goal_stats = db.query(
            HealthPlan.fitness_goal,
            func.count(HealthPlan.id).label('count')
        ).group_by(HealthPlan.fitness_goal).order_by(
            desc(func.count(HealthPlan.id))
        ).first()
        
        if goal_stats:
            insights.append(f"Most popular fitness goal: {goal_stats[0]} ({goal_stats[1]} plans)")
        
        # Average BMI insight
        avg_bmi = db.query(func.avg(HealthPlan.bmi)).scalar()
        if avg_bmi:
            if avg_bmi > 30:
                insights.append("Average user BMI indicates obesity, suggesting focus on weight loss")
            elif avg_bmi > 25:
                insights.append("Average user BMI indicates overweight, suggesting focus on body composition")
            else:
                insights.append("Average user BMI is in healthy range, suggesting focus on maintenance")
        
        # Calorie range insight
        avg_calories = db.query(func.avg(HealthPlan.daily_calories)).scalar()
        if avg_calories:
            if avg_calories < 1800:
                insights.append("Users are generally targeting aggressive calorie deficits")
            elif avg_calories > 2800:
                insights.append("Users are generally targeting calorie surpluses for muscle gain")
            else:
                insights.append("Users are generally targeting moderate calorie adjustments")
        
        # Recent activity
        plans_today = db.query(HealthPlan).filter(
            func.date(HealthPlan.created_at) == datetime.utcnow().date()
        ).count()
        
        if plans_today > 10:
            insights.append("High activity today - users are actively seeking fitness guidance")
        elif plans_today > 0:
            insights.append("Steady activity today - consistent user engagement")
        else:
            insights.append("No activity today - consider promotional campaigns")
        
        return {"insights": insights}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating insights: {str(e)}"
        )
