import api from './axios';
import { ApiResponse, Outlet, CreateOutletRequest, UpdateOutletRequest } from './types';

export const outletsApi = {
    getAll: async (): Promise<ApiResponse<Outlet[]>> => {
        const response = await api.get<ApiResponse<Outlet[]>>('/outlets');
        return response.data;
    },

    getById: async (id: string): Promise<ApiResponse<Outlet>> => {
        const response = await api.get<ApiResponse<Outlet>>(`/outlets/${id}`);
        return response.data;
    },

    create: async (data: CreateOutletRequest): Promise<ApiResponse<Outlet>> => {
        const response = await api.post<ApiResponse<Outlet>>('/outlets', data);
        return response.data;
    },

    update: async (id: string, data: UpdateOutletRequest): Promise<ApiResponse<Outlet>> => {
        const response = await api.put<ApiResponse<Outlet>>(`/outlets/${id}`, data);
        return response.data;
    },
};

export default outletsApi;
