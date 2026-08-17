import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="text-6xl font-black text-emerald-500 mb-2">404</div>
      <h2 className="text-xl font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm mb-6">
        The route you are trying to access does not exist or requires higher administrative privileges.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
      >
        <Home className="w-4 h-4" /> Return to Dashboard
      </button>
    </div>
  );
};

export default NotFoundPage;
