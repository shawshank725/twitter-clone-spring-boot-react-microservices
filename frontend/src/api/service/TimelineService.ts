import axios, { type AxiosResponse } from 'axios';
import  { API_URL } from '@constants/MiscConstants';
import { getAuthHeader } from '@methods/GetHeader';
import type { SearchResult } from '@/types/SearchResult/SearchResult';

const TimelineService = "timeline-service";
const TimelineEndpoint = "timeline";
const generateEndpoint = "generate";
const generateFollowSuggestionsEndpoint = "generateFollowSuggestions";
const getSearchResultsEndpoint = "getSearchResult";

export async function getTimeline(userId: number): Promise<AxiosResponse<number[]>> {
  return await axios.get(
    `${API_URL}/${TimelineService}/${TimelineEndpoint}/${generateEndpoint}`,
    {
      ...getAuthHeader(),
      params: { userId }
    }
  );
}

export async function generateFollowSuggestions(userId: number):Promise<AxiosResponse<number[]>> {
  return await axios.get(
    `${API_URL}/${TimelineService}/${TimelineEndpoint}/${generateFollowSuggestionsEndpoint}`,
    {
      ...getAuthHeader(),
      params: { userId }
    }
  );
}

export async function getSearchResult( input: string ): Promise<AxiosResponse<SearchResult>> {
  return await axios.get(
    `${API_URL}/${TimelineService}/${TimelineEndpoint}/${getSearchResultsEndpoint}`,
    {
      ...getAuthHeader(),
      params: { input }
    }
  );
}