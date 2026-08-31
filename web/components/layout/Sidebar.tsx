"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, AlertTriangle, Server, Target, Brain, Activity, Clock } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const primaryNav = [
    { name: 'SOC Overview', href: '/', icon: Shield },
    { name: 'Live Alerts', href: '/alerts', icon: AlertTriangle },
    { name: 'Endpoint Nodes', href: '/endpoints', icon: Server },
    { name: 'Dynamic Decoys', href: '/decoys', icon: Target },
    { name: 'Decision Engine', href: '/decision-engine', icon: Brain },
  ];

  const contextualNav = [
    { name: 'Telemetry Graph', href: '/telemetry', icon: Activity },
    { name: 'Process Timeline', href: '/process-timeline', icon: Clock },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-20 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wider text-white font-mono">KERNELSHIELD</h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight">Proactive Ransomware Defense</p>
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <div className="p-3">
          <p className="px-3 py-2 text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
            Core SOC Navigation
          </p>
          <nav className="space-y-1">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-mono transition ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Contextual Analytics Navigation */}
        <div className="p-3 border-t border-slate-800/80">
          <p className="px-3 py-2 text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
            Contextual Views
          </p>
          <nav className="space-y-1">
            {contextualNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-mono transition ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer System Telemetry Status */}
      <div className="p-3 m-3 bg-slate-950 rounded-lg border border-slate-800">
        <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>eBPF INTERLOCK ACTIVE</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1 font-mono">Intercepting: openat, write, execve, connect</p>
      </div>
    </aside>
  );
}
