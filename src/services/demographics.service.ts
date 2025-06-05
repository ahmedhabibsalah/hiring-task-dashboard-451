import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/config";
import {
  DemographicsConfig,
  DemographicsConfigCreatePayload,
  DemographicsConfigUpdatePayload,
  DemographicsResult,
  DemographicsResultsParams,
} from "@/types";

export const demographicsService = {
  async createConfig(
    data: DemographicsConfigCreatePayload
  ): Promise<DemographicsConfig> {
    return apiClient.post<DemographicsConfig>(
      API_ENDPOINTS.demographics.config,
      data
    );
  },

  async updateConfig(
    id: string,
    data: DemographicsConfigUpdatePayload
  ): Promise<DemographicsConfig> {
    return apiClient.put<DemographicsConfig>(
      `${API_ENDPOINTS.demographics.config}/${id}`,
      data
    );
  },

  async getResults(
    params: DemographicsResultsParams
  ): Promise<DemographicsResult[]> {
    return apiClient.get<DemographicsResult[]>(
      API_ENDPOINTS.demographics.results,
      params
    );
  },
};
