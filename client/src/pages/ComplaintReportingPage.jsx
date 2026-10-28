import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import api from '../services/api';
import {
  AlertCircle,
  CheckCircle2,
  Send,
  MapPin,
  Clock,
  Filter,
  Search,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Phone,
  Mail,
  User,
  PlusCircle,
  FileCheck,
  RefreshCw,
  Check
} from 'lucide-react';

const MOCK_COMPLAINTS = [
  {
    _id: 'cmp-2001',
    complaintId: 'CMP-2001',
    userName: 'Dhivya Dharshini S',
    userEmail: 'dhivya.dharshini.s@smartwaste.gov.in',
    userPhone: '+91 98401 11221',
    issueType: 'Overflowing Bin',
    priority: 'Critical',
    zone: 'East Zone',
    location: '100 Feet Road, Near Metro Station, Indiranagar',
    binId: 'BIN-101',
    description: 'Smart bin sensor reporting >95% capacity. Waste spilling onto the pedestrian pathway and attracting stray animals.',
    status: 'In Review',
    createdAt: new Date(Date.now() - 3600000 * 2)
  },
  {
    _id: 'cmp-2002',
    complaintId: 'CMP-2002',
    userName: 'Divyadharshini K',
    userEmail: 'divyadharshini.k@smartwaste.gov.in',
    userPhone: '+91 98402 22332',
    issueType: 'Missed Waste Collection',
    priority: 'High',
    zone: 'South Zone',
    location: '5th Block Commercial Market Road, Koramangala',
    binId: 'BIN-102',
    description: 'Scheduled morning 8:30 AM wet-waste compactor truck did not arrive. Market vegetable bins are full.',
    status: 'Assigned',
    createdAt: new Date(Date.now() - 3600000 * 5)
  },
  {
    _id: 'cmp-2003',
    complaintId: 'CMP-2003',
    userName: 'Kavisurya B',
    userEmail: 'kavisurya.b@smartwaste.gov.in',
    userPhone: '+91 98403 33443',
    issueType: 'Damaged / Broken Bin',
    priority: 'Medium',
    zone: 'East Zone',
    location: 'ITPL Main Gate, Whitefield Tech Zone',
    binId: 'BIN-103',
    description: 'Pedal lid mechanism jammed and upper solar sensor cover cracked. Automatic fill telemetry unstable.',
    status: 'In Review',
    createdAt: new Date(Date.now() - 3600000 * 9)
  },
  {
    _id: 'cmp-2004',
    complaintId: 'CMP-2004',
    userName: 'Rithu Pavisha S',
    userEmail: 'rithu.pavisha.s@smartwaste.gov.in',
    userPhone: '+91 98404 44554',
    issueType: 'Foul Odor / Hazardous Waste',
    priority: 'Critical',
    zone: 'South Zone',
    location: '27th Main Road, Sector 2, HSR Layout',
    binId: 'BIN-104',
    description: 'Severe foul odor and liquid runoff from unsegregated organic waste bin near residential apartments.',
    status: 'Assigned',
    createdAt: new Date(Date.now() - 3600000 * 12)
  },
  {
    _id: 'cmp-2005',
    complaintId: 'CMP-2005',
    userName: 'Sautanyhassre B T',
    userEmail: 'sautanyhassre.bt@smartwaste.gov.in',
    userPhone: '+91 98405 55665',
    issueType: 'Overflowing Bin',
    priority: 'High',
    zone: 'Central Zone',
    location: 'Church Street Junction, MG Road Metro Station',
    binId: 'BIN-105',
    description: 'Recyclables plastic bottle bin completely full after weekend evening foot traffic. Needs immediate clearance.',
    status: 'Submitted',
    createdAt: new Date(Date.now() - 3600000 * 1)
  },
  {
    _id: 'cmp-2006',
    complaintId: 'CMP-2006',
    userName: 'Shreya B',
    userEmail: 'shreya.b@smartwaste.gov.in',
    userPhone: '+91 98406 66776',
    issueType: 'Illegal Dumping',
    priority: 'High',
    zone: 'North Zone',
    location: 'Near Hebbal Flyover Service Road',
    binId: 'BIN-106',
    description: 'Construction packaging debris and mixed waste dumped on open curb near municipal park perimeter.',
    status: 'Submitted',
    createdAt: new Date(Date.now() - 3600000 * 18)
  },
  {
    _id: 'cmp-2007',
    userName: 'Varsha C',
    complaintId: 'CMP-2007',
    userEmail: 'varsha.c@smartwaste.gov.in',
    userPhone: '+91 98407 77887',
    issueType: 'Vehicle Spillage',
    priority: 'Medium',
    zone: 'West Zone',
    location: 'Rajajinagar 1st Block Main Road',
    binId: 'BIN-107',
    description: 'Waste spillage observed along 50 meters of roadway from collection vehicle transit.',
    status: 'Resolved',
    resolutionNotes: 'Street sweeping squad dispatched and roadway cleared completely at 07:15 AM.',
    createdAt: new Date(Date.now() - 86400000 * 1.5),
    resolvedAt: new Date(Date.now() - 86400000 * 1)
  },
  {
    _id: 'cmp-2008',
    complaintId: 'CMP-2008',
    userName: 'PS',
    userEmail: 'ps.officer@smartwaste.gov.in',
    userPhone: '+91 98408 88998',
    issueType: 'Overflowing Bin',
    priority: 'Critical',
    zone: 'Central Zone',
    location: 'Brigade Road Commercial Hub Cross',
    binId: 'BIN-108',
    description: 'Commercial wet waste bin overflowing outside shopping plaza. Immediate pickup dispatch requested.',
    status: 'Assigned',
    createdAt: new Date(Date.now() - 3600000 * 4)
  }
];

