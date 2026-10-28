import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Trash2,
  Activity,
  MapPin,
  Truck,
  CalendarCheck,
  BarChart3,
  FileText,
  Bell,
  ShieldCheck,
  MessageSquare,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);

  const currentRole = user?.role || 'viewer';

  // Role-specific tailored navigation
  let navItems = [];

  if (currentRole === 'admin') {
    navItems = [
      { label: 'Executive Command', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Complaint Control', path: '/complaints', icon: MessageSquare },
      { label: 'Collections Dispatch', path: '/collections', icon: CalendarCheck },
      { label: 'Bin Infrastructure', path: '/bins', icon: Trash2 },
      { label: 'Fleet Telemetry', path: '/vehicles', icon: Truck },
      { label: 'Live GIS Map', path: '/map', icon: MapPin },
      { label: 'Municipal Analytics', path: '/analytics', icon: BarChart3 },
      { label: 'Audit Reports', path: '/reports', icon: FileText },
      { label: 'Suggestions Inbox', path: '/suggestions', icon: FileText },
      { label: 'System Alerts', path: '/alerts', icon: Bell }
    ];
  } else if (currentRole === 'staff') {
    navItems = [
      { label: 'Field Operations', path: '/dashboard', icon: LayoutDashboard },
      { label: 'My Assigned Tasks', path: '/collections', icon: CalendarCheck },
      { label: 'Assigned Complaints', path: '/complaints', icon: MessageSquare },
      { label: 'Bin Fill Telemetry', path: '/monitoring', icon: Activity },
      { label: 'Collection Vehicles', path: '/vehicles', icon: Truck },
      { label: 'Route Map', path: '/map', icon: MapPin },
      { label: 'Field Alerts', path: '/alerts', icon: Bell }
    ];
  } else {
    // Viewer / Citizen Navigation
    navItems = [
      { label: 'Citizen Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Report Waste Issue', path: '/complaints', icon: MessageSquare },
      { label: 'My Complaints', path: '/my-complaints', icon: FileText },
      { label: 'Find Bins on Map', path: '/map', icon: MapPin },
      { label: 'Suggestions & Ideas', path: '/suggestions', icon: MessageSquare },
      { label: 'City Notifications', path: '/alerts', icon: Bell }
    ];
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              ♻️
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-white leading-none">Smart Waste</h1>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mt-1">Analytics Hub</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {currentRole === 'admin' ? 'Admin Command' : currentRole === 'staff' ? 'Field Workspace' : 'Citizen Portal'}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group
                  ${isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/5'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Role Badge Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{user?.name || 'Demo User'}</div>
              <div className="text-[10px] text-slate-400 capitalize">{user?.role || 'Guest'} Mode</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
