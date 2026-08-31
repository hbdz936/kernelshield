import React from 'react';
import { SystemStatus as SystemStatusType } from '../../types';
import { Cpu, Activity, Brain, ShieldAlert } from 'lucide-react';

interface SystemStatusProps {
  status: SystemStatusType;
}

export default function SystemStatus({ status }: SystemStatusProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm font-mono">
      <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>KERNELSHIELD AGENT & PIPELINE HEALTH</span>
        <span className="text-[10px] text-orange-700 font-extrabold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">REAL-TIME</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-300">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-500 text-[10px] font-bold">eBPF Agents</div>
            <div className="text-black font-extrabold">{status.ebpf_agents}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="p-2 rounded-lg bg-orange-100 text-orange-700 border border-orange-300">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-500 text-[10px] font-bold">SSE Stream</div>
            <div className="text-emerald-700 font-extrabold">{status.sse_stream}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-300">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-500 text-[10px] font-bold">Decision Engine</div>
            <div className="text-emerald-700 font-extrabold">{status.decision_engine}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="p-2 rounded-lg bg-rose-100 text-rose-700 border border-rose-300">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-500 text-[10px] font-bold">Response Engine</div>
            <div className="text-black font-extrabold">{status.response_engine}</div>
          </div>
        </div>
      </div>
    </div>
  );
}


