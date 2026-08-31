import React from 'react';
import { Severity } from '../../types';

interface ThreatBadgeProps {
  score?: number;
  severity?: Severity;
  showScore?: boolean;
}

export default function ThreatBadge({ score, severity, showScore = true }: ThreatBadgeProps) {
  let computedSev: Severity = severity || 'NORMAL';
  if (score !== undefined) {
    if (score >= 90) computedSev = 'CRITICAL';
    else if (score >= 70) computedSev = 'HIGH';
    else if (score >= 40) computedSev = 'MEDIUM';
    else if (score >= 20) computedSev = 'LOW';
    else computedSev = 'NORMAL';
  }

  const styles: Record<Severity, string> = {
    NORMAL: 'bg-slate-100 text-slate-800 border-slate-300 font-semibold',
    LOW: 'bg-blue-50 text-blue-800 border-blue-300 font-semibold',
    MEDIUM: 'bg-amber-50 text-amber-900 border-amber-300 font-bold',
    HIGH: 'bg-orange-50 text-orange-900 border-orange-300 font-bold',
    CRITICAL: 'bg-rose-50 text-rose-900 border-rose-400 font-black shadow-xs',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-mono border ${styles[computedSev]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        computedSev === 'CRITICAL' ? 'bg-rose-600 animate-pulse' :
        computedSev === 'HIGH' ? 'bg-orange-600' :
        computedSev === 'MEDIUM' ? 'bg-amber-600' :
        computedSev === 'LOW' ? 'bg-blue-600' : 'bg-slate-500'
      }`} />
      <span>{computedSev}</span>
      {showScore && score !== undefined && <span className="opacity-90">({score.toFixed(0)})</span>}
    </span>
  );
}
