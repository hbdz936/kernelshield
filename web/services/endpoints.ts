import { fetchAPI } from './api';
import { Endpoint } from '../types';
import { mockEndpoints } from '../mock/mockData';

export async function getEndpoints(): Promise<Endpoint[]> {
  const data = await fetchAPI<{ total: number; endpoints: Endpoint[] }>('/api/v1/endpoints');
  if (data && data.endpoints && data.endpoints.length > 0) {
    return data.endpoints;
  }
  return mockEndpoints;
}

export async function getEndpointById(id: string): Promise<Endpoint | null> {
  const endpoints = await getEndpoints();
  return endpoints.find((e) => e.id === id || e.hostname === id) || mockEndpoints[0];
}
