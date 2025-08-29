// Fitness Health Planner - Main Application

class FitnessApp {
    constructor() {
        this.calculator = new HealthCalculator();
        this.currentPlan = null;
        this.initializeApp();
    }

    /**
     * Initialize the application
     */
    initializeApp() {
        this.bindEvents();
        this.setupFormValidation();
        console.log('🏃‍♂️ Fitness Health Planner initialized successfully!');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        const form = document.getElementById('fitness-form');
        const newPlanBtn = document.getElementById('new-plan-btn');

        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        if (newPlanBtn) {
            newPlanBtn.addEventListener('click', () => this.showForm());
        }

        // Export buttons
        const exportTextBtn = document.getElementById('export-text-btn');
        const exportPdfBtn = document.getElementById('export-pdf-btn');

        if (exportTextBtn) {
            exportTextBtn.addEventListener('click', () => this.exportHealthPlan('text'));
        }

        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => this.exportHealthPlan('pdf'));
        }

        // Add input validation on blur
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        const form = document.getElementById('fitness-form');
        if (form) {
            form.addEventListener('input', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
                    this.validateField(e.target);
                }
            });
        }
    }

    /**
     * Validate individual form field
     */
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');
        this.removeFieldError(field);

        // Validate based on field type
        switch (field.id) {
            case 'age':
                if (!value || value < 13 || value > 120) {
                    isValid = false;
                    errorMessage = 'Age must be between 13 and 120 years';
                }
                break;
            case 'height':
                if (!value || value < 100 || value > 250) {
                    isValid = false;
                    errorMessage = 'Height must be between 100 and 250 cm';
                }
                break;
            case 'weight':
                if (!value || value < 30 || value > 300) {
                    isValid = false;
                    errorMessage = 'Weight must be between 30 and 300 kg';
                }
                break;
            case 'gender':
            case 'activity-level':
            case 'fitness-goal':
                if (!value) {
                    isValid = false;
                    errorMessage = 'This field is required';
                }
                break;
        }

        // Apply validation styling
        if (!isValid) {
            field.classList.add('error');
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    /**
     * Show field error message
     */
    showFieldError(field, message) {
        this.removeFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #e53e3e;
            font-size: 0.8rem;
            margin-top: 5px;
            font-weight: 500;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }

    /**
     * Remove field error message
     */
    removeFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    /**
     * Handle form submission
     */
    async handleFormSubmit(event) {
        event.preventDefault();
        
        // Validate all fields
        const form = event.target;
        const formData = new FormData(form);
        const userData = {
            age: parseInt(formData.get('age')),
            gender: formData.get('gender'),
            height: parseInt(formData.get('height')),
            weight: parseFloat(formData.get('weight')),
            activityLevel: formData.get('activityLevel'),
            fitnessGoal: formData.get('fitnessGoal')
        };

        // Validate all fields
        let allValid = true;
        const fields = form.querySelectorAll('input, select');
        fields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });

        if (!allValid) {
            this.showNotification('Please fix the errors in the form', 'error');
            return;
        }

        try {
            // Show loading state
            this.showLoading();
            
            // Generate health plan
            const healthPlan = this.calculator.generateHealthPlan(userData);
            this.currentPlan = healthPlan;
            
            // Display results
            this.displayResults(healthPlan);
            
            // Hide form and show results
            this.showResults();
            
            // Show success notification
            this.showNotification('Your health plan has been generated successfully!', 'success');
            
        } catch (error) {
            console.error('Error generating health plan:', error);
            this.showNotification('Error generating health plan: ' + error.message, 'error');
            this.hideLoading();
        }
    }

    /**
     * Display the health plan results
     */
    displayResults(healthPlan) {
        // Display basic metrics
        document.getElementById('bmi-value').textContent = healthPlan.metrics.bmi.value;
        document.getElementById('bmi-category').textContent = healthPlan.metrics.bmi.category;
        document.getElementById('bmr-value').textContent = healthPlan.metrics.bmr.toLocaleString();
        
        // Display daily calories
        document.getElementById('daily-calories').textContent = healthPlan.dailyCalories.toLocaleString();
        
        // Display macronutrients
        document.getElementById('protein-grams').textContent = healthPlan.macros.protein.grams;
        document.getElementById('protein-percentage').textContent = healthPlan.macros.protein.percentage;
        document.getElementById('carbs-grams').textContent = healthPlan.macros.carbs.grams;
        document.getElementById('carbs-percentage').textContent = healthPlan.macros.carbs.percentage;
        document.getElementById('fat-grams').textContent = healthPlan.macros.fat.grams;
        document.getElementById('fat-percentage').textContent = healthPlan.macros.fat.percentage;
        
        // Display water intake and sleep
        document.getElementById('water-intake').textContent = healthPlan.waterIntake;
        document.getElementById('sleep-recommendation').textContent = healthPlan.sleepRecommendation;
        
        // Display activity recommendations
        this.displayActivityRecommendations(healthPlan.activityRecommendations);
        
        // Display timeline estimates
        this.displayTimelineEstimates(healthPlan.timelineEstimates);
        
        // Display nutrients
        this.displayNutrients(healthPlan.nutrients);
        
        // Display health tips
        this.displayHealthTips(healthPlan.healthTips);
        
        // Hide loading
        this.hideLoading();
    }

    /**
     * Display activity recommendations
     */
    displayActivityRecommendations(activityRecs) {
        const container = document.getElementById('activity-recommendations');
        if (!container) return;

        let html = '<div class="activity-sections">';
        
        // Cardio section
        html += '<div class="activity-section"><h4>🏃‍♀️ Cardio</h4><ul>';
        activityRecs.cardio.forEach(rec => {
            html += `<li>${rec}</li>`;
        });
        html += '</ul></div>';
        
        // Strength section
        html += '<div class="activity-section"><h4>💪 Strength Training</h4><ul>';
        activityRecs.strength.forEach(rec => {
            html += `<li>${rec}</li>`;
        });
        html += '</ul></div>';
        
        // Flexibility section
        html += '<div class="activity-section"><h4>🧘‍♀️ Flexibility & Recovery</h4><ul>';
        activityRecs.flexibility.forEach(rec => {
            html += `<li>${rec}</li>`;
        });
        html += '</ul></div>';
        
        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Display timeline estimates
     */
    displayTimelineEstimates(timeline) {
        const container = document.getElementById('timeline-estimate');
        if (!container) return;

        let html = `<p><strong>Safe Rate:</strong> ${timeline.safeRate}</p>`;
        html += `<p><strong>Typical Duration:</strong> ${timeline.typicalDuration}</p>`;
        html += '<h4>📅 Milestones:</h4><ul>';
        timeline.milestones.forEach(milestone => {
            html += `<li>${milestone}</li>`;
        });
        html += '</ul>';
        
        container.innerHTML = html;
    }

    /**
     * Display nutrients information
     */
    displayNutrients(nutrients) {
        const container = document.getElementById('nutrients-list');
        if (!container) return;

        let html = '<div class="nutrients-grid">';
        
        Object.entries(nutrients).forEach(([nutrient, info]) => {
            html += `
                <div class="nutrient-item">
                    <h4>${nutrient}</h4>
                    <p><strong>Daily:</strong> ${info.daily}</p>
                    <p><strong>Benefits:</strong> ${info.benefits}</p>
                    <p><strong>Sources:</strong> ${info.sources.join(', ')}</p>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Display health tips
     */
    displayHealthTips(tips) {
        const container = document.getElementById('health-tips');
        if (!container) return;

        let html = '<ul>';
        tips.forEach(tip => {
            html += `<li>${tip}</li>`;
        });
        html += '</ul>';
        
        container.innerHTML = html;
    }

    /**
     * Show the form section
     */
    showForm() {
        document.getElementById('user-input-section').classList.remove('hidden');
        document.getElementById('results-section').classList.add('hidden');
        
        // Reset form
        document.getElementById('fitness-form').reset();
        
        // Clear any error styling
        const fields = document.querySelectorAll('input, select');
        fields.forEach(field => {
            field.classList.remove('error');
            this.removeFieldError(field);
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Show the results section
     */
    showResults() {
        document.getElementById('user-input-section').classList.add('hidden');
        document.getElementById('results-section').classList.remove('hidden');
        
        // Add fade-in animation
        const resultsSection = document.getElementById('results-section');
        resultsSection.classList.add('fade-in');
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Show loading state
     */
    showLoading() {
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Generating Plan...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Generate My Health Plan';
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#48bb78';
                break;
            case 'error':
                notification.style.backgroundColor = '#e53e3e';
                break;
            default:
                notification.style.backgroundColor = '#667eea';
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Export health plan as PDF or text
     */
    exportHealthPlan(format = 'text') {
        if (!this.currentPlan) {
            this.showNotification('No health plan to export', 'error');
            return;
        }

        if (format === 'text') {
            this.exportAsText();
        } else if (format === 'pdf') {
            this.exportAsPDF();
        }
    }

    /**
     * Export health plan as text
     */
    exportAsText() {
        const plan = this.currentPlan;
        let text = 'FITNESS HEALTH PLAN\n';
        text += '='.repeat(50) + '\n\n';
        
        text += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
        
        text += 'PERSONAL INFORMATION\n';
        text += `Age: ${plan.userData.age} years\n`;
        text += `Gender: ${plan.userData.gender}\n`;
        text += `Height: ${plan.userData.height} cm\n`;
        text += `Weight: ${plan.userData.weight} kg\n`;
        text += `Activity Level: ${plan.userData.activityLevel}\n`;
        text += `Fitness Goal: ${plan.userData.fitnessGoal}\n\n`;
        
        text += 'HEALTH METRICS\n';
        text += `BMI: ${plan.metrics.bmi.value} (${plan.metrics.bmi.category})\n`;
        text += `BMR: ${plan.metrics.bmr} calories/day\n`;
        text += `TDEE: ${plan.metrics.tdee} calories/day\n\n`;
        
        text += 'DAILY TARGETS\n';
        text += `Calories: ${plan.dailyCalories} calories/day\n`;
        text += `Protein: ${plan.macros.protein.grams}g (${plan.macros.protein.percentage}%)\n`;
        text += `Carbs: ${plan.macros.carbs.grams}g (${plan.macros.carbs.percentage}%)\n`;
        text += `Fat: ${plan.macros.fat.grams}g (${plan.macros.fat.percentage}%)\n\n`;
        
        text += 'LIFESTYLE RECOMMENDATIONS\n';
        text += `Water Intake: ${plan.waterIntake}\n`;
        text += `Sleep: ${plan.sleepRecommendation}\n\n`;
        
        // Create and download text file
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fitness-health-plan.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Health plan exported as text file', 'success');
    }

    /**
     * Export health plan as PDF (placeholder)
     */
    exportAsPDF() {
        this.showNotification('PDF export feature coming soon!', 'info');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FitnessApp();
});

// Add CSS for additional styling
const additionalStyles = `
    .field-error {
        color: #e53e3e;
        font-size: 0.8rem;
        margin-top: 5px;
        font-weight: 500;
    }
    
    input.error, select.error {
        border-color: #e53e3e !important;
        background-color: #fed7d7 !important;
    }
    
    .activity-sections {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
    }
    
    .activity-section {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .activity-section h4 {
        color: #2d3748;
        margin-bottom: 15px;
        font-size: 1.1rem;
        font-weight: 600;
    }
    
    .nutrients-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }
    
    .nutrient-item {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .nutrient-item h4 {
        color: #2d3748;
        margin-bottom: 15px;
        font-size: 1.1rem;
        font-weight: 600;
    }
    
    .nutrient-item p {
        margin-bottom: 8px;
        line-height: 1.5;
    }
    
    .nutrient-item strong {
        color: #2d3748;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
