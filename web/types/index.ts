export type Severity = 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ResponseMode = 'OBSERVE' | 'SIMULATE' | 'ENFORCE';

export interface Alert {
  id: string;
  endpoint_id: string;
  hostname: string;
  pid: number;
  ppid: number;
  process_name: string;
  executable_path: string;
  threat_score: number;
  severity: Severity;
  criticality_weight: number;
  triggered_rule: string;
  triggered_signals: string[];
  target_paths: string[];
  is_decoy_trigger: boolean;
  action_taken: string;
  status: 'MITIGATED' | 'INVESTIGATING' | 'UNRESOLVED';
  timestamp: string;
}

export interface Endpoint {
  id: string;
  hostname: string;
  ip_address: string;
  os: string;
  architecture: string;
  kernel_version: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  agent_version: string;
  ebpf_status: 'ACTIVE' | 'INACTIVE';
  btf_available: boolean;
  decoys_active: number;
  cpu_usage: number; // percentage
  memory_usage: number; // MB
  last_heartbeat: string;
  threats_count: number;
}

export interface Decoy {
  id: string;
  name: string;
  endpoint_id: string;
  endpoint_hostname: string;
  path: string;
  file_type: string;
  status: 'ACTIVE' | 'TRIGGERED' | 'DISABLED';
  created_at: string;
  last_interaction?: string;
  triggering_pid?: number;
  triggering_process?: string;
}

export interface SignalContribution {
  feature: string;
  score: number;
  description: string;
}

export interface DecisionDetails {
  pid: number;
  process_name: string;
  executable_path: string;
  endpoint_id: string;
  endpoint_hostname: string;
  threat_score: number;
  severity: Severity;
  confidence: number; // percentage e.g. 99.8
  decision_text: string;
  executed_action: string;
  contributions: SignalContribution[];
}

export interface ProcessEvent {
  id: string;
  timestamp: string;
  pid: number;
  process_name: string;
  event_type: 'EXECVE' | 'OPENAT' | 'WRITE' | 'RENAME' | 'UNLINK' | 'CONNECT' | 'DECOY_TRIGGER' | 'THREAT_DETECTED' | 'PROCESS_TERMINATED';
  category: 'PROCESS' | 'FILE' | 'NETWORK' | 'DECOY' | 'DECISION' | 'RESPONSE';
  metadata: {
    path?: string;
    bytes?: number;
    dest_ip?: string;
    dest_port?: number;
    flags?: string;
  };
}

export interface TelemetryPoint {
  timestamp: string;
  time: string;
  file_io: number;
  entropy: number;
  process: number;
  network: number;
  decoy: number;
}

export interface SystemStatus {
  ebpf_agents: string;
  sse_stream: 'CONNECTED' | 'DISCONNECTED';
  decision_engine: 'HEALTHY' | 'DEGRADED';
  response_engine: 'READY' | 'PAUSED';
}

export interface KPIMetrics {
  threats_mitigated: number;
  active_decoys: number;
  protected_endpoints: number;
  detection_latency: string;
  active_incidents: number;
  suspicious_processes: number;
}
