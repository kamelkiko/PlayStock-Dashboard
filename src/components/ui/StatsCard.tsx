import React from 'react';
import { Card, CardContent, Typography, Box, alpha, useTheme } from '@mui/material';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    color: string;
    loading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, loading }) => {
    const theme = useTheme();
    return (
        <Card
            sx={{
                borderRadius: 12,
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s, boxShadow 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 24px ${alpha(color, 0.2)}` },
                boxShadow: theme.palette.mode === 'light' ? 3 : 6,
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        {loading ? (
                            <Box sx={{ width: 80, height: 40, bgcolor: alpha(theme.palette.text.secondary, 0.1) }} />
                        ) : (
                            <Typography variant="h4" fontWeight={700}>
                                {value}
                            </Typography>
                        )}
                    </Box>
                    {icon && (
                        <Box sx={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: alpha(color, 0.1), color }}>
                            {icon}
                        </Box>
                    )}
                </Box>
            </CardContent>
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${color} 0%, ${alpha(color, 0.3)} 100%)` }} />
        </Card>
    );
};

export default StatsCard;
