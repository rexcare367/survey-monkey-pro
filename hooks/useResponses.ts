import { useApi } from './useApi';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';

export interface Response {
  id: string;
  surveyId: string;
  answers: Record<string, any>;
  createdAt: string;
}

export interface CreateResponseDto {
  surveyId: string;
  answers: Record<string, any>;
}

// API functions
export const responseApi = {
  list: () => apiClient.get<Response[]>(API_ENDPOINTS.RESPONSES.LIST),
  get: (id: string) => apiClient.get<Response>(API_ENDPOINTS.RESPONSES.GET(id)),
  create: (data: CreateResponseDto) => 
    apiClient.post<Response>(API_ENDPOINTS.RESPONSES.CREATE, data),
};

// Hooks
export function useResponses() {
  return useApi(responseApi.list, { immediate: true });
}

export function useResponse(id: string) {
  return useApi(() => responseApi.get(id), { immediate: !!id });
}

export function useCreateResponse() {
  return useApi(responseApi.create);
}

