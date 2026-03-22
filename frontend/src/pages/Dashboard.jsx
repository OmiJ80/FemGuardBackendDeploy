import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Activity, CalendarHeart, Sparkles, LogOut, ChevronRight, Target, Flame, HeartPulse } from 'lucide-react';

const CircularProgress = ({ score, maxScore, label, color, delay }) => {
    const percentage = (score / maxScore) * 100;
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay }}
            className="flex flex-col items-center justify-center p-4"
        >
            <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                    {/* Progress circle */}
                    <motion.circle 
                        cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeLinecap="round"
                        className={color}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeOut" }}
                        style={{ strokeDasharray: circumference }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xl font-bold dark:text-white">{score}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">/ {maxScore}</span>
                </div>
            </div>
            <span className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">{label}</span>
        </motion.div>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const [assessments, setAssessments] = useState([]);
    const [cycles, setCycles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assessRes, cycleRes] = await Promise.all([api.get('/risk'), api.get('/tracker')]);
                setAssessments(assessRes.data);
                setCycles(cycleRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const latestAssessment = assessments[0];

    // Calculate Gamification Streak
    const calculateStreak = () => {
        let streak = 0;
        const allActivityDates = [
            ...assessments.map(a => new Date(a.created_at).setHours(0,0,0,0)),
            ...cycles.map(c => new Date(c.created_at).setHours(0,0,0,0))
        ].sort((a, b) => b - a);
        
        // Remove duplicates (multiple activities on same day count as 1)
        const uniqueDates = [...new Set(allActivityDates)];
        
        if (uniqueDates.length === 0) return 0;

        const today = new Date().setHours(0,0,0,0);
        const oneDay = 86400000;

        // Check if there was activity today or yesterday to maintain a streak
        if (today - uniqueDates[0] > oneDay) return 0;

        streak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
            if (uniqueDates[i] - uniqueDates[i+1] === oneDay) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    const currentStreak = calculateStreak();

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <p className="text-slate-500 font-medium">Loading your health hub...</p>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase">
                            Health Dashboard
                        </span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
                        Welcome back, <span className="text-gradient hover:scale-105 inline-block transition-transform">{user?.name?.split(' ')[0]}</span> 👋
                    </motion.h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Your daily reproductive health overview.</p>
                </div>

                {/* Gamification Streak & Premium Upsell */}
                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                    {currentStreak > 0 ? (
                        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl">
                                <Flame className="w-5 h-5 text-primary" />
                                <span className="font-bold text-slate-800 dark:text-white text-sm">{currentStreak} Day Streak!</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                                <Flame className="w-5 h-5 text-slate-400" />
                                <span className="font-bold text-slate-500 text-sm">Start a streak!</span>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Core Health Metrics Ring Widget */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-panel p-8 mb-8 relative overflow-hidden"
            >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                 
                 <div className="flex flex-col md:flex-row justify-between items-center mb-6 relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2"><Target className="w-6 h-6 text-primary" /> Your Risk Profile</h2>
                        <p className="text-slate-500 mt-1">Based on your latest FemGuard clinical assessment.</p>
                    </div>
                    {latestAssessment && (
                        <Link to="/risk-assessment" className="btn-secondary mt-4 md:mt-0 text-sm py-2 px-5 flex items-center gap-1">
                            Retake Assessment <ChevronRight className="w-4 h-4" />
                        </Link>
                    )}
                 </div>

                 {latestAssessment ? (
                     <div className="flex flex-wrap justify-center md:justify-around gap-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/50">
                        <CircularProgress score={latestAssessment.pcos_score || 0} maxScore={16} label="PCOS Risk" color="text-primary" delay={0.2} />
                        <CircularProgress score={latestAssessment.metabolic_score || 0} maxScore={20} label="Metabolic Risk" color="text-accent" delay={0.4} />
                        <CircularProgress score={latestAssessment.infertility_score || 0} maxScore={18} label="Infertility Risk" color="text-secondary" delay={0.6} />
                     </div>
                 ) : (
                     <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                         <HeartPulse className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                         <h3 className="text-lg font-bold mb-2">No data available</h3>
                         <p className="text-slate-500 mb-6 max-w-sm mx-auto">Complete your first clinical assessment to unlock your personalized health metrics.</p>
                         <Link to="/risk-assessment" className="btn-primary shadow-glow">Start Assessment</Link>
                     </div>
                 )}
            </motion.div>

            {/* Bottom Grid: Tracker CTA & Timeline */}
            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Tracker Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
                    <div className="glass-panel p-8 h-full flex flex-col relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent dark:from-secondary/10 z-0"></div>
                        
                        <div className="relative z-10 flex-grow">
                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center mb-6">
                                <CalendarHeart className="w-6 h-6 text-secondary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Ovulation Tracker</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                {cycles.length > 0
                                    ? `Your next period is projected to begin around ${new Date(cycles[0].next_period_date).toLocaleDateString()}.`
                                    : "Pinpoint your fertile windows mathematically and seamlessly track your ongoing cycles with our smart calendar."}
                            </p>
                        </div>

                        <Link to="/tracker" className="btn-secondary w-full text-center flex items-center justify-center gap-2 group relative z-10 border-secondary/20 hover:border-secondary transition-colors">
                            Open Calendar <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>

                {/* Activity Timeline */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
                    <div className="glass-panel p-8 h-full">
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2"><Activity className="w-6 h-6 text-accent" /> Activity Timeline</h3>
                        
                        {assessments.length === 0 && cycles.length === 0 ? (
                             <p className="text-slate-500 text-center py-12 italic">Your timeline is quiet. Start logging to see magic happen.</p>
                        ) : (
                            <div className="relative pl-6 space-y-8 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                                
                                {assessments.map((a, idx) => (
                                    <div key={`a-${idx}`} className="relative pl-6">
                                        <div className="absolute left-[-29px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-primary z-10 box-content"></div>
                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-800 dark:text-white">Clinical Assessment Logged</h4>
                                                <span className="text-xs text-slate-500 font-medium">{new Date(a.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {/* Risk Badges */}
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${a.pcos_category.includes('Low') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                                                    PCOS: {a.pcos_category}
                                                </span>
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${a.metabolic_category.includes('Low') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                                                    Metabolic: {a.metabolic_category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {cycles.map((c, idx) => (
                                    <div key={`c-${idx}`} className="relative pl-6">
                                        <div className="absolute left-[-29px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-secondary z-10 box-content"></div>
                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">Period Logged</h4>
                                                <span className="text-xs text-slate-500 font-medium">{new Date(c.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Start date: {new Date(c.last_period_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                                
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
