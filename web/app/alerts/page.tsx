"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Search, CheckCircle, ArrowRight, AlertOctagon } from 'lucide-react';
import { getAlerts } from '@/services/alerts';
import { Alert } from '@/types';
import ThreatBadge from '@/components/ui/ThreatBadge';

export default function AlertsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchAlertList() {
      try {
        const data = await getAlerts();
        setAlerts(data);
      } catch (err) {
        console.error('Error fetching alerts', err);
      }
    }
    fetchAlertList();
  }, []);

  const filteredAlerts = alerts.filter(
    (a) =>
      a.process_name.toLowerCase().includes(filter.toLowerCase()) ||
      a.triggered_rule.toLowerCase().includes(filter.toLowerCase()) ||
      a.id.toLowerCase().includes(filter.toLowerCase()) ||
      a.pid.toString().includes(filter)
  );

  return (
    <div className="space-y-6 font-mono text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-orange-500" />
            Live Threat & Incident Repository
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Historical audit stream of detected ransomware processes, decoy triggers, and automated mitigations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-medium focus-within:border-orange-500 transition">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by PID, process, rule or ID..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent outline-none text-slate-900 placeholder-slate-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Alerts Feed Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-200 font-bold">
            <tr>
              <th className="py-3.5 px-4">Alert ID</th>
              <th className="py-3.5 px-4">Endpoint</th>
              <th className="py-3.5 px-4">PID & Process</th>
              <th className="py-3.5 px-4">Threat Score</th>
              <th className="py-3.5 px-4">Triggered Rule</th>
              <th className="py-3.5 px-4">Mitigation Action</th>
              <th className="py-3.5 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <tr
                  key={alert.id}
                  onClick={() => router.push(`/alerts/${alert.id}`)}
                  className="hover:bg-orange-50/50 cursor-pointer transition-colors group"
                >
                  <td className="py-4 px-4 font-extrabold text-orange-600">{alert.id}</td>
                  <td className="py-4 px-4 text-black font-bold">{alert.hostname || alert.endpoint_id}</td>
                  <td className="py-4 px-4">
                    <div className="font-extrabold text-black group-hover:text-orange-600 transition">{alert.process_name}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">PID: {alert.pid}</div>
                  </td>
                  <td className="py-4 px-4">
                    <ThreatBadge score={alert.threat_score} severity={alert.severity} />
                  </td>
                  <td className="py-4 px-4">
                    {alert.is_decoy_trigger ? (
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-extrabold border border-rose-300 text-[10px]">
                        DECOY TRAP TRIGGERED
                      </span>
                    ) : (
                      <span className="text-slate-900 font-semibold">{alert.triggered_rule}</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      {alert.action_taken}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-orange-600 font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Investigate <ArrowRight className="w-3 h-3" />
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-600 font-mono font-medium">
                  <AlertOctagon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  No active threats detected matching query criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

