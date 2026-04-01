// PCOS Risk Module logic
const calculatePCOS = (answers) => {
    let score = 0;
    
    // Menstrual Cycle Pattern
    if (answers.menstrual_cycle === 'mild_irregularity') score += 1;
    if (answers.menstrual_cycle === 'oligomenorrhea_amenorrhea') score += 3;
    
    // Hyperandrogenism Symptoms (Acne / Hair Growth)
    if (answers.hyperandrogenism === 'mild') score += 1;
    if (answers.hyperandrogenism === 'severe') score += 2;
    
    // BMI
    if (answers.bmi_category === '23-24.9') score += 1;
    if (answers.bmi_category === '>=25') score += 2;
    
    // Waist Circumference
    if (answers.waist_category === '80-88') score += 1;
    if (answers.waist_category === '>88') score += 2;
    
    // Insulin Resistance
    if (answers.insulin_resistance === 'present') score += 2;
    
    // Family History
    if (answers.family_history === 'present') score += 1;
    
    // Ultrasound Findings (Optional)
    if (answers.ultrasound_available === 'yes' && answers.ultrasound_finding === 'polycystic') {
        score += 5;
    }

    let category = '';
    let ayurvedic = '';

    if (score <= 4) {
        category = 'Low Risk';
        ayurvedic = 'Minimal Dosha Imbalance';
    } else if (score >= 5 && score <= 9) {
        category = 'Moderate Risk';
        ayurvedic = 'Kapha-Medo Dushti (Vitiation of Body Fat & Fluids)';
    } else {
        category = 'High Risk';
        ayurvedic = 'Srotas Avarana (Obstruction in channels affecting Artava)';
    }

    return { score, category, ayurvedic };
};

// Metabolic Syndrome Risk Module Logic
const calculateMetabolic = (answers) => {
    let score = 0;
    
    // BMI
    if (answers.bmi_category === '23-24.9') score += 1;
    if (answers.bmi_category === '>=25') score += 2;
    
    // Waist Circumference
    if (answers.waist_category === '80-88') score += 1;
    if (answers.waist_category === '>88') score += 2;
    
    // Blood Pressure
    if (answers.bp === 'elevated') score += 1;
    if (answers.bp === 'high') score += 2;
    
    // Acanthosis Nigricans
    if (answers.acanthosis === 'mild') score += 1;
    if (answers.acanthosis === 'marked') score += 2;
    
    // Fasting Blood Glucose
    if (answers.glucose === '100-125') score += 2;
    if (answers.glucose === '>=126') score += 3;
    
    // Triglycerides
    if (answers.triglycerides === '>=150') score += 2;
    
    // HDL Cholesterol
    if (answers.hdl === '<50') score += 2;
    
    // Physical Activity
    if (answers.activity === 'occasional') score += 1;
    if (answers.activity === 'sedentary') score += 2;

    let category = '';
    let ayurvedic = '';

    if (score <= 5) {
        category = 'Low Risk';
        ayurvedic = 'Healthy Agni & Meda';
    } else if (score >= 6 && score <= 12) {
        category = 'Moderate Risk';
        ayurvedic = 'Meda Dhatu Dushti (Disturbed fat metabolism)';
    } else {
        category = 'High Risk';
        ayurvedic = 'Prameha Purvarupa (Pre-diabetic state in Ayurveda)';
    }

    return { score, category, ayurvedic };
};

// Infertility Risk Module Logic
const calculateInfertility = (answers) => {
    let score = 0;
    
    // Menstrual Cycle Regularity
    if (answers.cycle_regularity === 'mild_irregular') score += 1;
    if (answers.cycle_regularity === 'irregular') score += 2;
    
    // Duration of Attempt to Conceive
    if (answers.trying_duration === 'less_than_1_year') score += 1;
    if (answers.trying_duration === 'more_than_1_year') score += 3;
    
    // Ovulation Status
    if (answers.ovulation === 'disturbed') score += 1;
    if (answers.ovulation === 'anovulation') score += 2;
    
    // Hyperandrogenism Symptoms (Acne / Hair Growth)
    if (answers.hyperandrogenism === 'mild') score += 1;
    if (answers.hyperandrogenism === 'severe') score += 2;
    
    // BMI
    if (answers.bmi_category === '23-24.9') score += 1;
    if (answers.bmi_category === '>=25') score += 2;
    
    // Insulin Resistance
    if (answers.insulin_resistance === 'present') score += 2;
    
    // Ultrasound Findings (Optional)
    if (answers.ultrasound_available === 'yes' && answers.ultrasound_finding === 'polycystic') {
        score += 3;
    }
    
    // Age
    if (answers.age_category === '30-34') score += 1;
    if (answers.age_category === '>=35') score += 2;

    let category = '';
    let ayurvedic = '';

    if (score <= 4) {
        category = 'Low infertility risk';
        ayurvedic = 'Balanced Apana Vata';
    } else if (score >= 5 && score <= 9) {
        category = 'Moderate infertility risk';
        ayurvedic = 'Vata + Kapha';
    } else {
        category = 'High infertility risk';
        ayurvedic = 'Apana Vata Avarana Affecting Artava, Beeja & Kshetra';
    }

    return { score, category, ayurvedic };
};

const getRecommendations = (pcosRisk, metabolicRisk, infertilityRisk) => {
    // Generate an aggregated recommendation string dynamically based on highest risks
    let recs = [];
    if (pcosRisk.category === 'High Risk' || pcosRisk.category === 'Very High Risk') {
        recs.push('Consult a gynecologist or endocrinologist for PCOS management. Follow a Kapha-Vata balancing diet (warm, light, easy to digest foods).');
    }
    if (metabolicRisk.category === 'High Risk') {
        recs.push('High metabolic risk detected. Immediate medical consultation required to screen for Premeha (diabetes). Focus on losing 5-10% of body weight via daily cardiovascular activity.');
    }
    if (infertilityRisk.category === 'High Risk') {
        recs.push('High infertility risk indicated. Specialist fertility consultation is strongly recommended alongside Ayurveda therapies for Apana Vata regulation.');
    }
    
    if (recs.length === 0) {
        recs.push('Overall low risk across all modules. Maintain a healthy lifestyle, stay active, and practice preventative self-care routines.');
    }
    
    return recs.join(' ');
};

module.exports = {
    calculatePCOS,
    calculateMetabolic,
    calculateInfertility,
    getRecommendations
};
