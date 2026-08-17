import React, { useState, useEffect } from 'react';
import InteractiveWasteMap from '../components/map/InteractiveWasteMap';
import api from '../services/api';
import Loader from '../components/common/Loader';
import { MapPin, Filter, Layers, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MapViewPage = () => {
  const navigate = useNavigate();
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoneFilter, setZoneFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchMapBins = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/bins?zone=${zoneFilter}&status=${statusFilter}`);
      if (res.data.success) {
        setBins(res.data.data);
      }
    } catch (err) {
      setBins([
        { _id: '1', binId: 'BIN-101', name: 'Indiranagar 100ft Rd', location: '100 Feet Rd', zone: 'East Zone', fillLevel: 94, status: 'Critical', latitude: 12.9784, longitude: 77.6408, wasteCategory: 'Plastic', binType: 'Smart Solar' },
        { _id: '2', binId: 'BIN-102', name: 'Koramangala 5th Block', location: 'Jyoti Nivas Rd', zone: 'South Zone', fillLevel: 92, status: 'Critical', latitude: 12.9352, longitude: 77.6245, wasteCategory: 'Organic', binType: 'Standard' },
        { _id: '3', binId: 'BIN-103', name: 'Whitefield ITPL Gate', location: 'ITPL Main Rd', zone: 'East Zone', fillLevel: 88, status: 'Very High', latitude: 12.9863, longitude: 77.7337, wasteCategory: 'E-waste', binType: 'Hazardous' },
        { _id: '4', binId: 'BIN-104', name: 'MG Road Metro Hub', location: 'Trinity Station', zone: 'Central Zone', fillLevel: 78, status: 'High', latitude: 12.9736, longitude: 77.6180, wasteCategory: 'Paper', binType: 'Smart Solar' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapBins();
  }, [zoneFilter, statusFilter]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-400" /> Interactive GIS Waste Map
          </h1>
          <p className="text-xs text-slate-400 mt-1">Spatial distribution of municipal waste bins, status pins, and GPS tracking.</p>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> <span className="text-slate-300">&lt;50%</span></div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> <span className="text-slate-300">50-75%</span></div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> <span className="text-slate-300">75-90%</span></div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> <span className="text-rose-400 font-bold">&gt;90%</span></div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300">Map Layer Filters:</span>
          
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded-xl px-3 py-1.5"
          >
            <option value="All">All Municipal Zones</option>
            <option value="East Zone">East Zone</option>
            <option value="South Zone">South Zone</option>
            <option value="Central Zone">Central Zone</option>
            <option value="North Zone">North Zone</option>
            <option value="West Zone">West Zone</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded-xl px-3 py-1.5"
          >
            <option value="All">All Statuses</option>
            <option value="Critical">Critical (&gt;90%)</option>
            <option value="High">High / Very High (&gt;75%)</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <button onClick={fetchMapBins} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Map Container */}
      {loading ? (
        <Loader text="Rendering GIS coordinates and spatial markers..." />
      ) : (
        <InteractiveWasteMap
          bins={bins}
          onScheduleCollection={(bin) => navigate('/collections', { state: { selectedBin: bin } })}
          height="620px"
        />
      )}
    </div>
  );
};

export default MapViewPage;
