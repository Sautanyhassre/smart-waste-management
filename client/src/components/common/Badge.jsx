import React from 'react';

const Badge = ({ children, status }) => {
  let styleClass = 'bg-slate-800 text-slate-300 border-slate-700';

  const s = (status || children || '').toString().toLowerCase();

  if (['critical', 'overflowing', 'very high', 'high', 'delayed', 'maintenance'].includes(s)) {
    if (s === 'critical' || s === 'overflowing') {
      styleClass = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    } else if (s === 'very high' || s === 'high' || s === 'delayed') {
      styleClass = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    } else if (s === 'maintenance') {
      styleClass = 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    }
  } else if (['completed', 'available', 'low', 'empty', 'assigned'].includes(s)) {
    if (s === 'completed' || s === 'available' || s === 'low' || s === 'empty') {
      styleClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    } else {
      styleClass = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
    }
  } else if (['in progress', 'collecting', 'moderate'].includes(s)) {
    styleClass = 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styleClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {children}
    </span>
  );
};

export default Badge;
