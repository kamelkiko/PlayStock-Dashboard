import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Switch,
    FormControlLabel,
    IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { storesApi } from '@/api';
import { Store } from '@/api/types';
import { storeSchema, StoreFormData } from '@/schemas';
import { useNotification } from '@/contexts/NotificationContext';

export const StoresPage: React.FC = () => {
    const { t } = useTranslation();
    const { showNotification } = useNotification();
    const [store, setStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Social links as array for easier form management
    const [socialLinksArray, setSocialLinksArray] = useState<Array<{ platform: string; url: string }>>([]);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<StoreFormData>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            code: '',
            name: '',
            description: '',
            logo: '',
            socialLinks: {},
            isActive: true,
        },
    });

    useEffect(() => {
        fetchStore();
    }, []);

    const fetchStore = async () => {
        setLoading(true);
        try {
            const response = await storesApi.getMyStore();
            if (response.isSuccess) {
                setStore(response.data);
                // Convert social links object to array
                const linksArray = Object.entries(response.data.socialLinks || {}).map(([platform, url]) => ({
                    platform,
                    url: url as string,
                }));
                setSocialLinksArray(linksArray);
            } else {
                if (response.code === 404 || response.message === "This operation requires the user to have a store") {
                    setStore(null);
                    setIsEditing(true);
                    setSocialLinksArray([]);
                    reset({
                        code: '',
                        name: '',
                        description: '',
                        logo: '',
                        socialLinks: {},
                        isActive: true,
                    });
                } else {
                    showNotification(response.message, 'error');
                }
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                setStore(null);
                setIsEditing(true);
                setSocialLinksArray([]);
                reset({
                    code: '',
                    name: '',
                    description: '',
                    logo: '',
                    socialLinks: {},
                    isActive: true,
                });
            } else {
                const message = err.response?.data?.message || err.message || t('errors.generic');
                showNotification(message, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (store) {
            reset({
                code: store.code,
                name: store.name,
                description: store.description || '',
                logo: store.logo,
                socialLinks: store.socialLinks,
                isActive: store.isActive,
            });
            const linksArray = Object.entries(store.socialLinks || {}).map(([platform, url]) => ({
                platform,
                url,
            }));
            setSocialLinksArray(linksArray);
        }
    }, [store, reset]);

    const onSubmit = async (data: StoreFormData) => {
        setSaving(true);
        try {
            // Convert social links array back to object
            const socialLinksObj: Record<string, string> = {};
            socialLinksArray.forEach(link => {
                if (link.platform.trim() && link.url.trim()) {
                    socialLinksObj[link.platform.trim()] = link.url.trim();
                }
            });

            let response;
            if (store) {
                response = await storesApi.update(store.id, {
                    code: data.code,
                    name: data.name,
                    description: data.description,
                    logo: data.logo,
                    socialLinks: socialLinksObj,
                    isActive: data.isActive,
                });
            } else {
                response = await storesApi.create({
                    code: data.code,
                    name: data.name,
                    description: data.description,
                    logo: data.logo,
                    socialLinks: socialLinksObj,
                });
            }

            if (response.isSuccess) {
                setStore(response.data);
                setIsEditing(false);
                showNotification(store ? t('stores.updatedSuccessfully') : t('stores.createdSuccessfully'), 'success');
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

    const handleCancel = () => {
        setIsEditing(false);
        if (store) {
            reset({
                code: store.code,
                name: store.name,
                description: store.description || '',
                logo: store.logo,
                socialLinks: store.socialLinks,
                isActive: store.isActive,
            });
            const linksArray = Object.entries(store.socialLinks || {}).map(([platform, url]) => ({
                platform,
                url,
            }));
            setSocialLinksArray(linksArray);
        }
    };

    const addSocialLink = () => {
        setSocialLinksArray(prev => [...prev, { platform: '', url: '' }]);
    };

    const removeSocialLink = (index: number) => {
        setSocialLinksArray(prev => prev.filter((_, i) => i !== index));
    };

    const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
        setSocialLinksArray(prev => prev.map((link, i) => i === index ? { ...link, [field]: value } : link));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        {t('stores.myStore')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('stores.storeInfo')}
                    </Typography>
                </Box>

                {!isEditing && store && (
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => setIsEditing(true)}
                    >
                        {t('common.edit')}
                    </Button>
                )}
            </Box>

            {(store || isEditing) && (
                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        {...register('code')}
                                        fullWidth
                                        label={t('stores.code')}
                                        disabled={!isEditing}
                                        error={!!errors.code}
                                        helperText={errors.code ? t(errors.code.message as string) : ''}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        {...register('name')}
                                        fullWidth
                                        label={t('stores.name')}
                                        disabled={!isEditing}
                                        error={!!errors.name}
                                        helperText={errors.name ? t(errors.name.message as string) : ''}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        {...register('description')}
                                        fullWidth
                                        label={t('stores.description')}
                                        multiline
                                        rows={3}
                                        disabled={!isEditing}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name="isActive"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        {...field}
                                                        checked={field.value ?? true}
                                                        disabled={!isEditing}
                                                        color="primary"
                                                    />
                                                }
                                                label={field.value ? t('common.active') : t('common.inactive')}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Social Links Section */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {t('stores.socialLinks')}
                                        </Typography>
                                        {isEditing && (
                                            <Button
                                                size="small"
                                                startIcon={<AddIcon />}
                                                onClick={addSocialLink}
                                            >
                                                {t('stores.addSocialLink')}
                                            </Button>
                                        )}
                                    </Box>

                                    {socialLinksArray.length === 0 && !isEditing && (
                                        <Typography variant="body2" color="text.secondary">
                                            {t('stores.noSocialLinks')}
                                        </Typography>
                                    )}

                                    {/* View mode - chips */}
                                    {!isEditing && socialLinksArray.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {socialLinksArray.map((link, index) => (
                                                <Chip
                                                    key={index}
                                                    label={link.platform}
                                                    component="a"
                                                    href={link.url}
                                                    target="_blank"
                                                    clickable
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    )}

                                    {/* Edit mode - form fields */}
                                    {isEditing && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {socialLinksArray.map((link, index) => (
                                                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                    <TextField
                                                        size="small"
                                                        label={t('stores.platform')}
                                                        value={link.platform}
                                                        onChange={e => updateSocialLink(index, 'platform', e.target.value)}
                                                        placeholder="Facebook"
                                                        sx={{ width: 150 }}
                                                    />
                                                    <TextField
                                                        size="small"
                                                        label={t('stores.link')}
                                                        value={link.url}
                                                        onChange={e => updateSocialLink(index, 'url', e.target.value)}
                                                        placeholder="https://facebook.com/yourpage"
                                                        sx={{ flex: 1 }}
                                                    />
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => removeSocialLink(index)}
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                            {socialLinksArray.length === 0 && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {t('stores.clickAddToAddLinks')}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Grid>

                                {isEditing && (
                                    <Grid size={{ xs: 12 }}>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<CancelIcon />}
                                                onClick={handleCancel}
                                                disabled={saving}
                                            >
                                                {t('common.cancel')}
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                                                disabled={saving}
                                            >
                                                {t('common.save')}
                                            </Button>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default StoresPage;
