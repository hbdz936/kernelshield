import React from 'react';
import { KPIMetrics } from '../../types';
import { ShieldCheck, Target, Zap, Server, AlertTriangle, Eye } from 'lucide-react';
import StatCard from '../StatCard';

interface KPICardsProps {
  metrics: KPIMetrics;
}

export default function KPICards({ metrics }: KPICardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-mono">
      <StatCard
        title="THREATS MITIGATED"
        value={metrics.threats_mitigated}
        subtext="100% Zero-Lag Kill"
        icon={ShieldCheck}
        color="rose"
      />
      <StatCard
        title="ACTIVE DECOYS"
        value={`${metrics.active_decoys} ACTIVE`}
        subtext="Instant Kill Traps"
        icon={Target}
        color="orange"
      />
      <StatCard
        title="DETECTION LATENCY"
        value={metrics.detection_latency}
        subtext="Zero-Copy eBPF Ring"
        icon={Zap}
        color="emerald"
      />
      <StatCard
        title="PROTECTED ENDPOINTS"
        value={`${metrics.protected_endpoints} ONLINE`}
        subtext="Signal Correlated"
        icon={Server}
        color="cyan"
      />
      <StatCard
        title="ACTIVE INCIDENTS"
        value={metrics.active_incidents}
        subtext="Under Mitigation"
        icon={AlertTriangle}
        color="amber"
      />
      <StatCard
        title="SUSPICIOUS PIDS"
        value={metrics.suspicious_processes}
        subtext="5s Sliding Window"
        icon={Eye}
        color="orange"
      />
    </div>
  );
}

