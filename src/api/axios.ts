import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, TokenResponse } from './types';
import i18n from '@/locales/i18n';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Token storage (in memory for access token)
let accessToken: string | null = null;

// Get/Set access token
export const getAccessToken = () => accessToken;
export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

// Refresh token storage (localStorage temporarily, will move to httpOnly cookie)
export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const setRefreshToken = (token: string | null) => {
    if (token) {
        localStorage.setItem('refreshToken', token);
    } else {
        localStorage.removeItem('refreshToken');
    }
};

// Clear all tokens
export const clearTokens = () => {
    accessToken = null;
    localStorage.removeItem('refreshToken');
};

// Token refresh state
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else if (token) {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add authorization header if token exists
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Add language header
        if (config.headers) {
            config.headers['Accept-Language'] = i18n.language || 'en';
        }

        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue the request while refreshing
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            resolve(api(originalRequest));
                        },
                        reject: (err: Error) => {
                            reject(err);
                        },
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                isRefreshing = false;
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const response = await axios.post<ApiResponse<TokenResponse>>(
                    `${API_BASE_URL}/auth/refresh`,
                    { refreshToken },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.data.isSuccess) {
                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
                        response.data.data;

                    setAccessToken(newAccessToken);
                    setRefreshToken(newRefreshToken);

                    processQueue(null, newAccessToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }

                    return api(originalRequest);
                } else {
                    throw new Error('Token refresh failed');
                }
            } catch (refreshError) {
                processQueue(refreshError as Error, null);
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
