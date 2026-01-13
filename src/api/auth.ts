import api, { setAccessToken, setRefreshToken, clearTokens } from './axios';
import { ApiResponse, LoginRequest, LoginResponse, TokenResponse, RefreshTokenRequest } from './types';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);

        if (response.data.isSuccess) {
            const { accessToken, refreshToken } = response.data.data;
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
        }

        return response.data;
    },

    refresh: async (refreshToken: string): Promise<ApiResponse<TokenResponse>> => {
        const response = await api.post<ApiResponse<TokenResponse>>('/auth/refresh', {
            refreshToken,
        } as RefreshTokenRequest);

        if (response.data.isSuccess) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            setAccessToken(accessToken);
            setRefreshToken(newRefreshToken);
        }

        return response.data;
    },

    logout: async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } finally {
            clearTokens();
        }
    },
};

export default authApi;
