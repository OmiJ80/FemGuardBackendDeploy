import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RiskAssessment from './pages/RiskAssessment';
import OvulationTracker from './pages/OvulationTracker';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    return children;
};


const PremiumRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    if (!user.is_premium && user.role !== 'admin') return <Navigate to="/dashboard" />;
    return children;
};

function AppControls() {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob animation-delay-2000"></div>

            <Navbar />

            <main className="flex-grow pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-12 w-full">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/risk-assessment" element={<ProtectedRoute><RiskAssessment /></ProtectedRoute>} />
                    <Route path="/tracker" element={<PremiumRoute><OvulationTracker /></PremiumRoute>} />

                </Routes>
            </main>

            <Footer />
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppControls />
            </AuthProvider>
        </Router>
    );
}

export default App;
