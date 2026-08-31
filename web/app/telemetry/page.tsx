"use client";

import React, { useState } from 'react';
import TelemetryGraph from '@/components/TelemetryGraph';
import { LineChart, Cpu, Server, Activity } from 'lucide-react';

export default function TelemetryPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('node-01');
  const [selectedPID, setSelectedPID] = useState<string>('2048');

  return (
    <div className="space-y-6 font-mono text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2.5">
            <LineChart className="w-6 h-6 text-orange-500" />
            eBPF Telemetry & Entropy Analytics
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Real-time kernel syscall burst frequencies, Shannon entropy calculations, and signal correlation markers.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          {/* Endpoint Selector */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Server className="w-4 h-4 text-orange-500" />
            <span className="text-slate-600 font-bold">Endpoint:</span>
            <select
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value)}
              className="bg-transparent text-black font-extrabold outline-none cursor-pointer"
            >
              <option value="node-01" className="bg-white text-black">node-01 (Ubuntu 24.04)</option>
              <option value="node-02" className="bg-white text-black">node-02 (Debian 12)</option>
              <option value="node-03" className="bg-white text-black">node-03 (RHEL 9.3)</option>
            </select>
          </div>

          {/* PID Input */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Cpu className="w-4 h-4 text-cyan-600" />
            <span className="text-slate-600 font-bold">Target PID:</span>
            <input
              type="text"
              value={selectedPID}
              onChange={(e) => setSelectedPID(e.target.value)}
              placeholder="e.g. 2048"
              className="bg-transparent text-black font-extrabold w-16 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Telemetry Visualizer */}
      <TelemetryGraph
        title={`TELEMETRY STREAM: HOST ${selectedEndpoint} ${selectedPID ? `(PID ${selectedPID})` : ''}`}
        subtitle="eBPF Ring Buffer Telemetry & High-Entropy Encryption Detection"
        showFilters={true}
      />

      {/* Real-time Event Annotations & Timeline Markers */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 font-mono shadow-sm">
        <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-orange-500" />
          TELEMETRY ANNOTATION MARKERS (PID {selectedPID})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center space-x-2 text-cyan-700 font-extrabold">
              <span className="w-2 h-2 rounded-full bg-cyan-600" />
              <span>12:01:00.021 — ONSET</span>
            </div>
            <p className="text-[11px] text-slate-700 font-medium">Suspicious execve execution in /tmp</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center space-x-2 text-rose-700 font-extrabold">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              <span>12:01:01.238 — DECOY TRAP</span>
            </div>
            <p className="text-[11px] text-slate-700 font-medium">Direct write on decoy document file</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center space-x-2 text-orange-700 font-extrabold">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span>12:01:01.241 — DECISION</span>
            </div>
            <p className="text-[11px] text-slate-700 font-medium">Score 100/100 Ransomware Verdict</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center space-x-2 text-emerald-700 font-extrabold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>12:01:01.244 — TERMINATED</span>
            </div>
            <p className="text-[11px] text-slate-700 font-medium">Kernel SIGKILL + Socket Isolated</p>
          </div>
        </div>
      </div>
    </div>
  );
}

