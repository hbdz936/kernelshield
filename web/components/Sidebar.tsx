"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, AlertTriangle, Cpu, Target, Brain, Activity, LineChart } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const primaryNavItems = [
    { name: 'SOC Overview', href: '/', icon: Shield },
    { name: 'Live Alerts', href: '/alerts', icon: AlertTriangle },
    { name: 'Endpoint Nodes', href: '/endpoints', icon: Cpu },
    { name: 'Dynamic Decoys', href: '/decoys', icon: Target },
    { name: 'Decision Engine', href: '/decision', icon: Brain },
  ];

  const contextualNavItems = [
    { name: 'Telemetry Graph', href: '/telemetry', icon: LineChart },
    { name: 'Process Timeline', href: '/timeline/2048', icon: Activity },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-20 shadow-sm">
      <div>
        {/* Brand Header */}
        <div className="p-5 flex items-center space-x-3 border-b border-slate-200 bg-white">
          <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider text-black flex items-center gap-1">
              KERNEL<span className="text-orange-500">SHIELD</span>
            </h1>
            <p className="text-[11px] text-slate-600 font-mono font-medium tracking-tight">Proactive Ransomware Defense</p>
          </div>
        </div>

        {/* Primary Navigation */}
        <div className="p-3">
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Core Console
          </div>
          <nav className="space-y-1 mt-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-600 border border-orange-500/40 shadow-sm'
                      : 'text-slate-700 hover:text-black hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-orange-500' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Contextual Views */}
          <div className="px-3 pt-5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Investigation & Analysis
          </div>
          <nav className="space-y-1 mt-1">
            {contextualNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-600 border border-orange-500/40 font-bold'
                      : 'text-slate-600 hover:text-black hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-500' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Kernel Engine Monitor */}
      <div className="p-4 m-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-600 font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>eBPF Ring: ACTIVE</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-orange-500/10 text-orange-600 px-1.5 py-0.5 rounded border border-orange-500/30">
            v1.0.0
          </span>
        </div>
        <p className="text-[10px] text-slate-600 font-mono leading-tight font-medium">
          Sensors: execve, openat, write, rename, connect
        </p>
      </div>
    </aside>
  );
}


