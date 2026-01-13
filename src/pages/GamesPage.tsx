import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    InputAdornment,
    Chip,
    CircularProgress,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Stack,
    Divider,
    Alert,
    IconButton,
    Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Search as SearchIcon,
    AttachMoney as MoneyIcon,
    Save as SaveIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { gamesApi } from '@/api';
import { Game, GameFilterRequest, GamePriceDisplay } from '@/api/types';
import { useNotification } from '@/contexts/NotificationContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Pricing Schema - at least one price required
const priceSchema = z.object({
    priceFull: z.number().min(0).optional().nullable(),
    pricePrimaryPs4: z.number().min(0).optional().nullable(),
    pricePrimaryPs5: z.number().min(0).optional().nullable(),
    priceSecondary: z.number().min(0).optional().nullable(),
    priceOffline: z.number().min(0).optional().nullable(),
}).refine(data => {
    // At least one price must be provided
    return data.priceFull || data.pricePrimaryPs4 || data.pricePrimaryPs5 || data.priceSecondary || data.priceOffline;
}, { message: 'gamePricing.atLeastOneRequired' });

type PriceFormData = z.infer<typeof priceSchema>;

export const GamesPage: React.FC = () => {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    // Game Data State
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filter & Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [platform, setPlatform] = useState<string>('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');

    // Dialog State
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTab, setDialogTab] = useState(0);
    const [currentPrice, setCurrentPrice] = useState<GamePriceDisplay | null>(null);
    const [priceLoading, setPriceLoading] = useState(false);
    const [savingPrice, setSavingPrice] = useState(false);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PriceFormData>({
        resolver: zodResolver(priceSchema),
        defaultValues: {
            priceFull: null,
            pricePrimaryPs4: null,
            pricePrimaryPs5: null,
            priceSecondary: null,
            priceOffline: null,
        }
    });

    const fetchGames = useCallback(async () => {
        setLoading(true);
        try {
            const filters: GameFilterRequest = {
                name: searchQuery || undefined,
                platform: platform ? platform as any : undefined,
                sortField,
                sortDirection,
            };
            const response = await gamesApi.getAll(page, 20, filters);
            if (response.isSuccess) {
                setGames(response.data.items);
                setTotalPages(Math.ceil(response.data.total / 20));
            } else {
                showNotification(response.message, 'error');
                setGames([]);
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || t('errors.generic');
            showNotification(message, 'error');
            setGames([]);
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery, platform, sortField, sortDirection, showNotification, t]);

    useEffect(() => {
        fetchGames();
    }, [fetchGames]);

    const handleSearch = () => {
        setPage(1);
        fetchGames();
    };

    const handleGameClick = async (game: Game) => {
        setSelectedGame(game);
        setDialogOpen(true);
        setDialogTab(0);
        setPriceLoading(true);
        reset(); // Reset form first

        try {
            const response = await gamesApi.getPrice(game.id);
            if (response.isSuccess && response.data) {
                setCurrentPrice(response.data);
                // Populate form with existing prices
                setValue('priceFull', response.data.priceFull ?? null);
                setValue('pricePrimaryPs4', response.data.pricePrimaryPs4 ?? null);
                setValue('pricePrimaryPs5', response.data.pricePrimaryPs5 ?? null);
                setValue('priceSecondary', response.data.priceSecondary ?? null);
                setValue('priceOffline', response.data.priceOffline ?? null);
            } else {
                setCurrentPrice(null);
            }
        } catch {
            setCurrentPrice(null);
        } finally {
            setPriceLoading(false);
        }
    };

    const handleSavePrice = async (data: PriceFormData) => {
        if (!selectedGame) return;
        setSavingPrice(true);
        try {
            const payload = {
                priceFull: data.priceFull || undefined,
                pricePrimaryPs4: data.pricePrimaryPs4 || undefined,
                pricePrimaryPs5: data.pricePrimaryPs5 || undefined,
                priceSecondary: data.priceSecondary || undefined,
                priceOffline: data.priceOffline || undefined,
                isActive: true,
            };

            let response;
            if (currentPrice) {
                response = await gamesApi.updatePrice(selectedGame.id, payload);
            } else {
                response = await gamesApi.setPrice(selectedGame.id, payload);
            }

            if (response.isSuccess) {
                showNotification(t('gamePricing.savedSuccessfully'), 'success');
                setCurrentPrice(response.data);
            } else {
                showNotification(response.message, 'error');
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || t('errors.generic');
            showNotification(message, 'error');
        } finally {
            setSavingPrice(false);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedGame(null);
        setCurrentPrice(null);
        reset();
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight={700}>
                    {t('games.title')}
                </Typography>
                <Tooltip title={t('common.refresh')}>
                    <IconButton onClick={fetchGames} disabled={loading} color="primary">
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder={t('games.searchGames')}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>{t('games.platform')}</InputLabel>
                                <Select
                                    value={platform}
                                    label={t('games.platform')}
                                    onChange={(e) => { setPlatform(e.target.value); setPage(1); }}
                                >
                                    <MenuItem value="">{t('games.allPlatforms')}</MenuItem>
                                    <MenuItem value="PS4">PS4</MenuItem>
                                    <MenuItem value="PS5">PS5</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>{t('common.sortBy')}</InputLabel>
                                <Select
                                    value={sortField}
                                    label={t('common.sortBy')}
                                    onChange={(e) => setSortField(e.target.value)}
                                >
                                    <MenuItem value="name">{t('games.name')}</MenuItem>
                                    <MenuItem value="releaseDate">{t('games.releaseDate')}</MenuItem>
                                    <MenuItem value="price">{t('games.price')}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>{t('common.direction')}</InputLabel>
                                <Select
                                    value={sortDirection}
                                    label={t('common.direction')}
                                    onChange={(e) => setSortDirection(e.target.value as 'ASC' | 'DESC')}
                                >
                                    <MenuItem value="ASC">{t('common.ascending')}</MenuItem>
                                    <MenuItem value="DESC">{t('common.descending')}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                            <Button variant="contained" onClick={handleSearch} fullWidth>
                                {t('common.search')}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Games Grid */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : games.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                        <Typography color="text.secondary">{t('games.noGames')}</Typography>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {games.map(game => (
                            <Grid key={game.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <Card
                                    onClick={() => handleGameClick(game)}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            height: 200,
                                            backgroundColor: 'grey.800',
                                            backgroundImage: game.coverImage ? `url(${game.coverImage})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {!game.coverImage && (
                                            <Typography color="grey.500">No Image</Typography>
                                        )}
                                    </CardMedia>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                                            <Chip
                                                label={game.platform}
                                                size="small"
                                                color={game.platform === 'PS5' ? 'primary' : 'secondary'}
                                            />
                                        </Box>
                                        <Typography variant="subtitle1" fontWeight={600} noWrap title={game.name}>
                                            {game.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {game.publisher || '-'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}
                </>
            )}

            {/* Game Details & Pricing Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {selectedGame?.coverImage && (
                        <Box
                            component="img"
                            src={selectedGame.coverImage}
                            sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'cover' }}
                        />
                    )}
                    <Box>
                        <Typography variant="h6">{selectedGame?.name}</Typography>
                        <Chip label={selectedGame?.platform} size="small" color="primary" />
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        <Tabs value={dialogTab} onChange={(_, v) => setDialogTab(v)}>
                            <Tab label={t('games.details')} />
                            <Tab label={t('games.addPrice')} icon={<MoneyIcon />} iconPosition="start" />
                        </Tabs>
                    </Box>

                    {/* Details Tab */}
                    {dialogTab === 0 && selectedGame && (
                        <Stack spacing={2}>
                            <Divider />
                            <Typography><strong>{t('games.publisher')}:</strong> {selectedGame.publisher || '-'}</Typography>
                            <Typography><strong>{t('games.releaseDate')}:</strong> {selectedGame.releaseDate || '-'}</Typography>
                            <Typography><strong>{t('games.originalPrice')}:</strong> {selectedGame.price ? `${selectedGame.price} ج.م` : '-'}</Typography>
                            <Typography><strong>{t('games.rating')}:</strong> {selectedGame.rating || '-'}</Typography>
                            {selectedGame.genres && selectedGame.genres.length > 0 && (
                                <Box>
                                    <Typography fontWeight={600} gutterBottom>{t('games.genres')}:</Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {selectedGame.genres.map(g => <Chip key={g} label={g} size="small" variant="outlined" />)}
                                    </Box>
                                </Box>
                            )}
                            <Divider />
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {selectedGame.gameUrl && (
                                    <Button
                                        variant="outlined"
                                        href={selectedGame.gameUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {t('games.visitWebsite')}
                                    </Button>
                                )}
                                <Button variant="contained" startIcon={<MoneyIcon />} onClick={() => setDialogTab(1)}>
                                    {currentPrice ? t('games.editPrice') : t('games.addPrice')}
                                </Button>
                            </Box>
                        </Stack>
                    )}

                    {/* Pricing Tab */}
                    {dialogTab === 1 && (
                        <Box component="form" onSubmit={handleSubmit(handleSavePrice)}>
                            {priceLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <Stack spacing={3}>
                                    <Alert severity={currentPrice ? 'success' : 'info'}>
                                        {currentPrice
                                            ? t('gamePricing.existingPriceInfo')
                                            : t('gamePricing.enterPricesBelow')}
                                    </Alert>

                                    {errors.root && (
                                        <Alert severity="error">{t(errors.root.message || '')}</Alert>
                                    )}

                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                {...register('priceFull', { valueAsNumber: true })}
                                                fullWidth
                                                label={t('gamePricing.fullPrice')}
                                                type="number"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">ج.م</InputAdornment>,
                                                    inputProps: { min: 0, step: 0.01 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                {...register('priceSecondary', { valueAsNumber: true })}
                                                fullWidth
                                                label={t('gamePricing.secondary')}
                                                type="number"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">ج.م</InputAdornment>,
                                                    inputProps: { min: 0, step: 0.01 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                {...register('pricePrimaryPs4', { valueAsNumber: true })}
                                                fullWidth
                                                label={t('gamePricing.ps4Primary')}
                                                type="number"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">ج.م</InputAdornment>,
                                                    inputProps: { min: 0, step: 0.01 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                {...register('pricePrimaryPs5', { valueAsNumber: true })}
                                                fullWidth
                                                label={t('gamePricing.ps5Primary')}
                                                type="number"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">ج.م</InputAdornment>,
                                                    inputProps: { min: 0, step: 0.01 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                {...register('priceOffline', { valueAsNumber: true })}
                                                fullWidth
                                                label={t('gamePricing.offline')}
                                                type="number"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">ج.م</InputAdornment>,
                                                    inputProps: { min: 0, step: 0.01 }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        startIcon={savingPrice ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                        disabled={savingPrice}
                                        fullWidth
                                    >
                                        {savingPrice ? t('common.saving') : t('common.save')}
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog}>{t('common.close')}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GamesPage;
