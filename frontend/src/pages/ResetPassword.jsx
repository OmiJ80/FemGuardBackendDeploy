import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldAlert, CheckCircle, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }
        if (password.length < 6) {
            return setError('Password must be at least 6 characters.');
        }

        setIsLoading(true);
        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3500);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired reset link. Please request a new one.');
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
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Password Reset!</h2>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                                Your password has been updated successfully.
                            </p>
                            <p className="text-sm text-slate-400">Redirecting you to Sign In...</p>
                        </motion.div>
                    ) : (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-5">
                                    <Lock className="w-7 h-7 text-accent" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">Set New Password</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    Create a strong, memorable password for your FemGuard account.
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
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'} required value={password}
                                            onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters"
                                            className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="password" required value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit" disabled={isLoading}
                                    className={`btn-primary w-full flex items-center justify-center gap-2 mt-2 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {isLoading ? 'Updating...' : 'Reset Password'}
                                </button>

                                <p className="text-center text-sm text-slate-500">
                                    Link expired? <Link to="/forgot-password" className="text-primary font-semibold hover:text-accent transition-colors">Request a new one</Link>
                                </p>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
