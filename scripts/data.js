// Fitness Health Planner - Data and Constants

// Activity Level Multipliers (Harris-Benedict Equation)
const ACTIVITY_MULTIPLIERS = {
    'sedentary': 1.2,           // Little or no exercise
    'lightly-active': 1.375,     // Light exercise 1-3 days/week
    'moderately-active': 1.55,   // Moderate exercise 3-5 days/week
    'very-active': 1.725,        // Hard exercise 6-7 days/week
    'extremely-active': 1.9      // Very hard exercise, physical job
};

// BMI Categories
const BMI_CATEGORIES = {
    'underweight': { min: 0, max: 18.4, category: 'Underweight', color: '#ff6b6b' },
    'normal': { min: 18.5, max: 24.9, category: 'Normal Weight', color: '#48bb78' },
    'overweight': { min: 25, max: 29.9, category: 'Overweight', color: '#f6ad55' },
    'obese': { min: 30, max: 100, category: 'Obese', color: '#e53e3e' }
};

// Calorie Adjustments for Goals
const GOAL_CALORIE_ADJUSTMENTS = {
    'weight-loss': { 
        adjustment: -500, 
        description: 'Calorie deficit for weight loss',
        proteinRatio: 0.3,
        carbsRatio: 0.4,
        fatRatio: 0.3
    },
    'weight-gain': { 
        adjustment: 300, 
        description: 'Calorie surplus for weight gain',
        proteinRatio: 0.25,
        carbsRatio: 0.5,
        fatRatio: 0.25
    },
    'lean-body': { 
        adjustment: 0, 
        description: 'Maintenance calories for lean body',
        proteinRatio: 0.3,
        carbsRatio: 0.45,
        fatRatio: 0.25
    }
};

// Physical Activity Recommendations
const ACTIVITY_RECOMMENDATIONS = {
    'weight-loss': {
        cardio: [
            '30-45 minutes of moderate cardio 5-6 days/week',
            'High-intensity interval training (HIIT) 2-3 days/week',
            'Walking 10,000+ steps daily',
            'Swimming or cycling for low-impact options'
        ],
        strength: [
            'Full-body strength training 3-4 days/week',
            'Focus on compound movements (squats, deadlifts, push-ups)',
            'Circuit training for calorie burn',
            'Bodyweight exercises for convenience'
        ],
        flexibility: [
            'Stretching 10-15 minutes daily',
            'Yoga 2-3 times per week',
            'Foam rolling for muscle recovery'
        ]
    },
    'weight-gain': {
        cardio: [
            '20-30 minutes of light cardio 2-3 days/week',
            'Focus on walking or light cycling',
            'Avoid excessive cardio to preserve calories'
        ],
        strength: [
            'Progressive overload strength training 4-5 days/week',
            'Focus on compound movements with heavy weights',
            'Allow 48-72 hours between muscle group training',
            'Include isolation exercises for muscle definition'
        ],
        flexibility: [
            'Dynamic stretching before workouts',
            'Static stretching after workouts',
            'Focus on mobility for better exercise form'
        ]
    },
    'lean-body': {
        cardio: [
            '30 minutes of moderate cardio 3-4 days/week',
            'Mix of steady-state and interval training',
            'Include fun activities like dancing or sports',
            'Aim for 150 minutes of moderate activity weekly'
        ],
        strength: [
            'Full-body strength training 3 days/week',
            'Moderate weights with higher repetitions (12-15)',
            'Include functional movements',
            'Focus on form and mind-muscle connection'
        ],
        flexibility: [
            'Daily stretching routine',
            'Yoga or Pilates 2-3 times per week',
            'Include balance and stability exercises'
        ]
    }
};

// Timeline Estimates
const TIMELINE_ESTIMATES = {
    'weight-loss': {
        safeRate: '0.5-1 kg per week',
        typicalDuration: '12-24 weeks for significant results',
        milestones: [
            'Week 2-4: Initial water weight loss and increased energy',
            'Week 4-8: Noticeable changes in body composition',
            'Week 8-12: Significant weight loss and improved fitness',
            'Week 12+: Continued progress with established habits'
        ]
    },
    'weight-gain': {
        safeRate: '0.25-0.5 kg per week',
        typicalDuration: '16-32 weeks for significant results',
        milestones: [
            'Week 2-4: Initial strength gains and appetite increase',
            'Week 4-8: Noticeable muscle growth and weight gain',
            'Week 8-16: Significant muscle development',
            'Week 16+: Continued gains with refined nutrition'
        ]
    },
    'lean-body': {
        safeRate: 'Maintain weight while improving body composition',
        typicalDuration: '8-16 weeks for visible results',
        milestones: [
            'Week 2-4: Improved energy and workout performance',
            'Week 4-8: Noticeable muscle tone and definition',
            'Week 8-12: Significant body composition improvements',
            'Week 12+: Maintained results with sustainable habits'
        ]
    }
};

