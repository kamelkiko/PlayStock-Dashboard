import { create } from 'zustand';
import { User } from '@/api/types';
import { authApi, usersApi, getRefreshToken, clearTokens } from '@/api';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await authApi.login({ username, password });

            if (response.isSuccess) {
                set({
                    user: response.data.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
                return true;
            } else {
                set({
                    error: response.message || 'Login failed',
                    isLoading: false,
                });
                return false;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            set({
                error: errorMessage,
                isLoading: false,
            });
            return false;
        }
    },

    logout: async () => {
        set({ isLoading: true });

        try {
            await authApi.logout();
        } catch {
            // Even if logout fails on server, clear local state
        } finally {
            clearTokens();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        }
    },

    checkAuth: async () => {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
            return;
        }

        set({ isLoading: true });

        try {
            // Try to refresh the token first
            const tokenResponse = await authApi.refresh(refreshToken);

            if (tokenResponse.isSuccess) {
                // Get user profile
                const userResponse = await usersApi.getMe();

                if (userResponse.isSuccess) {
                    set({
                        user: userResponse.data,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    return;
                }
            }

            // If we get here, authentication failed
            clearTokens();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        } catch {
            clearTokens();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore;
