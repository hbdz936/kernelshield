import { fetchAPI } from './api';
import { DecisionDetails } from '../types';
import { mockDecision } from '../mock/mockData';

export async function getDecisionByPID(pid: number | string): Promise<DecisionDetails> {
  const data = await fetchAPI<DecisionDetails>(`/api/v1/decisions/${pid}`);
  if (data) {
    return data;
  }
  return {
    ...mockDecision,
    pid: typeof pid === 'number' ? pid : parseInt(pid, 10) || 2048,
  };
}
