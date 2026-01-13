import React, { ReactNode } from 'react';
import { Box, Container, Paper, Typography, useTheme } from '@mui/material';

interface AuthLayoutProps {
    children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.palette.mode === 'light'
                    ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`
                    : `linear-gradient(135deg, #0D0D14 0%, #1A1A2E 50%, #252542 100%)`,
                p: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={theme.palette.mode === 'light' ? 8 : 2}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 4,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: theme.palette.mode === 'light'
                            ? 'rgba(255, 255, 255, 0.95)'
                            : 'rgba(26, 26, 46, 0.95)',
                    }}
                >
                    {/* Logo */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 4,
                        }}
                    >
                        <Box
                            component="img"
                            src="/logo.jpg"
                            alt="PlayStock"
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 3,
                                objectFit: 'cover',
                                mb: 2,
                                boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
                            }}
                        />
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            PlayStock
                        </Typography>
                    </Box>

                    {children}
                </Paper>
            </Container>
        </Box>
    );
};

export default AuthLayout;
