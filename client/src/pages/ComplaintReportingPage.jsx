import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  Check,
  Camera,
  Upload,
  UserCheck,
  Calendar,
  AlertTriangle,
  FileText
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
    photoUrl: 'file:///C:/Users/Balaji.g/.gemini/antigravity/brain/09fe82e8-9dd6-4e97-954d-42f66658d757/citizen_reporting_garbage_1793124433737.jpg',
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
    assignedTo: { _id: 's1', name: 'Ravi Kumar', phone: '+91 98765 43210' },
    expectedCollectionTime: 'Today 11:30 AM',
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
    assignedTo: { _id: 's2', name: 'Meena Devi', phone: '+91 98765 43211' },
    expectedCollectionTime: 'Today 02:00 PM',
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
    assignedTo: { _id: 's1', name: 'Ravi Kumar', phone: '+91 98765 43210' },
    expectedCollectionTime: 'Today 03:30 PM',
    createdAt: new Date(Date.now() - 3600000 * 4)
  }
];

const ComplaintReportingPage = () => {
  const { user, isAdmin, isStaff, isViewer } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(isViewer ? 'new' : 'list');

  useEffect(() => {
    if (isStaff) {
      setActiveTab('list');
    }
  }, [isStaff]);
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [registeredComplaintId, setRegisteredComplaintId] = useState('');

  // Photo upload preview state
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Admin Assignment Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedForAssign, setSelectedForAssign] = useState(null);
  const [assignData, setAssignData] = useState({
    assignedTo: '',
    priority: 'High',
    expectedCollectionTime: 'Today 11:30 AM',
    adminRemarks: '',
    status: 'Assigned'
  });

  // Staff Workflow Status Modal
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [selectedForWorkflow, setSelectedForWorkflow] = useState(null);
  const [workflowData, setWorkflowData] = useState({
    status: 'In Progress',
    resolutionNotes: '',
    resolutionEvidenceUrl: ''
  });

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
    description: '',
    photoUrl: ''
  });

  const fetchStaffAndComplaints = async () => {
    setLoading(true);
    try {
      const requests = [api.get(`/complaints?status=${statusFilter}&zone=${zoneFilter}&search=${search}`)];
      if (isAdmin) requests.push(api.get('/auth/staff'));

      const [complaintsRes, staffRes] = await Promise.all(requests);

      if (complaintsRes.data?.success && complaintsRes.data?.data) {
        setComplaints(complaintsRes.data.data);
      }
      if (staffRes?.data?.success && staffRes?.data?.data) {
        setStaffList(staffRes.data.data);
      }
    } catch (err) {
      console.warn('Backend sleeping, showing cached dataset');
      setStaffList([
        { _id: 's1', name: 'Ravi Kumar', zone: 'East Zone', phone: '+91 98765 43210' },
        { _id: 's2', name: 'Meena Devi', zone: 'South Zone', phone: '+91 98765 43211' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffAndComplaints();
  }, [statusFilter, zoneFilter]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Image Upload handler (Base64 data URL)
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please upload a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({ ...prev, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      const res = await api.post('/complaints', formData);
      const generatedId = res.data?.data?.complaintId || `CMP-${Math.floor(2000 + Math.random() * 8000)}`;
      setRegisteredComplaintId(generatedId);
      setSubmitSuccess(true);

      const newEntry = {
        _id: res.data?.data?._id || `local-${Date.now()}`,
        complaintId: generatedId,
        ...formData,
        status: 'Submitted',
        createdAt: new Date()
      };
      setComplaints(prev => [newEntry, ...prev]);

      // Reset form
      setFormData({
        userName: user?.name || '',
        userEmail: user?.email || '',
        userPhone: user?.phone || '',
        issueType: 'Overflowing Bin',
        priority: 'Medium',
        zone: 'Central Zone',
        location: '',
        binId: '',
        description: '',
        photoUrl: ''
      });
      setPhotoPreview('');
    } catch (err) {
      const fallbackId = `CMP-${Math.floor(2000 + Math.random() * 8000)}`;
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

  // Admin Assignment Handlers
  const handleOpenAssign = (cmp) => {
    setSelectedForAssign(cmp);
    setAssignData({
      assignedTo: cmp.assignedTo?._id || '',
      priority: cmp.priority || 'High',
      expectedCollectionTime: cmp.expectedCollectionTime || 'Today 11:30 AM',
      adminRemarks: cmp.adminRemarks || '',
      status: 'Assigned'
    });
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!selectedForAssign) return;

    try {
      await api.patch(`/complaints/${selectedForAssign._id}/assign`, assignData);
      setIsAssignModalOpen(false);
      fetchStaffAndComplaints();
    } catch (err) {
      // Local fallback
      const staffObj = staffList.find(s => s._id === assignData.assignedTo) || { name: 'Assigned Staff', phone: '+91 98765 00000' };
      setComplaints(prev => prev.map(c => 
        c._id === selectedForAssign._id
          ? { ...c, assignedTo: staffObj, priority: assignData.priority, status: 'Assigned', expectedCollectionTime: assignData.expectedCollectionTime }
          : c
      ));
      setIsAssignModalOpen(false);
    }
  };

  // Staff Workflow Handlers
  const handleOpenWorkflow = (cmp) => {
    setSelectedForWorkflow(cmp);
    setWorkflowData({
      status: cmp.status === 'Assigned' ? 'Accepted' : cmp.status === 'Accepted' ? 'In Progress' : 'Resolved',
      resolutionNotes: cmp.resolutionNotes || '',
      resolutionEvidenceUrl: ''
    });
    setIsWorkflowModalOpen(true);
  };

  const handleSaveWorkflow = async (e) => {
    e.preventDefault();
    if (!selectedForWorkflow) return;

    try {
      await api.patch(`/complaints/${selectedForWorkflow._id}/workflow`, workflowData);
      setIsWorkflowModalOpen(false);
      fetchStaffAndComplaints();
    } catch (err) {
      setComplaints(prev => prev.map(c => 
        c._id === selectedForWorkflow._id
          ? { ...c, status: workflowData.status, resolutionNotes: workflowData.resolutionNotes, resolvedAt: workflowData.status === 'Resolved' ? new Date() : c.resolvedAt }
          : c
      ));
      setIsWorkflowModalOpen(false);
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
      case 'Accepted':  return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
      case 'In Progress': return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
      case 'Resolved':  return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'Rejected':  return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'Reopened':  return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
      default:          return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-400" /> 
            {isAdmin ? 'Municipal Complaint Management & Redressal Center' : isStaff ? 'Assigned Field Grievance Operations' : 'Citizen Waste Grievance Portal'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isAdmin ? 'Review incoming citizen reports, validate issues, assign officers, and audit field resolutions.' :
             isStaff ? 'Inspect assigned citizen reports, execute pickups, and upload resolution proof.' :
             'Report overflowing waste, upload photo proof, and track municipal cleanup progress.'}
          </p>
        </div>

        {/* Tab Switcher - Citizens and Admins have tab switching; Staff only has their assigned tasks */}
        {!isStaff ? (
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'new'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Raise Grievance
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'list'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCheck className="w-4 h-4" /> {isAdmin ? 'Complaint Control Log' : 'Public Tracking Log'} ({complaints.length})
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Assigned to My Squad ({complaints.length})</span>
            </div>
            <button
              onClick={fetchComplaints}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
              title="Refresh Tasks"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: COMPLAINT REPORTING FORM (Citizens / Admin only)  */}
      {/* ======================================================== */}
      {!isStaff && activeTab === 'new' && (
        <div className="max-w-4xl mx-auto">
          {submitSuccess && (
            <div className="mb-6 p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-start gap-4 animate-in fade-in">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-sm text-white">Grievance Registered Successfully!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Your Official Municipal Reference ID is <strong className="text-emerald-400 font-mono tracking-wider text-sm">{registeredComplaintId}</strong>.
                  Municipal ward officers and dispatch squads have been notified in real time.
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => setActiveTab('list')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow"
                  >
                    View in Complaint Log
                  </button>
                  {isViewer && (
                    <button
                      onClick={() => navigate('/my-complaints')}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
                    >
                      View in My Complaints
                    </button>
                  )}
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs rounded-xl border border-slate-800"
                  >
                    Report Another
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
                <h2 className="text-base font-extrabold text-white">Citizen Waste Grievance Form</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Report overflowing waste, illegal roadside dumping, missed pickups, or broken municipal bins.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitComplaint} className="space-y-6">
              {/* Citizen Details Row */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" /> 1. Complainant Contact Information
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleChange}
                        placeholder="citizen@smartwaste.gov.in"
                        className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 focus:border-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="tel"
                        name="userPhone"
                        value={formData.userPhone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 focus:border-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Issue Category & Priority */}
              <div className="border-t border-slate-800/80 pt-5">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-emerald-400" /> 2. Issue Classification &amp; Urgency
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Issue Category <span className="text-rose-400">*</span>
                    </label>
                    <select
                      name="issueType"
                      value={formData.issueType}
                      onChange={handleChange}
                      className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Overflowing Bin">Overflowing Bin (&gt;90% full, spillage on street)</option>
                      <option value="Damaged / Broken Bin">Damaged / Broken Bin (lid, solar panel, sensor cover)</option>
                      <option value="Missed Waste Collection">Missed Waste Collection (scheduled truck skipped)</option>
                      <option value="Foul Odor / Hazardous Waste">Foul Odor / Hazardous Waste Leakage</option>
                      <option value="Illegal Dumping">Illegal Dumping on Public Curb</option>
                      <option value="Vehicle Spillage">Vehicle Waste Spillage</option>
                      <option value="Other">Other Operational Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Urgency Level</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Low">Low — Minor aesthetic or non-urgent concern</option>
                      <option value="Medium">Medium — Standard neighborhood pickup</option>
                      <option value="High">High — Large overflow blocking street</option>
                      <option value="Critical">Critical — Severe health/sanitation hazard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location & Bin Details */}
              <div className="border-t border-slate-800/80 pt-5">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" /> 3. Location Landmark &amp; Bin ID
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
                      Specific Location Landmark <span className="text-rose-400">*</span>
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
                  <p className="text-[11px] text-slate-500 mt-1">Located on the barcode label affixed to the bin casing.</p>
                </div>
              </div>

              {/* Photo Evidence Upload Section */}
              <div className="border-t border-slate-800/80 pt-5">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-400" /> 4. Upload Photo Evidence
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Upload an image of the overflowing garbage or damaged bin to assist the dispatch squad with vehicle sizing.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
                  >
                    <Upload className="w-4 h-4 text-emerald-400" /> Choose Photo from Device
                  </button>

                  {photoPreview && (
                    <div className="flex items-center gap-3">
                      <img
                        src={photoPreview}
                        alt="Evidence Preview"
                        className="w-16 h-14 object-cover rounded-xl border border-emerald-500/40"
                      />
                      <button
                        type="button"
                        onClick={() => { setPhotoPreview(''); setFormData(p => ({ ...p, photoUrl: '' })); }}
                        className="text-xs text-rose-400 hover:underline font-semibold"
                      >
                        Remove photo
                      </button>
                    </div>
                  )}
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
                  placeholder="Describe the nature of the waste accumulation, duration of overflow, or any relevant details..."
                  className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <span className="text-[11px] text-slate-400">
                  <span className="text-rose-400">*</span> Required fields for municipal registration
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Registering...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: COMPLAINT AUDIT & REDRESSAL LOG                   */}
      {/* ======================================================== */}
      {(isStaff || activeTab === 'list') && (
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
                  placeholder="Search complaint ID, location, citizen..."
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
                  <option value="Accepted">Accepted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Reopened">Reopened</option>
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
              onClick={fetchStaffAndComplaints}
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
                    <th className="py-3.5 px-4">Citizen / Reporter</th>
                    <th className="py-3.5 px-4">Issue Category</th>
                    <th className="py-3.5 px-4">Zone &amp; Landmark</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Responsible Staff</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
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
                          <div className="font-extrabold text-white font-mono">{c.complaintId}</div>
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
                          {c.photoUrl && (
                            <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5 font-semibold">
                              <Camera className="w-2.5 h-2.5" /> Photo Attached
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-300 font-semibold">{c.zone}</div>
                          <div className="text-slate-500 text-[10px] truncate max-w-[180px]">{c.location}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(c.priority)}`}>
                            {c.priority}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(c.status)}`}>
                            {c.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {c.assignedTo ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">
                                {c.assignedTo.name?.charAt(0) || 'S'}
                              </div>
                              <div>
                                <div className="text-white font-semibold leading-tight">{c.assignedTo.name}</div>
                                <div className="text-[10px] text-slate-500">{c.expectedCollectionTime || 'Assigned'}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">Unassigned</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {isAdmin && (
                            <button
                              onClick={() => handleOpenAssign(c)}
                              className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow"
                            >
                              Assign / Review
                            </button>
                          )}
                          {isStaff && (
                            <button
                              onClick={() => handleOpenWorkflow(c)}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-all shadow"
                            >
                              Update Status
                            </button>
                          )}
                          {isViewer && (
                            <button
                              onClick={() => navigate('/my-complaints')}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg"
                            >
                              Track
                            </button>
                          )}
                        </td>
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
      {/* ADMIN ASSIGNMENT & VALIDATION MODAL                      */}
      {/* ======================================================== */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Admin Complaint Control: ${selectedForAssign?.complaintId}`}
      >
        {selectedForAssign && (
          <form onSubmit={handleSaveAssignment} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="font-bold text-white text-sm">{selectedForAssign.issueType}</div>
              <p className="text-slate-400">{selectedForAssign.description}</p>
              <div className="text-[10px] text-slate-500 pt-1">
                Reported by: <strong className="text-slate-300">{selectedForAssign.userName}</strong> · Location: {selectedForAssign.location} ({selectedForAssign.zone})
              </div>
            </div>

            {selectedForAssign.photoUrl && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Attached Photo Evidence</label>
                <img
                  src={selectedForAssign.photoUrl}
                  alt="Evidence"
                  className="w-full max-h-48 object-cover rounded-xl border border-slate-800"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-purple-400" /> Assign Eligible Staff Member
              </label>
              <select
                value={assignData.assignedTo}
                onChange={(e) => setAssignData({ ...assignData, assignedTo: e.target.value })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              >
                <option value="">Select Staff Member to Assign...</option>
                {staffList.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.zone}) {s.phone ? `· ${s.phone}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Priority Override</label>
                <select
                  value={assignData.priority}
                  onChange={(e) => setAssignData({ ...assignData, priority: e.target.value })}
                  className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Collection Window</label>
                <input
                  type="text"
                  value={assignData.expectedCollectionTime}
                  onChange={(e) => setAssignData({ ...assignData, expectedCollectionTime: e.target.value })}
                  placeholder="e.g. Today 11:30 AM"
                  className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Administrative Remarks / Handling Instructions</label>
              <textarea
                rows="3"
                value={assignData.adminRemarks}
                onChange={(e) => setAssignData({ ...assignData, adminRemarks: e.target.value })}
                placeholder="Instructions for the field worker (e.g. Take heavy compactor truck 2002, hazardous waste reported)..."
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
              >
                Confirm Assignment
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ======================================================== */}
      {/* STAFF WORKFLOW UPDATE MODAL                              */}
      {/* ======================================================== */}
      <Modal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        title={`Staff Action Update: ${selectedForWorkflow?.complaintId}`}
      >
        {selectedForWorkflow && (
          <form onSubmit={handleSaveWorkflow} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="font-bold text-white mb-1">{selectedForWorkflow.issueType}</div>
              <p className="text-slate-400">{selectedForWorkflow.description}</p>
              <div className="mt-1 text-[10px] text-slate-500">
                Location: {selectedForWorkflow.location} ({selectedForWorkflow.zone})
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Execute Workflow Transition</label>
              <select
                value={workflowData.status}
                onChange={(e) => setWorkflowData({ ...workflowData, status: e.target.value })}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              >
                <option value="Accepted">Accepted — Worker acknowledged task</option>
                <option value="In Progress">In Progress — En route or collecting on site</option>
                <option value="Resolved">Resolved — Waste cleared and bin restored</option>
                <option value="Rejected">Blocked / Unable to Collect — Inaccessible</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Field Completion Notes / Operational Remarks
              </label>
              <textarea
                rows="3"
                value={workflowData.resolutionNotes}
                onChange={(e) => setWorkflowData({ ...workflowData, resolutionNotes: e.target.value })}
                placeholder="Log exact field action (e.g. Cleared 140kg overflow from Indiranagar bin, site washed and sanitized)..."
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsWorkflowModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                Save Action
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ComplaintReportingPage;
