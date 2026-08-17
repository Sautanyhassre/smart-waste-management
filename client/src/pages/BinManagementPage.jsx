import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { Trash2, Plus, Edit2, Search, Filter, AlertTriangle, RefreshCw } from 'lucide-react';

const BinManagementPage = () => {
  const { isAdmin } = useContext(AuthContext);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBinId, setCurrentBinId] = useState(null);

  const [formData, setFormData] = useState({
    binId: '',
    name: '',
    location: '',
    zone: 'East Zone',
    latitude: 12.9716,
    longitude: 77.5946,
    binType: 'Standard',
    wasteCategory: 'Organic',
    capacity: 240,
    fillLevel: 0
  });

  const fetchBins = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/bins?search=${search}&zone=${zoneFilter}&status=${statusFilter}`);
      if (res.data.success) {
        setBins(res.data.data);
      }
    } catch (err) {
      console.warn('Backend offline, loading mock bins');
      setBins([
        { _id: '1', binId: 'BIN-101', name: 'Indiranagar 100ft Rd', location: '100 Feet Rd', zone: 'East Zone', fillLevel: 94, status: 'Critical', priorityLevel: 'Critical', binType: 'Smart Solar', wasteCategory: 'Plastic', capacity: 300, latitude: 12.9784, longitude: 77.6408 },
        { _id: '2', binId: 'BIN-102', name: 'Koramangala 5th Block', location: 'Jyoti Nivas Rd', zone: 'South Zone', fillLevel: 92, status: 'Critical', priorityLevel: 'Critical', binType: 'Standard', wasteCategory: 'Organic', capacity: 240, latitude: 12.9352, longitude: 77.6245 },
        { _id: '3', binId: 'BIN-103', name: 'Whitefield ITPL Gate', location: 'ITPL Main Rd', zone: 'East Zone', fillLevel: 88, status: 'Very High', priorityLevel: 'High', binType: 'Hazardous', wasteCategory: 'E-waste', capacity: 200, latitude: 12.9863, longitude: 77.7337 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
  }, [zoneFilter, statusFilter]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      binId: `BIN-${Math.floor(Math.random() * 899 + 100)}`,
      name: '',
      location: '',
      zone: 'East Zone',
      latitude: 12.9716,
      longitude: 77.5946,
      binType: 'Standard',
      wasteCategory: 'Organic',
      capacity: 240,
      fillLevel: 10
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bin) => {
    setIsEditing(true);
    setCurrentBinId(bin._id);
    setFormData({
      binId: bin.binId,
      name: bin.name,
      location: bin.location,
      zone: bin.zone,
      latitude: bin.latitude,
      longitude: bin.longitude,
      binType: bin.binType,
      wasteCategory: bin.wasteCategory,
      capacity: bin.capacity,
      fillLevel: bin.fillLevel
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/bins/${currentBinId}`, formData);
      } else {
        await api.post('/bins', formData);
      }
      setIsModalOpen(false);
      fetchBins();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving waste bin');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bin?')) return;
    try {
      await api.delete(`/bins/${id}`);
      fetchBins();
    } catch (err) {
      alert('Error deleting bin');
    }
  };

  const handleQuickFillUpdate = async (id, currentFill) => {
    const newFill = prompt('Enter new fill level % (0-100):', currentFill);
    if (newFill === null) return;
    const num = Number(newFill);
    if (isNaN(num) || num < 0 || num > 100) return alert('Please enter a valid fill percentage between 0 and 100');

    try {
      await api.patch(`/bins/${id}/fill-level`, { fillLevel: num });
      fetchBins();
    } catch (err) {
      alert('Error updating fill level');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-emerald-400" /> Waste Bin Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Add, update fill status, configure bin parameters and municipal locations.</p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Waste Bin
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search Bin ID, Name or Location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBins()}
            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="All">All Zones</option>
            <option value="East Zone">East Zone</option>
            <option value="South Zone">South Zone</option>
            <option value="Central Zone">Central Zone</option>
            <option value="North Zone">North Zone</option>
            <option value="West Zone">West Zone</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Low">Low (0-25%)</option>
            <option value="Moderate">Moderate (26-50%)</option>
            <option value="High">High (51-75%)</option>
            <option value="Very High">Very High (76-90%)</option>
            <option value="Critical">Critical (&gt;90%)</option>
          </select>

          <button onClick={fetchBins} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl border border-slate-700">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bins Table */}
      {loading ? (
        <Loader text="Loading waste bins..." />
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Bin ID / Name</th>
                  <th className="py-3.5 px-4">Location / Zone</th>
                  <th className="py-3.5 px-4">Category & Type</th>
                  <th className="py-3.5 px-4">Fill Level</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {bins.map((bin) => (
                  <tr key={bin._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{bin.binId}</div>
                      <div className="text-slate-400 text-[11px]">{bin.name}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{bin.location}</div>
                      <div className="text-emerald-400 text-[10px] font-semibold">{bin.zone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                        {bin.wasteCategory}
                      </span>
                      <span className="text-slate-500 text-[10px] ml-1.5">{bin.binType} ({bin.capacity}L)</span>
                    </td>

                    <td className="py-3.5 px-4 w-44">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all ${
                              bin.fillLevel > 90 ? 'bg-rose-500' :
                              bin.fillLevel > 75 ? 'bg-amber-500' :
                              bin.fillLevel > 50 ? 'bg-blue-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${bin.fillLevel}%` }}
                          />
                        </div>
                        <span className="font-bold text-white text-xs shrink-0">{bin.fillLevel}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge status={bin.status}>{bin.status}</Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        bin.priorityLevel === 'Critical' ? 'bg-rose-500/20 text-rose-400' :
                        bin.priorityLevel === 'High' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {bin.priorityLevel || 'Low'} Priority
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleQuickFillUpdate(bin._id, bin.fillLevel)}
                        title="Update Fill %"
                        className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        Update Fill
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(bin)}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(bin._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Waste Bin' : 'Add New Waste Bin'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bin ID</label>
              <input
                type="text"
                required
                value={formData.binId}
                onChange={(e) => setFormData({ ...formData, binId: e.target.value })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bin Name</label>
              <input
                type="text"
                required
                placeholder="Indiranagar 100ft Rd"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location Details</label>
              <input
                type="text"
                required
                placeholder="Near Metro Gate 2"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Municipal Zone</label>
              <select
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              >
                <option value="East Zone">East Zone</option>
                <option value="South Zone">South Zone</option>
                <option value="Central Zone">Central Zone</option>
                <option value="North Zone">North Zone</option>
                <option value="West Zone">West Zone</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bin Type</label>
              <select
                value={formData.binType}
                onChange={(e) => setFormData({ ...formData, binType: e.target.value })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-2 py-2"
              >
                <option value="Standard">Standard</option>
                <option value="Smart Solar">Smart Solar</option>
                <option value="Recycle">Recycle</option>
                <option value="Hazardous">Hazardous</option>
                <option value="Compost">Compost</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Waste Category</label>
              <select
                value={formData.wasteCategory}
                onChange={(e) => setFormData({ ...formData, wasteCategory: e.target.value })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-2 py-2"
              >
                <option value="Organic">Organic</option>
                <option value="Plastic">Plastic</option>
                <option value="Paper">Paper</option>
                <option value="Metal">Metal</option>
                <option value="Glass">Glass</option>
                <option value="E-waste">E-waste</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Capacity (Liters)</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Fill %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.fillLevel}
                onChange={(e) => setFormData({ ...formData, fillLevel: Number(e.target.value) })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
            >
              {isEditing ? 'Save Changes' : 'Create Bin'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BinManagementPage;
