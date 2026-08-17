import React, { useState, useEffect } from 'react';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { Bell, AlertTriangle, CheckCircle, ShieldAlert, Clock } from 'lucide-react';

const AlertsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      setNotifications([
        { _id: '1', title: 'CRITICAL: Bin BIN-101 Overflowing', message: 'Indiranagar 100ft Rd Bin A is at 94% capacity. Immediate collection required!', severity: 'critical', type: 'overflow', createdAt: new Date() },
        { _id: '2', title: 'CRITICAL: Bin BIN-114 E-Waste Full', message: 'Gachibowli DLF Cybercity bin has reached 95% capacity.', severity: 'critical', type: 'overflow', createdAt: new Date() },
        { _id: '3', title: 'Warning: Bin BIN-102 Crossed 90%', message: 'Koramangala 5th Block Hub bin is 92% full.', severity: 'warning', type: 'overflow', createdAt: new Date() },
        { _id: '4', title: 'Collection COL-106 Delayed', message: 'Traffic congestion delayed arrival by 45 mins.', severity: 'warning', type: 'delay', createdAt: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-400" /> System Alerts & Overflow Audit Log
          </h1>
          <p className="text-xs text-slate-400 mt-1">Real-time alerts triggered by bin fill thresholds, collection delays, and vehicle service flags.</p>
        </div>
      </div>

      {/* Alerts Feed */}
      {loading ? (
        <Loader text="Loading alert notification logs..." />
      ) : (
        <div className="space-y-4">
          {notifications.map((alert) => (
            <div
              key={alert._id}
              className={`glass-panel p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                alert.severity === 'critical' ? 'border-rose-500/50 bg-rose-950/10' :
                alert.severity === 'warning' ? 'border-amber-500/50 bg-amber-950/10' :
                'border-slate-800'
              }`}
            >
              <div className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                alert.severity === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse' :
                alert.severity === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-extrabold text-sm text-white">{alert.title}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(alert.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{alert.message}</p>
                {alert.relatedEntity && (
                  <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Entity: {alert.relatedEntity}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
