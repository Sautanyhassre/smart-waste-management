import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { CalendarCheck, Plus, CheckCircle, Clock, Truck, User, AlertCircle, RefreshCw } from 'lucide-react';

const CollectionManagementPage = () => {
  const { isAdmin, isStaff } = useContext(AuthContext);
  const location = useLocation();

  const [collections, setCollections] = useState([]);
  const [bins, setBins] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [newCollection, setNewCollection] = useState({
    binId: '',
    vehicleId: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '09:00 AM'
  });

  const [updateData, setUpdateData] = useState({
    status: 'Completed',
    quantityCollected: 150,
    remarks: 'Routine pickup completed'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [collRes, binRes, vehRes] = await Promise.all([
        api.get(`/collections?status=${statusFilter}`),
        api.get('/bins'),
        api.get('/vehicles')
      ]);

      if (collRes.data.success) setCollections(collRes.data.data);
      if (binRes.data.success) setBins(binRes.data.data);
      if (vehRes.data.success) setVehicles(vehRes.data.data);
    } catch (err) {
      console.warn('Backend offline, loading mock collections');
      setCollections([
        { _id: 'c1', collectionId: 'COL-101', bin: { _id: 'b1', binId: 'BIN-101', name: 'Indiranagar 100ft Rd', fillLevel: 94 }, vehicle: { _id: 'v2', registrationNumber: 'KA-01-WM-2002' }, scheduledDate: new Date(), scheduledTime: '08:30 AM', status: 'In Progress', remarks: 'Priority pickup' },
        { _id: 'c2', collectionId: 'COL-102', bin: { _id: 'b2', binId: 'BIN-102', name: 'Koramangala 5th Block', fillLevel: 92 }, vehicle: { _id: 'v1', registrationNumber: 'KA-01-WM-1001' }, scheduledDate: new Date(), scheduledTime: '09:00 AM', status: 'Assigned', remarks: 'Assigned route' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  // Preselect bin if navigated from Dispatch button
  useEffect(() => {
    if (location.state?.selectedBin) {
      setNewCollection(prev => ({ ...prev, binId: location.state.selectedBin._id }));
      setIsScheduleModalOpen(true);
    }
  }, [location.state]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/collections', newCollection);
      setIsScheduleModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule collection task');
    }
  };

  const handleOpenUpdate = (task) => {
    setSelectedTask(task);
    setUpdateData({
      status: task.status === 'Assigned' ? 'In Progress' : 'Completed',
      quantityCollected: task.quantityCollected || 150,
      remarks: task.remarks || ''
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    try {
      await api.patch(`/collections/${selectedTask._id}/status`, updateData);
      setIsUpdateModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update collection status');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-400" /> Collection Management & Route Dispatch
          </h1>
          <p className="text-xs text-slate-400 mt-1">Assign collection staff, track vehicle pickup routes, and log collected waste tonnage.</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Collection Task
          </button>
        )}
      </div>

      {/* Status Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="All">All Collection Tasks</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>

        <button onClick={fetchData} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Collections Table */}
      {loading ? (
        <Loader text="Fetching collection schedules and vehicle assignments..." />
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Task ID</th>
                  <th className="py-3.5 px-4">Waste Bin Details</th>
                  <th className="py-3.5 px-4">Assigned Vehicle</th>
                  <th className="py-3.5 px-4">Scheduled Slot</th>
                  <th className="py-3.5 px-4">Collected Quantity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {collections.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white text-sm">{task.collectionId}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-white font-bold">{task.bin?.binId || 'N/A'}</div>
                      <div className="text-slate-400 text-[11px]">{task.bin?.name || 'Bin Location'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {task.vehicle ? (
                        <div>
                          <div className="text-emerald-400 font-bold">{task.vehicle.registrationNumber}</div>
                          <div className="text-slate-500 text-[10px]">{task.vehicle.vehicleType}</div>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{new Date(task.scheduledDate).toLocaleDateString()}</div>
                      <div className="text-slate-500 text-[10px]">{task.scheduledTime}</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white">
                      {task.status === 'Completed' ? `${task.quantityCollected} kg` : '-'}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge status={task.status}>{task.status}</Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => handleOpenUpdate(task)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow"
                        >
                          Update Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Waste Collection Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Waste Bin</label>
            <select
              required
              value={newCollection.binId}
              onChange={(e) => setNewCollection({ ...newCollection, binId: e.target.value })}
              className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
            >
              <option value="">Select Bin to Collect...</option>
              {bins.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.binId} — {b.name} ({b.fillLevel}% Fill - {b.zone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Vehicle (Optional)</label>
            <select
              value={newCollection.vehicleId}
              onChange={(e) => setNewCollection({ ...newCollection, vehicleId: e.target.value })}
              className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
            >
              <option value="">Select Vehicle...</option>
              {vehicles.filter(v => v.status !== 'Maintenance').map((v) => (
                <option key={v._id} value={v._id}>
                  {v.registrationNumber} ({v.vehicleType} - Status: {v.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Scheduled Date</label>
              <input
                type="date"
                required
                value={newCollection.scheduledDate}
                onChange={(e) => setNewCollection({ ...newCollection, scheduledDate: e.target.value })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Scheduled Time Slot</label>
              <input
                type="text"
                value={newCollection.scheduledTime}
                onChange={(e) => setNewCollection({ ...newCollection, scheduledTime: e.target.value })}
                placeholder="09:00 AM"
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
            >
              Dispatch Schedule
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Task Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title={`Update Collection Task: ${selectedTask?.collectionId}`}
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Collection Task Status</label>
            <select
              value={updateData.status}
              onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
              className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
            >
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="Missed">Missed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {updateData.status === 'Completed' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity Waste Collected (kg)</label>
              <input
                type="number"
                required
                value={updateData.quantityCollected}
                onChange={(e) => setUpdateData({ ...updateData, quantityCollected: Number(e.target.value) })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Completing this task will reset bin fill level to 0% in MongoDB.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Staff Remarks / Log Notes</label>
            <textarea
              rows="3"
              value={updateData.remarks}
              onChange={(e) => setUpdateData({ ...updateData, remarks: e.target.value })}
              placeholder="Enter remarks..."
              className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
            >
              Confirm Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CollectionManagementPage;
