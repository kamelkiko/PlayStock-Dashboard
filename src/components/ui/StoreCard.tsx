import React from 'react';
import { Card, CardContent, Typography, Chip, Avatar, useTheme, alpha, Stack } from '@mui/material';
import { Store as StoreIcon } from '@mui/icons-material';

interface StoreCardProps {
    name: string;
    status: 'active' | 'inactive' | 'suspended';
    outletsCount: number;
    revenue: string;
    lastActivity: string;
    onClick?: () => void;
}

const statusColors = (theme: any, status: string) => {
    switch (status) {
        case 'active':
            return theme.palette.success.main;
        case 'inactive':
            return theme.palette.grey[500];
        case 'suspended':
            return theme.palette.warning.main;
        default:
            return theme.palette.text.secondary;
    }
};

export const StoreCard: React.FC<StoreCardProps> = ({ name, status, outletsCount, revenue, lastActivity, onClick }) => {
    const theme = useTheme();
    const bgColor = theme.palette.mode === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(26,26,46,0.85)';
    const borderColor = alpha(statusColors(theme, status), 0.2);

    return (
        <Card
            onClick={onClick}
            sx={{
                borderRadius: 3,
                background: bgColor,
                backdropFilter: 'blur(12px)',
                border: `1px solid ${borderColor}`,
                height: '100%',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                        <StoreIcon sx={{ color: theme.palette.primary.main }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} noWrap>
                        {name}
                    </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Chip
                        label={status.toUpperCase()}
                        size="small"
                        sx={{
                            bgcolor: alpha(statusColors(theme, status), 0.1),
                            color: statusColors(theme, status),
                            fontWeight: 600,
                            fontSize: 11,
                        }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        {outletsCount} outlets
                    </Typography>
                </Stack>

                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
                    {revenue}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Last activity: {lastActivity}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default StoreCard;
