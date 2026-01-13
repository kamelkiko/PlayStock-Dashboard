import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Skeleton,
    alpha,
    useTheme,
    IconButton,
    Tooltip,
    Stack,
} from '@mui/material';
import {
    People as PeopleIcon,
    Inventory as InventoryIcon,
    SportsEsports as GamesIcon,
    Storefront as StorefrontIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/stores';
import { customersApi, vendorsApi, gamesApi, outletsApi } from '@/api';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/contexts/NotificationContext';

/** Premium Stat Card component */
const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    loading?: boolean;
}> = ({ title, value, icon, color, loading }) => {
    return (
        <Card
            sx={{
                borderRadius: 3,
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px ${alpha(color, 0.2)}`,
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        {loading ? (
                            <Skeleton width={80} height={40} />
                        ) : (
                            <Typography variant="h4" fontWeight={700}>
                                {value}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: alpha(color, 0.1),
                            color: color,
                        }}
                    >
                        {icon}
                    </Box>
                </Stack>
            </CardContent>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${color} 0%, ${alpha(color, 0.3)} 100%)`,
                }}
            />
        </Card>
    );
};

export const DashboardPage: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ customers: 0, vendors: 0, gamePrices: 0, outlets: 0 });

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [custRes, vendRes, priceRes, outRes] = await Promise.all([
                customersApi.getAll(),
                vendorsApi.getAll(),
                gamesApi.getStorePrices(1, 1),
                outletsApi.getAll(),
            ]);
            setStats({
                customers: custRes.isSuccess ? custRes.data.length : 0,
                vendors: vendRes.isSuccess ? vendRes.data.length : 0,
                gamePrices: priceRes.isSuccess ? priceRes.data.total : 0,
                outlets: outRes.isSuccess ? outRes.data.length : 0,
            });
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || t('errors.generic');
            showNotification(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRefresh = () => {
        fetchStats();
        showNotification(t('dashboard.refreshing'), 'info');
    };

    const statCards = [
        { key: 'customers', title: t('dashboard.totalCustomers'), value: stats.customers, icon: <PeopleIcon sx={{ fontSize: 28 }} />, color: theme.palette.primary.main },
        { key: 'vendors', title: t('dashboard.totalVendors'), value: stats.vendors, icon: <InventoryIcon sx={{ fontSize: 28 }} />, color: theme.palette.secondary.main },
        { key: 'gamePrices', title: t('dashboard.totalGamePrices'), value: stats.gamePrices, icon: <GamesIcon sx={{ fontSize: 28 }} />, color: '#FF6B6B' },
        { key: 'outlets', title: t('dashboard.totalOutlets'), value: stats.outlets, icon: <StorefrontIcon sx={{ fontSize: 28 }} />, color: '#4CAF50' },
    ];

    const quickActions = [
        { label: t('customers.addCustomer'), path: '/customers', color: theme.palette.primary.main },
        { label: t('vendors.addVendor'), path: '/vendors', color: theme.palette.secondary.main },
        { label: t('games.browseGames'), path: '/games', color: '#FF6B6B' },
        { label: t('outlets.addOutlet'), path: '/outlets', color: '#4CAF50' },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        {t('dashboard.welcome', { name: user?.name || 'User' })}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {t('dashboard.overview')}
                    </Typography>
                </Box>
                <Tooltip title={t('common.refresh')}>
                    <IconButton onClick={handleRefresh} disabled={loading} color="primary" size="large">
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Stack>

            {/* Stats Grid */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                    gap: 3,
                    mb: 4,
                }}
            >
                {statCards.map(card => (
                    <StatCard key={card.key} title={card.title} value={card.value} icon={card.icon} color={card.color} loading={loading} />
                ))}
            </Box>

            {/* Quick Actions and Recent Activity */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 3,
                }}
            >
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {t('dashboard.quickActions')}
                        </Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            {quickActions.map(action => (
                                <Box
                                    key={action.path}
                                    onClick={() => navigate(action.path)}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: alpha(action.color, 0.08),
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        '&:hover': { backgroundColor: alpha(action.color, 0.15) },
                                    }}
                                >
                                    <Typography fontWeight={500}>{action.label}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {t('dashboard.recentActivity')}
                        </Typography>
                        <Stack alignItems="center" justifyContent="center" sx={{ py: 6, color: 'text.secondary' }}>
                            <Typography variant="body2">{t('common.noData')}</Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default DashboardPage;
