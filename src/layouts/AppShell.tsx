import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUIStore } from '@/stores';

/**
 * AppShell provides the overall layout: a collapsible sidebar, a sticky header, and a content area.
 * It handles responsive behavior: on mobile the sidebar becomes a temporary drawer.
 */
export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { sidebarOpen, sidebarCollapsed, sidebarWidth } = useUIStore();

    const drawerWidth = sidebarCollapsed ? 80 : sidebarWidth; // collapsed width

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            {/* Sidebar */}
            <Sidebar width={drawerWidth} open={sidebarOpen} isMobile={isMobile} />

            {/* Main area */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Header />
                {/* Content */}
                <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 2, overflow: 'auto' }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default AppShell;
