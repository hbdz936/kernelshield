"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { mockProcessTimeline } from '@/mock/mockData';
import { ProcessEvent } from '@/types';
import { Activity, Cpu, FileText, Globe, Lock, Brain, CheckCircle2, ShieldAlert, Info } from 'lucide-react';

export default function ProcessTimelinePage() {
  const params = useParams();
  const pid = (params?.pid as string) || '2048';
  const processName = 'bad_encryptor';

  const [selectedEvent, setSelectedEvent] = useState<ProcessEvent | null>(mockProcessTimeline[2]);

  const categoryColorMap: Record<ProcessEvent['category'], string> = {
    PROCESS: 'bg-cyan-50 text-cyan-800 border-cyan-300 font-bold',
    FILE: 'bg-orange-50 text-orange-800 border-orange-300 font-bold',
    NETWORK: 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold',
    DECOY: 'bg-rose-50 text-rose-800 border-rose-300 font-black',
    DECISION: 'bg-amber-50 text-amber-900 border-amber-300 font-bold',
    RESPONSE: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
  };

  const getCategoryIcon = (category: ProcessEvent['category']) => {
    switch (category) {
      case 'PROCESS': return Cpu;
      case 'FILE': return FileText;
      case 'NETWORK': return Globe;
      case 'DECOY': return Lock;
      case 'DECISION': return Brain;
      case 'RESPONSE': return CheckCircle2;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6 font-mono text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-orange-500" />
            Process Behavior Timeline: {processName}
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Microsecond-granular eBPF syscall trace for PID <strong className="text-orange-600 font-bold">{pid}</strong> on node-01
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold">
            Executable: <strong className="text-black font-extrabold">/tmp/bad_encryptor</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
        {/* Timeline Event Feed (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider">
              CHRONOLOGICAL SYS CALL SEQUENCE ({mockProcessTimeline.length} EVENTS)
            </h3>
            <span className="text-[10px] text-slate-500 font-bold">Click any event to inspect metadata</span>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {mockProcessTimeline.map((evt) => {
              const isSelected = selectedEvent?.id === evt.id;

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`relative pl-8 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-orange-50/80 border-orange-400 shadow-sm scale-[1.01]'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className={`absolute left-1.5 top-4 w-4 h-4 rounded-full border flex items-center justify-center bg-white ${
                    evt.category === 'DECOY' ? 'border-rose-600 text-rose-600' : 'border-orange-500 text-orange-500'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-600 text-xs font-bold">{evt.timestamp}</span>
                      <span className="font-extrabold text-black text-xs">{evt.event_type}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] border ${categoryColorMap[evt.category]}`}>
                      {evt.category}
                    </span>
                  </div>

                  {evt.metadata?.path && (
                    <div className="mt-1 text-[11px] text-slate-600 font-medium truncate">
                      Path: <span className="text-slate-900 font-bold">{evt.metadata.path}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Metadata Inspector Drawer / Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-orange-500" />
                EVENT METADATA INSPECTOR
              </h3>
              {selectedEvent && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-orange-50 text-orange-800 font-extrabold border border-orange-200">
                  {selectedEvent.id}
                </span>
              )}
            </div>

            {selectedEvent ? (
              <div className="mt-4 space-y-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-semibold">
                  <div className="flex justify-between text-slate-600">
                    <span>Event Type:</span>
                    <span className="text-black font-extrabold">{selectedEvent.event_type}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Category:</span>
                    <span className="text-orange-600 font-extrabold">{selectedEvent.category}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Timestamp:</span>
                    <span className="text-slate-900 font-bold">{selectedEvent.timestamp}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>PID:</span>
                    <span className="text-slate-900 font-bold">{selectedEvent.pid}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-semibold">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">PAYLOAD & SYSCALL ARGUMENTS</span>
                  {selectedEvent.metadata.path && (
                    <div className="text-slate-800">
                      <span className="text-slate-600 font-bold">Target Path: </span>
                      <span className="text-orange-700 font-bold break-all">{selectedEvent.metadata.path}</span>
                    </div>
                  )}
                  {selectedEvent.metadata.bytes && (
                    <div className="text-slate-800">
                      <span className="text-slate-600 font-bold">Write Length: </span>
                      <span className="text-black font-bold">{selectedEvent.metadata.bytes} Bytes</span>
                    </div>
                  )}
                  {selectedEvent.metadata.dest_ip && (
                    <div className="text-slate-800">
                      <span className="text-slate-600 font-bold">Outbound Socket: </span>
                      <span className="text-rose-700 font-extrabold">{selectedEvent.metadata.dest_ip}:{selectedEvent.metadata.dest_port}</span>
                    </div>
                  )}
                  {selectedEvent.metadata.flags && (
                    <div className="text-slate-800">
                      <span className="text-slate-600 font-bold">Syscall Flags: </span>
                      <span className="text-slate-900 font-bold">{selectedEvent.metadata.flags}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-8 text-center font-medium">
                Select an event from the timeline to view low-level payload details.
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[11px] space-y-1">
            <span className="text-orange-700 font-extrabold">eBPF Syscall Trace Guarantee</span>
            <p className="text-slate-600 font-medium">
              Direct zero-copy interception via kprobe & tracepoint ring buffers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

