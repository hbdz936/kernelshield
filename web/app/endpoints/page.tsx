"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getEndpoints } from '@/services/endpoints';
import { Endpoint } from '@/types';
import { Server, ArrowRight } from 'lucide-react';

export default function EndpointNodesPage() {
  const router = useRouter();
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEndpointNodes() {
      try {
        const data = await getEndpoints();
        setEndpoints(data);
      } catch (err) {
        console.error('Failed to load endpoint nodes', err);
      } finally {
        setLoading(false);
      }
    }
    loadEndpointNodes();
  }, []);

  return (
    <div className="space-y-6 font-mono text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2.5">
            <Server className="w-6 h-6 text-orange-500" />
            Protected Endpoint Nodes
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Linux hosts running eBPF agent probes for zero-overhead syscall interception and ring-buffer correlation.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            {endpoints.length} PROTECTED NODES ONLINE
          </span>
        </div>
      </div>

      {/* Endpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        {endpoints.map((ep) => (
          <div
            key={ep.id}
            onClick={() => router.push(`/endpoints/${ep.id}`)}
            className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 hover:border-orange-400 cursor-pointer transition-all hover:scale-[1.01] group shadow-sm"
          >
            {/* Host Title & Online Badge */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-black group-hover:text-orange-600 transition">
                  {ep.hostname}
                </h3>
                <p className="text-[11px] text-slate-500 font-bold">{ep.ip_address}</p>
              </div>

              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                <span>ONLINE</span>
              </div>
            </div>

            {/* System Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase font-bold">OS & ARCH</span>
                <div className="text-black font-extrabold text-[11px] truncate">{ep.os}</div>
                <div className="text-[10px] text-slate-600 font-medium">{ep.architecture}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase font-bold">AGENT & eBPF</span>
                <div className="text-orange-700 font-extrabold text-[11px]">{ep.agent_version}</div>
                <div className="text-[10px] text-emerald-700 font-bold">eBPF {ep.ebpf_status}</div>
              </div>
            </div>

            {/* Metrics: CPU & RAM */}
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between text-slate-700">
                <span>CPU Usage:</span>
                <span className="text-black font-black">{ep.cpu_usage}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: `${ep.cpu_usage * 10}%` }} />
              </div>

              <div className="flex justify-between text-slate-700 pt-1">
                <span>Memory Usage:</span>
                <span className="text-black font-black">{ep.memory_usage} MB</span>
              </div>
            </div>

            {/* Threat Count & Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs font-mono">
              <div className="flex items-center space-x-1.5">
                {ep.threats_count > 0 ? (
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-black border border-rose-300 text-[10px]">
                    {ep.threats_count} CRITICAL THREAT
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                    0 THREATS
                  </span>
                )}
              </div>

              <span className="text-orange-600 font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform text-xs">
                Inspect Node <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

