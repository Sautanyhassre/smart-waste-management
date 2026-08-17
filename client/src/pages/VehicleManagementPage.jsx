import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { Truck, Plus, Edit2, Trash2, Wrench, Shield, CheckCircle2 } from 'lucide-react';

const VehicleManagementPage = () => {
  const { isAdmin } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    vehicleId: '',
    registrationNumber: '',
    vehicleType: 'Compactor Truck',
    capacity: 5.0,
    status: 'Available',
    currentLocation: 'Central Depot'
  });

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vehicles');
      if (res.data.success) {
        setVehicles(res.data.data);
      }
    } catch (err) {
      setVehicles([
        { _id: '1', vehicleId: 'VEH-101', registrationNumber: 'KA-01-WM-1001', vehicleType: 'Compactor Truck', capacity: 8.5, status: 'Available', currentLocation: 'Koramangala Depot' },
        { _id: '2', vehicleId: 'VEH-102', registrationNumber: 'KA-01-WM-2002', vehicleType: 'Mini Tipper', capacity: 3.2, status: 'Assigned', currentLocation: 'Indiranagar Zone' },
        { _id: '3', vehicleId: 'VEH-103', registrationNumber: 'KA-01-WM-3003', vehicleType: 'Hook Loader', capacity: 10.0, status: 'Collecting', currentLocation: 'Whitefield' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      vehicleId: `VEH-${Math.floor(Math.random() * 899 + 100)}`,
      registrationNumber: 'KA-01-WM-' + Math.floor(Math.random() * 8999 + 1000),
      vehicleType: 'Compactor Truck',
      capacity: 5.0,
      status: 'Available',
      currentLocation: 'Central Depot'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v) => {
    setIsEditing(true);
    setCurrentId(v._id);
    setFormData({
      vehicleId: v.vehicleId,
      registrationNumber: v.registrationNumber,
      vehicleType: v.vehicleType,
      capacity: v.capacity,
      status: v.status,
      currentLocation: v.currentLocation
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/vehicles/${currentId}`, formData);
      } else {
        await api.post('/vehicles', formData);
      }
      setIsModalOpen(false);
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving vehicle details');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete vehicle from fleet register?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      alert('Error deleting vehicle');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-400" /> Vehicle & Fleet Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage municipal collection trucks, capacity limits, and service maintenance states.</p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Fleet Vehicle
          </button>
        )}
      </div>

      {/* Fleet Cards Grid */}
      {loading ? (
        <Loader text="Loading vehicle fleet statistics..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div key={v._id || v.vehicleId} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-white">{v.vehicleId}</span>
                  <Badge status={v.status}>{v.status}</Badge>
                </div>

                <div className="mt-3">
                  <h3 className="font-extrabold text-lg text-emerald-400 font-mono tracking-wide">{v.registrationNumber}</h3>
                  <p className="text-xs text-slate-300 font-semibold mt-0.5">{v.vehicleType}</p>
                </div>

                <div className="mt-4 py-2.5 px-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Capacity Limit:</span>
                    <strong className="text-white">{v.capacity} Tons</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Current Depot / Zone:</span>
                    <strong className="text-emerald-400">{v.currentLocation}</strong>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(v)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(v._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Fleet Vehicle' : 'Add New Vehicle'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle ID</label>
              <input
                type="text"
                required
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Number</label>
              <input
                type="text"
                required
                placeholder="KA-01-WM-1001"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Category</label>
              <select
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              >
                <option value="Compactor Truck">Compactor Truck</option>
                <option value="Mini Tipper">Mini Tipper</option>
                <option value="Hook Loader">Hook Loader</option>
                <option value="Electric Cart">Electric Cart</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payload Capacity (Tons)</label>
              <input
                type="number"
                step="0.1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Operational Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              >
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Collecting">Collecting</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Depot / Zone Location</label>
              <input
                type="text"
                value={formData.currentLocation}
                onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                placeholder="Koramangala Depot"
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
              {isEditing ? 'Update Vehicle' : 'Register Vehicle'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VehicleManagementPage;
