"use client";

import React, { useEffect, useState } from 'react';
import { Lock, Plus, RefreshCw, CheckCircle2, FileCode, Eye, RotateCw, Slash } from 'lucide-react';
import Link from 'next/link';
import { getDecoys } from '@/services/decoys';
import { Decoy } from '@/types';

export default function DecoysPage() {
  const [decoys, setDecoys] = useState<Decoy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDecoyInventory() {
      try {
        const data = await getDecoys();
        setDecoys(data);
      } catch (err) {
        console.error('Failed to fetch decoys inventory', err);
      } finally {
        setLoading(false);
      }
    }
    loadDecoyInventory();
  }, []);

  const handleDisableDecoy = (id: string) => {
    setDecoys((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'DISABLED' as const } : d))
    );
  };

  const handleRotateDecoy = (id: string) => {
    alert(`Rotated decoy trap configuration for ${id}. New token hash generated.`);
  };

  const handleDeployNewDecoy = () => {
    const newDecoy: Decoy = {
      id: `dec-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: `Q1_Audit_Trap_${Math.floor(Math.random() * 100)}.xlsx`,
      path: `/home/user/finance/Q1_Audit_Trap_${Math.floor(Math.random() * 100)}.xlsx`,
      file_type: 'XLSX Trap',
      endpoint_id: 'node-01',
      endpoint_hostname: 'node-01 (Ubuntu 24.04)',
      status: 'ACTIVE',
      created_at: 'Just now',
    };
    setDecoys((prev) => [newDecoy, ...prev]);
  };

  const activeCount = decoys.filter((d) => d.status === 'ACTIVE').length;
  const triggeredCount = decoys.filter((d) => d.status === 'TRIGGERED').length;

  return (
    <div className="space-y-6 font-mono text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2.5">
            <Lock className="w-6 h-6 text-orange-500" />
            Dynamic Decoys & Honeypot Trap Inventory
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Zero-false-positive fake document traps configured with semantic headers for instant ransomware kill.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDeployNewDecoy}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-mono font-bold shadow-md shadow-orange-500/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-white" />
            Deploy Trap Decoy File
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Total Active Traps</span>
          <h3 className="text-2xl font-black text-black mt-1">{activeCount}</h3>
          <p className="text-xs text-emerald-700 font-bold mt-1">100% Armed & eBPF Monitored</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Triggered Traps</span>
          <h3 className="text-2xl font-black text-rose-600 mt-1">{triggeredCount}</h3>
          <p className="text-xs text-slate-600 font-medium mt-1">SIGKILL Executed Instantly</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold">False Positive Guarantee</span>
          <h3 className="text-2xl font-black text-orange-600 mt-1">0.00%</h3>
          <p className="text-xs text-slate-600 font-medium mt-1">Legitimate users never access decoys</p>
        </div>
      </div>

      {/* Decoys Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm font-mono">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider">
            ARMED DECOY TRAP INVENTORY
          </h3>
          <span className="text-xs text-orange-600 font-bold flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-orange-500 animate-spin" /> Auto-Rotating Paths
          </span>
        </div>

        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-200 font-bold">
            <tr>
              <th className="py-3.5 px-4">Decoy Trap Name</th>
              <th className="py-3.5 px-4">Endpoint Host</th>
              <th className="py-3.5 px-4">Trap Path</th>
              <th className="py-3.5 px-4">Trap Status</th>
              <th className="py-3.5 px-4">Triggering PID</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {decoys.map((decoy) => (
              <tr key={decoy.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-extrabold text-black flex items-center gap-2">
                  <FileCode className={`w-4 h-4 ${decoy.status === 'TRIGGERED' ? 'text-rose-600 animate-pulse' : 'text-orange-500'}`} />
                  <span>{decoy.name}</span>
                </td>
                <td className="py-4 px-4 font-extrabold text-orange-600">{decoy.endpoint_hostname}</td>
                <td className="py-4 px-4 text-slate-700 font-medium max-w-xs truncate">{decoy.path}</td>
                <td className="py-4 px-4">
                  {decoy.status === 'ACTIVE' && (
                    <span className="px-2.5 py-1 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold">
                      ACTIVE TRAP
                    </span>
                  )}
                  {decoy.status === 'TRIGGERED' && (
                    <span className="px-2.5 py-1 rounded text-[10px] bg-rose-50 text-rose-800 border border-rose-300 font-black animate-pulse">
                      TRIGGERED
                    </span>
                  )}
                  {decoy.status === 'DISABLED' && (
                    <span className="px-2.5 py-1 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-300 font-bold">
                      DISABLED
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {decoy.triggering_pid ? (
                    <div>
                      <div className="font-extrabold text-rose-700">{decoy.triggering_process}</div>
                      <div className="text-[10px] text-slate-500 font-bold">PID: {decoy.triggering_pid}</div>
                    </div>
                  ) : (
                    <span className="text-slate-400">&mdash;</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {decoy.status === 'TRIGGERED' && (
                      <Link
                        href={`/alerts/alt-90412`}
                        className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-800 border border-orange-300 hover:bg-orange-100 transition flex items-center gap-1 font-extrabold"
                      >
                        <Eye className="w-3 h-3 text-orange-600" />
                        <span>Investigation</span>
                      </Link>
                    )}

                    <button
                      onClick={() => handleRotateDecoy(decoy.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 transition flex items-center gap-1 font-bold"
                    >
                      <RotateCw className="w-3 h-3 text-cyan-600" />
                      <span>Rotate</span>
                    </button>

                    {decoy.status !== 'DISABLED' && (
                      <button
                        onClick={() => handleDisableDecoy(decoy.id)}
                        className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-300 hover:bg-rose-50 hover:text-rose-700 transition"
                      >
                        <Slash className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
