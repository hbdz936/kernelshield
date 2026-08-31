import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  color: 'orange' | 'cyan' | 'rose' | 'emerald' | 'amber';
}

export default function StatCard({ title, value, subtext, icon: Icon, color }: StatCardProps) {
  const colorMap = {
    orange: 'bg-orange-50/50 text-orange-800 border-orange-200',
    cyan: 'bg-cyan-50/50 text-cyan-800 border-cyan-200',
    rose: 'bg-rose-50/50 text-rose-800 border-rose-200',
    emerald: 'bg-emerald-50/50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50/50 text-amber-800 border-amber-200',
  };

  const iconBgMap = {
    orange: 'bg-orange-500 text-white shadow-md shadow-orange-500/20',
    cyan: 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20',
    rose: 'bg-rose-600 text-white shadow-md shadow-rose-500/20',
    emerald: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20',
    amber: 'bg-amber-600 text-white shadow-md shadow-amber-500/20',
  };

  return (
    <div className={`p-5 rounded-2xl bg-white border ${colorMap[color]} shadow-sm transition hover:shadow-md hover:scale-[1.01]`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl ${iconBgMap[color]}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-3xl font-black text-black tracking-tight">{value}</div>
        <p className="text-xs text-slate-600 mt-1 font-mono font-medium">{subtext}</p>
      </div>
    </div>
  );
}


