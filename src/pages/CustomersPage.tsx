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
import { customersApi } from '@/api';
import { Customer } from '@/api/types';
import { customerSchema, CustomerFormData } from '@/schemas';
import { useNotification } from '@/contexts/NotificationContext';

export const CustomersPage: React.FC = () => {
    const { t } = useTranslation();
    const { showNotification } = useNotification();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: { code: '', name: '', phone: '', email: '', notes: '' },
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await customersApi.getAll();
            if (response.isSuccess) {
                setCustomers(response.data);
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

    const onSubmit = async (data: CustomerFormData) => {
        setSaving(true);
        try {
            const payload = {
                name: data.name,
                code: data.code,
                phone: data.phone || undefined,
                email: data.email || undefined,
                notes: data.notes || undefined,
            };

            const response = editingId
                ? await customersApi.update(editingId, payload)
                : await customersApi.create(payload);

            if (response.isSuccess) {
                if (editingId) {
                    setCustomers(prev => prev.map(c => c.id === editingId ? response.data : c));
                    showNotification(t('customers.updatedSuccessfully'), 'success');
                } else {
                    setCustomers(prev => [...prev, response.data]);
                    showNotification(t('customers.createdSuccessfully'), 'success');
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

    const handleEdit = (customer: Customer) => {
        setEditingId(customer.id);
        reset({
            code: customer.code,
            name: customer.name,
            phone: customer.phone || '',
            email: customer.email || '',
            notes: customer.notes || '',
        });
        setDialogOpen(true);
    };

    const handleView = (customer: Customer) => {
        setViewingCustomer(customer);
        setViewDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingId(null);
        reset({ code: '', name: '', phone: '', email: '', notes: '' });
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight={700}>
                    {t('customers.title')}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setDialogOpen(true)}
                >
                    {t('customers.addCustomer')}
                </Button>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : customers.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography color="text.secondary">{t('customers.noCustomers')}</Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('customers.code')}</TableCell>
                                        <TableCell>{t('customers.name')}</TableCell>
                                        <TableCell>{t('customers.phone')}</TableCell>
                                        <TableCell>{t('customers.email')}</TableCell>
                                        <TableCell align="right">{t('common.actions')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customers.map(customer => (
                                        <TableRow key={customer.id} hover>
                                            <TableCell>{customer.code}</TableCell>
                                            <TableCell>{customer.name}</TableCell>
                                            <TableCell>{customer.phone || '-'}</TableCell>
                                            <TableCell>{customer.email || '-'}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" onClick={() => handleView(customer)}>
                                                    <ViewIcon />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleEdit(customer)}>
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

            {/* Add/Edit Customer Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{editingId ? t('customers.editCustomer') : t('customers.addCustomer')}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    {...register('code')}
                                    fullWidth
                                    label={t('customers.code')}
                                    error={!!errors.code}
                                    helperText={errors.code ? t(errors.code.message as string) : ''}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    {...register('name')}
                                    fullWidth
                                    label={t('customers.name')}
                                    error={!!errors.name}
                                    helperText={errors.name ? t(errors.name.message as string) : ''}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    {...register('phone')}
                                    fullWidth
                                    label={t('customers.phone')}
                                    placeholder="01xxxxxxxxx"
                                    error={!!errors.phone}
                                    helperText={errors.phone ? t(errors.phone.message as string) : ''}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    {...register('email')}
                                    fullWidth
                                    label={t('customers.email')}
                                    error={!!errors.email}
                                    helperText={errors.email ? t(errors.email.message as string) : ''}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    {...register('notes')}
                                    fullWidth
                                    label={t('customers.notes')}
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

            {/* View Customer Dialog */}
            <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t('customers.viewCustomer')}</DialogTitle>
                <DialogContent>
                    {viewingCustomer && (
                        <Box sx={{ pt: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('customers.code')}:</strong> {viewingCustomer.code}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('customers.name')}:</strong> {viewingCustomer.name}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('customers.phone')}:</strong> {viewingCustomer.phone || '-'}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('customers.email')}:</strong> {viewingCustomer.email || '-'}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('customers.notes')}:</strong> {viewingCustomer.notes || '-'}
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

export default CustomersPage;
