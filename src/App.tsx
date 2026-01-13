import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AppShell } from '@/layouts';
import { ProtectedRoute } from '@/features/auth';
import { useAuthStore } from '@/stores';
import '@/locales/i18n';

// Lazy load pages for code splitting
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const StoresPage = React.lazy(() => import('@/pages/StoresPage'));
const StoreDetailsPage = React.lazy(() => import('@/pages/StoreDetailsPage'));
const OutletsPage = React.lazy(() => import('@/pages/OutletsPage'));
const VendorsPage = React.lazy(() => import('@/pages/VendorsPage'));
const CustomersPage = React.lazy(() => import('@/pages/CustomersPage'));
const GamesPage = React.lazy(() => import('@/pages/GamesPage'));
const GamePricingPage = React.lazy(() => import('@/pages/GamePricingPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));

// Loading fallback component
const PageLoader: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
    }}
  >
    <CircularProgress />
  </Box>
);

// App routes component
const AppRoutes: React.FC = () => {
  const { checkAuth } = useAuthStore();

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell>
                <DashboardPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stores"
          element={
            <ProtectedRoute>
              <AppShell>
                <StoresPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stores/:id"
          element={
            <ProtectedRoute>
              <AppShell>
                <StoreDetailsPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/outlets"
          element={
            <ProtectedRoute>
              <AppShell>
                <OutletsPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors"
          element={
            <ProtectedRoute>
              <AppShell>
                <VendorsPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <AppShell>
                <CustomersPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/games"
          element={
            <ProtectedRoute>
              <AppShell>
                <GamesPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/game-pricing"
          element={
            <ProtectedRoute>
              <AppShell>
                <GamePricingPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppShell>
                <SettingsPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

import { NotificationProvider } from '@/contexts/NotificationContext';

// Main App component
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
