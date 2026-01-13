import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Skeleton, alpha, useTheme, Stack, Card, CardContent } from '@mui/material';
import { storesApi } from '@/api';
import { useNotification } from '@/contexts/NotificationContext';
import { Store } from '@/api/types';

/**
 * Store Details page – a business overview, not a CRUD page.
 * Shows KPI cards, activity timeline, and linked entities placeholders.
 */
const StoreDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const { showNotification } = useNotification();
    const theme = useTheme();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [store, setStore] = useState<Store | null>(null);

    const fetchStore = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await storesApi.getById(id);
            if (res.isSuccess) {
                setStore(res.data);
            } else {
                showNotification(res.message, 'error');
                navigate('/stores');
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || t('errors.generic');
            showNotification(msg, 'error');
            navigate('/stores');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStore();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={150} sx={{ borderRadius: 3 }} />
                ))}
            </Box>
        );
    }

    if (!store) {
        return null;
    }

    const kpis = [
        { title: t('stores.revenue'), value: '—', icon: '💰', color: theme.palette.primary.main },
        { title: t('stores.outlets'), value: '—', icon: '🏬', color: theme.palette.secondary.main },
        { title: t('stores.lastActivity'), value: t('common.noData'), icon: '⏱️', color: '#FF6B6B' },
        { title: t('stores.status'), value: store.isActive ? t('stores.active') : t('stores.inactive'), icon: '📍', color: store.isActive ? theme.palette.success.main : theme.palette.error.main },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    {store.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {store.description ?? t('stores.noDescription')}
                </Typography>
            </Box>

            {/* KPI Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                {kpis.map((kpi, idx) => (
                    <Card
                        key={idx}
                        sx={{
                            borderRadius: 3,
                            height: '100%',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 24px ${alpha(kpi.color, 0.2)}` },
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {kpi.title}
                                    </Typography>
                                    <Typography variant="h5" fontWeight={600}>
                                        {kpi.value}
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ opacity: 0.3 }}>
                                    {kpi.icon}
                                </Typography>
                            </Stack>
                        </CardContent>
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${kpi.color} 0%, ${alpha(kpi.color, 0.3)} 100%)` }} />
                    </Card>
                ))}
            </Box>

            {/* Activity Timeline (placeholder) */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    {t('stores.activityTimeline')}
                </Typography>
                <Box sx={{ p: 3, bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {t('stores.noActivity')}
                    </Typography>
                </Box>
            </Box>

            {/* Linked Entities (placeholder) */}
            <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    {t('stores.linkedEntities')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('stores.noLinkedData')}
                </Typography>
            </Box>
        </Box>
    );
};

export default StoreDetailsPage;
