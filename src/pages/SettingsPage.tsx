import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Switch,
    Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Person as PersonIcon,
    DarkMode as DarkModeIcon,
    Language as LanguageIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/stores';
import { useThemeMode } from '@/theme/ThemeProvider';

export const SettingsPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuthStore();
    const { isDark, toggleMode } = useThemeMode();

    const handleLanguageToggle = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                {t('settings.title')}
            </Typography>

            <Grid container spacing={3}>
                {/* Profile Section */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                {t('settings.profile')}
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Avatar
                                    sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}
                                    src={user?.profilePicture || undefined}
                                >
                                    {user?.name?.charAt(0) || 'U'}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{user?.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        @{user?.username}
                                    </Typography>
                                </Box>
                            </Box>

                            <List disablePadding>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={t('customers.email')}
                                        secondary={user?.email}
                                    />
                                </ListItem>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={t('customers.phone')}
                                        secondary={user?.phone}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Appearance Section */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                {t('settings.appearance')}
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            <List disablePadding>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemIcon>
                                        <DarkModeIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={t('settings.theme')}
                                        secondary={isDark ? t('settings.darkMode') : t('settings.lightMode')}
                                    />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            checked={isDark}
                                            onChange={toggleMode}
                                            color="primary"
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>

                                <ListItem sx={{ px: 0 }}>
                                    <ListItemIcon>
                                        <LanguageIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={t('settings.language')}
                                        secondary={i18n.language === 'en' ? 'English' : 'العربية'}
                                    />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            checked={i18n.language === 'ar'}
                                            onChange={handleLanguageToggle}
                                            color="primary"
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SettingsPage;
