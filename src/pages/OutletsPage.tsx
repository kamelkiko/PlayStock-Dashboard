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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Store as StoreIcon,
    Language as OnlineIcon,
} from '@mui/icons-material';
import { outletsApi } from '@/api';
import { Outlet, OutletType } from '@/api/types';
import { useNotification } from '@/contexts/NotificationContext';

// Local form state interface (different from API schema)
interface OutletFormState {
    code: string;
    name: string;
    type: OutletType;
    address: string;
    googleMapsUrl: string;
    phones: string; // Comma-separated for form
    whatsApps: string; // Comma-separated for form
}

const defaultFormState: OutletFormState = {
    code: '',
    name: '',
    type: 'PHYSICAL',
    address: '',
    googleMapsUrl: '',
    phones: '',
    whatsApps: '',
};

export const OutletsPage: React.FC = () => {
    const { t } = useTranslation();
    const { showNotification } = useNotification();
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewingOutlet, setViewingOutlet] = useState<Outlet | null>(null);
    const [formData, setFormData] = useState<OutletFormState>(defaultFormState);
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof OutletFormState, string>>>({});

    useEffect(() => {
        fetchOutlets();
    }, []);

    const fetchOutlets = async () => {
        setLoading(true);
        try {
            const response = await outletsApi.getAll();
            if (response.isSuccess) {
                setOutlets(response.data);
            } else {
                if (response.code === 400 && response.message.includes('store')) {
                    showNotification(t('outlets.createStoreFirst'), 'warning');
                } else {
                    showNotification(response.message, 'error');
                }
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || t('errors.generic');
            showNotification(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<Record<keyof OutletFormState, string>> = {};

        if (!formData.code || formData.code.length < 3) {
            errors.code = t('validation.required.code');
        }
        if (!formData.name || formData.name.length < 3) {
            errors.name = t('validation.required.name');
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSaving(true);
        try {
            const payload = {
                code: formData.code,
                name: formData.name,
                type: formData.type,
                address: formData.address || undefined,
                googleMapsUrl: formData.googleMapsUrl || undefined,
                phones: formData.phones
                    ? formData.phones.split(',').map(p => p.trim()).filter(Boolean)
                    : undefined,
                whatsApps: formData.whatsApps
                    ? formData.whatsApps.split(',').map(w => w.trim()).filter(Boolean)
                    : undefined,
            };

            const response = editingId
                ? await outletsApi.update(editingId, payload)
                : await outletsApi.create(payload);

            if (response.isSuccess) {
                if (editingId) {
                    setOutlets(prev => prev.map(o => o.id === editingId ? response.data : o));
                    showNotification(t('outlets.updatedSuccessfully'), 'success');
                } else {
                    setOutlets(prev => [...prev, response.data]);
                    showNotification(t('outlets.createdSuccessfully'), 'success');
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

    const handleEdit = (outlet: Outlet) => {
        setEditingId(outlet.id);
        setFormData({
            code: outlet.code,
            name: outlet.name,
            type: outlet.type,
            address: outlet.address || '',
            googleMapsUrl: outlet.googleMapsUrl || '',
            phones: outlet.phones?.join(', ') || '',
            whatsApps: outlet.whatsApps?.join(', ') || '',
        });
        setFormErrors({});
        setDialogOpen(true);
    };

    const handleView = (outlet: Outlet) => {
        setViewingOutlet(outlet);
        setViewDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingId(null);
        setFormData(defaultFormState);
        setFormErrors({});
    };

    const handleInputChange = (field: keyof OutletFormState, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight={700}>
                    {t('outlets.title')}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setDialogOpen(true)}
                >
                    {t('outlets.addOutlet')}
                </Button>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : outlets.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography color="text.secondary">{t('outlets.noOutlets')}</Typography>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => setDialogOpen(true)}
                                sx={{ mt: 2 }}
                            >
                                {t('outlets.addOutlet')}
                            </Button>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('outlets.code')}</TableCell>
                                        <TableCell>{t('outlets.name')}</TableCell>
                                        <TableCell>{t('outlets.type')}</TableCell>
                                        <TableCell>{t('outlets.address')}</TableCell>
                                        <TableCell>{t('outlets.status')}</TableCell>
                                        <TableCell align="right">{t('common.actions')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {outlets.map(outlet => (
                                        <TableRow key={outlet.id} hover>
                                            <TableCell>{outlet.code}</TableCell>
                                            <TableCell>{outlet.name}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={outlet.type === 'PHYSICAL' ? <StoreIcon /> : <OnlineIcon />}
                                                    label={t(`outlets.${outlet.type.toLowerCase()}`)}
                                                    size="small"
                                                    color={outlet.type === 'PHYSICAL' ? 'primary' : 'secondary'}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>{outlet.address || '-'}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={outlet.isActive ? t('common.active') : t('common.inactive')}
                                                    size="small"
                                                    color={outlet.isActive ? 'success' : 'default'}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" onClick={() => handleView(outlet)}>
                                                    <ViewIcon />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleEdit(outlet)}>
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

            {/* Add/Edit Outlet Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>{editingId ? t('outlets.editOutlet') : t('outlets.addOutlet')}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label={t('outlets.code')}
                                    value={formData.code}
                                    onChange={(e) => handleInputChange('code', e.target.value)}
                                    error={!!formErrors.code}
                                    helperText={formErrors.code}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label={t('outlets.name')}
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    error={!!formErrors.name}
                                    helperText={formErrors.name}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth>
                                    <InputLabel>{t('outlets.type')}</InputLabel>
                                    <Select
                                        value={formData.type}
                                        label={t('outlets.type')}
                                        onChange={(e) => handleInputChange('type', e.target.value)}
                                    >
                                        <MenuItem value="PHYSICAL">{t('outlets.physical')}</MenuItem>
                                        <MenuItem value="ONLINE">{t('outlets.online')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label={t('outlets.address')}
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label={t('outlets.googleMapsUrl')}
                                    value={formData.googleMapsUrl}
                                    onChange={(e) => handleInputChange('googleMapsUrl', e.target.value)}
                                    placeholder="https://maps.google.com/..."
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label={t('outlets.phones')}
                                    value={formData.phones}
                                    onChange={(e) => handleInputChange('phones', e.target.value)}
                                    placeholder="01xx, 01yy"
                                    helperText={t('outlets.phonesHelp')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label={t('outlets.whatsApps')}
                                    value={formData.whatsApps}
                                    onChange={(e) => handleInputChange('whatsApps', e.target.value)}
                                    placeholder="01xx, 01yy"
                                    helperText={t('outlets.whatsAppsHelp')}
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

            {/* View Outlet Dialog */}
            <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t('outlets.viewOutlet')}</DialogTitle>
                <DialogContent>
                    {viewingOutlet && (
                        <Box sx={{ pt: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('outlets.code')}:</strong> {viewingOutlet.code}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('outlets.name')}:</strong> {viewingOutlet.name}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('outlets.type')}:</strong> {t(`outlets.${viewingOutlet.type.toLowerCase()}`)}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('outlets.address')}:</strong> {viewingOutlet.address || '-'}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('outlets.phones')}:</strong> {viewingOutlet.phones?.join(', ') || '-'}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('outlets.whatsApps')}:</strong> {viewingOutlet.whatsApps?.join(', ') || '-'}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>{t('outlets.status')}:</strong> {viewingOutlet.isActive ? t('common.active') : t('common.inactive')}
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

export default OutletsPage;
