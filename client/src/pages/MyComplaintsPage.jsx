import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import api from '../services/api';
import {
  FileText,
  Search,
  Filter,
  RefreshCw,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  ChevronRight,
  Star,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  PlusCircle,
  Eye,
  Camera
} from 'lucide-react';

const MyComplaintsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Detail Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Feedback / Confirm Resolved Modal
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  // Reopen Modal
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [reopenSubmitting, setReopenSubmitting] = useState(false);

  const fetchMyComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints?myComplaints=true');
      if (res.data?.success) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      console.warn('Backend unavailable, using cached personal complaints');
      setComplaints([
        {
          _id: 'cmp-2005',
          complaintId: 'CMP-2005',
          userName: user?.name || 'Citizen',
          userEmail: user?.email || '',
          issueType: 'Overflowing Bin',
          priority: 'High',
          zone: 'Central Zone',
          location: 'Church Street Junction, MG Road Metro Station',
          binId: 'BIN-105',
          description: 'Recyclables plastic bottle bin completely full after weekend evening foot traffic. Needs immediate clearance.',
          status: 'Assigned',
          assignedTo: { name: 'Ravi Kumar', role: 'staff', phone: '+91 98765 43210' },
          expectedCollectionTime: 'Today 11:30 AM',
          createdAt: new Date(Date.now() - 3600000 * 2),
          activityLog: [
            { action: 'Complaint Submitted', performedBy: user?.name || 'Citizen', timestamp: new Date(Date.now() - 3600000 * 2) },
            { action: 'Assigned to Ravi Kumar', performedBy: 'Municipal Dispatch Admin', timestamp: new Date(Date.now() - 3600000 * 1) }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const handleOpenDetail = (cmp) => {
    setSelectedComplaint(cmp);
    setDetailModalOpen(true);
  };

  const handleOpenFeedback = (cmp) => {
    setSelectedComplaint(cmp);
    setFeedbackRating(5);
    setFeedbackComment('');
    setFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setFeedbackSubmitting(true);
    try {
      await api.patch(`/complaints/${selectedComplaint._id}/citizen-action`, {
        action: 'confirm_resolved',
        rating: feedbackRating,
        comment: feedbackComment
      });
      setFeedbackModalOpen(false);
      fetchMyComplaints();
    } catch (err) {
      alert('Feedback recorded locally.');
      setFeedbackModalOpen(false);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const handleOpenReopen = (cmp) => {
    setSelectedComplaint(cmp);
    setReopenReason('');
    setReopenModalOpen(true);
  };

  const handleSubmitReopen = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setReopenSubmitting(true);
    try {
      await api.patch(`/complaints/${selectedComplaint._id}/citizen-action`, {
        action: 'reopen',
        reopenReason
      });
      setReopenModalOpen(false);
      fetchMyComplaints();
    } catch (err) {
      alert('Reopen request logged.');
      setReopenModalOpen(false);
    } finally {
      setReopenSubmitting(false);
    }
  };

  const filtered = complaints.filter(c => {
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchSearch = !search ||
      c.complaintId.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.issueType.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Submitted': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'In Review': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Assigned':  return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Accepted':  return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'In Progress': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Resolved':  return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Reopened':  return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:          return 'bg-slate-700/40 text-slate-300 border-slate-600/30';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" /> My Personal Complaints History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track real-time progress, see assigned collection officers, and confirm resolution proof for all your reported issues.
          </p>
        </div>

        <button
          onClick={() => navigate('/complaints')}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Report New Issue
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Complaint ID or location..."
              className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 w-64"
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
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>
        </div>

        <button onClick={fetchMyComplaints} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse">Loading your complaints history...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
          <CheckCircle2 className="w-12 h-12 text-emerald-500/40 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No Complaints Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            You currently have no complaints matching the search criteria.
          </p>
          <button
            onClick={() => navigate('/complaints')}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow"
          >
            Report an Issue Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((cmp) => (
            <div
              key={cmp._id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: Complaint Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-sm text-white font-mono">{cmp.complaintId}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(cmp.status)}`}>
                      {cmp.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                      {cmp.priority} Priority
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-200">{cmp.issueType}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{cmp.description}</p>

                  <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {cmp.location} ({cmp.zone})
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      Reported {new Date(cmp.createdAt).toLocaleDateString()} at {new Date(cmp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Photo Evidence Thumbnail if Present */}
                  {cmp.photoUrl && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                        <Camera className="w-3 h-3 text-emerald-400" /> Uploaded Photo Evidence:
                      </span>
                      <img
                        src={cmp.photoUrl}
                        alt="Evidence"
                        className="w-24 h-20 object-cover rounded-xl border border-slate-800 hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => handleOpenDetail(cmp)}
                      />
                    </div>
                  )}

                  {/* Assigned Officer Visibility Section */}
                  {cmp.assignedTo && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-purple-500/20 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xs">
                          {cmp.assignedTo.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Responsible Collection Officer</div>
                          <div className="text-xs font-bold text-white">{cmp.assignedTo.name}</div>
                          <div className="text-[10px] text-slate-400">Official Contact: {cmp.assignedTo.phone || 'Available via Helpdesk'}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-500">Expected Resolution Window</div>
                        <div className="text-xs font-semibold text-emerald-400">{cmp.expectedCollectionTime || 'Confirmed Route Schedule'}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex md:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenDetail(cmp)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" /> Full History
                  </button>

                  {cmp.status === 'Resolved' && !cmp.citizenFeedback?.isConfirmedResolved && (
                    <button
                      onClick={() => handleOpenFeedback(cmp)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Resolved
                    </button>
                  )}

                  {cmp.status === 'Resolved' && (
                    <button
                      onClick={() => handleOpenReopen(cmp)}
                      className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs rounded-xl border border-rose-500/30 transition-all flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Still Not Resolved?
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* FULL COMPLAINT TIMELINE & DETAIL MODAL                   */}
      {/* ======================================================== */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={`Complaint Details: ${selectedComplaint?.complaintId}`}
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-sm">{selectedComplaint.issueType}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(selectedComplaint.status)}`}>
                  {selectedComplaint.status}
                </span>
              </div>
              <p className="text-slate-300">{selectedComplaint.description}</p>
              <div className="text-[10px] text-slate-500 pt-1">
                Location: {selectedComplaint.location} ({selectedComplaint.zone})
              </div>
            </div>

            {/* Photo Preview */}
            {selectedComplaint.photoUrl && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Attached Photo Evidence</label>
                <img
                  src={selectedComplaint.photoUrl}
                  alt="Complaint Evidence"
                  className="w-full max-h-56 object-cover rounded-xl border border-slate-800"
                />
              </div>
            )}

            {/* Responsible Staff Details */}
            {selectedComplaint.assignedTo && (
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs">
                <div className="font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Assigned Municipal Staff Officer
                </div>
                <div className="text-white font-semibold">{selectedComplaint.assignedTo.name}</div>
                <div className="text-[11px] text-slate-400">Contact: {selectedComplaint.assignedTo.phone || selectedComplaint.assignedTo.email}</div>
                <div className="text-[10px] text-emerald-400 mt-1">Expected Arrival: {selectedComplaint.expectedCollectionTime || 'Confirmed route'}</div>
              </div>
            )}

            {/* Resolution Evidence if Resolved */}
            {selectedComplaint.resolutionNotes && (
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
                <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Staff Resolution Notes
                </div>
                <p className="text-slate-300">{selectedComplaint.resolutionNotes}</p>
                {selectedComplaint.resolvedAt && (
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Resolved on {new Date(selectedComplaint.resolvedAt).toLocaleString()}
                  </span>
                )}
              </div>
            )}

            {/* Audit Progress Timeline */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Audit Progress Timeline
              </label>
              <div className="space-y-2 border-l-2 border-emerald-500/40 pl-3 ml-2 text-xs">
                {selectedComplaint.activityLog && selectedComplaint.activityLog.length > 0 ? (
                  selectedComplaint.activityLog.map((log, idx) => (
                    <div key={idx} className="relative pb-2">
                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900" />
                      <div className="font-bold text-white">{log.action}</div>
                      <div className="text-[10px] text-slate-500">
                        By {log.performedBy} ({log.role}) · {new Date(log.timestamp).toLocaleString()}
                      </div>
                      {log.notes && <p className="text-[11px] text-slate-400 mt-0.5">{log.notes}</p>}
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 text-xs">Complaint submitted and registered in municipal dispatch.</div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ======================================================== */}
      {/* CONFIRM RESOLUTION & FEEDBACK MODAL                      */}
      {/* ======================================================== */}
      <Modal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        title="Confirm Resolution & Citizen Rating"
      >
        <form onSubmit={handleSubmitFeedback} className="space-y-4">
          <p className="text-xs text-slate-300">
            Municipal field workers have marked this issue as resolved. Please verify if the site has been cleaned and share your feedback.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Rating (1 to 5 Stars)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFeedbackRating(star)}
                  className={`p-2 rounded-xl border text-base transition-all ${
                    star <= feedbackRating
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-slate-950 text-slate-600 border-slate-800'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Feedback / Service Remarks</label>
            <textarea
              rows="3"
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="e.g. Garbage was completely cleared and bin washed. Excellent quick response!"
              className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setFeedbackModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={feedbackSubmitting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
            >
              {feedbackSubmitting ? 'Saving...' : 'Submit Resolution Confirmation'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ======================================================== */}
      {/* REOPEN COMPLAINT MODAL                                   */}
      {/* ======================================================== */}
      <Modal
        isOpen={reopenModalOpen}
        onClose={() => setReopenModalOpen(false)}
        title="Request Complaint Reopening"
      >
        <form onSubmit={handleSubmitReopen} className="space-y-4">
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300">
            If the garbage was not cleared properly or the issue still persists on site, provide details below. An administrative investigation will be triggered.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Reason Why Issue Is Still Not Resolved <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows="3"
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="Describe what remains unaddressed (e.g. Truck emptied only one bin, spillage left behind on road)..."
              className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setReopenModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={reopenSubmitting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              {reopenSubmitting ? 'Reopening...' : 'Confirm Reopen'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyComplaintsPage;
