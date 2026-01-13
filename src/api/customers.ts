import api from './axios';
import { ApiResponse, Customer, CreateCustomerRequest, UpdateCustomerRequest } from './types';

export const customersApi = {
    getAll: async (): Promise<ApiResponse<Customer[]>> => {
        const response = await api.get<ApiResponse<Customer[]>>('/customers');
        return response.data;
    },

    getById: async (id: string): Promise<ApiResponse<Customer>> => {
        const response = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
        return response.data;
    },

    create: async (data: CreateCustomerRequest): Promise<ApiResponse<Customer>> => {
        const response = await api.post<ApiResponse<Customer>>('/customers', data);
        return response.data;
    },

    update: async (id: string, data: UpdateCustomerRequest): Promise<ApiResponse<Customer>> => {
        const response = await api.put<ApiResponse<Customer>>(`/customers/${id}`, data);
        return response.data;
    },
};

export default customersApi;
