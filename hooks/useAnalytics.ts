import { useApi } from './useApi';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';

export interface AnalyticsOverview {
  totalSurveys: number;
  totalResponses: number;
  averageResponseRate: number;
}

export interface SurveyAnalytics {
  surveyId: string;
  totalResponses: number;
  responseRate: number;
  completionRate: number;
}

// API functions
export const analyticsApi = {
  overview: () => apiClient.get<AnalyticsOverview>(API_ENDPOINTS.ANALYTICS.OVERVIEW),
  survey: (id: string) => apiClient.get<SurveyAnalytics>(API_ENDPOINTS.ANALYTICS.SURVEY(id)),
};

// Hooks
export function useAnalyticsOverview() {
  return useApi(analyticsApi.overview, { immediate: true });
}

export function useSurveyAnalytics(id: string) {
  return useApi(() => analyticsApi.survey(id), { immediate: !!id });
}

