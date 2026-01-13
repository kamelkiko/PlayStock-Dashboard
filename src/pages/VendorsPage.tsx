import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vendorsApi } from '@/api';
import { Vendor } from '@/api/types';
import { vendorSchema, VendorFormData } from '@/schemas';
import { useNotification } from '@/contexts/NotificationContext';

export const VendorsPage: React.FC = () => {
    const { t } = useTranslation();
    const { showNotification } = useNotification();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewingVendor, setViewingVendor] = useState<Vendor | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<VendorFormData>({
        resolver: zodResolver(vendorSchema),
        defaultValues: { code: '', name: '', phone: '', notes: '' },
    });

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const response = await vendorsApi.getAll();
            if (response.isSuccess) {
                setVendors(response.data);
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

    const onSubmit = async (data: VendorFormData) => {
        setSaving(true);
        try {
            const payload = {
                name: data.name,
                code: data.code,
                phone: data.phone || undefined,
                notes: data.notes || undefined,
            };

            const response = editingId
                ? await vendorsApi.update(editingId, payload)
                : await vendorsApi.create(payload);

            if (response.isSuccess) {
                if (editingId) {
                    setVendors(prev => prev.map(v => v.id === editingId ? response.data : v));
                    showNotification(t('vendors.updatedSuccessfully'), 'success');
                } else {
                    setVendors(prev => [...prev, response.data]);
                    showNotification(t('vendors.createdSuccessfully'), 'success');
                }
                handleCloseDialog();
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

    const handleEdit = (vendor: Vendor) => {
        setEditingId(vendor.id);
        reset({
            code: vendor.code,
            name: vendor.name,
            phone: vendor.phone || '',
            notes: vendor.notes || '',
        });
        setDialogOpen(true);
    };

    const handleView = (vendor: Vendor) => {
        setViewingVendor(vendor);
        setViewDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingId(null);
        reset({ code: '', name: '', phone: '', notes: '' });
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight={700}>
                    {t('vendors.title')}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setDialogOpen(true)}
                >
                    {t('vendors.addVendor')}
                </Button>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : vendors.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography color="text.secondary">{t('vendors.noVendors')}</Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('vendors.code')}</TableCell>
                                        <TableCell>{t('vendors.name')}</TableCell>
                                        <TableCell>{t('vendors.phone')}</TableCell>
                                        <TableCell>{t('vendors.notes')}</TableCell>
                                        <TableCell align="right">{t('common.actions')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {vendors.map(vendor => (
                                        <TableRow key={vendor.id} hover>
                                            <TableCell>{vendor.code}</TableCell>
                                            <TableCell>{vendor.name}</TableCell>
                                            <TableCell>{vendor.phone || '-'}</TableCell>
                                            <TableCell>{vendor.notes || '-'}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" onClick={() => handleView(vendor)}>
                                                    <ViewIcon />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleEdit(vendor)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Vendor Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{editingId ? t('vendors.editVendor') : t('vendors.addVendor')}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    {...register('code')}
                                    fullWidth
                                    label={t('vendors.code')}
                                    error={!!errors.code}
                                    helperText={errors.code ? t(errors.code.message as string) : ''}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    {...register('name')}
                                    fullWidth
                                    label={t('vendors.name')}
                                    error={!!errors.name}
                                    helperText={errors.name ? t(errors.name.message as string) : ''}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    {...register('phone')}
                                    fullWidth
                                    label={t('vendors.phone')}
                                    placeholder="01xxxxxxxxx"
                                    error={!!errors.phone}
                                    helperText={errors.phone ? t(errors.phone.message as string) : ''}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    {...register('notes')}
                                    fullWidth
                                    label={t('vendors.notes')}
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={handleCloseDialog} disabled={saving}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                            startIcon={saving ? <CircularProgress size={16} /> : null}
                        >
                            {editingId ? t('common.save') : t('common.create')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* View Vendor Dialog */}
            <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t('vendors.viewVendor')}</DialogTitle>
                <DialogContent>
                    {viewingVendor && (
                        <Box sx={{ pt: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('vendors.code')}:</strong> {viewingVendor.code}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('vendors.name')}:</strong> {viewingVendor.name}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('vendors.phone')}:</strong> {viewingVendor.phone || '-'}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('vendors.notes')}:</strong> {viewingVendor.notes || '-'}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialogOpen(false)}>{t('common.close')}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VendorsPage;
