import { fetchAPI } from './api';
import { Alert } from '../types';
import { mockAlerts } from '../mock/mockData';

export async function getAlerts(): Promise<Alert[]> {
  const data = await fetchAPI<{ total: number; alerts: Alert[] }>('/api/v1/alerts');
  if (data && data.alerts && data.alerts.length > 0) {
    return data.alerts;
  }
  return mockAlerts;
}

export async function getAlertById(id: string): Promise<Alert | null> {
  const alerts = await getAlerts();
  return alerts.find((a) => a.id === id || a.pid.toString() === id) || mockAlerts[0];
}

export async function createSimulatedAlert(payload: Partial<Alert>): Promise<Alert> {
  const res = await fetchAPI<{ status: string; alert: Alert }>('/api/v1/alerts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (res && res.alert) {
    return res.alert;
  }
  const fallback: Alert = {
    id: `alt-${Math.floor(10000 + Math.random() * 90000)}`,
    endpoint_id: payload.endpoint_id || 'node-01',
    hostname: payload.hostname || 'soc-node-01',
    pid: payload.pid || 2048,
    ppid: payload.ppid || 1821,
    process_name: payload.process_name || 'simulated_ransomware_exe',
    executable_path: payload.executable_path || '/tmp/simulated_ransomware_exe',
    threat_score: payload.threat_score || 100,
    severity: 'CRITICAL',
    criticality_weight: payload.criticality_weight || 10.0,
    triggered_rule: payload.triggered_rule || 'USP#1_DYNAMIC_DECOY_INSTANT_KILL',
    triggered_signals: [
      'High file write rate',
      'Entropy burst',
      'Dynamic decoy interaction',
    ],
    target_paths: payload.target_paths || ['/home/user/finance/Q4_Financial_Projection_v3.docx'],
    is_decoy_trigger: payload.is_decoy_trigger ?? true,
    action_taken: payload.action_taken || 'TERMINATE PROCESS + ISOLATE NETWORK',
    status: 'MITIGATED',
    timestamp: new Date().toLocaleTimeString(),
  };
  return fallback;
}
