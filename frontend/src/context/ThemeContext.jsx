import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Check local storage or system preference on initial load
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Remove old theme
        root.classList.remove('light', 'dark');
        
        // Add new theme
        root.classList.add(theme);
        
        // Save to local storage for persistence
        localStorage.setItem('theme', theme);
        
        // Also update HTML meta theme color for mobile Safari/Chrome
        const metaThemeColor = document.querySelector("meta[name=theme-color]");
        if (metaThemeColor) {
            metaThemeColor.setAttribute("content", theme === 'dark' ? '#020617' : '#F8FAFC');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
