import React from 'react';
import { ArrowRight, FileText, Cpu, Globe, Lock, Brain } from 'lucide-react';

export default function PipelineVisualizer() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 font-mono space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
            CORE ARCHITECTURE & SIGNAL PIPELINE
          </h3>
          <p className="text-[10px] text-slate-600 font-medium mt-0.5">ONE KERNEL &bull; FOUR SIGNAL SOURCES &bull; ONE DECISION ENGINE</p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-orange-50 text-orange-700 border border-orange-200">
          eBPF INTERLOCK ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-xs">
        {/* 1. Signals */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
          <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex justify-between items-center">
            <span>4 SIGNAL SOURCES</span>
            <span className="text-orange-600 font-bold">eBPF</span>
          </div>
          <div className="space-y-1.5 text-[11px] font-bold">
            <div className="flex items-center space-x-2 text-black">
              <FileText className="w-3.5 h-3.5 text-orange-500" />
              <span>FILE I/O (open/write)</span>
            </div>
            <div className="flex items-center space-x-2 text-black">
              <Cpu className="w-3.5 h-3.5 text-cyan-600" />
              <span>PROCESS (execve)</span>
            </div>
            <div className="flex items-center space-x-2 text-black">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>NETWORK (connect)</span>
            </div>
            <div className="flex items-center space-x-2 text-black">
              <Lock className="w-3.5 h-3.5 text-rose-600" />
              <span>ENTROPY / DECOY</span>
            </div>
          </div>
        </div>

        {/* Arrow 1 */}
        <div className="hidden md:flex justify-center text-slate-400">
          <ArrowRight className="w-5 h-5 animate-pulse text-orange-500" />
        </div>

        {/* 2. Correlation */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center space-y-1.5">
          <div className="text-[10px] font-bold text-slate-600 uppercase">5s SLIDING WINDOW</div>
          <div className="text-black font-black text-sm">CORRELATOR</div>
          <p className="text-[10px] text-slate-600 font-medium">PID Feature Aggregation & Multipliers</p>
        </div>

        {/* Arrow 2 */}
        <div className="hidden md:flex justify-center text-slate-400">
          <ArrowRight className="w-5 h-5 animate-pulse text-rose-500" />
        </div>

        {/* 3. Decision & Response */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="text-[10px] font-bold text-slate-700 uppercase">DECISION ENGINE</span>
            <Brain className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-[11px] space-y-1 font-bold">
            <div className="flex justify-between text-black">
              <span>Threat Score:</span>
              <span className="text-rose-600 font-extrabold">100 / 100</span>
            </div>
            <div className="flex justify-between text-black">
              <span>Executed Action:</span>
              <span className="text-emerald-700 font-extrabold">SIGKILL + ISOLATE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


