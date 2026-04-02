import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const RiskAssessment = () => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState({});
    const [pcosResult, setPcosResult] = useState(null);
    const [metabolicResult, setMetabolicResult] = useState(null);
    const [infertilityResult, setInfertilityResult] = useState(null);
    const [finalResult, setFinalResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleOptionChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const calculateStepResult = async (moduleName) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/risk/calculate-partial', { answers, module: moduleName });
            if (moduleName === 'pcos') setPcosResult(response.data);
            else if (moduleName === 'metabolic') setMetabolicResult(response.data);
            else if (moduleName === 'infertility') setInfertilityResult(response.data);
            setStep(prev => prev + 1);
        } catch (err) {
            setError(err.response?.data?.message || `Error calculating ${moduleName} result.`);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        let requiredOnThisStep = [];
        if (step === 1) {
            requiredOnThisStep = ['menstrual_cycle', 'hyperandrogenism', 'bmi_category', 'waist_category', 'insulin_resistance', 'family_history', 'ultrasound_available'];
            const missing = requiredOnThisStep.filter(id => answers[id] === undefined);
            if (missing.length > 0) {
                setError('Please answer all required questions for PCOS section.');
                return;
            }
            if (answers.ultrasound_available === 'yes' && !answers.ultrasound_finding) {
                setError('Please select ultrasound findings.');
                return;
            }
            calculateStepResult('pcos');
            return;
        }
        
        if (step === 3) {
            requiredOnThisStep = ['bmi_category', 'waist_category', 'bp', 'acanthosis', 'glucose', 'triglycerides', 'hdl', 'activity'];
            const missing = requiredOnThisStep.filter(id => answers[id] === undefined);
            if (missing.length > 0) {
                setError('Please answer all questions for Metabolic section.');
                return;
            }
            calculateStepResult('metabolic');
            return;
        }

        if (step === 5) {
            requiredOnThisStep = ['cycle_regularity', 'trying_duration', 'ovulation', 'hyperandrogenism', 'bmi_category', 'insulin_resistance', 'ultrasound_available', 'age_category'];
            const missing = requiredOnThisStep.filter(id => answers[id] === undefined);
            if (missing.length > 0) {
                setError('Please answer all required questions for Infertility section.');
                return;
            }
            if (answers.ultrasound_available === 'yes' && !answers.ultrasound_finding) {
                setError('Please select ultrasound findings.');
                return;
            }
            calculateStepResult('infertility');
            return;
        }

        setError('');
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        setError('');
        setStep(prev => prev - 1);
    };

    const handleSubmitAssessment = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/risk', { answers });
            setFinalResult(response.data);
            setStep(7); // Final summary
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting full assessment.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPartial = async (moduleName, result) => {
        if (!user.is_premium) {
            alert("This is a Premium feature. Please upgrade from your Dashboard.");
            return;
        }
        try {
            const response = await api.post('/reports/download-instant-partial', 
                { module: moduleName, result }, 
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `FemGuard_${moduleName.toUpperCase()}_Result.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            alert('Error downloading partial report.');
        }
    };

    const handleDownloadFullReport = async () => {
        if (!user.is_premium) {
            alert("This is a Premium feature. Please upgrade from your Dashboard.");
            return;
        }
        try {
            const response = await api.get(`/reports/download/${finalResult.assessmentId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `FemGuard_Full_Report_${user.name}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            alert('Error downloading full report.');
        }
    };

    const Question = ({ id, text, options }) => (
        <div className="mb-6 p-5 bg-white/40 rounded-xl hover:bg-white/60 transition-colors border border-transparent hover:border-primary/20">
            <p className="font-semibold text-lg text-gray-800 mb-4">{text}</p>
            <div className="flex flex-wrap gap-3">
                {options.map((opt) => {
                    const isSelected = answers[id] === opt.value;
                    return (
                        <label key={opt.value}
                            className={`flex-1 min-w-[140px] flex justify-center items-center py-3 px-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
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

    const ModuleResultDisplay = ({ title, moduleName, result, colorClass, nextLabel }) => (
        <div className="animate-fade-in text-center py-6">
            <div className="mb-6">
                <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider bg-opacity-10 text-${colorClass} bg-${colorClass}`}>
                    Section Result: {title}
                </span>
            </div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">{moduleName} Risk Analysis</h2>
            
            <div className="flex flex-col items-center mb-8">
                <div className={`w-40 h-40 rounded-full border-8 flex flex-col justify-center items-center mb-4 transition-all duration-500 ${
                    result.category.includes('High') ? 'border-red-500 shadow-lg shadow-red-200' : 
                    result.category.includes('Moderate') ? 'border-orange-500 shadow-lg shadow-orange-100' : 
                    'border-green-500 shadow-lg shadow-green-100'
                }`}>
                    <span className="text-4xl font-black">{result.score}</span>
                    <span className="text-xs font-bold text-gray-400">SCORE</span>
                </div>
                <span className="font-black uppercase text-xl mb-4 tracking-tight text-gray-700">{result.category}</span>
                
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white shadow-sm max-w-md">
                    <span className="text-[11px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Ayurvedic Insight</span>
                    <p className="text-lg text-gray-800 font-medium italic leading-relaxed">"{result.ayurvedic}"</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button 
                    onClick={() => handleDownloadPartial(title.toLowerCase(), result)} 
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full font-bold border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                >
                    📥 Download {title} Result
                </button>
                <button onClick={nextStep} className="btn-primary px-10 py-3 shadow-xl">
                    {nextLabel} →
                </button>
            </div>
        </div>
    );

    return (
        <div className="py-8 max-w-4xl mx-auto px-4">
            <div className="glass-panel p-6 md:p-10">
                {/* Progress Tracking */}
                <div className="mb-10 text-center">
                    <div className="inline-flex flex-col items-center mb-1 group cursor-default">
                        <span className="text-sm font-bold text-slate-500/80 dark:text-slate-400/80 lowercase tracking-[0.2em] mb-1 transition-all group-hover:text-primary">dkpl's</span>
                        <h2 className="text-5xl md:text-6xl font-black leading-none tracking-tighter uppercase italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm group-hover:drop-shadow-md transition-all">
                            FemGuard
                        </h2>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-4">PCOS, Metabolic syndrome & Infertility Risk Assessment</p>
                    
                    <div className="mt-8 flex justify-between items-center max-w-md mx-auto relative px-4">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                        <div 
                            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
                            style={{ width: `${((step - 1) / 6) * 100}%` }}
                        ></div>
                        
                        {[1, 2, 3, 4, 5, 6, 7].map(s => (
                            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all duration-500 ${step >= s ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-300 border border-gray-200'}`}>
                                {s}
                            </div>
                        ))}
                    </div>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 shadow-sm">{error}</div>}

                <div className="min-h-[400px]">
                    {step === 1 && (
                        <div className="animate-slide-up">
                            <div className="mb-8 border-l-4 border-primary pl-4">
                                <h3 className="text-2xl font-bold text-gray-800">Part 1: PCOS Risk Assessment 🩸</h3>
                                <p className="text-gray-500">Based on symptoms and physical indicators.</p>
                            </div>
                            <Question id="menstrual_cycle" text="Menstrual Cycle Pattern" options={[{label: 'Regular', value: 'regular'}, {label: 'Mild Irregularity', value: 'mild_irregularity'}, {label: 'Oligomenorrhea', value: 'oligomenorrhea_amenorrhea'}]} />
                            <Question id="hyperandrogenism" text="Excess Hair Growth / Acne" options={[{label: 'Absent', value: 'absent'}, {label: 'Mild', value: 'mild'}, {label: 'Severe', value: 'severe'}]} />
                            <Question id="bmi_category" text="Body Mass Index (BMI)" options={[{label: '< 23', value: '<23'}, {label: '23–24.9', value: '23-24.9'}, {label: '≥ 25', value: '>=25'}]} />
                            <Question id="waist_category" text="Waist Circumference (cm)" options={[{label: '< 80', value: '<80'}, {label: '80–88', value: '80-88'}, {label: '> 88', value: '>88'}]} />
                            <Question id="insulin_resistance" text="Insulin Resistance (e.g. Glucose >100 or Skin Darkening)" options={[{label: 'Absent', value: 'absent'}, {label: 'Present', value: 'present'}]} />
                            <Question id="family_history" text="Family History of PCOS or Diabetes" options={[{label: 'No', value: 'absent'}, {label: 'Yes', value: 'present'}]} />
                            
                            <Question id="ultrasound_available" text="Do you have an Ultrasound Report?" options={[{label: 'No', value: 'no'}, {label: 'Yes', value: 'yes'}]} />
                            {answers.ultrasound_available === 'yes' && (
                                <Question id="ultrasound_finding" text="Ultrasound Finding" options={[{label: 'Normal Ovaries', value: 'normal'}, {label: 'Polycystic Ovarian Morphology', value: 'polycystic'}]} />
                            )}
                        </div>
                    )}

                    {step === 2 && pcosResult && (
                        <ModuleResultDisplay title="PCOS" moduleName="PCOS" result={pcosResult} colorClass="primary" nextLabel="Continue to Metabolic" />
                    )}

                    {step === 3 && (
                        <div className="animate-slide-up">
                            <div className="mb-8 border-l-4 border-secondary pl-4">
                                <h3 className="text-2xl font-bold text-gray-800">Part 2: Metabolic Syndrome Assessment ⚖️</h3>
                                <p className="text-gray-500">Evaluating cardiovascular and metabolic risk factors.</p>
                            </div>
                            <Question id="bmi_category" text="Body Mass Index (BMI)" options={[{label: '< 23', value: '<23'}, {label: '23–24.9', value: '23-24.9'}, {label: '≥ 25', value: '>=25'}]} />
                            <Question id="waist_category" text="Waist Circumference (cm)" options={[{label: '< 80', value: '<80'}, {label: '80–88', value: '80-88'}, {label: '> 88', value: '>88'}]} />
                            <Question id="bp" text="Blood Pressure" options={[{label: 'Normal (<120/80)', value: 'normal'}, {label: 'Elevated (120-129)', value: 'elevated'}, {label: 'High (≥130/85)', value: 'high'}]} />
                            <Question id="acanthosis" text="Acanthosis Nigricans (Dark Skin Patches)" options={[{label: 'Absent', value: 'absent'}, {label: 'Mild', value: 'mild'}, {label: 'Marked', value: 'marked'}]} />
                            <Question id="glucose" text="Fasting Blood Glucose" options={[{label: 'Normal (<100)', value: 'normal'}, {label: '100–125 (Pre-diabetic)', value: '100-125'}, {label: '≥ 126 (Diabetic)', value: '>=126'}]} />
                            <Question id="triglycerides" text="Triglycerides" options={[{label: 'Normal (<150)', value: 'normal'}, {label: 'High (≥150)', value: '>=150'}]} />
                            <Question id="hdl" text="HDL Cholesterol" options={[{label: 'Healthy (≥50)', value: 'normal'}, {label: 'Low (<50)', value: '<50'}]} />
                            <Question id="activity" text="Physical Activity Level" options={[{label: 'Regular Exercise', value: 'regular'}, {label: 'Occasional', value: 'occasional'}, {label: 'Sedentary', value: 'sedentary'}]} />
                        </div>
                    )}

                    {step === 4 && metabolicResult && (
                        <ModuleResultDisplay title="Metabolic" moduleName="Metabolic" result={metabolicResult} colorClass="secondary" nextLabel="Continue to Infertility" />
                    )}

                    {step === 5 && (
                        <div className="animate-slide-up">
                            <div className="mb-8 border-l-4 border-accent pl-4">
                                <h3 className="text-2xl font-bold text-gray-800">Part 3: Infertility Risk Assessment 👶</h3>
                                <p className="text-gray-500">Assessing factors affecting reproductive health.</p>
                            </div>
                            <Question id="cycle_regularity" text="Menstrual Cycle Regularity" options={[{label: 'Normal', value: 'normal'}, {label: 'Mildly Irregular', value: 'mild_irregular'}, {label: 'Irregular / Chronic Anovulation', value: 'irregular'}]} />
                            <Question id="trying_duration" text="Trying to Conceive Duration" options={[{label: 'Not trying', value: 'not_trying'}, {label: 'Less than 1 year', value: 'less_than_1_year'}, {label: 'More than 1 year', value: 'more_than_1_year'}]} />
                            <Question id="ovulation" text="Ovulation Status" options={[{label: 'Normal', value: 'normal'}, {label: 'Disturbed', value: 'disturbed'}, {label: 'Anovulation', value: 'anovulation'}]} />
                            <Question id="hyperandrogenism" text="Excess Hair Growth / Acne" options={[{label: 'Absent', value: 'absent'}, {label: 'Mild', value: 'mild'}, {label: 'Severe', value: 'severe'}]} />
                            <Question id="bmi_category" text="Body Mass Index (BMI)" options={[{label: '< 23', value: '<23'}, {label: '23–24.9', value: '23-24.9'}, {label: '≥ 25', value: '>=25'}]} />
                            <Question id="insulin_resistance" text="Insulin Resistance" options={[{label: 'Absent', value: 'absent'}, {label: 'Present', value: 'present'}]} />
                            
                            <Question id="ultrasound_available" text="Do you have an Ultrasound Report?" options={[{label: 'No', value: 'no'}, {label: 'Yes', value: 'yes'}]} />
                            {answers.ultrasound_available === 'yes' && (
                                <Question id="ultrasound_finding" text="Ultrasound Finding" options={[{label: 'Normal', value: 'normal'}, {label: 'PCOS Morphology', value: 'polycystic'}]} />
                            )}

                            <Question id="age_category" text="Age Factor" options={[{label: '< 30 years', value: '<30'}, {label: '30–34 years', value: '30-34'}, {label: '≥ 35 years', value: '>=35'}]} />
                        </div>
                    )}

                    {step === 6 && infertilityResult && (
                        <ModuleResultDisplay title="Infertility" moduleName="Infertility" result={infertilityResult} colorClass="accent" nextLabel="Show Final Summary" />
                    )}

                    {step === 7 && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-bold text-center mb-8">Full Assessment Summary</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                                    <h4 className="font-bold text-primary mb-2">PCOS</h4>
                                    <p className="text-2xl font-black">{pcosResult?.score}/17</p>
                                    <p className="text-xs font-bold uppercase mt-1">{pcosResult?.category}</p>
                                </div>
                                <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/10 text-center">
                                    <h4 className="font-bold text-secondary mb-2">Metabolic</h4>
                                    <p className="text-2xl font-black">{metabolicResult?.score}/17</p>
                                    <p className="text-xs font-bold uppercase mt-1">{metabolicResult?.category}</p>
                                </div>
                                <div className="p-6 bg-accent/5 rounded-2xl border border-accent/10 text-center">
                                    <h4 className="font-bold text-accent mb-2">Infertility</h4>
                                    <p className="text-2xl font-black">{infertilityResult?.score}/18</p>
                                    <p className="text-xs font-bold uppercase mt-1">{infertilityResult?.category}</p>
                                </div>
                            </div>

                            {finalResult ? (
                                <div className="bg-white/60 p-6 rounded-2xl border border-white mb-8">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span>🌿</span> Ayurvedic Recommendations
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed italic">"{finalResult.recommendations}"</p>
                                </div>
                            ) : (
                                <div className="text-center p-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mb-8">
                                    <p className="text-gray-500 font-medium">Ready to generate your personalized health plan?</p>
                                    <button onClick={handleSubmitAssessment} disabled={loading} className="btn-primary mt-4 px-10 py-3 shadow-xl">
                                        {loading ? 'Processing...' : 'Complete & Generate Full Report ✨'}
                                    </button>
                                </div>
                            )}

                            {finalResult && (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button onClick={() => window.location.reload()} className="px-8 py-4 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition-all border border-gray-200">
                                        🔄 Retake
                                    </button>
                                    <button onClick={handleDownloadFullReport} className="btn-primary px-8 py-4 shadow-xl flex items-center gap-2">
                                        📥 Download Full PDF Report
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation Footer for Question Steps */}
                {[1, 3, 5].includes(step) && (
                    <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
                        {step > 1 && (
                            <button onClick={prevStep} className="px-6 py-3 rounded-full font-bold text-gray-500 hover:bg-gray-100">
                                ← Back
                            </button>
                        )}
                        <div className="flex-1"></div>
                        <button onClick={nextStep} disabled={loading} className="btn-primary px-10 py-3 shadow-lg">
                            {loading ? 'Calculating...' : 'See Results →'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiskAssessment;
