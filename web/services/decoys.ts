import { fetchAPI } from './api';
import { Decoy } from '../types';
import { mockDecoys } from '../mock/mockData';

export async function getDecoys(): Promise<Decoy[]> {
  const data = await fetchAPI<{ total: number; decoys: Decoy[] }>('/api/v1/decoys');
  if (data && data.decoys && data.decoys.length > 0) {
    return data.decoys;
  }
  return mockDecoys;
}
