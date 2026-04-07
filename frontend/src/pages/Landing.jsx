import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, CalendarHeart, Sparkles } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="glass-panel p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
    >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-slate-800 dark:to-surface-dark flex items-center justify-center mb-6 shadow-sm border border-primary-200 dark:border-primary-900/30">
            <Icon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{desc}</p>
    </motion.div>
);

const Landing = () => {
    return (
        <div className="flex flex-col min-h-[80vh] overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 flex flex-col items-center justify-center text-center px-4 w-full">

                {/* Floating Elements Background */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <motion.div
                        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-20 left-[10%] w-64 h-64 bg-accent/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[60px]"
                    />
                    <motion.div
                        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-40 right-[15%] w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[60px]"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-surface-dark/80 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 backdrop-blur-md"
                >
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">The #1 Platform for Reproductive Women Health</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 max-w-4xl"
                >
                    Welcome To <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                        FEMGUARD Assesment
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed"
                >
                    FemGuard combines modern clinical assessment algorithms with Ayurvedic insights to deliver a personalized, proactive approach to asses PCOS, Metabolic Syndrome & Infertility.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Link to="/register" className="btn-primary text-lg px-8 py-4 shadow-xl w-full sm:w-auto min-w-[200px] text-center">
                        Start Free Trial
                    </Link>
                    <Link to="/login" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto min-w-[200px] text-center">
                        Returning User?
                    </Link>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-4 max-w-7xl mx-auto w-full relative z-10">


                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={ShieldCheck}
                        title="3-Module Screening"
                        desc="Advanced algorithmic breakdown of your PCOS, Metabolic, and Infertility risk factors using FemGuard criteria."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={CalendarHeart}
                        title="Smart Ovulation Tracking"
                        desc="Log cycles and precisely predict fertile windows using historical menstrual data and smart averages."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={Activity}
                        title="Ayurvedic Analytics"
                        desc="Unique synthesis of modern medicine with traditional Ayurvedic dosha imbalances and tailored lifestyle plans."
                        delay={0.3}
                    />
                </div>
            </section>

            {/* Simple Footer spacing block */}
            <div className="h-24"></div>
        </div>
    );
};

export default Landing;
