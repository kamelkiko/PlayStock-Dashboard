import api from './axios';
import { ApiResponse, Store, CreateStoreRequest, UpdateStoreRequest } from './types';

export const storesApi = {
    getById: async (id: string): Promise<ApiResponse<Store>> => {
        const response = await api.get<ApiResponse<Store>>(`/stores/${id}`);
        return response.data;
    },

    getAll: async (): Promise<ApiResponse<Store[]>> => {
        const response = await api.get<ApiResponse<Store[]>>('/stores');
        return response.data;
    },

    getMyStore: async (): Promise<ApiResponse<Store>> => {
        const response = await api.get<ApiResponse<Store>>('/stores/me');
        return response.data;
    },

    create: async (data: CreateStoreRequest): Promise<ApiResponse<Store>> => {
        const response = await api.post<ApiResponse<Store>>('/stores', data);
        return response.data;
    },

    update: async (id: string, data: UpdateStoreRequest): Promise<ApiResponse<Store>> => {
        const response = await api.put<ApiResponse<Store>>(`/stores/${id}`, data);
        return response.data;
    },
};

export default storesApi;
