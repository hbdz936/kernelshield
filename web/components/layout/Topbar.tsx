"use client";

import React, { useState } from 'react';
import { Search, Bell, Activity, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { ResponseMode } from '../../types';
import { useSSE } from '../../hooks/useSSE';

export default function Topbar() {
  const [responseMode, setResponseMode] = useState<ResponseMode>('SIMULATE');
  const { isConnected } = useSSE();

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10 shrink-0">
      {/* Global Search */}
      <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 w-80">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Global search (PID, Hash, Path, Rule)..."
          className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-full text-xs font-mono"
        />
      </div>

      {/* Control Status Indicators */}
      <div className="flex items-center space-x-4 text-xs font-mono">
        {/* Response Mode Selector */}
        <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 uppercase text-[10px]">MODE:</span>
          <select
            value={responseMode}
            onChange={(e) => setResponseMode(e.target.value as ResponseMode)}
            className="bg-transparent border-none text-white font-bold outline-none cursor-pointer text-xs"
          >
            <option value="OBSERVE" className="bg-slate-900 text-amber-400">OBSERVE (Passive)</option>
            <option value="SIMULATE" className="bg-slate-900 text-cyan-400">SIMULATE (Dry Run)</option>
            <option value="ENFORCE" className="bg-slate-900 text-rose-400">ENFORCE (Active Kill)</option>
          </select>
        </div>

        {/* SSE Stream Connection Indicator */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg border font-bold text-[11px] ${
          isConnected
            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
            : 'bg-rose-950/60 text-rose-400 border-rose-800/60'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
          <span>{isConnected ? '● SSE CONNECTED' : '● SSE DISCONNECTED'}</span>
        </div>

        {/* System Health Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SYSTEM HEALTHY</span>
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 relative transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        </button>
      </div>
    </header>
  );
}
