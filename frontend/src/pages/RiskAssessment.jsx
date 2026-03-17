import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const RiskAssessment = () => {
    const { user } = useAuth();
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleOptionChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation: Check if we have at least 10 answers answered to avoid blank submits
        if (Object.keys(answers).length < 10) {
            setError('Please answer all the required questions before submitting.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Note: Our new algorithm expects very specific keys.
            // (e.g., answers.menstrual_cycle = 'mild_irregularity')
            // The state `answers` is already storing these exact string or numeric values directly from the radio inputs.
            const response = await api.post('/risk', { answers });
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting assessment.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async () => {
        if (!user.is_premium) {
            alert("This is a Premium feature. Please upgrade from your Dashboard.");
            return;
        }
        
        try {
            const response = await api.get(`/reports/download/${result.assessmentId}`, {
                responseType: 'blob', // Important for downloading files
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('href');
            link.href = url;
            link.setAttribute('download', `FemGuard_Report_${user.name}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            alert('Error downloading report.');
        }
    };

    if (result) {
        return (
            <div className="py-8 max-w-5xl mx-auto">
                <div className="glass-panel p-8 text-center">
                    <h2 className="text-3xl font-bold mb-2">FemGuard Assessment Results</h2>
                    <p className="text-gray-600 mb-8">Generated using Ayurvedic logic and modern medical symptoms</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {/* PCOS Risk */}
                        <div className="bg-white/50 rounded-xl p-6 border border-white flex flex-col items-center">
                            <h3 className="text-xl font-bold text-primary mb-4">PCOS Risk</h3>
                            <div className={`w-32 h-32 rounded-full border-8 flex flex-col justify-center items-center mb-4 ${result.pcosRisk.category.includes('High') ? 'border-red-500' : result.pcosRisk.category.includes('Moderate') ? 'border-orange-500' : 'border-green-500'}`}>
                                <span className="text-3xl font-black">{result.pcosRisk.score}/16</span>
                            </div>
                            <span className="font-bold uppercase text-sm mb-2">{result.pcosRisk.category}</span>
                            <p className="text-xs text-gray-700 h-12">{result.pcosRisk.ayurvedic}</p>
                        </div>

                        {/* Metabolic Risk */}
                        <div className="bg-white/50 rounded-xl p-6 border border-white flex flex-col items-center">
                            <h3 className="text-xl font-bold text-secondary mb-4">Metabolic Risk</h3>
                            <div className={`w-32 h-32 rounded-full border-8 flex flex-col justify-center items-center mb-4 ${result.metabolicRisk.category.includes('High') ? 'border-red-500' : result.metabolicRisk.category.includes('Moderate') ? 'border-orange-500' : 'border-green-500'}`}>
                                <span className="text-3xl font-black">{result.metabolicRisk.score}/20</span>
                            </div>
                            <span className="font-bold uppercase text-sm mb-2">{result.metabolicRisk.category}</span>
                            <p className="text-xs text-gray-700 h-12">{result.metabolicRisk.ayurvedic}</p>
                        </div>

                        {/* Infertility Risk */}
                        <div className="bg-white/50 rounded-xl p-6 border border-white flex flex-col items-center">
                            <h3 className="text-xl font-bold text-accent mb-4">Infertility Risk</h3>
                            <div className={`w-32 h-32 rounded-full border-8 flex flex-col justify-center items-center mb-4 ${result.infertilityRisk.category.includes('High') ? 'border-red-500' : result.infertilityRisk.category.includes('Moderate') ? 'border-orange-500' : 'border-green-500'}`}>
                                <span className="text-3xl font-black">{result.infertilityRisk.score}/18</span>
                            </div>
                            <span className="font-bold uppercase text-sm mb-2">{result.infertilityRisk.category}</span>
                            <p className="text-xs text-gray-700 h-12">{result.infertilityRisk.ayurvedic}</p>
                        </div>
                    </div>

                    <div className="bg-white/50 rounded-xl p-6 mb-8 text-left border border-white">
                        <h3 className="text-xl font-bold text-secondary mb-3">Overall Recommendations 🌿</h3>
                        <p className="text-gray-700 text-lg leading-relaxed">{result.recommendations}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-bold hover:bg-gray-300">
                            Retake Test
                        </button>
                        <button onClick={handleDownloadReport} className="btn-primary animate-pulse shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-600">
                            Download Detailed PDF Report {user?.is_premium ? '' : '(Premium)'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Helper component for questions
    const Question = ({ id, text, options }) => (
        <div className="mb-8 p-4 bg-white/40 rounded-xl hover:bg-white/60 transition-colors">
            <p className="font-semibold text-lg text-gray-800 mb-4">{text}</p>
            <div className="flex flex-wrap gap-4">
                {options.map((opt) => {
                    const isSelected = answers[id] === opt.value;
                    return (
                        <label key={opt.value}
                            className={`flex-1 min-w-[150px] flex justify-center items-center py-3 px-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                    ? 'border-primary bg-primary/10 text-primary font-bold'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="radio"
                                name={id}
                                value={opt.value}
                                className="hidden"
                                onChange={() => handleOptionChange(id, opt.value)}
                                checked={isSelected}
                            />
                            {opt.label}
                        </label>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="py-8 max-w-4xl mx-auto">
            <div className="glass-panel p-8 md:p-12">
                <h2 className="text-3xl font-bold text-primary mb-2">FemGuard Risk Assessment</h2>
                <p className="text-gray-600 mb-8">Please answer all questions accurately to calculate your PCOS, Metabolic, and Infertility risk profile.</p>

                {error && <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6 shadow-sm border border-red-200">{error}</div>}

                <form onSubmit={handleSubmit}>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8 bg-gray-100 p-3 rounded-lg border-l-4 border-primary">Section 1: Reproductive & Clinical Symptoms</h3>
                    
                    <Question 
                        id="menstrual_cycle" 
                        text="What is your menstrual cycle pattern?" 
                        options={[{label: 'Regular (21–35 days)', value: 'regular'}, {label: 'Mild Irregularity', value: 'mild_irregularity'}, {label: 'Oligomenorrhea / Amenorrhea (Missed periods)', value: 'oligomenorrhea_amenorrhea'}]} 
                    />
                    
                    <Question 
                        id="hyperandrogenism" 
                        text="Are you experiencing symptoms of excess male hormones?" 
                        options={[{label: 'Absent', value: 'absent'}, {label: 'Mild acne or mild hair growth', value: 'mild_acne_hair'}, {label: 'Hirsutism / Severe Acne', value: 'hirsutism_severe_acne'}]} 
                    />

                    <Question 
                        id="insulin_resistance" 
                        text="Do you have dark patches on your skin (Acanthosis nigricans) or elevated glucose?" 
                        options={[{label: 'No', value: 'absent'}, {label: 'Yes', value: 'present'}]} 
                    />
                    
                    <Question 
                        id="acanthosis" 
                        text="If you have dark skin patches (Acanthosis Nigricans), how severe is it?" 
                        options={[{label: 'Absent', value: 'absent'}, {label: 'Mild', value: 'mild'}, {label: 'Marked (Severe)', value: 'marked'}]} 
                    />
                    
                    <Question 
                        id="ultrasound" 
                        text="Has an ultrasound ever shown polycystic ovarian morphology?" 
                        options={[{label: 'No / Normal Ovaries', value: 'normal'}, {label: 'Yes', value: 'polycystic'}]} 
                    />
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-12 bg-gray-100 p-3 rounded-lg border-l-4 border-secondary">Section 2: Anthropometrics & Lifestyle</h3>
                    
                    <Question 
                        id="bmi" 
                        text="What is your estimated Body Mass Index (BMI) or Body Type?" 
                        options={[{label: 'Underweight / Normal (<23)', value: 22}, {label: 'Slightly Overweight (23-24.9)', value: 24}, {label: 'Overweight / Obese (≥25)', value: 26}]}  // passing numbers directly here for the specific range check in logic
                    />
                    
                    <Question 
                        id="waist_cm" 
                        text="What is your Waist Circumference?" 
                        options={[{label: '< 80 cm', value: 75}, {label: '80–88 cm', value: 85}, {label: '> 88 cm', value: 95}]} 
                    />

                    <Question 
                        id="activity" 
                        text="What is your Physical Activity Level?" 
                        options={[{label: 'Regular Exercise', value: 'regular'}, {label: 'Occasional', value: 'occasional'}, {label: 'Sedentary Lifestyle', value: 'sedentary'}]} 
                    />
                    
                    <Question 
                        id="family_history" 
                        text="Do you have a family history of PCOS or Diabetes?" 
                        options={[{label: 'No', value: 'absent'}, {label: 'Yes', value: 'present'}]} 
                    />

                    <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-12 bg-gray-100 p-3 rounded-lg border-l-4 border-accent">Section 3: Biochemical & Infertility Metrics (Optional but recommended)</h3>
                    
                    <Question 
                        id="bp" 
                        text="What is your average Blood Pressure?" 
                        options={[{label: 'Normal (<120/80)', value: 'normal'}, {label: 'Elevated (120-129)', value: '120-129'}, {label: 'High (≥130/85)', value: '130+'}]} 
                    />

                    <Question 
                        id="glucose" 
                        text="Fasting Blood Glucose Level (if known):" 
                        options={[{label: 'Normal (<100 mg/dl)', value: 90}, {label: 'Elevated (100–125)', value: 110}, {label: 'High (≥126)', value: 130}]} 
                    />
                    
                    <Question 
                        id="triglycerides" 
                        text="Triglycerides Level (if known):" 
                        options={[{label: 'Normal (<150 mg/dl)', value: 100}, {label: 'High (≥150)', value: 160}]} 
                    />
                    
                    <Question 
                        id="hdl" 
                        text="HDL (Good) Cholesterol Level (if known):" 
                        options={[{label: 'Normal (≥50 mg/dl)', value: 60}, {label: 'Low (<50)', value: 40}]} 
                    />

                    <Question 
                        id="trying_to_conceive" 
                        text="Duration of attempting to conceive (if applicable):" 
                        options={[{label: 'Not trying', value: 'not_trying'}, {label: 'Trying < 1 year', value: 'less_than_1_year'}, {label: 'Trying ≥ 1 year', value: 'more_than_1_year'}]} 
                    />

                    <Question 
                        id="ovulation" 
                        text="Do you have Ovulatory Dysfunction?" 
                        options={[{label: 'Normal Ovulation', value: 'normal'}, {label: 'Occasional Disturbance', value: 'occasional_disturbance'}, {label: 'Chronic Anovulation', value: 'chronic_anovulation'}]} 
                    />
                    
                    <Question 
                        id="age" 
                        text="What is your Age range?" 
                        options={[{label: '< 30 years', value: 25}, {label: '30–34 years', value: 32}, {label: '≥ 35 years', value: 40}]} 
                    />


                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn-primary w-full text-lg py-4 mt-8 flex justify-center items-center shadow-xl ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Analyzing FemGuard Metrics...' : 'Submit Assessment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RiskAssessment;
