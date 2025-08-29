// Fitness Health Planner - Calculations Module

class HealthCalculator {
    constructor() {
        this.data = window.FITNESS_DATA;
    }

    /**
     * Calculate Body Mass Index (BMI)
     * @param {number} weight - Weight in kg
     * @param {number} height - Height in cm
     * @returns {object} BMI value and category
     */
    calculateBMI(weight, height) {
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        // Find BMI category
        let category = 'Unknown';
        let color = '#718096';
        
        for (const [key, value] of Object.entries(this.data.BMI_CATEGORIES)) {
            if (bmi >= value.min && bmi <= value.max) {
                category = value.category;
                color = value.color;
                break;
            }
        }
        
        return {
            value: Math.round(bmi * 10) / 10,
            category: category,
            color: color
        };
    }

    /**
     * Calculate Basal Metabolic Rate (BMR) using Harris-Benedict Equation
     * @param {number} weight - Weight in kg
     * @param {number} height - Height in cm
     * @param {number} age - Age in years
     * @param {string} gender - Gender ('male', 'female', 'other')
     * @returns {number} BMR in calories
     */
    calculateBMR(weight, height, age, gender) {
        let bmr;
        
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else if (gender === 'female') {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        } else {
            // For 'other' gender, use average of male and female calculations
            const maleBMR = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            const femaleBMR = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            bmr = (maleBMR + femaleBMR) / 2;
        }
        
        return Math.round(bmr);
    }

    /**
     * Calculate Total Daily Energy Expenditure (TDEE)
     * @param {number} bmr - Basal Metabolic Rate
     * @param {string} activityLevel - Activity level
     * @returns {number} TDEE in calories
     */
    calculateTDEE(bmr, activityLevel) {
        const multiplier = this.data.ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
        return Math.round(bmr * multiplier);
    }

    /**
     * Calculate daily calorie target based on fitness goal
     * @param {number} tdee - Total Daily Energy Expenditure
     * @param {string} goal - Fitness goal
     * @returns {number} Daily calorie target
     */
    calculateDailyCalories(tdee, goal) {
        const adjustment = this.data.GOAL_CALORIE_ADJUSTMENTS[goal]?.adjustment || 0;
        return Math.round(tdee + adjustment);
    }

    /**
     * Calculate macronutrient breakdown
     * @param {number} dailyCalories - Daily calorie target
     * @param {string} goal - Fitness goal
     * @returns {object} Macronutrient breakdown in grams and percentages
     */
    calculateMacros(dailyCalories, goal) {
        const goalData = this.data.GOAL_CALORIE_ADJUSTMENTS[goal];
        
        if (!goalData) {
            // Default ratios if goal not found
            const proteinRatio = 0.3;
            const carbsRatio = 0.45;
            const fatRatio = 0.25;
            
            return {
                protein: {
                    grams: Math.round((dailyCalories * proteinRatio) / 4),
                    percentage: Math.round(proteinRatio * 100)
                },
                carbs: {
                    grams: Math.round((dailyCalories * carbsRatio) / 4),
                    percentage: Math.round(carbsRatio * 100)
                },
                fat: {
                    grams: Math.round((dailyCalories * fatRatio) / 9),
                    percentage: Math.round(fatRatio * 100)
                }
            };
        }
        
        const proteinRatio = goalData.proteinRatio;
        const carbsRatio = goalData.carbsRatio;
        const fatRatio = goalData.fatRatio;
        
        return {
            protein: {
                grams: Math.round((dailyCalories * proteinRatio) / 4),
                percentage: Math.round(proteinRatio * 100)
            },
            carbs: {
                grams: Math.round((dailyCalories * carbsRatio) / 4),
                percentage: Math.round(carbsRatio * 100)
            },
            fat: {
                grams: Math.round((dailyCalories * fatRatio) / 9),
                percentage: Math.round(fatRatio * 100)
            }
        };
    }

    /**
     * Get water intake recommendation
     * @param {number} weight - Weight in kg
     * @param {string} activityLevel - Activity level
     * @returns {string} Water intake recommendation
     */
    getWaterIntake(weight, activityLevel) {
        let baseIntake = this.data.WATER_INTAKE.base;
        
        // Adjust for activity level
        if (activityLevel === 'moderately-active' || activityLevel === 'very-active') {
            baseIntake = '3.5-4.5 liters per day';
        } else if (activityLevel === 'extremely-active') {
            baseIntake = '4-5 liters per day';
        }
        
        return baseIntake;
    }

    /**
     * Get sleep recommendation
     * @returns {string} Sleep recommendation
     */
    getSleepRecommendation() {
        return this.data.SLEEP_RECOMMENDATIONS.duration;
    }

