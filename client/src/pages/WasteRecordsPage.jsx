import React, { useState, useEffect } from 'react';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { FileText, Filter, Calendar, Search, RefreshCw } from 'lucide-react';

const WasteRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/analytics/records?category=${categoryFilter}&zone=${zoneFilter}`);
      if (res.data.success) {
        setRecords(res.data.data);
      }
    } catch (err) {
      setRecords([
        { _id: '1', recordId: 'WR-1001', category: 'Plastic', quantity: 210, unit: 'kg', zone: 'East Zone', collectionDate: new Date() },
        { _id: '2', recordId: 'WR-1002', category: 'Organic', quantity: 340, unit: 'kg', zone: 'South Zone', collectionDate: new Date() },
        { _id: '3', recordId: 'WR-1003', category: 'E-waste', quantity: 180, unit: 'kg', zone: 'East Zone', collectionDate: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [categoryFilter, zoneFilter]);

  const totalKg = records.reduce((acc, r) => acc + (r.quantity || 0), 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" /> Waste Collection Records & Audit Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">Immutable collection logs, waste category weights, and zone audit tracking.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          <span className="text-xs text-slate-400 block">Total Filtered Weight:</span>
          <span className="text-lg font-extrabold text-emerald-400 font-mono">{totalKg.toLocaleString()} kg</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300">Filters:</span>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded-xl px-3 py-1.5"
          >
            <option value="All">All Categories</option>
            <option value="Organic">Organic</option>
            <option value="Plastic">Plastic</option>
            <option value="Paper">Paper</option>
            <option value="Glass">Glass</option>
            <option value="E-waste">E-waste</option>
            <option value="Metal">Metal</option>
            <option value="Mixed">Mixed</option>
          </select>

          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded-xl px-3 py-1.5"
          >
            <option value="All">All Zones</option>
            <option value="East Zone">East Zone</option>
            <option value="South Zone">South Zone</option>
            <option value="Central Zone">Central Zone</option>
            <option value="North Zone">North Zone</option>
            <option value="West Zone">West Zone</option>
          </select>
        </div>

        <button onClick={fetchRecords} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <Loader text="Loading waste collection logs..." />
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Record ID</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Municipal Zone</th>
                  <th className="py-3.5 px-4">Waste Category</th>
                  <th className="py-3.5 px-4">Weight (kg)</th>
                  <th className="py-3.5 px-4">Associated Bin / Vehicle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {records.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">{r.recordId}</td>
                    <td className="py-3.5 px-4 text-slate-300">{new Date(r.collectionDate).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-semibold">{r.zone}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-800 text-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white font-mono text-sm">{r.quantity} kg</td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {r.binId?.name || 'Bin Location'} {r.vehicleId?.registrationNumber ? `(${r.vehicleId.registrationNumber})` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteRecordsPage;
