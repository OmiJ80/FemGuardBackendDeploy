const { calculatePCOS, calculateMetabolic, calculateInfertility } = require('../backend/utils/ayurvedicLogic');

const testPCOS = () => {
    console.log('Testing PCOS Logic...');
    const result_low = calculatePCOS({ menstrual_cycle: 'regular', hyperandrogenism: 'absent', bmi_category: '<23', waist_category: '<80', insulin_resistance: 'absent', family_history: 'absent', ultrasound_available: 'no' });
    console.log('Low Risk Test:', result_low.score, result_low.category);

    const result_mod = calculatePCOS({ menstrual_cycle: 'mild_irregularity', hyperandrogenism: 'mild', bmi_category: '23-24.9', waist_category: '80-88', insulin_resistance: 'present', family_history: 'absent', ultrasound_available: 'no' });
    // score: 1 + 1 + 1 + 1 + 2 = 6 (Moderate)
    console.log('Moderate Risk Test:', result_mod.score, result_mod.category);

    const result_high = calculatePCOS({ menstrual_cycle: 'oligomenorrhea_amenorrhea', hyperandrogenism: 'severe', bmi_category: '>=25', waist_category: '>88', insulin_resistance: 'present', family_history: 'present', ultrasound_available: 'yes', ultrasound_finding: 'polycystic' });
    // score: 3 + 2 + 2 + 2 + 2 + 1 + 5 = 17 (High)
    console.log('High Risk Test:', result_high.score, result_high.category);
};

const testMetabolic = () => {
    console.log('\nTesting Metabolic Logic...');
    const result_low = calculateMetabolic({ bmi_category: '<23', waist_category: '<80', bp: 'normal', acanthosis: 'absent', glucose: 'normal', triglycerides: 'normal', hdl: 'normal', activity: 'regular' });
    console.log('Low Risk Test:', result_low.score, result_low.category);

    const result_mod = calculateMetabolic({ bmi_category: '23-24.9', waist_category: '80-88', bp: 'elevated', acanthosis: 'mild', glucose: '100-125', triglycerides: 'normal', hdl: 'normal', activity: 'occasional' });
    // score: 1 + 1 + 1 + 1 + 2 + 0 + 0 + 1 = 7 (Moderate)
    console.log('Moderate Risk Test:', result_mod.score, result_mod.category);

    const result_high = calculateMetabolic({ bmi_category: '>=25', waist_category: '>88', bp: 'high', acanthosis: 'marked', glucose: '>=126', triglycerides: '>=150', hdl: '<50', activity: 'sedentary' });
    // score: 2 + 2 + 2 + 2 + 3 + 2 + 2 + 2 = 17 (High)
    console.log('High Risk Test:', result_high.score, result_high.category);
};

const testInfertility = () => {
    console.log('\nTesting Infertility Logic...');
    const result_low = calculateInfertility({ cycle_regularity: 'normal', trying_duration: 'not_trying', ovulation: 'normal', hyperandrogenism: 'absent', bmi_category: '<23', insulin_resistance: 'absent', ultrasound_available: 'no', age_category: '<30' });
    console.log('Low Risk Test:', result_low.score, result_low.category);

    const result_mod = calculateInfertility({ cycle_regularity: 'mild_irregular', trying_duration: 'less_than_1_year', ovulation: 'disturbed', hyperandrogenism: 'mild', bmi_category: '23-24.9', insulin_resistance: 'absent', ultrasound_available: 'no', age_category: '30-34' });
    // score: 1 + 1 + 1 + 1 + 1 + 0 + 0 + 1 = 6 (Moderate)
    console.log('Moderate Risk Test:', result_mod.score, result_mod.category);

    const result_high = calculateInfertility({ cycle_regularity: 'irregular', trying_duration: 'more_than_1_year', ovulation: 'anovulation', hyperandrogenism: 'severe', bmi_category: '>=25', insulin_resistance: 'present', ultrasound_available: 'yes', ultrasound_finding: 'polycystic', age_category: '>=35' });
    // score: 2 + 3 + 2 + 2 + 2 + 2 + 5 + 2 = 20 (High)
    console.log('High Risk Test:', result_high.score, result_high.category);
};

testPCOS();
testMetabolic();
testInfertility();
