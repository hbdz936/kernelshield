"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SystemStatus from '@/components/dashboard/SystemStatus';
import KPICards from '@/components/dashboard/KPICards';
import PipelineVisualizer from '@/components/dashboard/PipelineVisualizer';
import TelemetryGraph from '@/components/TelemetryGraph';
import ThreatBadge from '@/components/ui/ThreatBadge';
import { getAlerts, createSimulatedAlert } from '@/services/alerts';
import { getEndpoints } from '@/services/endpoints';
import { Alert, KPIMetrics, SystemStatus as SystemStatusType } from '@/types';
import { Activity, Zap, CheckCircle2, AlertOctagon, Shield, ArrowUpRight } from 'lucide-react';

export default function SOCDashboard() {
  const router = useRouter();

  const [systemStatus, setSystemStatus] = useState<SystemStatusType>({
    ebpf_agents: '3/3 ONLINE',
    sse_stream: 'CONNECTED',
    decision_engine: 'HEALTHY',
    response_engine: 'READY',
  });

  const [metrics, setMetrics] = useState<KPIMetrics>({
    threats_mitigated: 14,
    active_decoys: 18,
    protected_endpoints: 3,
    detection_latency: '<1 sec',
    active_incidents: 1,
    suspicious_processes: 2,
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const alertList = await getAlerts();
        setAlerts(alertList);
      } catch (err) {
        console.error('Failed to load initial SOC dashboard alerts', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleSimulateDecoyTrigger = async () => {
    const randomPID = Math.floor(2000 + Math.random() * 7000);
    const newSimAlert = await createSimulatedAlert({
      pid: randomPID,
      process_name: 'bad_encryptor',
      threat_score: 100,
      triggered_rule: 'USP#1_DYNAMIC_DECOY_INSTANT_KILL',
      is_decoy_trigger: true,
      action_taken: 'TERMINATE PROCESS + ISOLATE NETWORK',
      target_paths: ['/home/user/finance/Q4_Financial_Report.docx'],
    });

    setAlerts((prev) => [newSimAlert, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      threats_mitigated: prev.threats_mitigated + 1,
    }));
  };

  return (
    <div className="space-y-6 bg-white text-slate-900">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-orange-500" />
            SOC Ransomware Threat Command
          </h1>
          <p className="text-xs text-slate-600 font-mono mt-1 font-medium">
            "Detect and attribute ransomware behavior before destructive encryption completes."
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSimulateDecoyTrigger}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-mono font-bold shadow-md shadow-orange-500/20 transition flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-white" />
            Simulate Decoy Trigger
          </button>
        </div>
      </div>

      {/* SECTION A: SYSTEM STATUS */}
      <SystemStatus status={systemStatus} />

      {/* SECTION B: KPI CARDS */}
      <KPICards metrics={metrics} />

      {/* SECTION C & D: TELEMETRY GRAPH & CORE ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TelemetryGraph />
        </div>

        <div className="space-y-4">
          <PipelineVisualizer />

          {/* Key Product Differentiation Panel */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 font-mono">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-orange-600 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-orange-500" />
              <span>Core Differentiation</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between font-bold text-rose-700">
                  <span>USP #1: Dynamic Decoy Traps</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-black">Instant Kill</span>
                </div>
                <p className="text-slate-600 mt-1 text-[11px] font-medium">
                  Zero-false-positive trap files placed in sensitive paths. Any write syscall triggers immediate SIGKILL.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between font-bold text-orange-700">
                  <span>USP #2: 5s Window Correlator</span>
                  <span className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-black">eBPF Ring</span>
                </div>
                <p className="text-slate-600 mt-1 text-[11px] font-medium">
                  Correlates process execve, high write burst frequency, Shannon entropy (&gt;7.5), and socket connects by PID.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION E: RECENT THREATS TABLE */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm font-mono">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-black flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-600 animate-pulse" />
              RECENT DETECTED THREATS & AUTOMATED RESPONSES
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Click any incident row to open full forensic investigation view
            </p>
          </div>
          <Link
            href="/alerts"
            className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 font-bold"
          >
            <span>View All Alerts</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Endpoint</th>
                <th className="py-3.5 px-4">PID & Process</th>
                <th className="py-3.5 px-4">Threat Score</th>
                <th className="py-3.5 px-4">Triggered Rule</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alerts.map((alert) => (
                <tr
                  key={alert.id}
                  onClick={() => router.push(`/alerts/${alert.id}`)}
                  className="hover:bg-orange-50/50 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {alert.timestamp || 'Just now'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-orange-600">
                    {alert.hostname || alert.endpoint_id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-black group-hover:text-orange-600 transition">
                      {alert.process_name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold">PID: {alert.pid}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <ThreatBadge score={alert.threat_score} severity={alert.severity} />
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate">
                    {alert.is_decoy_trigger ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-rose-50 text-rose-800 font-extrabold border border-rose-300">
                        DECOY TRAP TRIGGERED
                      </span>
                    ) : (
                      <span className="text-slate-800 font-semibold">{alert.triggered_rule}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {alert.action_taken}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800 border border-slate-300 font-bold">
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
