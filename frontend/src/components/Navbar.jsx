import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, ShieldPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="px-6 py-4 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/50 dark:border-white/10 fixed w-full top-0 flex justify-between items-center z-50 transition-colors duration-300"
        >
            <Link to="/" className="flex items-center gap-3 group">
                <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-glow group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <ShieldPlus className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-[11px] font-bold text-slate-500/80 dark:text-slate-400/80 lowercase tracking-wider ml-0.5 group-hover:text-primary transition-colors duration-300">dkpl's</span>
                    <span className="text-2xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm group-hover:drop-shadow-md transition-all">
                        FemGuard
                    </span>
                </div>
            </Link>
            
            <div className="flex gap-4 items-center">
                
                {/* Theme Toggle Button */}
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    aria-label="Toggle Dark Mode"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="hidden md:flex items-center gap-6 border-l border-slate-200 dark:border-slate-700 pl-6 ml-2">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Dashboard</Link>

                            <button onClick={handleLogout} className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors ml-2">
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Log In</Link>
                            <Link to="/register" className="btn-primary py-2 px-5 text-sm shadow-glow">Start Free Trial</Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
