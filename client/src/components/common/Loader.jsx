import React from 'react';

const Loader = ({ text = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
      <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
      <p className="text-xs font-medium text-slate-400">{text}</p>
    </div>
  );
};

export default Loader;
