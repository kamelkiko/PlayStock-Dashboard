import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
    Pagination,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Switch,
    InputAdornment,
    Avatar,
    Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Edit as EditIcon, Save as SaveIcon, SportsEsports as GameIcon } from '@mui/icons-material';
import { gamesApi } from '@/api';
import { GamePriceDisplayWithGame } from '@/api/types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNotification } from '@/contexts/NotificationContext';

// Schema for price update
const priceSchema = z.object({
    priceFull: z.number().min(0).optional().nullable(),
    pricePrimaryPs4: z.number().min(0).optional().nullable(),
    pricePrimaryPs5: z.number().min(0).optional().nullable(),
    priceSecondary: z.number().min(0).optional().nullable(),
    priceOffline: z.number().min(0).optional().nullable(),
    isActive: z.boolean(),
    notes: z.string().optional().nullable(),
});

type PriceFormData = z.infer<typeof priceSchema>;

export const GamePricingPage: React.FC = () => {
    const { t } = useTranslation();
    const { showNotification } = useNotification();
    const [items, setItems] = useState<GamePriceDisplayWithGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingItem, setEditingItem] = useState<GamePriceDisplayWithGame | null>(null);
    const [saving, setSaving] = useState(false);

    const { control, register, handleSubmit, reset, formState: { errors } } = useForm<PriceFormData>({
        resolver: zodResolver(priceSchema),
    });

    useEffect(() => {
        fetchPrices();
    }, [page]);

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const response = await gamesApi.getStorePrices(page, 20);
            if (response.isSuccess) {
                setItems(response.data.items);
                setTotalPages(Math.ceil(response.data.total / 20));
            } else {
                showNotification(response.message, 'error');
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || t('errors.generic');
            showNotification(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (item: GamePriceDisplayWithGame) => {
        setEditingItem(item);
        reset({
            priceFull: item.priceFull,
            pricePrimaryPs4: item.pricePrimaryPs4,
            pricePrimaryPs5: item.pricePrimaryPs5,
            priceSecondary: item.priceSecondary,
            priceOffline: item.priceOffline,
            isActive: item.isActive,
            notes: item.notes,
        });
    };

    const handleCloseDialog = () => {
        setEditingItem(null);
        reset();
    };

    const onSubmit = async (data: PriceFormData) => {
        if (!editingItem) return;

        setSaving(true);
        try {
            const response = await gamesApi.updatePrice(editingItem.gameId, {
                ...data,
                priceFull: data.priceFull || 0,
            });

            if (response.isSuccess) {
                setItems(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item));
                handleCloseDialog();
                showNotification(t('gamePricing.priceUpdated'), 'success');
            } else {
                showNotification(response.message, 'error');
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || t('errors.generic');
            showNotification(message, 'error');
        } finally {
            setSaving(false);
        }
    };

    // Format price display
    const formatPrice = (price: number | null | undefined) => {
        if (price === null || price === undefined) return '-';
        return `${price.toFixed(0)} ج.م`;
    };

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    {t('gamePricing.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('gamePricing.subtitle')}
                </Typography>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : items.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">{t('common.noData')}</Typography>
                        </Box>
                    ) : (
                        <>
                            <TableContainer component={Paper} elevation={0}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>{t('gamePricing.game')}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>{t('gamePricing.full')}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>PS4</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>PS5</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>{t('gamePricing.sec')}</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 600 }}>{t('common.active')}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map(item => (
                                            <TableRow key={item.id} hover>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        {item.gameCoverImage ? (
                                                            <Avatar
                                                                src={item.gameCoverImage}
                                                                variant="rounded"
                                                                sx={{ width: 48, height: 48 }}
                                                            />
                                                        ) : (
                                                            <Avatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: 'grey.700' }}>
                                                                <GameIcon />
                                                            </Avatar>
                                                        )}
                                                        <Box>
                                                            <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ maxWidth: 200 }}>
                                                                {item.gameName}
                                                            </Typography>
                                                            <Chip
                                                                label={item.gamePlatform}
                                                                size="small"
                                                                color={item.gamePlatform === 'PS5' ? 'primary' : 'secondary'}
                                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">{formatPrice(item.priceFull)}</TableCell>
                                                <TableCell align="right">{formatPrice(item.pricePrimaryPs4)}</TableCell>
                                                <TableCell align="right">{formatPrice(item.pricePrimaryPs5)}</TableCell>
                                                <TableCell align="right">{formatPrice(item.priceSecondary)}</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={item.isActive ? t('common.yes') : t('common.no')}
                                                        size="small"
                                                        color={item.isActive ? 'success' : 'default'}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="small" onClick={() => handleEditClick(item)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={(_, v) => setPage(v)}
                                        color="primary"
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editingItem} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {editingItem?.gameCoverImage && (
                            <Avatar
                                src={editingItem.gameCoverImage}
                                variant="rounded"
                                sx={{ width: 56, height: 56 }}
                            />
                        )}
                        <Box>
                            <Typography variant="h6">{editingItem?.gameName}</Typography>
                            <Chip
                                label={editingItem?.gamePlatform}
                                size="small"
                                color="primary"
                            />
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    {...register('priceFull', { valueAsNumber: true })}
                                    fullWidth
                                    label={t('gamePricing.fullPrice')}
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">ج.م</InputAdornment>,
                                        inputProps: { min: 0 }
                                    }}
                                    error={!!errors.priceFull}
                                    helperText={errors.priceFull?.message}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    {...register('priceSecondary', { valueAsNumber: true })}
                                    fullWidth
                                    label={t('gamePricing.secondary')}
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">ج.م</InputAdornment>,
                                        inputProps: { min: 0 }
                                    }}
                                    error={!!errors.priceSecondary}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    {...register('pricePrimaryPs4', { valueAsNumber: true })}
                                    fullWidth
                                    label={t('gamePricing.ps4Primary')}
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">ج.م</InputAdornment>,
                                        inputProps: { min: 0 }
                                    }}
                                    error={!!errors.pricePrimaryPs4}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    {...register('pricePrimaryPs5', { valueAsNumber: true })}
                                    fullWidth
                                    label={t('gamePricing.ps5Primary')}
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">ج.م</InputAdornment>,
                                        inputProps: { min: 0 }
                                    }}
                                    error={!!errors.pricePrimaryPs5}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    {...register('priceOffline', { valueAsNumber: true })}
                                    fullWidth
                                    label={t('gamePricing.offline')}
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">ج.م</InputAdornment>,
                                        inputProps: { min: 0 }
                                    }}
                                    error={!!errors.priceOffline}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={<Switch {...field} checked={field.value} />}
                                            label={t('common.active')}
                                            sx={{ mt: 1 }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    {...register('notes')}
                                    fullWidth
                                    label={t('gamePricing.notes')}
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                            startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                        >
                            {t('common.save')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default GamePricingPage;
