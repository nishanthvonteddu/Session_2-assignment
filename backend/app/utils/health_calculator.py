"""
Health Calculator for FastAPI Backend
Contains all fitness and health calculation logic
"""

from app.utils.data import FITNESS_DATA

class HealthCalculator:
    def __init__(self):
        self.data = FITNESS_DATA

    def calculate_bmi(self, weight: float, height: float) -> dict:
        """Calculate Body Mass Index (BMI)"""
        height_in_meters = height / 100
        bmi = weight / (height_in_meters * height_in_meters)
        
        # Find BMI category
        category = 'Unknown'
        color = '#718096'
        
        for key, value in self.data['BMI_CATEGORIES'].items():
            if bmi >= value['min'] and bmi <= value['max']:
                category = value['category']
                color = value['color']
                break
        
        return {
            'value': round(bmi * 10) / 10,
            'category': category,
            'color': color
        }

    def calculate_bmr(self, weight: float, height: float, age: int, gender: str) -> float:
        """Calculate Basal Metabolic Rate (BMR) using Harris-Benedict Equation"""
        if gender == 'male':
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
        elif gender == 'female':
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
        else:
            # For 'other' gender, use average of male and female calculations
            male_bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
            female_bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
            bmr = (male_bmr + female_bmr) / 2
        
        return round(bmr)

    def calculate_tdee(self, bmr: float, activity_level: str) -> float:
        """Calculate Total Daily Energy Expenditure (TDEE)"""
        multiplier = self.data['ACTIVITY_MULTIPLIERS'].get(activity_level, 1.2)
        return round(bmr * multiplier)

    def calculate_daily_calories(self, tdee: float, goal: str) -> float:
        """Calculate daily calorie target based on fitness goal"""
        adjustment = self.data['GOAL_CALORIE_ADJUSTMENTS'].get(goal, {}).get('adjustment', 0)
        return round(tdee + adjustment)

    def calculate_macros(self, daily_calories: float, goal: str) -> dict:
        """Calculate macronutrient breakdown"""
        goal_data = self.data['GOAL_CALORIE_ADJUSTMENTS'].get(goal, {})
        
        if not goal_data:
            # Default ratios
            protein_ratio = 0.3
            carbs_ratio = 0.45
            fat_ratio = 0.25
        else:
            protein_ratio = goal_data.get('proteinRatio', 0.3)
            carbs_ratio = goal_data.get('carbsRatio', 0.45)
            fat_ratio = goal_data.get('fatRatio', 0.25)
        
        return {
            'protein': {
                'grams': round((daily_calories * protein_ratio) / 4),
                'percentage': round(protein_ratio * 100)
            },
            'carbs': {
                'grams': round((daily_calories * carbs_ratio) / 4),
                'percentage': round(carbs_ratio * 100)
            },
            'fat': {
                'grams': round((daily_calories * fat_ratio) / 9),
                'percentage': round(fat_ratio * 100)
            }
        }

    def get_water_intake(self, weight: float, activity_level: str) -> str:
        """Get water intake recommendation"""
        base_intake = self.data['WATER_INTAKE']['base']
        
        # Adjust for activity level
        if activity_level in ['moderately-active', 'very-active']:
            base_intake = '3.5-4.5 liters per day'
        elif activity_level == 'extremely-active':
            base_intake = '4-5 liters per day'
        
        return base_intake

    def get_sleep_recommendation(self) -> str:
        """Get sleep recommendation"""
        return self.data['SLEEP_RECOMMENDATIONS']['duration']

    def get_activity_recommendations(self, goal: str) -> dict:
        """Get activity recommendations based on goal"""
        return self.data['ACTIVITY_RECOMMENDATIONS'].get(goal, self.data['ACTIVITY_RECOMMENDATIONS']['lean-body'])

    def get_timeline_estimates(self, goal: str) -> dict:
        """Get timeline estimates for the goal"""
        return self.data['TIMELINE_ESTIMATES'].get(goal, self.data['TIMELINE_ESTIMATES']['lean-body'])

    def get_important_nutrients(self) -> dict:
        """Get important nutrients information"""
        return self.data['IMPORTANT_NUTRIENTS']

    def get_general_health_tips(self) -> list:
        """Get general health tips"""
        return self.data['GENERAL_HEALTH_TIPS']

    def validate_input(self, user_data: dict) -> dict:
        """Validate user input"""
        errors = []
        
        if not user_data.get('age') or user_data['age'] < 13 or user_data['age'] > 120:
            errors.append('Age must be between 13 and 120 years')
        
        if not user_data.get('height') or user_data['height'] < 100 or user_data['height'] > 250:
            errors.append('Height must be between 100 and 250 cm')
        
        if not user_data.get('weight') or user_data['weight'] < 30 or user_data['weight'] > 300:
            errors.append('Weight must be between 30 and 300 kg')
        
        if not user_data.get('gender'):
            errors.append('Please select a gender')
        
        if not user_data.get('activity_level'):
            errors.append('Please select an activity level')
        
        if not user_data.get('fitness_goal'):
            errors.append('Please select a fitness goal')
        
        return {
            'is_valid': len(errors) == 0,
            'errors': errors
        }

    def generate_health_plan(self, user_data: dict) -> dict:
        """Generate complete health plan"""
        # Validate input
        validation = self.validate_input(user_data)
        if not validation['is_valid']:
            raise ValueError(f"Invalid input: {', '.join(validation['errors'])}")
        
        # Calculate basic metrics
        bmi = self.calculate_bmi(user_data['weight'], user_data['height'])
        bmr = self.calculate_bmr(user_data['weight'], user_data['height'], user_data['age'], user_data['gender'])
        tdee = self.calculate_tdee(bmr, user_data['activity_level'])
        daily_calories = self.calculate_daily_calories(tdee, user_data['fitness_goal'])
        macros = self.calculate_macros(daily_calories, user_data['fitness_goal'])
        
        # Get recommendations
        water_intake = self.get_water_intake(user_data['weight'], user_data['activity_level'])
        sleep_recommendation = self.get_sleep_recommendation()
        activity_recommendations = self.get_activity_recommendations(user_data['fitness_goal'])
        timeline_estimates = self.get_timeline_estimates(user_data['fitness_goal'])
        nutrients = self.get_important_nutrients()
        health_tips = self.get_general_health_tips()
        
        return {
            'user_data': user_data,
            'metrics': {
                'bmi': bmi,
                'bmr': bmr,
                'tdee': tdee
            },
            'dailyCalories': daily_calories,
            'macros': macros,
            'waterIntake': water_intake,
            'sleepRecommendation': sleep_recommendation,
            'activityRecommendations': activity_recommendations,
            'timelineEstimates': timeline_estimates,
            'nutrients': nutrients,
            'healthTips': health_tips
        }
