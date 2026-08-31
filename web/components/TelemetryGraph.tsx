"use client";

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TelemetryPoint } from '@/types';
import { LineChart, Activity, Zap } from 'lucide-react';

interface TelemetryGraphProps {
  data?: TelemetryPoint[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  selectedEndpoint?: string;
  selectedPID?: number;
}

export default function TelemetryGraph({
  data = [],
  title = "eBPF TELEMETRY & ENTROPY BURST RATE",
  subtitle = "Real-time kernel syscall frequencies, Shannon entropy rate, and decoy traps",
  showFilters = true,
}: TelemetryGraphProps) {
  const [signals, setSignals] = useState({
    fileIO: true,
    entropy: true,
    process: true,
    network: false,
  });

  const [timeRange, setTimeRange] = useState<'5m' | '30m' | '1h'>('30m');

  const toggleSignal = (key: keyof typeof signals) => {
    setSignals((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const defaultData: TelemetryPoint[] = [
    { timestamp: '12:00:00', time: '12:00', file_io: 12, entropy: 2.1, process: 2, network: 1, decoy: 0 },
    { timestamp: '12:00:30', time: '12:00:30', file_io: 15, entropy: 2.3, process: 3, network: 2, decoy: 0 },
    { timestamp: '12:01:00', time: '12:01', file_io: 95, entropy: 7.98, process: 14, network: 6, decoy: 1 },
    { timestamp: '12:01:30', time: '12:01:30', file_io: 4, entropy: 1.2, process: 1, network: 0, decoy: 0 },
    { timestamp: '12:02:00', time: '12:02', file_io: 8, entropy: 1.5, process: 2, network: 1, decoy: 0 },
    { timestamp: '12:02:30', time: '12:02:30', file_io: 10, entropy: 1.8, process: 2, network: 1, decoy: 0 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;
  const isDataEmpty = data && data.length === 0 && !chartData;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 font-mono">
      {/* Header & Signal Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-black tracking-wide flex items-center gap-2">
            <LineChart className="w-4 h-4 text-orange-500" />
            {title}
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-0.5">{subtitle}</p>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-3">
            {/* Signal Toggles */}
            <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs">
              <label className="flex items-center space-x-1.5 px-2 py-1 rounded cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={signals.fileIO}
                  onChange={() => toggleSignal('fileIO')}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-slate-800 font-bold">File I/O</span>
              </label>

              <label className="flex items-center space-x-1.5 px-2 py-1 rounded cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={signals.entropy}
                  onChange={() => toggleSignal('entropy')}
                  className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-rose-600 font-bold">Entropy</span>
              </label>

              <label className="flex items-center space-x-1.5 px-2 py-1 rounded cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={signals.process}
                  onChange={() => toggleSignal('process')}
                  className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-cyan-700 font-bold">Process</span>
              </label>

              <label className="flex items-center space-x-1.5 px-2 py-1 rounded cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={signals.network}
                  onChange={() => toggleSignal('network')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-600 font-bold">Network</span>
              </label>
            </div>

            {/* Time Range Filter */}
            <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              {(['5m', '30m', '1h'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    timeRange === range
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Graph Area */}
      {isDataEmpty ? (
        <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center p-6 space-y-2">
          <Activity className="w-8 h-8 text-slate-400 animate-pulse" />
          <h4 className="text-sm font-bold text-black">No telemetry available</h4>
          <p className="text-xs text-slate-600 max-w-sm">Waiting for eBPF endpoint events from agent probes...</p>
        </div>
      ) : (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEntropy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFileIO" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProcess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#cbd5e1',
                  borderRadius: '12px',
                  color: '#000000',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              {signals.entropy && (
                <Area
                  type="monotone"
                  dataKey="entropy"
                  stroke="#dc2626"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEntropy)"
                  name="Shannon Entropy (bits/byte)"
                />
              )}
              {signals.fileIO && (
                <Area
                  type="monotone"
                  dataKey="file_io"
                  stroke="#f97316"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorFileIO)"
                  name="File Write Syscalls/sec"
                />
              )}
              {signals.process && (
                <Area
                  type="monotone"
                  dataKey="process"
                  stroke="#0891b2"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorProcess)"
                  name="Process Exec Events"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend / Status Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-700 font-semibold">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600" /> Entropy Spike (&gt;7.5)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" /> High Write Rate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-600" /> Process Lifecycle
          </span>
        </div>
        <div className="flex items-center gap-1 text-emerald-700 font-bold">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero-Copy Ring Buffer Stream</span>
        </div>
      </div>
    </div>
  );
}

