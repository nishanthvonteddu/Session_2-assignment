# Fitness Health Planner

A comprehensive, web-based fitness application that generates personalized health plans based on user input. Built with modern web technologies and designed for optimal user experience.

## Description

Fitness Health Planner is a simple, privacy-first web app that helps users create personalized fitness plans. Based on your age, gender, height, weight, activity level, and fitness goal, it calculates BMI, BMR, and TDEE, and provides practical recommendations for calories, macronutrients, hydration, exercise, and more.

## Features

### Core Functionality

- Personalized Health Plans: Generate custom fitness plans based on your unique profile
- Scientific Calculations: Uses proven formulas for BMI, BMR, and TDEE calculations
- Goal-Oriented: Supports weight loss, weight gain, and lean body maintenance goals
- Comprehensive Recommendations: Includes nutrition, exercise, and lifestyle guidance

### Health Metrics

- BMI Calculation: Body Mass Index with category classification
- BMR Calculation: Basal Metabolic Rate using Harris-Benedict equation
- TDEE Calculation: Total Daily Energy Expenditure based on activity level
- Macronutrient Breakdown: Protein, carbohydrates, and fat recommendations

### Nutrition Planning

- Daily Calorie Targets: Personalized based on your goal and activity level
- Macro Ratios: Optimized protein, carbs, and fat percentages for your fitness goal
- Nutrient Information: Complete guide to essential vitamins and minerals
- Food Sources: Where to find important nutrients in your diet

### Exercise Recommendations

- Cardio Training: Tailored cardio recommendations for your goal
- Strength Training: Progressive strength training guidelines
- Flexibility and Recovery: Stretching, yoga, and recovery exercises
- Activity Frequency: Weekly workout schedules based on your level

### Lifestyle Guidance

- Water Intake: Personalized hydration recommendations
- Sleep Guidelines: Optimal sleep duration and quality tips
- Timeline Estimates: Realistic expectations for reaching your goals
- Health Tips: 15+ actionable health and wellness tips

### User Experience

- Responsive Design: Works perfectly on desktop, tablet, and mobile
- Form Validation: Real-time input validation with helpful error messages
- Export Functionality: Download your health plan as a text file
- Modern UI: Beautiful, intuitive interface with smooth animations

## Quick Start

### Option 1: Open Directly (Simplest)

1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. Start using the application immediately

### Option 2: Local Development Server (Recommended)

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/fitness-health-planner.git
   cd fitness-health-planner
   ```

2. Start a local server using one of the following:

   Using Python 3:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

   Using Python 2:

   ```bash
   python -m SimpleHTTPServer 8000
   ```

   Using Node.js:

   ```bash
   npx http-server -p 8000
   ```

   Using PHP:

   ```bash
   php -S localhost:8000
   ```

3. Access the application:

   - Open your browser
   - Go to `http://localhost:8000`

4. Stop the server when finished:

   ```bash
   Ctrl + C
   ```

## Local Development

### Why Use a Local Server

- Better JavaScript functionality
- Proper CORS handling
- Real development environment
- Better debugging support
- Standard developer workflow

### Example Commands

Navigate to your project directory:

```bash
cd "/Users/work/Desktop/ERA V4/Assignment 2"
```

Start local server:

```bash
python3 -m http.server 8000
```

Access app in browser:

```text
http://localhost:8000
```

Stop the server:

```bash
Ctrl + C
```

## How to Use

### Step 1: Enter Your Information

- Age: 13-120 years
- Gender: Male, Female, or Other
- Height: 100-250 cm
- Weight: 30-300 kg
- Activity Level: Choose from 5 options
- Fitness Goal: Weight loss, weight gain, or lean body

### Step 2: Generate Your Plan

- Click the "Generate Plan" button
- Review your personalized recommendations

### Step 3: Take Action

- Export your plan if needed
- Create new plans anytime
- Track your progress over time

## Project Structure

```
fitness-health-planner/
├── index.html              Main application page
├── README.md               Project documentation
├── styles/
│   └── main.css            Complete styling and responsive design
└── scripts/
    ├── app.js              Main application logic and UI management
    ├── calculations.js     Health calculations and formulas
    └── data.js             Data and recommendations
```

## Technology Stack

- HTML5: Semantic structure
- CSS3: Styling and responsive design
- JavaScript (ES6+): Logic and interactivity
- No frameworks or libraries required
- Works offline after loading

## Responsive Design

This application is fully responsive and optimized for:

- Desktop: Full layout and features
- Tablet: Touch-friendly interface
- Mobile: Compact design for small screens

## Technical Details

### Calculations

- BMI: weight (kg) / height (m)^2
- BMR (Male): 88.362 + (13.397 × weight) + (4.799 × height) - (5.677 × age)
- BMR (Female): 447.593 + (9.247 × weight) + (3.098 × height) - (4.330 × age)
- TDEE: BMR × Activity Multiplier
- Macronutrients: Based on calorie distribution per goal

### Activity Multipliers

- Sedentary: 1.2
- Lightly Active: 1.375
- Moderately Active: 1.55
- Very Active: 1.725
- Extremely Active: 1.9

### Goal-Based Calorie Adjustments

- Weight Loss: -500 calories/day
- Weight Gain: +300 calories/day
- Lean Body: No adjustment (maintenance)

## Data Sources

The app includes data on:

- Macronutrient ratios
- Essential vitamins and minerals
- Food sources for key nutrients
- Goal-specific fitness recommendations

## Privacy and Security

- No user accounts
- No data tracking
- No analytics or ads
- All data stays on your device
- Works offline after first load

## Future Enhancements

Planned features include:

- PDF export of your health plan
- Progress tracking and saving
- Meal planning and recipe suggestions
- Exercise video integration
- Social sharing options

## Contributing

1. Fork the repository
2. Create a new feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you experience issues:

- Use a modern browser
- Ensure JavaScript is enabled
- Check your console for errors
- Verify your folder and file structure

## Target Users

- Fitness beginners
- Health-conscious individuals
- Weight loss or weight gain seekers
- Wellness-focused users
- Personal trainers and coaches

## Why Choose This App

- No registration required
- Free and open-source
- Scientifically accurate
- Data stays on your device
- Lightweight and fast
- Easy to understand and use

Built for better health and fitness.
