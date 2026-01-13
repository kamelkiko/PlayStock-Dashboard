import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import {
    ThemeProvider as MuiThemeProvider,
    CssBaseline,
    useMediaQuery,
} from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { useTranslation } from 'react-i18next';
import { lightTheme, darkTheme } from './theme';
import { isRTL } from '@/locales/i18n';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    toggleMode: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create RTL cache
const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

// Create LTR cache
const cacheLtr = createCache({
    key: 'muiltr',
    stylisPlugins: [prefixer],
});

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const { i18n } = useTranslation();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    // Get initial mode from localStorage or default to 'system'
    const [mode, setModeState] = useState<ThemeMode>(() => {
        const savedMode = localStorage.getItem('themeMode') as ThemeMode;
        return savedMode || 'system';
    });

    // Calculate actual dark/light based on mode
    const isDark = useMemo(() => {
        if (mode === 'system') {
            return prefersDarkMode;
        }
        return mode === 'dark';
    }, [mode, prefersDarkMode]);

    // Set mode and persist to localStorage
    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    // Toggle between light and dark
    const toggleMode = () => {
        setMode(isDark ? 'light' : 'dark');
    };

    // Get current language direction
    const direction = isRTL(i18n.language) ? 'rtl' : 'ltr';

    // Select appropriate cache based on direction
    const cache = direction === 'rtl' ? cacheRtl : cacheLtr;

    // Create theme with direction
    const theme = useMemo(() => {
        const baseTheme = isDark ? darkTheme : lightTheme;
        return {
            ...baseTheme,
            direction,
        };
    }, [isDark, direction]);

    // Update document direction
    useEffect(() => {
        document.dir = direction;
        document.documentElement.setAttribute('lang', i18n.language);
    }, [direction, i18n.language]);

    // Update body class for theme
    useEffect(() => {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${isDark ? 'dark' : 'light'}`);
    }, [isDark]);

    const contextValue = useMemo(
        () => ({
            mode,
            setMode,
            toggleMode,
            isDark,
        }),
        [mode, isDark]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            <CacheProvider value={cache}>
                <MuiThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </MuiThemeProvider>
            </CacheProvider>
        </ThemeContext.Provider>
    );
};

// Hook to use theme context
export const useThemeMode = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeMode must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeProvider;
