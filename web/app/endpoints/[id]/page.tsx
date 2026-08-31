"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getEndpointById } from '@/services/endpoints';
import { getAlerts } from '@/services/alerts';
import { Endpoint, Alert } from '@/types';
import ThreatBadge from '@/components/ui/ThreatBadge';
import TelemetryGraph from '@/components/TelemetryGraph';
import { Server, CheckCircle2, Activity, ArrowRight } from 'lucide-react';

export default function EndpointDetailsPage() {
  const params = useParams();
  const endpointId = (params?.id as string) || 'node-01';

  const [endpoint, setEndpoint] = useState<Endpoint | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Processes' | 'Telemetry' | 'Threats'>('Overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEndpointInfo() {
      try {
        const epData = await getEndpointById(endpointId);
        setEndpoint(epData);

        const allAlerts = await getAlerts();
        setAlerts(allAlerts.filter((a) => a.endpoint_id === endpointId || a.hostname === epData?.hostname));
      } catch (err) {
        console.error('Failed to load endpoint details', err);
      } finally {
        setLoading(false);
      }
    }
    loadEndpointInfo();
  }, [endpointId]);

  if (loading || !endpoint) {
    return (
      <div className="p-8 space-y-4 animate-pulse font-mono">
        <div className="h-8 bg-slate-200 rounded w-64" />
        <div className="h-40 bg-slate-200 rounded w-full" />
      </div>
    );
  }

  const sensors = [
    { name: 'execve', desc: 'Process execution & binary path interception', active: true },
    { name: 'openat', desc: 'File open handles & flag analysis', active: true },
    { name: 'write', desc: 'File write frequency & burst detection', active: true },
    { name: 'rename', desc: 'Mass file extension modification monitoring', active: true },
    { name: 'unlink', desc: 'Shadow copy & backup file deletion trap', active: true },
    { name: 'connect', desc: 'Outbound socket connection & C2 beaconing', active: true },
  ];

  return (
    <div className="space-y-6 font-mono text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-orange-600 font-bold mb-1">
            <Link href="/endpoints" className="hover:underline">Endpoint Nodes</Link>
            <span>/</span>
            <span>{endpoint.hostname}</span>
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2.5">
            <Server className="w-6 h-6 text-orange-500" />
            Endpoint Details: {endpoint.hostname}
          </h1>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>ONLINE</span>
          </div>
          <span className="text-slate-600 font-medium">Last Seen: {endpoint.last_heartbeat}</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 font-mono text-xs">
        {(['Overview', 'Processes', 'Telemetry', 'Threats'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl transition font-extrabold ${
              activeTab === tab
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-700 hover:text-black hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'Overview' && (
        <div className="space-y-6 font-mono">
          {/* Agent & Kernel Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Agent Status */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <span className="text-[10px] text-slate-500 uppercase font-bold">eBPF AGENT STATUS</span>
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between text-slate-700">
                  <span>Agent Version:</span>
                  <span className="text-orange-700 font-extrabold">{endpoint.agent_version}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Agent Health:</span>
                  <span className="text-emerald-700 font-extrabold">HEALTHY</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>CPU Overhead:</span>
                  <span className="text-black font-extrabold">{endpoint.cpu_usage}%</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Memory RAM:</span>
                  <span className="text-black font-extrabold">{endpoint.memory_usage} MB</span>
                </div>
              </div>
            </div>

            {/* Kernel Diagnostics */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <span className="text-[10px] text-slate-500 uppercase font-bold">KERNEL DIAGNOSTICS</span>
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between text-slate-700">
                  <span>Kernel Version:</span>
                  <span className="text-black font-extrabold">{endpoint.kernel_version}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>BTF Type Info:</span>
                  <span className="text-emerald-700 font-extrabold">AVAILABLE</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>eBPF State:</span>
                  <span className="text-emerald-700 font-extrabold">ACTIVE</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Ring Buffer:</span>
                  <span className="text-emerald-700 font-extrabold">HEALTHY (0 Drops)</span>
                </div>
              </div>
            </div>

            {/* Current Threats */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <span className="text-[10px] text-slate-500 uppercase font-bold">ACTIVE THREATS</span>
              <div className="space-y-2 text-xs">
                {alerts.length > 0 ? (
                  alerts.map((alt) => (
                    <div key={alt.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <div>
                        <div className="font-extrabold text-black">{alt.process_name}</div>
                        <div className="text-[10px] text-slate-500 font-bold">PID {alt.pid}</div>
                      </div>
                      <ThreatBadge score={alt.threat_score} severity={alt.severity} />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-600 font-medium">No active threats detected on host.</p>
                )}
              </div>
            </div>
          </div>

          {/* eBPF Sensors Checklist */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              ACTIVE eBPF KERNEL SENSORS ({sensors.length} ACTIVE)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              {sensors.map((sensor) => (
                <div key={sensor.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-orange-700 text-sm font-mono font-extrabold">{sensor.name}</span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ACTIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">{sensor.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PROCESSES */}
      {activeTab === 'Processes' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 font-mono text-xs">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider">
            MONITORED PROCESSES ON {endpoint.hostname}
          </h3>

          <div className="space-y-3">
            {[
              { pid: 2048, name: 'bad_encryptor', path: '/tmp/bad_encryptor', status: 'KILLED', score: 100 },
              { pid: 3190, name: 'crypto_miner_agent', path: '/var/www/uploads/miner.bin', status: 'KILLED', score: 78.5 },
              { pid: 1024, name: 'systemd-journal', path: '/lib/systemd/systemd-journald', status: 'CLEAN', score: 0 },
            ].map((proc) => (
              <div key={proc.pid} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-black text-sm">{proc.name} (PID {proc.pid})</div>
                  <div className="text-[11px] text-slate-600 font-medium">{proc.path}</div>
                </div>

                <div className="flex items-center space-x-3">
                  <ThreatBadge score={proc.score} />
                  <Link
                    href={`/timeline/${proc.pid}`}
                    className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-800 border border-orange-300 hover:bg-orange-100 font-extrabold transition flex items-center gap-1"
                  >
                    <span>Timeline</span>
                    <ArrowRight className="w-3 h-3 text-orange-600" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: TELEMETRY */}
      {activeTab === 'Telemetry' && (
        <TelemetryGraph
          title={`ENDPOINT TELEMETRY: ${endpoint.hostname}`}
          subtitle="eBPF Ring Buffer Telemetry & High-Entropy Encryption Detection"
        />
      )}

      {/* TAB CONTENT: THREATS */}
      {activeTab === 'Threats' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 font-mono text-xs">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider">
            ENDPOINT THREAT AUDIT LOG ({alerts.length} INCIDENTS)
          </h3>

          <div className="space-y-3">
            {alerts.map((alt) => (
              <div key={alt.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-orange-600">{alt.id} &bull; {alt.process_name} (PID {alt.pid})</div>
                  <div className="text-[11px] text-slate-700 font-semibold">{alt.triggered_rule}</div>
                </div>

                <div className="flex items-center space-x-3">
                  <ThreatBadge score={alt.threat_score} severity={alt.severity} />
                  <Link
                    href={`/alerts/${alt.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200 font-extrabold transition"
                  >
                    Investigate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

