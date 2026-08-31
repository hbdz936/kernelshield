"use client";

import React from 'react';
import { ShieldAlert, X, Sliders, CheckCircle2 } from 'lucide-react';
import { ResponseMode } from '@/types';

interface ResponseModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: ResponseMode;
  onSelectMode?: (newMode: ResponseMode) => void;
  // Optional action mode params
  isActionMode?: boolean;
  processName?: string;
  pid?: number;
  endpoint?: string;
  action?: string;
  onConfirmAction?: () => void;
}

export default function ResponseModeModal({
  isOpen,
  onClose,
  mode = 'SIMULATE',
  onSelectMode,
  isActionMode = false,
  processName = 'bad_encryptor',
  pid = 2048,
  endpoint = 'node-01',
  action = 'TERMINATE PROCESS + ISOLATE NETWORK',
  onConfirmAction,
}: ResponseModeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2.5 text-orange-600">
            {isActionMode ? <ShieldAlert className="w-5 h-5 text-rose-600" /> : <Sliders className="w-5 h-5 text-orange-500" />}
            <h3 className="font-extrabold text-sm tracking-wide text-black uppercase font-mono">
              {isActionMode ? 'CONFIRM ACTIVE MITIGATION' : 'SELECT RESPONSE MODE'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isActionMode ? (
          <div className="space-y-4 font-mono">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs font-semibold">
              <div className="flex justify-between text-slate-600">
                <span>Target Process:</span>
                <span className="text-black font-extrabold">{processName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Target PID:</span>
                <span className="text-slate-900">{pid}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Target Endpoint:</span>
                <span className="text-orange-600 font-extrabold">{endpoint}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-2.5 border-t border-slate-200">
                <span>Mitigation Directive:</span>
                <span className="text-rose-600 font-extrabold">{action}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-sans font-medium">
              Executing this action sends an immediate SIGKILL directive via eBPF ring buffer to endpoint host <strong className="text-black font-mono">{endpoint}</strong>.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onConfirmAction) onConfirmAction();
                  onClose();
                }}
                className="px-4 py-2 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-md shadow-rose-600/20"
              >
                Confirm Mitigate Directive
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 font-mono">
            <p className="text-xs text-slate-700 font-medium font-sans">
              Configure how KernelShield decision engine responds to detected ransomware threat behavior.
            </p>

            <div className="space-y-3">
              {[
                {
                  id: 'OBSERVE' as ResponseMode,
                  title: 'OBSERVE MODE',
                  desc: 'Log and correlate behavioral telemetry without taking automated kill/isolation actions.',
                  badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-300',
                },
                {
                  id: 'SIMULATE' as ResponseMode,
                  title: 'SIMULATE MODE (Default Demo)',
                  desc: 'Generate real-time telemetry alerts, correlation decisions, and mock mitigations safely.',
                  badgeColor: 'bg-orange-50 text-orange-800 border-orange-300',
                },
                {
                  id: 'ENFORCE' as ResponseMode,
                  title: 'ENFORCE MODE',
                  desc: 'Autonomous kernel-level process termination (SIGKILL) & network socket isolation upon threat detection.',
                  badgeColor: 'bg-rose-50 text-rose-800 border-rose-300',
                },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    if (onSelectMode) onSelectMode(m.id);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    mode === m.id
                      ? 'bg-orange-50/80 border-orange-400 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-xs font-mono text-black">{m.title}</span>
                      {mode === m.id && <CheckCircle2 className="w-4 h-4 text-orange-500" />}
                    </div>
                    <p className="text-[11px] text-slate-600 font-sans font-medium">{m.desc}</p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${m.badgeColor}`}>
                    {m.id}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


