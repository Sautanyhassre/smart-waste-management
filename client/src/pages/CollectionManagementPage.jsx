import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import api from '../services/api';
import {
  CalendarCheck, Plus, CheckCircle, Clock, Truck, User,
  AlertCircle, RefreshCw, ClipboardList, Star, MapPin,
  ChevronRight, UserCheck
} from 'lucide-react';

/* ─── Staff "My Tasks" Hero Panel ─────────────────────────────────────────── */
const MyTasksPanel = ({ user, onRefresh }) => {
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateData, setUpdateData] = useState({ status: 'In Progress', quantityCollected: 150, remarks: '' });

  const fetchMyTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/collections?myTasks=true');
      if (res.data.success) setMyTasks(res.data.data);
    } catch {
      // Mock tasks for offline demo
      setMyTasks([
        {
          _id: 'mt1', collectionId: 'COL-101',
          bin: { binId: 'BIN-101', name: 'Indiranagar 100ft Rd', fillLevel: 94, zone: 'East Zone' },
          vehicle: { registrationNumber: 'KA-01-WM-2002', vehicleType: 'Compactor' },
          scheduledDate: new Date(), scheduledTime: '08:30 AM', status: 'In Progress',
          remarks: 'Priority pickup'
        },
        {
          _id: 'mt2', collectionId: 'COL-105',
          bin: { binId: 'BIN-205', name: 'Koramangala 5th Block', fillLevel: 78, zone: 'South Zone' },
          vehicle: { registrationNumber: 'KA-01-WM-1001', vehicleType: 'Tipper' },
          scheduledDate: new Date(Date.now() + 86400000), scheduledTime: '10:00 AM', status: 'Assigned',
          remarks: 'Routine route'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyTasks(); }, []);

  const handleOpenUpdate = (task) => {
    setSelectedTask(task);
    setUpdateData({
      status: task.status === 'Assigned' ? 'In Progress' : 'Completed',
      quantityCollected: task.quantityCollected || 150,
      remarks: task.remarks || ''
    });
    setUpdateModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    try {
      await api.patch(`/collections/${selectedTask._id}/status`, updateData);
      setUpdateModalOpen(false);
      fetchMyTasks();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const statusColor = (s) => ({
    'In Progress': 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
    'Assigned':    'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    'Completed':   'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    'Delayed':     'bg-red-500/20 text-red-300 border border-red-500/40',
  }[s] || 'bg-slate-700 text-slate-300');

  const pending = myTasks.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled');
  const done    = myTasks.filter(t => t.status === 'Completed');

  return (
    <>
      {/* ── Greeting Banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 p-5 shadow-xl mb-2">
        <div className="absolute -top-6 -right-6 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-widest">Staff Portal</p>
            <h2 className="text-xl font-extrabold text-white leading-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Staff'} 👋
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              You have <span className="text-amber-400 font-bold">{pending.length}</span> pending task{pending.length !== 1 ? 's' : ''} and{' '}
              <span className="text-emerald-400 font-bold">{done.length}</span> completed today.
            </p>
          </div>
          <button
            onClick={fetchMyTasks}
            className="ml-auto p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-xl transition-colors"
            title="Refresh my tasks"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* ── Mini Stats ── */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Total Assigned', value: myTasks.length, color: 'text-white', icon: <ClipboardList className="w-4 h-4 text-slate-400" /> },
            { label: 'In Progress',   value: myTasks.filter(t => t.status === 'In Progress').length, color: 'text-blue-300', icon: <Clock className="w-4 h-4 text-blue-400" /> },
            { label: 'Completed',     value: done.length, color: 'text-emerald-400', icon: <CheckCircle className="w-4 h-4 text-emerald-400" /> },
          ].map((s) => (
            <div key={s.label} className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-2.5 border border-slate-700/50">
              {s.icon}
              <div>
                <div className={`text-lg font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-slate-500 font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── My Tasks List ── */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" /> My Assigned Collection Tasks
          </h3>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-semibold">
            {myTasks.length} tasks total
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs animate-pulse">Fetching your tasks…</div>
        ) : myTasks.length === 0 ? (
          <div className="p-10 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-500/40 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-semibold">All clear! No tasks assigned to you yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {myTasks.map((task) => (
              <div
                key={task._id}
                className="px-4 py-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: task info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-extrabold text-white">{task.collectionId}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-slate-300">{task.bin?.name || 'N/A'}</span>
                      <span className="text-slate-600">·</span>
                      <span>{task.bin?.zone}</span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        {task.vehicle?.registrationNumber || 'No vehicle assigned'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(task.scheduledDate).toLocaleDateString()} · {task.scheduledTime}
                      </span>
                      {task.bin?.fillLevel != null && (
                        <span className="flex items-center gap-1">
                          <AlertCircle className={`w-3 h-3 ${task.bin.fillLevel >= 80 ? 'text-red-400' : 'text-amber-400'}`} />
                          Bin Fill: <span className={`font-bold ${task.bin.fillLevel >= 80 ? 'text-red-300' : 'text-amber-300'}`}>{task.bin.fillLevel}%</span>
                        </span>
                      )}
                    </div>

                    {task.remarks && (
                      <p className="mt-1.5 text-[11px] text-slate-500 italic">
                        📝 {task.remarks}
                      </p>
                    )}
                  </div>

                  {/* Right: action */}
                  {task.status !== 'Completed' && task.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleOpenUpdate(task)}
                      className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
                    >
                      Update <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                  {task.status === 'Completed' && (
                    <span className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 font-bold text-xs rounded-xl border border-emerald-500/30">
                      <CheckCircle className="w-3 h-3" /> Done
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Update Status Modal ── */}
      <Modal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        title={`Update Task: ${selectedTask?.collectionId}`}
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New Status</label>
            <select
              value={updateData.status}
              onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
              className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="Missed">Missed</option>
            </select>
          </div>

          {updateData.status === 'Completed' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity Collected (kg)</label>
              <input
                type="number"
                required
                value={updateData.quantityCollected}
                onChange={(e) => setUpdateData({ ...updateData, quantityCollected: Number(e.target.value) })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Completing will reset bin fill level to 0% in MongoDB.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Remarks / Log Notes</label>
            <textarea
              rows="3"
              value={updateData.remarks}
              onChange={(e) => setUpdateData({ ...updateData, remarks: e.target.value })}
              placeholder="Enter remarks…"
              className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button type="button" onClick={() => setUpdateModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl">Cancel</button>
            <button type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg">
              Confirm Update
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

/* ─── Main Collection Management Page ─────────────────────────────────────── */
const CollectionManagementPage = () => {
  const { isAdmin, isStaff, user } = useContext(AuthContext);
  const location = useLocation();

  const [collections, setCollections] = useState([]);
  const [bins, setBins] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [staffFilter, setStaffFilter] = useState('All');
  const [activeTab, setActiveTab] = useState(isStaff ? 'my-tasks' : 'all');

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [newCollection, setNewCollection] = useState({
    binId: '',
    vehicleId: '',
    staffId: '',
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
      const requests = [
        api.get(`/collections?status=${statusFilter}`),
        api.get('/bins'),
        api.get('/vehicles')
      ];
      if (isAdmin) requests.push(api.get('/auth/staff'));

      const [collRes, binRes, vehRes, staffRes] = await Promise.all(requests);

      if (collRes.data.success) setCollections(collRes.data.data);
      if (binRes.data.success) setBins(binRes.data.data);
      if (vehRes.data.success) setVehicles(vehRes.data.data);
      if (staffRes?.data?.success) setStaffList(staffRes.data.data);
    } catch (err) {
      console.warn('Backend offline, loading mock collections');
      setCollections([
        {
          _id: 'c1', collectionId: 'COL-101',
          bin: { _id: 'b1', binId: 'BIN-101', name: 'Indiranagar 100ft Rd', fillLevel: 94 },
          vehicle: { _id: 'v2', registrationNumber: 'KA-01-WM-2002', vehicleType: 'Compactor' },
          staff: { _id: 's1', name: 'Ravi Kumar', email: 'ravi@smartwaste.gov.in', phone: '9876543210' },
          scheduledDate: new Date(), scheduledTime: '08:30 AM', status: 'In Progress', remarks: 'Priority pickup'
        },
        {
          _id: 'c2', collectionId: 'COL-102',
          bin: { _id: 'b2', binId: 'BIN-102', name: 'Koramangala 5th Block', fillLevel: 92 },
          vehicle: { _id: 'v1', registrationNumber: 'KA-01-WM-1001', vehicleType: 'Tipper' },
          staff: { _id: 's2', name: 'Meena Devi', email: 'meena@smartwaste.gov.in', phone: '9876543211' },
          scheduledDate: new Date(), scheduledTime: '09:00 AM', status: 'Assigned', remarks: 'Assigned route'
        }
      ]);
      setStaffList([
        { _id: 's1', name: 'Ravi Kumar', phone: '9876543210', zone: 'East Zone' },
        { _id: 's2', name: 'Meena Devi', phone: '9876543211', zone: 'South Zone' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [statusFilter]);

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

  // Filter collections by staff
  const filteredCollections = staffFilter === 'All'
    ? collections
    : collections.filter(t => t.staff?._id === staffFilter || t.staff?.id === staffFilter);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-400" /> Collection Management &amp; Route Dispatch
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isAdmin
              ? 'Assign collection staff, track vehicle pickup routes, and log collected waste tonnage.'
              : 'View your assigned tasks, update status, and log completed pickups.'}
          </p>
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

      {/* ── Tab Switcher (staff sees "My Tasks" default, admin sees both) ── */}
      <div className="flex gap-2 border-b border-slate-800 pb-0">
        {isStaff && (
          <button
            onClick={() => setActiveTab('my-tasks')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 -mb-px ${
              activeTab === 'my-tasks'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 inline mr-1.5" />My Tasks
          </button>
        )}
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 -mb-px ${
            activeTab === 'all'
              ? 'border-emerald-500 text-emerald-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5 inline mr-1.5" />All Collections
        </button>
      </div>

      {/* ── Staff "My Tasks" Tab ── */}
      {activeTab === 'my-tasks' && isStaff && (
        <MyTasksPanel user={user} onRefresh={fetchData} />
      )}

      {/* ── All Collections Tab ── */}
      {activeTab === 'all' && (
        <>
          {/* Filters Row */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
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

              {isAdmin && staffList.length > 0 && (
                <>
                  <span className="text-xs font-semibold text-slate-400">Filter Staff:</span>
                  <select
                    value={staffFilter}
                    onChange={(e) => setStaffFilter(e.target.value)}
                    className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none"
                  >
                    <option value="All">All Staff</option>
                    {staffList.map(s => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </>
              )}
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
                      <th className="py-3.5 px-4">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-emerald-400" /> Assigned Staff
                        </span>
                      </th>
                      <th className="py-3.5 px-4">Scheduled Slot</th>
                      <th className="py-3.5 px-4">Collected Qty</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {filteredCollections.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-slate-500 text-xs">
                          No collection tasks found.
                        </td>
                      </tr>
                    ) : filteredCollections.map((task) => (
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

                        {/* ── Assigned Staff Column ── */}
                        <td className="py-3.5 px-4">
                          {task.staff ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white text-[10px] font-extrabold shrink-0 shadow">
                                {task.staff.name?.charAt(0)?.toUpperCase() || 'S'}
                              </div>
                              <div>
                                <div className="text-white font-semibold leading-tight">{task.staff.name}</div>
                                <div className="text-slate-500 text-[10px]">{task.staff.phone || task.staff.email}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">Not assigned</span>
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
        </>
      )}

      {/* ── Schedule Modal (Admin) ── */}
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

          {/* ── Assign Staff Dropdown ── */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-violet-400" /> Assign Staff Member
            </label>
            <select
              value={newCollection.staffId}
              onChange={(e) => setNewCollection({ ...newCollection, staffId: e.target.value })}
              className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
            >
              <option value="">Select Staff Member...</option>
              {staffList.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} — {s.zone} {s.phone ? `(${s.phone})` : ''}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 mt-1">
              Assigned staff will see this task in their personal "My Tasks" portal.
            </p>
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

      {/* ── Update Task Modal ── */}
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