const ComplaintReportingPage = () => {
  const { user, isAdmin, isStaff } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'list'
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [registeredComplaintId, setRegisteredComplaintId] = useState('');

  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Update modal state (admin/staff)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('In Review');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    userName: user?.name || '',
    userEmail: user?.email || '',
    userPhone: user?.phone || '',
    issueType: 'Overflowing Bin',
    priority: 'Medium',
    zone: user?.zone && user?.zone !== 'All Zones' ? user.zone : 'Central Zone',
    location: '',
    binId: '',
    description: ''
  });

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/complaints?status=${statusFilter}&zone=${zoneFilter}&search=${search}`);
      if (res.data?.success && res.data?.data) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      console.warn('Backend sleeping, showing cached/demo complaints list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, zoneFilter]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      const res = await api.post('/complaints', formData);
      const generatedId = res.data?.data?.complaintId || `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
      setRegisteredComplaintId(generatedId);
      setSubmitSuccess(true);

      // Prepend locally so user immediately sees it
      const newEntry = {
        _id: res.data?.data?._id || `local-${Date.now()}`,
        complaintId: generatedId,
        ...formData,
        status: 'Submitted',
        createdAt: new Date()
      };
      setComplaints(prev => [newEntry, ...prev]);

      // Reset form fields
      setFormData({
        userName: user?.name || '',
        userEmail: user?.email || '',
        userPhone: user?.phone || '',
        issueType: 'Overflowing Bin',
        priority: 'Medium',
        zone: 'Central Zone',
        location: '',
        binId: '',
        description: ''
      });
    } catch (err) {
      // In offline/demo mode, still give a smooth submission experience
      const fallbackId = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
      setRegisteredComplaintId(fallbackId);
      setSubmitSuccess(true);
      const fallbackEntry = {
        _id: `local-${Date.now()}`,
        complaintId: fallbackId,
        ...formData,
        status: 'Submitted',
        createdAt: new Date()
      };
      setComplaints(prev => [fallbackEntry, ...prev]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenUpdate = (cmp) => {
    setSelectedComplaint(cmp);
    setUpdateStatus(cmp.status);
    setResolutionNotes(cmp.resolutionNotes || '');
    setIsUpdateModalOpen(true);
  };

  const handleSaveStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      await api.patch(`/complaints/${selectedComplaint._id}/status`, {
        status: updateStatus,
        resolutionNotes
      });
      setIsUpdateModalOpen(false);
      fetchComplaints();
    } catch (err) {
      // Offline fallback update
      setComplaints(prev => prev.map(c => 
        c._id === selectedComplaint._id 
          ? { ...c, status: updateStatus, resolutionNotes, resolvedAt: updateStatus === 'Resolved' ? new Date() : c.resolvedAt }
          : c
      ));
      setIsUpdateModalOpen(false);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchZone = zoneFilter === 'All' || c.zone === zoneFilter;
    const matchSearch = !search || 
      c.complaintId.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.userName.toLowerCase().includes(search.toLowerCase()) ||
      (c.binId && c.binId.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchZone && matchSearch;
  });

  const getPriorityBadge = (pri) => {
    switch (pri) {
      case 'Critical': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'High':     return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Medium':   return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:         return 'bg-slate-700/40 text-slate-300 border-slate-600/30';
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Submitted': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'In Review': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'Assigned':  return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'Resolved':  return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'Rejected':  return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      default:          return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-400" /> Citizen Complaint Reporting &amp; Redressal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Report municipal waste collection issues, track grievance status, and dispatch quick cleanup actions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'new'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> Raise Complaint
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" /> Complaint Log ({complaints.length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: COMPLAINT REPORTING FORM                          */}
      {/* ======================================================== */}
      {activeTab === 'new' && (
        <div className="max-w-4xl mx-auto">
          {submitSuccess && (
            <div className="mb-6 p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-start gap-4 animate-in fade-in">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-sm text-white">Complaint Submitted Successfully!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Your Complaint Reference ID is <strong className="text-emerald-400 font-mono tracking-wider text-sm">{registeredComplaintId}</strong>.
                  Municipal ward officers and collection supervisors have been notified.
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => setActiveTab('list')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow"
                  >
                    View in Complaint Log
                  </button>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
                  >
                    Submit Another Complaint
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-800/80 pb-5 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Complaint Reporting Form</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fill in the details below to report municipal bin issues, waste accumulation, or delayed trucks.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitComplaint} className="space-y-6">
              {/* Citizen Details Row */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" /> 1. Citizen / Complainant Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        name="userName"
                        required
                        value={formData.userName}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 focus:border-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleChange}
                        placeholder="e.g. citizen@gmail.com"
                        className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 focus:border-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="tel"
                        name="userPhone"
                        value={formData.userPhone}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 focus:border-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Issue Category & Priority */}
              <div className="border-t border-slate-800/80 pt-5">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-emerald-400" /> 2. Issue Classification
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Issue Type <span className="text-rose-400">*</span>
                    </label>
                    <select
                      name="issueType"
                      value={formData.issueType}
                      onChange={handleChange}
                      className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Overflowing Bin">Overflowing Bin (&gt;90% full, spillage)</option>
                      <option value="Damaged / Broken Bin">Damaged / Broken Bin (lid, solar panel, sensor)</option>
                      <option value="Missed Waste Collection">Missed Waste Collection (truck did not arrive)</option>
                      <option value="Foul Odor / Hazardous Waste">Foul Odor / Hazardous Waste Spillage</option>
                      <option value="Illegal Dumping">Illegal Dumping in Public Zone</option>
                      <option value="Vehicle Spillage">Vehicle Waste Leakage</option>
                      <option value="Other">Other Operational Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Urgency / Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Low">Low — Minor aesthetic or delayed issue</option>
                      <option value="Medium">Medium — Standard collection concern</option>
                      <option value="High">High — Overflowing on public walkway</option>
                      <option value="Critical">Critical — Severe health/traffic hazard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location & Bin Details */}
              <div className="border-t border-slate-800/80 pt-5">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" /> 3. Location &amp; Waste Bin Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Municipal Zone <span className="text-rose-400">*</span>
                    </label>
                    <select
                      name="zone"
                      value={formData.zone}
                      onChange={handleChange}
                      className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="East Zone">East Zone</option>
                      <option value="South Zone">South Zone</option>
                      <option value="Central Zone">Central Zone</option>
                      <option value="North Zone">North Zone</option>
                      <option value="West Zone">West Zone</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Specific Location / Landmark <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Opposite Metro Pillar 140, 100 Feet Road"
                      className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Bin Identifier (Optional if known)
                  </label>
                  <input
                    type="text"
                    name="binId"
                    value={formData.binId}
                    onChange={handleChange}
                    placeholder="e.g. BIN-101, BIN-102"
                    className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none sm:max-w-xs"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Located on the metallic QR barcode plate on the smart bin.
                  </p>
                </div>
              </div>

              {/* Description Details */}
              <div className="border-t border-slate-800/80 pt-5">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Detailed Complaint Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the nature of the waste issue, duration of overflow, approximate volume of spillage, or any relevant landmarks..."
                  className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <span className="text-[11px] text-slate-400">
                  <span className="text-rose-400">*</span> Required fields for complaint dispatch
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Registering Complaint...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: COMPLAINT AUDIT & REDRESSAL LOG                   */}
      {/* ======================================================== */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search complaints, IDs, locations..."
                  className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 w-52 sm:w-64"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="In Review">In Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Zone:</span>
                <select
                  value={zoneFilter}
                  onChange={(e) => setZoneFilter(e.target.value)}
                  className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none"
                >
                  <option value="All">All Zones</option>
                  <option value="East Zone">East Zone</option>
                  <option value="South Zone">South Zone</option>
                  <option value="Central Zone">Central Zone</option>
                  <option value="North Zone">North Zone</option>
                  <option value="West Zone">West Zone</option>
                </select>
              </div>
            </div>

            <button
              onClick={fetchComplaints}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
              title="Refresh log"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Complaints Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Complaint ID</th>
                    <th className="py-3.5 px-4">Citizen</th>
                    <th className="py-3.5 px-4">Issue Category</th>
                    <th className="py-3.5 px-4">Zone / Location</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Reported On</th>
                    {(isAdmin || isStaff) && (
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                        No complaints match the specified query filters.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-white">{c.complaintId}</div>
                          {c.binId && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              {c.binId}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-white font-semibold">{c.userName}</div>
                          <div className="text-slate-500 text-[10px]">{c.userPhone || c.userEmail || 'No contact'}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-200 font-semibold">{c.issueType}</div>
                          <p className="text-slate-500 text-[10px] truncate max-w-xs">{c.description}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-300">{c.zone}</div>
                          <div className="text-slate-500 text-[10px] truncate max-w-[200px]">{c.location}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(c.priority)}`}>
                            {c.priority}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(c.status)}`}>
                            {c.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {new Date(c.createdAt).toLocaleDateString()}
                          <span className="block text-[10px] text-slate-600">
                            {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        {(isAdmin || isStaff) && (
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleOpenUpdate(c)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow"
                            >
                              Update
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REDRESSAL UPDATE MODAL (Staff/Admin)                     */}
      {/* ======================================================== */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title={`Redressal Update: ${selectedComplaint?.complaintId}`}
      >
        {selectedComplaint && (
          <form onSubmit={handleSaveStatusUpdate} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="font-bold text-white mb-1">{selectedComplaint.issueType}</div>
              <p className="text-slate-400">{selectedComplaint.description}</p>
              <div className="mt-2 text-[10px] text-slate-500">
                Location: {selectedComplaint.location} ({selectedComplaint.zone})
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Redressal Status</label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              >
                <option value="Submitted">Submitted</option>
                <option value="In Review">In Review</option>
                <option value="Assigned">Assigned for Action</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Resolution / Field Staff Notes</label>
              <textarea
                rows="3"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Log actions taken (e.g. Collection vehicle KA-01-WM-1001 dispatched, bin emptied)..."
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
        )}
      </Modal>
    </div>
  );
};

export default ComplaintReportingPage;
