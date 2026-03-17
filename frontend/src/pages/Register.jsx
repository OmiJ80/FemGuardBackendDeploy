import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, ShieldAlert, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setIsLoading(true);
        const result = await register(formData.name, formData.email, formData.phone, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
            <motion.div 
                initial="hidden" animate="visible" variants={containerVariants}
                className="glass-panel w-full max-w-5xl flex flex-col md:flex-row overflow-hidden shadow-2xl"
            >
                {/* Visual Left Side */}
                <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-accent to-primary text-white md:w-5/12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-black opacity-10 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
                    
                    <h2 className="text-4xl font-extrabold mb-4 z-10 leading-tight">Start Your Journey.</h2>
                    <p className="text-white/80 z-10 text-lg mb-8">Join thousands of women taking control of their reproductive health with data-driven insights.</p>
                    
                    <ul className="space-y-4 z-10 text-white/90">
                        <li className="flex items-center gap-3"><div className="w-2 h-2 bg-white rounded-full"></div> 3-Module Risk Assessment</li>
                        <li className="flex items-center gap-3"><div className="w-2 h-2 bg-white rounded-full"></div> Smart Ovulation Tracking</li>
                        <li className="flex items-center gap-3"><div className="w-2 h-2 bg-white rounded-full"></div> Ayurvedic Diagnostics</li>
                    </ul>
                </div>

                {/* Form Right Side */}
                <div className="p-8 md:p-12 w-full md:w-7/12 flex flex-col justify-center bg-white dark:bg-slate-900">
                    <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">Create Account</h2>
                        <p className="text-slate-500 dark:text-slate-400">Enter your details to get started.</p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3 border border-red-100 dark:border-red-900/50"
                        >
                            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                            <span className="text-sm font-medium">{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text" name="name" required value={formData.name} onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Jane Doe"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email" name="email" required value={formData.email} onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="you@email.com"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password" name="password" required value={formData.password} onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" disabled={isLoading}
                            className={`btn-primary mt-6 md:col-span-2 w-full flex items-center justify-center gap-2 group ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        Already have an account? <Link to="/login" className="text-primary dark:text-primary-light hover:text-accent font-bold ml-1 transition-colors">Sign in</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
