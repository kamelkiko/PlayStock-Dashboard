import { createTheme, ThemeOptions, alpha } from '@mui/material/styles';

// PlayStock Brand Colors (derived from logo)
const brandColors = {
    primary: {
        main: '#7B5CF5', // Refined purple from logo
        light: '#9B7EFC',
        dark: '#5A3DD4',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#00D4E6', // Cyan accent from logo
        light: '#33DDFF',
        dark: '#00A8B8',
        contrastText: '#000000',
    },
    accent: {
        magenta: '#D946EF',
        pink: '#F472B6',
        violet: '#8B5CF6',
    },
    // Semantic surfaces
    navy: '#0F0F14',
    surface: '#1A1A22',
    lavender: '#F5F3FF',
};

// Common theme options
const getBaseThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
    palette: {
        mode,
        primary: brandColors.primary,
        secondary: brandColors.secondary,
        ...(mode === 'light'
            ? {
                background: {
                    default: '#FAFBFC',
                    paper: '#FFFFFF',
                },
                text: {
                    primary: '#0F0F14',
                    secondary: '#64748B',
                },
                divider: 'rgba(0, 0, 0, 0.06)',
            }
            : {
                background: {
                    default: brandColors.navy,
                    paper: brandColors.surface,
                },
                text: {
                    primary: '#F8FAFC',
                    secondary: '#94A3B8',
                },
                divider: 'rgba(255, 255, 255, 0.06)',
            }),
        error: {
            main: '#EF4444',
            light: '#F87171',
            dark: '#DC2626',
        },
        warning: {
            main: '#F59E0B',
            light: '#FBBF24',
            dark: '#D97706',
        },
        success: {
            main: '#10B981',
            light: '#34D399',
            dark: '#059669',
        },
        info: {
            main: '#3B82F6',
            light: '#60A5FA',
            dark: '#2563EB',
        },
    },
    typography: {
        fontFamily: '"Inter", "Cairo", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        h1: {
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.125rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '0.875rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '0.9375rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.8125rem',
            lineHeight: 1.6,
        },
        caption: {
            fontSize: '0.75rem',
            lineHeight: 1.5,
            color: mode === 'light' ? '#64748B' : '#94A3B8',
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
        },
    },
    shape: {
        borderRadius: 8,
    },
    spacing: 8,
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '*': {
                    boxSizing: 'border-box',
                },
                html: {
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                },
                body: {
                    scrollBehavior: 'smooth',
                },
                // Custom scrollbar
                '::-webkit-scrollbar': {
                    width: '6px',
                    height: '6px',
                },
                '::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '::-webkit-scrollbar-thumb': {
                    background: mode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)',
                    borderRadius: '3px',
                },
                '::-webkit-scrollbar-thumb:hover': {
                    background: mode === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.25)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    boxShadow: 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        boxShadow: 'none',
                        transform: 'translateY(-1px)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                },
                containedPrimary: {
                    background: brandColors.primary.main,
                    '&:hover': {
                        background: brandColors.primary.dark,
                    },
                },
                outlined: {
                    borderWidth: 1.5,
                    '&:hover': {
                        borderWidth: 1.5,
                        backgroundColor: alpha(brandColors.primary.main, 0.04),
                    },
                },
                text: {
                    '&:hover': {
                        backgroundColor: alpha(brandColors.primary.main, 0.06),
                    },
                },
            },
            defaultProps: {
                disableElevation: true,
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: mode === 'light'
                        ? '1px solid rgba(0, 0, 0, 0.05)'
                        : '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: mode === 'light'
                        ? '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
                        : 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        boxShadow: mode === 'light'
                            ? '0 4px 12px rgba(0, 0, 0, 0.08)'
                            : '0 4px 12px rgba(0, 0, 0, 0.4)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 2,
                        },
                    },
                },
            },
            defaultProps: {
                variant: 'outlined',
                size: 'small',
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: mode === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: mode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                    },
                },
                input: {
                    fontSize: '0.875rem',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                },
                colorPrimary: {
                    backgroundColor: alpha(brandColors.primary.main, 0.1),
                    color: brandColors.primary.main,
                    '&:hover': {
                        backgroundColor: alpha(brandColors.primary.main, 0.16),
                    },
                },
                colorSecondary: {
                    backgroundColor: alpha(brandColors.secondary.main, 0.1),
                    color: brandColors.secondary.dark,
                },
                colorSuccess: {
                    backgroundColor: alpha('#10B981', 0.1),
                    color: '#059669',
                },
                colorError: {
                    backgroundColor: alpha('#EF4444', 0.1),
                    color: '#DC2626',
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    backgroundColor: mode === 'light' ? '#1E293B' : '#334155',
                    padding: '6px 12px',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                    boxShadow: mode === 'light'
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRadius: 0,
                    backgroundColor: mode === 'light' ? '#FFFFFF' : brandColors.surface,
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-head': {
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: mode === 'light' ? '#64748B' : '#94A3B8',
                        backgroundColor: mode === 'light' ? '#F8FAFC' : brandColors.navy,
                        borderBottom: mode === 'light'
                            ? '1px solid rgba(0,0,0,0.06)'
                            : '1px solid rgba(255,255,255,0.06)',
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    transition: 'background-color 0.15s ease',
                    '&:hover': {
                        backgroundColor: mode === 'light'
                            ? alpha(brandColors.primary.main, 0.02)
                            : alpha(brandColors.primary.main, 0.04),
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '12px 16px',
                    fontSize: '0.875rem',
                    borderBottom: mode === 'light'
                        ? '1px solid rgba(0, 0, 0, 0.04)'
                        : '1px solid rgba(255, 255, 255, 0.04)',
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: brandColors.primary.main,
                    fontWeight: 600,
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    margin: '2px 8px',
                    padding: '10px 12px',
                    transition: 'all 0.15s ease',
                    '&.Mui-selected': {
                        backgroundColor: alpha(brandColors.primary.main, 0.08),
                        '&:hover': {
                            backgroundColor: alpha(brandColors.primary.main, 0.12),
                        },
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 3,
                            height: '60%',
                            borderRadius: '0 2px 2px 0',
                            backgroundColor: brandColors.primary.main,
                        },
                    },
                    '&:hover': {
                        backgroundColor: mode === 'light'
                            ? 'rgba(0,0,0,0.04)'
                            : 'rgba(255,255,255,0.04)',
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontSize: '0.875rem',
                },
                standardSuccess: {
                    backgroundColor: alpha('#10B981', 0.1),
                    color: '#059669',
                },
                standardError: {
                    backgroundColor: alpha('#EF4444', 0.1),
                    color: '#DC2626',
                },
                standardWarning: {
                    backgroundColor: alpha('#F59E0B', 0.1),
                    color: '#D97706',
                },
                standardInfo: {
                    backgroundColor: alpha('#3B82F6', 0.1),
                    color: '#2563EB',
                },
            },
        },
        MuiSkeleton: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                },
                rectangular: {
                    borderRadius: 8,
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: 'all 0.15s ease',
                    '&:hover': {
                        backgroundColor: mode === 'light'
                            ? 'rgba(0,0,0,0.04)'
                            : 'rgba(255,255,255,0.06)',
                    },
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 10,
                    boxShadow: mode === 'light'
                        ? '0 10px 40px rgba(0, 0, 0, 0.12)'
                        : '0 10px 40px rgba(0, 0, 0, 0.4)',
                    border: mode === 'light'
                        ? '1px solid rgba(0,0,0,0.05)'
                        : '1px solid rgba(255,255,255,0.08)',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: '0.875rem',
                    padding: '8px 16px',
                    borderRadius: 6,
                    margin: '2px 6px',
                    transition: 'all 0.15s ease',
                },
            },
        },
        MuiPagination: {
            styleOverrides: {
                root: {
                    '& .MuiPaginationItem-root': {
                        fontSize: '0.875rem',
                        '&.Mui-selected': {
                            backgroundColor: brandColors.primary.main,
                            color: '#FFFFFF',
                            '&:hover': {
                                backgroundColor: brandColors.primary.dark,
                            },
                        },
                    },
                },
            },
        },
    },
});

// Create light theme
export const lightTheme = createTheme(getBaseThemeOptions('light'));

// Create dark theme
export const darkTheme = createTheme(getBaseThemeOptions('dark'));

// Export brand colors for external use
export { brandColors };
