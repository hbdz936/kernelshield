"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getAlertById } from '@/services/alerts';
import { Alert } from '@/types';
import ThreatBadge from '@/components/ui/ThreatBadge';
import { ShieldAlert, Cpu, CheckCircle2, ArrowRight, Activity, Brain, Server, Folder, FileCode } from 'lucide-react';

export default function AlertInvestigationPage() {
  const params = useParams();
  const router = useRouter();
  const alertId = (params?.id as string) || 'alt-90412';

  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlertDetails() {
      try {
        const data = await getAlertById(alertId);
        setAlert(data);
      } catch (err) {
        console.error('Failed to load alert details', err);
      } finally {
        setLoading(false);
      }
    }
    loadAlertDetails();
  }, [alertId]);

  if (loading || !alert) {
    return (
      <div className="p-8 space-y-4 animate-pulse font-mono">
        <div className="h-8 bg-slate-200 rounded w-64" />
        <div className="h-40 bg-slate-200 rounded w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono text-slate-900">
      {/* Top Title & Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-orange-600 font-bold mb-1">
            <Link href="/alerts" className="hover:underline">Alerts</Link>
            <span>/</span>
            <span>{alert.id}</span>
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            Threat Incident Investigation: {alert.id}
          </h1>
        </div>

        {/* Action / Contextual Navigation Links */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/decision"
            className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-300 text-xs font-mono font-extrabold transition flex items-center gap-1.5 shadow-xs"
          >
            <Brain className="w-3.5 h-3.5 text-orange-600" />
            <span>View Decision</span>
          </Link>

          <Link
            href={`/timeline/${alert.pid}`}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs font-mono font-extrabold transition flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-600" />
            <span>View Process Timeline</span>
          </Link>

          <Link
            href={`/endpoints/${alert.endpoint_id}`}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs font-mono font-extrabold transition flex items-center gap-1.5"
          >
            <Server className="w-3.5 h-3.5 text-indigo-600" />
            <span>View Endpoint</span>
          </Link>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 font-mono">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Incident Severity</span>
          <div className="mt-1">
            <ThreatBadge score={alert.threat_score} severity={alert.severity} />
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">Score: {alert.threat_score} / 100</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Target Process & PID</span>
          <h3 className="text-base font-extrabold text-black mt-1">{alert.process_name}</h3>
          <p className="text-xs text-orange-600 font-bold">PID {alert.pid} &bull; PPID {alert.ppid}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Target Host Node</span>
          <h3 className="text-base font-extrabold text-black mt-1">{alert.hostname}</h3>
          <p className="text-xs text-slate-600 font-medium">Node ID: {alert.endpoint_id}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Mitigation Status</span>
          <div className="mt-1 flex items-center space-x-1.5 text-emerald-800 font-black text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{alert.status}</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium mt-1">{alert.action_taken}</p>
        </div>
      </div>

      {/* Detailed Technical Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
        {/* Process Breakdown & Triggered Signals */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-sm">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-orange-500" />
            PROCESS & TRIGGERED SIGNALS
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-semibold">
            <div className="flex justify-between text-slate-600">
              <span>Executable Path:</span>
              <span className="text-black font-extrabold">{alert.executable_path}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Triggered Rule:</span>
              <span className="text-orange-600 font-extrabold">{alert.triggered_rule}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Criticality Weight:</span>
              <span className="text-amber-800 font-extrabold">{alert.criticality_weight}x Path Multiplier</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase">Signal Evidence Checklist</span>
            <div className="space-y-2">
              {alert.triggered_signals.map((sig, i) => (
                <div key={i} className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-black">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{sig}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Targeted Paths & Response Summary */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
              <Folder className="w-4 h-4 text-rose-600" />
              TARGETED CRITICAL FILE PATHS
            </h3>

            <div className="space-y-2">
              {alert.target_paths.map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center space-x-2 text-slate-800 font-semibold">
                  <FileCode className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="truncate">{p}</span>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
              <h4 className="text-xs font-extrabold text-emerald-800 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                AUTOMATED RESPONSE EXECUTED
              </h4>
              <ul className="text-xs text-slate-800 font-medium space-y-1 list-disc list-inside">
                <li>Process PID {alert.pid} terminated via eBPF ring buffer SIGKILL</li>
                <li>Host network interface isolated from external C2 outbound sockets</li>
                <li>Dynamic Decoy traps rotated and verified uncompromised</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Logged at: {alert.timestamp}</span>
            <Link
              href="/decision"
              className="text-orange-600 hover:text-orange-700 font-extrabold flex items-center gap-1"
            >
              Examine Decision Matrix <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

