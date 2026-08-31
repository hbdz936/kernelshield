"use client";

import React, { useEffect, useState } from 'react';
import { getDecisionByPID } from '@/services/decisions';
import { DecisionDetails } from '@/types';
import ThreatBadge from '@/components/ui/ThreatBadge';
import { Brain, ShieldAlert, CheckCircle2, ArrowRight, Activity, Zap } from 'lucide-react';
import ResponseModeModal from '@/components/ui/ResponseModeModal';

export default function DecisionEnginePage() {
  const [decision, setDecision] = useState<DecisionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    async function loadDecision() {
      try {
        const data = await getDecisionByPID(2048);
        setDecision(data);
      } catch (err) {
        console.error('Failed to load decision engine details', err);
      } finally {
        setLoading(false);
      }
    }
    loadDecision();
  }, []);

  if (loading || !decision) {
    return (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-64" />
        <div className="h-40 bg-slate-200 rounded w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono text-slate-900">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2.5">
            <Brain className="w-6 h-6 text-orange-500" />
            Decision Engine & Signal Correlation
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Attribution pipeline explaining WHY KernelShield classified PID {decision.pid} as malicious ransomware.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className="px-4 py-2 text-xs font-mono font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-md shadow-rose-600/20 flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            Trigger Mitigation Directive
          </button>
        </div>
      </div>

      {/* Target Process Metadata Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-6 font-mono shadow-sm">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold">Target Process</span>
          <h3 className="text-lg font-black text-black mt-1">{decision.process_name}</h3>
          <p className="text-xs text-slate-600 font-medium mt-0.5">{decision.executable_path}</p>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold">PID & Host</span>
          <h3 className="text-lg font-black text-orange-600 mt-1">PID {decision.pid}</h3>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Endpoint: {decision.endpoint_hostname}</p>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold">Attribution Model</span>
          <h3 className="text-sm font-bold text-black mt-1">5s Correlated Rule Engine</h3>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Deterministic Signal Multipliers</p>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold">Decision Verdict</span>
          <div className="mt-1">
            <ThreatBadge score={decision.threat_score} severity={decision.severity} />
          </div>
          <p className="text-xs text-emerald-700 font-bold mt-1">Confidence: {decision.confidence}%</p>
        </div>
      </div>

      {/* Pipeline Flow Visualization */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <h3 className="text-xs font-mono font-bold text-black uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-orange-500" />
          DECISION PIPELINE FLOW
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-[10px] text-slate-500 font-bold">1. RAW SIGNALS</div>
            <div className="text-black font-extrabold">eBPF Syscalls</div>
            <p className="text-[10px] text-slate-600">write, openat, rename, connect</p>
          </div>

          <div className="hidden md:flex justify-center text-orange-500">
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-[10px] text-slate-500 font-bold">2. AGGREGATION</div>
            <div className="text-black font-extrabold">5s Window</div>
            <p className="text-[10px] text-slate-600">Entropy & Path Multiplier</p>
          </div>

          <div className="hidden md:flex justify-center text-rose-500">
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-[10px] text-slate-500 font-bold">3. CORRELATION SCORE</div>
            <div className="text-rose-700 font-black">100 / 100</div>
            <p className="text-[10px] text-emerald-700 font-bold">SIGKILL Directive</p>
          </div>
        </div>
      </div>

      {/* Signal Contribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-mono font-bold text-black">
                SIGNAL CONTRIBUTION BREAKDOWN
              </h3>
              <p className="text-xs text-slate-600 font-medium font-mono">Weighted behavior contributions summed to reach total threat score</p>
            </div>
            <span className="text-xs font-mono font-extrabold bg-orange-50 text-orange-800 px-2.5 py-1 rounded border border-orange-200">
              Total Score: {decision.threat_score}/100
            </span>
          </div>

          <div className="space-y-3 font-mono">
            {decision.contributions.map((c, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-black">{c.feature}</span>
                  <span className="text-xs font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded border border-orange-300">
                    +{c.score} PTS
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full"
                    style={{ width: `${(c.score / 30) * 100}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-700 font-medium">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verdict & Executed Action */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4 font-mono">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              CORRELATION DECISION
            </div>

            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-300 text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-rose-600 mx-auto animate-pulse" />
              <div className="text-base font-black text-rose-800">{decision.decision_text}</div>
              <p className="text-xs text-slate-800 font-medium">
                Confidence: <strong className="text-black">{decision.confidence}%</strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">EXECUTED MITIGATION ACTION</span>
              <div className="flex items-center space-x-2 text-emerald-800 font-black text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{decision.executed_action}</span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium">
                Process terminated via eBPF kernel ring buffer. Endpoint network sockets isolated.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs font-mono text-slate-800 space-y-1">
            <div className="font-bold text-orange-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-orange-600" />
              Deterministic Rule Engine Guarantee
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              No black-box machine learning hallucination. Every threat score points to specific eBPF kernel syscall evidence.
            </p>
          </div>
        </div>
      </div>

      {/* Mitigation Action Modal */}
      <ResponseModeModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        isActionMode={true}
        processName={decision.process_name}
        pid={decision.pid}
        endpoint={decision.endpoint_hostname}
        action={decision.executed_action}
        onConfirmAction={() => {
          alert(`Sent SIGKILL to PID ${decision.pid} on ${decision.endpoint_hostname}`);
        }}
      />
    </div>
  );
}

