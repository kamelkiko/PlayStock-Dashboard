import api from './axios';
import { ApiResponse, Vendor, CreateVendorRequest, UpdateVendorRequest } from './types';

export const vendorsApi = {
    getAll: async (): Promise<ApiResponse<Vendor[]>> => {
        const response = await api.get<ApiResponse<Vendor[]>>('/vendors');
        return response.data;
    },

    getById: async (id: string): Promise<ApiResponse<Vendor>> => {
        const response = await api.get<ApiResponse<Vendor>>(`/vendors/${id}`);
        return response.data;
    },

    create: async (data: CreateVendorRequest): Promise<ApiResponse<Vendor>> => {
        const response = await api.post<ApiResponse<Vendor>>('/vendors', data);
        return response.data;
    },

    update: async (id: string, data: UpdateVendorRequest): Promise<ApiResponse<Vendor>> => {
        const response = await api.put<ApiResponse<Vendor>>(`/vendors/${id}`, data);
        return response.data;
    },
};

export default vendorsApi;
