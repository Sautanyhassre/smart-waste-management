import React, { useState, useEffect } from 'react';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, Truck, Filter, Search, ShieldAlert, Sparkles } from 'lucide-react';

const MOCK_BINS = [
  { _id: '1', binId: 'BIN-101', name: 'Indiranagar 100ft Rd', location: '100 Feet Rd', zone: 'East Zone', fillLevel: 94, status: 'Critical', priorityScore: 95, priorityLevel: 'Critical', binType: 'Smart Solar', wasteCategory: 'Plastic' },
  { _id: '2', binId: 'BIN-102', name: 'Koramangala 5th Block', location: 'Jyoti Nivas Rd', zone: 'South Zone', fillLevel: 92, status: 'Critical', priorityScore: 92, priorityLevel: 'Critical', binType: 'Standard', wasteCategory: 'Organic' },
  { _id: '3', binId: 'BIN-103', name: 'Whitefield ITPL Gate', location: 'ITPL Main Rd', zone: 'East Zone', fillLevel: 88, status: 'Very High', priorityScore: 84, priorityLevel: 'High', binType: 'Hazardous', wasteCategory: 'E-waste' },
  { _id: '4', binId: 'BIN-104', name: 'HSR Layout Sector 2', location: '27th Main Rd', zone: 'South Zone', fillLevel: 72, status: 'High', priorityScore: 68, priorityLevel: 'Medium', binType: 'Standard', wasteCategory: 'Mixed' },
  { _id: '5', binId: 'BIN-105', name: 'MG Road Metro', location: 'MG Road', zone: 'Central Zone', fillLevel: 45, status: 'Moderate', priorityScore: 40, priorityLevel: 'Low', binType: 'Smart Solar', wasteCategory: 'Paper' }
];

const BinMonitoringPage = () => {
  const navigate = useNavigate();
  const [bins, setBins] = useState(MOCK_BINS);   // instant mock data
  const [loading, setLoading] = useState(false);  // no full-screen spinner
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const fetchMonitoringData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/bins?search=${search}&priority=${priorityFilter}`);
      if (res.data.success) {
        setBins(res.data.data);
      }
    } catch (err) {
      // Keep existing mock data on error — no blank screen
      console.warn('Backend offline — showing demo bin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoringData();
  }, [priorityFilter]);

  const handleUpdateFill = async (id, newFill) => {
    try {
      await api.patch(`/bins/${id}/fill-level`, { fillLevel: newFill });
      fetchMonitoringData();
    } catch (err) {
      alert('Failed to update fill level');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" /> Real-time Bin Monitoring & Priority Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1">Live fill telemetry, IoT sensor updates, and algorithmic priority scores.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMonitoringData}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" /> Refresh Telemetry
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search Bin ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchMonitoringData()}
            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">Filter Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="All">All Priority Levels</option>
            <option value="Critical">Critical (&ge;80 Score)</option>
            <option value="High">High (60-79 Score)</option>
            <option value="Medium">Medium (40-59 Score)</option>
            <option value="Low">Low (&lt;40 Score)</option>
          </select>
        </div>
      </div>

      {/* Monitoring Grid */}
      {loading ? (
        <Loader text="Calculating live collection priority scores..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bins.map((bin) => {
            const isCritical = bin.fillLevel >= 75 || bin.priorityScore >= 80;
            return (
              <div 
                key={bin._id || bin.binId}
                className={`glass-panel p-5 rounded-2xl border transition-all relative ${
                  isCritical ? 'border-rose-500/50 bg-rose-950/10' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white">{bin.binId}</span>
                      <Badge status={bin.status}>{bin.status}</Badge>
                    </div>
                    <h3 className="font-bold text-sm text-white mt-1">{bin.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{bin.location} ({bin.zone})</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Priority</span>
                    <span className={`text-sm font-extrabold px-2 py-0.5 rounded-lg inline-block mt-0.5 ${
                      bin.priorityScore >= 80 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      bin.priorityScore >= 60 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {bin.priorityScore || Math.round(bin.fillLevel * 0.9)} / 100
                    </span>
                  </div>
                </div>

                {/* Fill Level Gauge */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">Current Fill Volume</span>
                    <span className={bin.fillLevel > 90 ? 'text-rose-400 font-extrabold' : 'text-emerald-400'}>
                      {bin.fillLevel}% ({Math.round((bin.capacity || 240) * (bin.fillLevel / 100))}L / {bin.capacity || 240}L)
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        bin.fillLevel > 90 ? 'bg-rose-500' :
                        bin.fillLevel > 75 ? 'bg-amber-500' :
                        bin.fillLevel > 50 ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${bin.fillLevel}%` }}
                    />
                  </div>
                </div>

                {/* Quick Simulation Slider */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-500 block mb-1">Simulate Sensor Telemetry %</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={bin.fillLevel}
                      onChange={(e) => handleUpdateFill(bin._id, Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <button
                    onClick={() => navigate('/collections', { state: { selectedBin: bin } })}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Truck className="w-3.5 h-3.5" /> Dispatch
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BinMonitoringPage;
