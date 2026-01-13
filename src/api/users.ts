import api from './axios';
import { ApiResponse, User } from './types';

export const usersApi = {
    getMe: async (): Promise<ApiResponse<User>> => {
        const response = await api.get<ApiResponse<User>>('/users/me');
        return response.data;
    },
};

export default usersApi;