// Water Intake Recommendations
const WATER_INTAKE = {
    base: '2.7-3.7 liters per day',
    factors: [
        'Add 0.5-1 liter for each hour of exercise',
        'Increase intake in hot weather or high altitude',
        'Monitor urine color (should be light yellow)',
        'Drink water throughout the day, not just when thirsty'
    ]
};

// Sleep Recommendations
const SLEEP_RECOMMENDATIONS = {
    duration: '7-9 hours per night',
    quality: [
        'Maintain consistent sleep schedule',
        'Create a relaxing bedtime routine',
        'Keep bedroom cool, dark, and quiet',
        'Avoid screens 1 hour before bed',
        'Exercise regularly but not close to bedtime'
    ]
};

// Important Nutrients and Sources
const IMPORTANT_NUTRIENTS = {
    'Protein': {
        sources: ['Lean meats', 'Fish', 'Eggs', 'Legumes', 'Greek yogurt', 'Quinoa'],
        benefits: 'Muscle building, repair, and maintenance',
        daily: '1.6-2.2g per kg body weight for active individuals'
    },
    'Omega-3 Fatty Acids': {
        sources: ['Fatty fish', 'Flaxseeds', 'Chia seeds', 'Walnuts', 'Avocado'],
        benefits: 'Heart health, brain function, inflammation reduction',
        daily: '1-2 servings of fatty fish per week'
    },
    'Vitamin D': {
        sources: ['Sunlight', 'Fatty fish', 'Egg yolks', 'Fortified dairy', 'Mushrooms'],
        benefits: 'Bone health, immune function, mood regulation',
        daily: '15-20 minutes of sun exposure or 600-800 IU supplement'
    },
    'Iron': {
        sources: ['Red meat', 'Spinach', 'Legumes', 'Pumpkin seeds', 'Dark chocolate'],
        benefits: 'Oxygen transport, energy production, immune function',
        daily: '8-18mg depending on age and gender'
    },
    'Calcium': {
        sources: ['Dairy products', 'Leafy greens', 'Almonds', 'Sardines', 'Tofu'],
        benefits: 'Bone health, muscle function, nerve transmission',
        daily: '1000-1300mg depending on age'
    },
    'Vitamin B12': {
        sources: ['Animal products', 'Fortified cereals', 'Nutritional yeast'],
        benefits: 'Energy production, nerve function, red blood cell formation',
        daily: '2.4mcg for adults'
    },
    'Magnesium': {
        sources: ['Nuts and seeds', 'Dark chocolate', 'Leafy greens', 'Whole grains'],
        benefits: 'Muscle function, energy production, sleep quality',
        daily: '310-420mg depending on age and gender'
    },
    'Zinc': {
        sources: ['Oysters', 'Red meat', 'Pumpkin seeds', 'Legumes', 'Nuts'],
        benefits: 'Immune function, protein synthesis, wound healing',
        daily: '8-11mg depending on age and gender'
    }
};

// General Health Tips
const GENERAL_HEALTH_TIPS = [
    'Start your day with a healthy breakfast to boost metabolism',
    'Eat slowly and mindfully to improve digestion and satisfaction',
    'Include a variety of colorful fruits and vegetables daily',
    'Limit processed foods and added sugars',
    'Stay hydrated throughout the day',
    'Get regular health check-ups and screenings',
    'Manage stress through meditation, exercise, or hobbies',
    'Build a support network of friends and family',
    'Set realistic, achievable health goals',
    'Track your progress but don\'t obsess over daily fluctuations',
    'Listen to your body and rest when needed',
    'Celebrate small victories and progress milestones',
    'Focus on sustainable lifestyle changes, not quick fixes',
    'Get adequate sleep for recovery and overall health',
    'Include both cardio and strength training in your routine'
];

// Export all data for use in other modules
window.FITNESS_DATA = {
    ACTIVITY_MULTIPLIERS,
    BMI_CATEGORIES,
    GOAL_CALORIE_ADJUSTMENTS,
    ACTIVITY_RECOMMENDATIONS,
    TIMELINE_ESTIMATES,
    WATER_INTAKE,
    SLEEP_RECOMMENDATIONS,
    IMPORTANT_NUTRIENTS,
    GENERAL_HEALTH_TIPS
};
