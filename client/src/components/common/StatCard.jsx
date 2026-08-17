import React from 'react';

const StatCard = ({ title, value, unit, icon: Icon, trend, trendValue, color = 'emerald', critical = false }) => {
  const colorMap = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-5 glass-card transition-all duration-300
      ${critical ? 'border-rose-500/50 bg-rose-950/20 critical-glow' : ''}
    `}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorMap[color] || colorMap.emerald}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{value}</span>
        {unit && <span className="text-xs text-slate-400 font-medium">{unit}</span>}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium">
          <span className={trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
          <span className="text-slate-500">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
