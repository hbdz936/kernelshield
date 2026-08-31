import './globals.css';
import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'KernelShield - Proactive Ransomware Defense Platform',
  description: 'eBPF Signal-Correlated Context-Aware Linux Ransomware Defense',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="flex min-h-screen bg-white text-slate-900 antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
          <Navbar />
          <main className="p-6 flex-1 space-y-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
