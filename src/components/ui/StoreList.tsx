import React, { useEffect, useState } from 'react';
import { Box, Skeleton, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StoreCard } from './StoreCard';
import { storesApi } from '@/api';
import { useNotification } from '@/contexts/NotificationContext';
import { StoreUI } from '@/api/types';

export const StoreList: React.FC = () => {
    const { t } = useTranslation();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stores, setStores] = useState<StoreUI[]>([]);

    const fetchStores = async () => {
        setLoading(true);
        try {
            const res = await storesApi.getAll();
            if (res.isSuccess) {
                // Map API data to StoreUI interface (mock fields if missing)
                const data: StoreUI[] = res.data.map(item => ({
                    ...item,
                    revenue: (item as any).revenue ? `${(item as any).revenue} ج.م` : '—',
                    outletsCount: (item as any).outletsCount ?? 0,
                    lastActivity: (item as any).lastActivity ?? t('common.noData'),
                }));
                setStores(data);
            } else {
                showNotification(res.message, 'error');
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || t('errors.generic');
            showNotification(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                    gap: 3,
                }}
            >
                {Array.from({ length: 8 }).map((_, idx) => (
                    <Skeleton key={idx} variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
                ))}
            </Box>
        );
    }

    if (stores.length === 0) {
        return (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                    {t('stores.empty')}
                </Typography>
            </Stack>
        );
    }

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                gap: 3,
            }}
        >
            {stores.map(store => (
                <StoreCard
                    key={store.id}
                    name={store.name}
                    status={store.isActive ? 'active' : 'inactive'}
                    outletsCount={store.outletsCount ?? 0}
                    revenue={store.revenue ?? '—'}
                    lastActivity={store.lastActivity ?? t('common.noData')}
                    onClick={() => navigate(`/stores/${store.id}`)}
                />
            ))}
        </Box>
    );
};

export default StoreList;
