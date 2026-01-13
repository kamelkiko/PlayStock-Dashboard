import React from 'react';
import { AppBar, Toolbar, IconButton, Avatar, Box, Tooltip, Menu, MenuItem, useTheme, alpha } from '@mui/material';
import { Brightness4 as DarkIcon, Brightness7 as LightIcon, Language as LanguageIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/stores';

export const Header: React.FC = () => {
    const theme = useTheme();
    const { i18n, t } = useTranslation();
    const { toggleDarkMode, setLanguage } = useUIStore();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLanguageToggle = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
        setLanguage(newLang);
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                backgroundColor: theme.palette.mode === 'light' ? alpha('#fff', 0.9) : alpha('#1A1A2E', 0.9),
                backdropFilter: 'blur(12px)',
                boxShadow: 'none',
                borderBottom: theme.palette.divider,
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Left side: could hold a logo or title */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Placeholder for logo - could be replaced with actual image */}
                    <Box component="span" sx={{ fontWeight: 600, fontSize: '1.2rem', ml: 1 }}>
                        {t('app.title')}
                    </Box>
                </Box>
                {/* Right side: actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Theme toggle */}
                    <Tooltip title={theme.palette.mode === 'light' ? t('theme.dark') : t('theme.light')}>
                        <IconButton onClick={toggleDarkMode} color="inherit">
                            {theme.palette.mode === 'light' ? <DarkIcon /> : <LightIcon />}
                        </IconButton>
                    </Tooltip>
                    {/* Language switch */}
                    <Tooltip title={t('language.switch')}>
                        <IconButton onClick={handleLanguageToggle} color="inherit">
                            <LanguageIcon />
                        </IconButton>
                    </Tooltip>
                    {/* Profile menu */}
                    <Tooltip title={t('profile.menu')}>
                        <IconButton onClick={handleProfileClick} color="inherit">
                            <Avatar alt="User" src="/logo192.png" />
                        </IconButton>
                    </Tooltip>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                        <MenuItem>{t('profile.account')}</MenuItem>
                        <MenuItem>{t('profile.settings')}</MenuItem>
                        <MenuItem>{t('profile.logout')}</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