    /**
     * Get activity recommendations based on goal
     * @param {string} goal - Fitness goal
     * @returns {object} Activity recommendations
     */
    getActivityRecommendations(goal) {
        return this.data.ACTIVITY_RECOMMENDATIONS[goal] || this.data.ACTIVITY_RECOMMENDATIONS['lean-body'];
    }

    /**
     * Get timeline estimates for the goal
     * @param {string} goal - Fitness goal
     * @returns {object} Timeline information
     */
    getTimelineEstimates(goal) {
        return this.data.TIMELINE_ESTIMATES[goal] || this.data.TIMELINE_ESTIMATES['lean-body'];
    }

    /**
     * Get important nutrients information
     * @returns {object} Nutrients information
     */
    getImportantNutrients() {
        return this.data.IMPORTANT_NUTRIENTS;
    }

    /**
     * Get general health tips
     * @returns {array} Array of health tips
     */
    getGeneralHealthTips() {
        return this.data.GENERAL_HEALTH_TIPS;
    }

    /**
     * Calculate estimated time to reach goal
     * @param {string} goal - Fitness goal
     * @param {number} currentWeight - Current weight in kg
     * @param {number} targetWeight - Target weight in kg (optional)
     * @returns {string} Estimated timeline
     */
    estimateGoalTimeline(goal, currentWeight, targetWeight = null) {
        if (goal === 'lean-body') {
            return '8-16 weeks for visible results';
        }
        
        if (!targetWeight) {
            return this.data.TIMELINE_ESTIMATES[goal]?.typicalDuration || 'Varies by individual';
        }
        
        const weightDifference = Math.abs(targetWeight - currentWeight);
        
        if (goal === 'weight-loss') {
            const weeks = Math.ceil(weightDifference / 0.75); // 0.75 kg per week average
            return `${weeks} weeks for ${weightDifference} kg weight loss`;
        } else if (goal === 'weight-gain') {
            const weeks = Math.ceil(weightDifference / 0.375); // 0.375 kg per week average
            return `${weeks} weeks for ${weightDifference} kg weight gain`;
        }
        
        return 'Varies by individual';
    }

    /**
     * Validate user input
     * @param {object} userData - User input data
     * @returns {object} Validation result
     */
    validateInput(userData) {
        const errors = [];
        
        if (!userData.age || userData.age < 13 || userData.age > 120) {
            errors.push('Age must be between 13 and 120 years');
        }
        
        if (!userData.height || userData.height < 100 || userData.height > 250) {
            errors.push('Height must be between 100 and 250 cm');
        }
        
        if (!userData.weight || userData.weight < 30 || userData.weight > 300) {
            errors.push('Weight must be between 30 and 300 kg');
        }
        
        if (!userData.gender) {
            errors.push('Please select a gender');
        }
        
        if (!userData.activityLevel) {
            errors.push('Please select an activity level');
        }
        
        if (!userData.fitnessGoal) {
            errors.push('Please select a fitness goal');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Generate complete health plan
     * @param {object} userData - User input data
     * @returns {object} Complete health plan
     */
    generateHealthPlan(userData) {
        // Validate input
        const validation = this.validateInput(userData);
        if (!validation.isValid) {
            throw new Error(`Invalid input: ${validation.errors.join(', ')}`);
        }
        
        // Calculate basic metrics
        const bmi = this.calculateBMI(userData.weight, userData.height);
        const bmr = this.calculateBMR(userData.weight, userData.height, userData.age, userData.gender);
        const tdee = this.calculateTDEE(bmr, userData.activityLevel);
        const dailyCalories = this.calculateDailyCalories(tdee, userData.fitnessGoal);
        const macros = this.calculateMacros(dailyCalories, userData.fitnessGoal);
        
        // Get recommendations
        const waterIntake = this.getWaterIntake(userData.weight, userData.activityLevel);
        const sleepRecommendation = this.getSleepRecommendation();
        const activityRecommendations = this.getActivityRecommendations(userData.fitnessGoal);
        const timelineEstimates = this.getTimelineEstimates(userData.fitnessGoal);
        const nutrients = this.getImportantNutrients();
        const healthTips = this.getGeneralHealthTips();
        
        return {
            userData: userData,
            metrics: {
                bmi: bmi,
                bmr: bmr,
                tdee: tdee
            },
            dailyCalories: dailyCalories,
            macros: macros,
            waterIntake: waterIntake,
            sleepRecommendation: sleepRecommendation,
            activityRecommendations: activityRecommendations,
            timelineEstimates: timelineEstimates,
            nutrients: nutrients,
            healthTips: healthTips
        };
    }
}

// Export the calculator class
window.HealthCalculator = HealthCalculator;
