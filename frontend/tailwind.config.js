/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable toggling dark mode manually
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563EB', // Blue-600 (from logo)
                    hover: '#1D4ED8',
                    light: '#DBEAFE',
                    dark: '#1E3A8A'
                },
                secondary: {
                    DEFAULT: '#3B82F6', // Blue-500 (keeping original secondary as a different blue)
                    hover: '#2563EB',
                    light: '#DBEAFE',
                    dark: '#1E3A8A'
                },
                accent: {
                    DEFAULT: '#22C55E', // Green-500 (from logo)
                    hover: '#16A34A',
                    light: '#DCFCE7',
                    dark: '#14532D'
                },
                surface: {
                    light: '#FFFFFF',
                    dark: '#0F172A',     // Slate-900 (Deep modern dark)
                    darkHover: '#1E293B',// Slate-800
                },
                background: {
                    light: '#F8FAFC',    // Slate-50 (Very light gray, modern SaaS look)
                    dark: '#020617',     // Slate-950 (Almost black)
                },
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 15px rgba(244, 63, 94, 0.3)',
                'glass-dark': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'pcos-gradient': 'linear-gradient(135deg, #F43F5E 0%, #8B5CF6 100%)',
            },
            animation: {
                'blob': 'blob 7s infinite',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
