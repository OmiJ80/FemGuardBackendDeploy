import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Crown, Activity, Download, Search, LayoutDashboard, Settings, Bell, Filter, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
    const { user } = useAuth();
    const [usersList, setUsersList] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const usersPerPage = 5;

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [usersRes, statsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/stats')
            ]);
            setUsersList(usersRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error("Error fetching admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadReports = async () => {
        try {
            const response = await api.get('/admin/reports/download', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'anonymized_risk_reports.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error downloading report", error);
        }
    };

    // Table Filtering & Pagination Logic
    const filteredUsers = useMemo(() => {
        let result = usersList;
        if (searchTerm) {
            result = result.filter(u => 
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return result;
    }, [usersList, searchTerm]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Chart Data Preparation (Colors updated for SaaS Theme)
    const riskCategories = stats.map(s => s.risk_category);
    const riskCounts = stats.map(s => s.count);
    
    // Using Theme colors: Rose, Violet, Blue, Emerald
    const getChartColor = (cat) => {
        if (cat === 'High' || cat === 'Very High' || cat.includes('Kapha-Vata')) return { bg: 'rgba(244, 63, 94, 0.8)', border: '#F43F5E' }; // Rose 500
        if (cat === 'Moderate' || cat.includes('Kapha-Medo')) return { bg: 'rgba(139, 92, 246, 0.8)', border: '#8B5CF6' }; // Violet 500
        return { bg: 'rgba(16, 185, 129, 0.8)', border: '#10B981' }; // Emerald 500
    };

    const bgColors = riskCategories.map(cat => getChartColor(cat).bg);
    const borderColors = riskCategories.map(cat => getChartColor(cat).border);

    const barChartData = {
        labels: riskCategories.length ? riskCategories : ['No Data'],
        datasets: [{
            label: 'Assessments',
            data: riskCounts.length ? riskCounts : [0],
            backgroundColor: bgColors.length ? bgColors : ['#E2E8F0'],
            borderColor: borderColors.length ? borderColors : ['#CBD5E1'],
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.6,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#F8FAFC',
                bodyColor: '#F8FAFC',
                padding: 12,
                cornerRadius: 8,
            }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } }
        }
    };

    if (loading) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-[#020617]">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading Workspace...</p>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#020617] -mt-20 pt-20 overflow-hidden relative">
            
            {/* Sidebar Toggle (Mobile) */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden absolute top-24 left-4 z-50 p-2 bg-white dark:bg-slate-900 rounded-md shadow-md"
            >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Admin Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside 
                        initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                        className="w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col absolute lg:relative z-40"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800/50">
                            <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">FemGuard Admin</h2>
                            <p className="text-xs text-slate-500 mt-1 font-medium">v2.0 Workspace</p>
                        </div>
                        
                        <nav className="flex-1 p-4 space-y-2">
                            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold transition-colors">
                                <LayoutDashboard className="w-5 h-5" /> Dashboard
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <Users className="w-5 h-5" /> Users
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <Activity className="w-5 h-5" /> Analytics
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <Settings className="w-5 h-5" /> Settings
                            </a>
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto w-full p-4 lg:p-8 scroll-smooth">
                {/* Topbar */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pt-4 lg:pt-0">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Overview</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Here's what's happening on your platform today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
                        </button>
                        <button onClick={downloadReports} className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 shadow-glow">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>
                </header>

                {/* KPI Cards Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Total Users KPI */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Users className="w-24 h-24" /></div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center"><Users className="w-6 h-6" /></div>
                            <h3 className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs">Total Users</h3>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white">{usersList.length}</h2>
                        <p className="text-sm text-emerald-500 font-medium mt-2 flex items-center gap-1">+12% this month</p>
                    </motion.div>

                    {/* Reserved for future metric */}

                    {/* Assessments Done KPI */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6 relative overflow-hidden group sm:col-span-2 lg:col-span-1">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Activity className="w-24 h-24" /></div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center"><Activity className="w-6 h-6" /></div>
                            <h3 className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs">Assessments Run</h3>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white">{riskCounts.reduce((a, b) => a + b, 0)}</h2>
                        <p className="text-sm text-emerald-500 font-medium mt-2 flex items-center gap-1">Data-rich profiles built</p>
                    </motion.div>
                </div>

                {/* Main Content Grid: Charts & Tables */}
                <div className="grid lg:grid-cols-3 gap-6 mb-12">
                    
                    {/* Activity Chart */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="lg:col-span-1 glass-panel p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">PCOS Risk Distribution</h3>
                        <div className="h-64 relative w-full">
                            <Bar data={barChartData} options={chartOptions} />
                        </div>
                    </motion.div>

                    {/* Advanced Data Table */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="lg:col-span-2 glass-panel flex flex-col overflow-hidden">
                        
                        {/* Table Header Controls */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap">User Directory</h3>
                            
                            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                                {/* Search */}
                                <div className="relative flex-1 sm:flex-none">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text" placeholder="Search users..." 
                                        value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                        className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-white/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">User</th>
                                        <th className="px-6 py-4 font-semibold">Contact</th>
                                        <th className="px-6 py-4 font-semibold">Subscription</th>
                                        <th className="px-6 py-4 font-semibold">Joined Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {currentUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex justify-center items-center text-white font-bold text-xs uppercase shadow-sm">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-slate-900 dark:text-white">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                <div className="flex flex-col">
                                                    <span>{u.email}</span>
                                                    <span className="text-xs text-slate-400">{u.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm">Active Member</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                                {new Date(u.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))}
                                    {currentUsers.length === 0 && (
                                        <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">No users match your filters.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredUsers.length === 0 ? 0 : indexOfFirstUser + 1}</span> to <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredUsers.length}</span> users
                            </span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}
                                    className="p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}
                                    className="p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
