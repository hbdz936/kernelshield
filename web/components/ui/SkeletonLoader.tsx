import React from 'react';

export default function SkeletonLoader({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-slate-800/60 rounded-lg w-full" />
      ))}
    </div>
  );
}
