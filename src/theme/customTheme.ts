import { createTheme, ThemeOptions, alpha } from '@mui/material/styles';

// Extracted from PlayStock logo (assumed colors)
const brand = {
    primary: '#7B2CBF', // deep purple
    secondary: '#00D4FF', // vibrant cyan
    accent: '#FF6B6B', // accent red for alerts
};

// Spacing base (8px)
const spacing = 8;

const baseOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
    palette: {
        mode,
        primary: { main: brand.primary },
        secondary: { main: brand.secondary },
        background: {
            default: mode === 'light' ? '#F5F7FA' : '#0D0D14',
            paper: mode === 'light' ? '#FFFFFF' : '#1A1A2E',
        },
        text: {
            primary: mode === 'light' ? '#1A1A2E' : '#FFFFFF',
            secondary: mode === 'light' ? '#666687' : '#A0A0B0',
        },
        error: { main: '#F44336' },
        warning: { main: '#FF9800' },
        success: { main: '#4CAF50' },
        info: { main: '#2196F3' },
    },
    shape: { borderRadius: 12 }, // cards > inputs > buttons hierarchy later
    spacing,
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 },
        h2: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.3 },
        h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.4 },
        h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
        h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.5 },
        h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
        body1: { fontSize: '1rem', lineHeight: 1.6 },
        body2: { fontSize: '0.875rem', lineHeight: 1.6 },
        button: { textTransform: 'none', fontWeight: 600 },
        caption: { fontSize: '0.75rem' },
    },
    components: {
        // Global CSS baseline for smooth fonts & scrollbars
        MuiCssBaseline: {
            styleOverrides: {
                '*': { boxSizing: 'border-box' },
                html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
                body: { margin: 0, padding: 0, fontFamily: "'Inter', 'Roboto', sans-serif" },
                // Custom scrollbar (thin, rounded)
                '*::-webkit-scrollbar': { width: '8px', height: '8px' },
                '*::-webkit-scrollbar-track': { background: 'transparent' },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha('#000', 0.2),
                    borderRadius: 4,
                    border: '2px solid transparent',
                    backgroundClip: 'content-box',
                },
            },
        },
        // Buttons with subtle elevation and hover lift
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
                },
                containedPrimary: {
                    background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
                    color: '#fff',
                    '&:hover': { background: `linear-gradient(135deg, ${brand.primary} 20%, ${brand.secondary} 80%)` },
                },
            },
        },
        // Cards with soft shadow and hover lift
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: mode === 'light' ? '0 4px 12px rgba(0,0,0,0.06)' : '0 4px 12px rgba(0,0,0,0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: mode === 'light' ? '0 12px 24px rgba(0,0,0,0.12)' : '0 12px 24px rgba(0,0,0,0.6)' },
                },
            },
        },
        // Inputs with floating labels (outlined variant)
        MuiTextField: {
            defaultProps: { variant: 'outlined', size: 'medium' },
            styleOverrides: {
                root: {
                    '& .MuiInputLabel-root': { top: '-6px', left: '12px', background: mode === 'light' ? '#fff' : '#1A1A2E', padding: '0 4px' },
                    '& .MuiOutlinedInput-root': { borderRadius: 8 },
                },
            },
        },
        // Table styling
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'light' ? '#F0F4F8' : '#1A1A2E',
                    '& .MuiTableCell-head': { fontWeight: 600, color: mode === 'light' ? '#1A1A2E' : '#FFFFFF' },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: mode === 'light' ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
                    '&:hover': { backgroundColor: alpha('#000', mode === 'light' ? 0.02 : 0.1) },
                },
            },
        },
        // Tooltip with subtle blur
        MuiTooltip: {
            styleOverrides: {
                tooltip: { backgroundColor: mode === 'light' ? '#333' : '#fff', color: mode === 'light' ? '#fff' : '#333', fontSize: '0.75rem', borderRadius: 6 },
            },
        },
        // Drawer (sidebar) custom width and backdrop blur
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(26,26,46,0.85)',
                    backdropFilter: 'blur(12px)',
                    borderRight: mode === 'light' ? '1px solid rgba(0,0,0,0.08)' : 'none',
                },
            },
        },
        // AppBar (header) glass effect
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(26,26,46,0.9)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: 'none',
                },
            },
        },
    },
});

export const lightTheme = createTheme(baseOptions('light'));
export const darkTheme = createTheme(baseOptions('dark'));
export { brand };
