import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Types
export interface ShortenURLRequest {
  original_url: string;
}

export interface ShortenURLResponse {
  original_url: string;
  short_code: string;
  short_url: string;
  created_at: string;
}

export interface URLAnalytics {
  short_code: string;
  original_url: string;
  total_clicks: number;
  created_at: string;
  clicks_by_date: { date: string; count: number }[];
  clicks_by_browser: { browser: string; count: number }[];
  clicks_by_device: { device: string; count: number }[];
  clicks_by_country: { country: string; count: number }[];
}

// API client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const shortenURL = async (data: ShortenURLRequest): Promise<ShortenURLResponse> => {
  const response = await apiClient.post<ShortenURLResponse>('/shorten', data);
  
  return response.data;
};

export const getURLAnalytics = async (shortCode: string): Promise<URLAnalytics> => {
  const response = await apiClient.get<URLAnalytics>(`/analytics/${shortCode}`);
  return response.data;
};

export const getRecentURLs = async (): Promise<ShortenURLResponse[]> => {
  const response = await apiClient.get<ShortenURLResponse[]>('/recent');
  return response.data;
};
