import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center -mt-10 px-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-panel w-full max-w-4xl flex flex-col md:flex-row overflow-hidden shadow-2xl"
            >
                {/* Visual Left Side */}
                <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-primary to-accent text-white md:w-5/12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                    
                    <h2 className="text-4xl font-extrabold mb-4 z-10 leading-tight">Welcome Back to FemGuard</h2>
                    <p className="text-white/80 z-10 text-lg">Your personalized hub for proactive reproductive health & Ayurveda.</p>
                </div>

                {/* Form Right Side */}
                <div className="p-8 md:p-12 w-full md:w-7/12 flex flex-col justify-center bg-white dark:bg-slate-900">
                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">Sign In</h2>
                        <p className="text-slate-500 dark:text-slate-400">Enter your email and password to access your dashboard.</p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3 border border-red-100 dark:border-red-900/50"
                        >
                            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                            <span className="text-sm font-medium">{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="relative">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex justify-between items-center mb-1.5 pl-1 pr-1">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                    {/* Forgot password link */}
                                    <Link to="/forgot-password" className="text-xs text-primary hover:text-accent font-medium transition-colors">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`btn-primary mt-4 w-full flex items-center justify-center gap-2 group ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        Don't have an account? <Link to="/register" className="text-primary dark:text-primary-light hover:text-accent font-bold ml-1 transition-colors">Create one now</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
