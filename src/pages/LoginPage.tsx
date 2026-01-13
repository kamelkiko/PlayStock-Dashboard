import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Person as PersonIcon,
    Lock as LockIcon,
} from '@mui/icons-material';
import { AuthLayout } from '@/layouts';
import { useAuthStore } from '@/stores';
import { loginSchema, LoginFormData } from '@/schemas';

export const LoginPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Clear error on mount
    useEffect(() => {
        clearError();
    }, [clearError]);

    const onSubmit = async (data: LoginFormData) => {
        const success = await login(data.username, data.password);
        if (success) {
            navigate('/', { replace: true });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <AuthLayout>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    {t('auth.welcomeBack')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('auth.loginSubtitle')}
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
                    {t('auth.loginError')}
                </Alert>
            )}

            <Box component="form" onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit)(e);
            }} noValidate>
                <TextField
                    {...register('username')}
                    fullWidth
                    label={t('auth.username')}
                    autoComplete="username"
                    autoFocus
                    error={!!errors.username}
                    helperText={errors.username ? t(errors.username.message as string, { min: 3 }) : ''}
                    disabled={isLoading || isSubmitting}
                    sx={{ mb: 2.5 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    {...register('password')}
                    fullWidth
                    label={t('auth.password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password ? t(errors.password.message as string, { min: 6 }) : ''}
                    disabled={isLoading || isSubmitting}
                    sx={{ mb: 3 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading || isSubmitting}
                    sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                    }}
                >
                    {isLoading || isSubmitting ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} color="inherit" />
                            {t('auth.loggingIn')}
                        </Box>
                    ) : (
                        t('auth.loginButton')
                    )}
                </Button>
            </Box>
        </AuthLayout>
    );
};

export default LoginPage;
