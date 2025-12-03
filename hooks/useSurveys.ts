import { useApi } from './useApi';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';

export interface Survey {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSurveyDto {
  title: string;
  description?: string;
}

export interface UpdateSurveyDto {
  title?: string;
  description?: string;
}

// API functions
export const surveyApi = {
  list: () => apiClient.get<Survey[]>(API_ENDPOINTS.SURVEYS.LIST),
  get: (id: string) => apiClient.get<Survey>(API_ENDPOINTS.SURVEYS.GET(id)),
  create: (data: CreateSurveyDto) => apiClient.post<Survey>(API_ENDPOINTS.SURVEYS.CREATE, data),
  update: (id: string, data: UpdateSurveyDto) => 
    apiClient.put<Survey>(API_ENDPOINTS.SURVEYS.UPDATE(id), data),
  delete: (id: string) => apiClient.delete(API_ENDPOINTS.SURVEYS.DELETE(id)),
};

// Hooks
export function useSurveys() {
  return useApi(surveyApi.list, { immediate: true });
}

export function useSurvey(id: string) {
  return useApi(() => surveyApi.get(id), { immediate: !!id });
}

export function useCreateSurvey() {
  return useApi(surveyApi.create);
}

export function useUpdateSurvey() {
  return useApi(surveyApi.update);
}

export function useDeleteSurvey() {
  return useApi(surveyApi.delete);
}

