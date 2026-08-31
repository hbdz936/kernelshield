"use client";

import React, { useState } from 'react';
import { Bell, Search, Lock, Sliders } from 'lucide-react';
import ResponseModeModal from './ui/ResponseModeModal';
import { ResponseMode } from '@/types';

interface NavbarProps {
  onSearchChange?: (term: string) => void;
  sseConnected?: boolean;
}

export default function Navbar({ onSearchChange, sseConnected = true }: NavbarProps) {
  const [responseMode, setResponseMode] = useState<ResponseMode>('SIMULATE');
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        {/* Search Input */}
        <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 w-96 text-sm focus-within:border-orange-500 transition">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search PID, process name, rule, or path..."
            className="bg-transparent border-none outline-none text-slate-900 placeholder-slate-500 w-full text-xs font-mono font-medium"
          />
        </div>

        {/* Top Status & Controls */}
        <div className="flex items-center space-x-3">
          {/* Response Mode Selector */}
          <button
            onClick={() => setIsModeModalOpen(true)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition shadow-sm ${
              responseMode === 'ENFORCE'
                ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                : responseMode === 'SIMULATE'
                ? 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100'
                : 'bg-cyan-50 text-cyan-700 border-cyan-300 hover:bg-cyan-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-orange-500" />
            <span>MODE: {responseMode}</span>
          </button>

          {/* Live SSE Stream Indicator */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
              sseConnected
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-rose-50 border-rose-300 text-rose-700'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${sseConnected ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${sseConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            </span>
            <span>{sseConnected ? '● SSE CONNECTED' : '● SSE DISCONNECTED'}</span>
          </div>

          {/* System Defense Lock */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono font-semibold">
            <Lock className="w-3.5 h-3.5 text-orange-500" />
            <span>5s CORRELATOR: ACTIVE</span>
          </div>

          {/* Notification Button */}
          <button className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 relative transition">
            <Bell className="w-4 h-4 text-slate-800" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          </button>
        </div>
      </header>

      {/* Response Mode Selector Modal */}
      <ResponseModeModal
        isOpen={isModeModalOpen}
        onClose={() => setIsModeModalOpen(false)}
        mode={responseMode}
        onSelectMode={(newMode) => setResponseMode(newMode)}
      />
    </>
  );
}


