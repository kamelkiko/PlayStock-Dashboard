import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Drawer, List, ListItemButton, ListItemIcon, Tooltip, useTheme, alpha } from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Store as StoreIcon,
    Storefront as StorefrontIcon,
    People as PeopleIcon,
    Inventory as InventoryIcon,
    SportsEsports as GamesIcon,
    AttachMoney as PricingIcon,
    Settings as SettingsIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useUIStore } from '@/stores';

interface SidebarProps {
    width: number;
    open: boolean;
    isMobile: boolean;
}

const navItems = [
    { key: 'dashboard', icon: <DashboardIcon />, path: '/' },
    { key: 'stores', icon: <StoreIcon />, path: '/stores' },
    { key: 'outlets', icon: <StorefrontIcon />, path: '/outlets' },
    { key: 'vendors', icon: <InventoryIcon />, path: '/vendors' },
    { key: 'customers', icon: <PeopleIcon />, path: '/customers' },
    { key: 'games', icon: <GamesIcon />, path: '/games' },
    { key: 'gamePricing', icon: <PricingIcon />, path: '/game-pricing' },
    { key: 'settings', icon: <SettingsIcon />, path: '/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ width, open, isMobile }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { sidebarCollapsed, toggleSidebarCollapsed, setSidebarOpen } = useUIStore();
    const isRTL = theme.direction === 'rtl';

    const handleNav = (path: string) => {
        navigate(path);
        if (isMobile) setSidebarOpen(false);
    };

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 2, px: 1, backgroundColor: 'transparent' }}>
            {/* Collapse toggle */}
            <Box sx={{ display: 'flex', justifyContent: sidebarCollapsed ? 'center' : 'flex-end', mb: 2 }}>
                <ListItemButton onClick={toggleSidebarCollapsed} sx={{ minWidth: 40, borderRadius: 2, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) } }}>
                    {sidebarCollapsed ? (isRTL ? <ChevronLeftIcon /> : <ChevronRightIcon />) : (isRTL ? <ChevronRightIcon /> : <ChevronLeftIcon />)}
                </ListItemButton>
            </Box>
            <List sx={{ flexGrow: 1 }}>
                {navItems.map(item => {
                    const active = location.pathname === item.path;
                    return (
                        <Tooltip key={item.key} title={sidebarCollapsed ? t(`nav.${item.key}`) : ''} placement={isRTL ? 'right' : 'left'} arrow>
                            <ListItemButton
                                onClick={() => handleNav(item.path)}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                                    px: 2,
                                    borderRadius: 2,
                                    position: 'relative',
                                    '&:before': {
                                        content: "''",
                                        position: 'absolute',
                                        left: sidebarCollapsed ? 'auto' : 0,
                                        right: sidebarCollapsed ? 0 : 'auto',
                                        top: 8,
                                        bottom: 8,
                                        width: 4,
                                        bgcolor: active ? theme.palette.primary.main : 'transparent',
                                        borderRadius: 2,
                                    },
                                    bgcolor: active ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 0, mr: sidebarCollapsed ? 0 : 2, justifyContent: 'center', color: active ? theme.palette.primary.main : 'text.secondary' }}>
                                    {item.icon}
                                </ListItemIcon>
                                {!sidebarCollapsed && (
                                    <Box component="span" sx={{ color: active ? theme.palette.primary.main : 'text.primary', fontWeight: active ? 600 : 400 }}>
                                        {t(`nav.${item.key}`)}
                                    </Box>
                                )}
                            </ListItemButton>
                        </Tooltip>
                    );
                })}
            </List>
        </Box>
    );

    if (isMobile) {
        return (
            <Drawer
                variant="temporary"
                anchor={isRTL ? 'right' : 'left'}
                open={open}
                onClose={() => setSidebarOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box' } }}
            >
                {drawerContent}
            </Drawer>
        );
    }

    return (
        <Drawer
            variant="permanent"
            anchor={isRTL ? 'right' : 'left'}
            sx={{
                width,
                flexShrink: 0,
                '& .MuiDrawer-paper': { width, boxSizing: 'border-box', borderRight: isRTL ? 'none' : `1px solid ${theme.palette.divider}` },
            }}
        >
            {drawerContent}
        </Drawer>
    );
};

export default Sidebar;
