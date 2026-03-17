import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldAlert, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-panel w-full max-w-md p-10 shadow-2xl"
            >
                {/* Back to Login */}
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors mb-8 -ml-1 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Sign In
                </Link>

                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Check Your Inbox!</h2>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                                If an account with <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span> exists, we've sent a password reset link. It expires in 1 hour.
                            </p>
                            <Link to="/login" className="btn-primary w-full text-center block">
                                Return to Sign In
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                                    <Mail className="w-7 h-7 text-primary" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">Forgot Password?</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                    No worries! Enter the email you registered with and we'll send you a link to reset your password.
                                </p>
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
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit" disabled={isLoading}
                                    className={`btn-primary w-full flex items-center justify-center gap-2 mt-2 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
