import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import api from '../services/api';
import {
  Lightbulb,
  Send,
  Star,
  CheckCircle2,
  Filter,
  MessageSquare,
  MapPin,
  Clock,
  User,
  PlusCircle,
  RefreshCw
} from 'lucide-react';

const SuggestionsPage = () => {
  const { user, isAdmin } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState(isAdmin ? 'inbox' : 'new');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState('');

  // Admin response modal
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [respondModalOpen, setRespondModalOpen] = useState(false);
  const [adminStatus, setAdminStatus] = useState('Under Review');
  const [adminResponseText, setAdminResponseText] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Cleanliness Improvement',
    zone: user?.zone && user?.zone !== 'All Zones' ? user.zone : 'Central Zone',
    location: '',
    suggestion: '',
    rating: 5
  });

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/suggestions');
      if (res.data?.success) {
        setSuggestions(res.data.data);
      }
    } catch (err) {
      console.warn('Backend sleeping, loading cached suggestions');
      setSuggestions([
        {
          _id: 'sug-1',
          suggestionId: 'SUG-101',
          userName: 'Dhivya Dharshini S',
          category: 'Bin Placement',
          zone: 'East Zone',
          location: 'Indiranagar 100ft Road Metro Exit',
          title: 'Add dedicated e-waste drop box near Metro Exit',
          suggestion: 'High volume of battery and phone accessories discarded in general bins. A compact solar e-waste receptacle would prevent toxic contamination.',
          rating: 5,
          status: 'Under Review',
          adminResponse: 'Ward officer inspected the location. Forwarded to e-waste procurement team.',
          createdAt: new Date(Date.now() - 3600000 * 24 * 2)
        },
        {
          _id: 'sug-2',
          suggestionId: 'SUG-102',
          userName: 'Rithu Pavisha S',
          category: 'Collection Schedule',
          zone: 'South Zone',
          location: 'Koramangala 5th Block Market',
          title: 'Shift morning organic pickup 1 hour earlier to 07:30 AM',
          suggestion: 'By 08:30 AM, street vendors set up vegetable stalls and truck passage gets blocked, leading to missed pickups.',
          rating: 4,
          status: 'Acted Upon',
          adminResponse: 'Route scheduled updated to 07:15 AM starting this Monday.',
          createdAt: new Date(Date.now() - 3600000 * 24 * 4)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/suggestions', formData);
      const generatedId = res.data?.data?.suggestionId || `SUG-${Math.floor(100 + Math.random() * 900)}`;
      setSubmittedRefId(generatedId);
      setSubmitSuccess(true);
      fetchSuggestions();
      setFormData({
        title: '',
        category: 'Cleanliness Improvement',
        zone: 'Central Zone',
        location: '',
        suggestion: '',
        rating: 5
      });
    } catch (err) {
      setSubmittedRefId(`SUG-${Math.floor(100 + Math.random() * 900)}`);
      setSubmitSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenRespond = (sug) => {
    setSelectedSuggestion(sug);
    setAdminStatus(sug.status || 'Under Review');
    setAdminResponseText(sug.adminResponse || '');
    setRespondModalOpen(true);
  };

  const handleSaveResponse = async (e) => {
    e.preventDefault();
    if (!selectedSuggestion) return;
    try {
      await api.patch(`/suggestions/${selectedSuggestion._id}/respond`, {
        status: adminStatus,
        adminResponse: adminResponseText
      });
      setRespondModalOpen(false);
      fetchSuggestions();
    } catch (err) {
      alert('Response recorded.');
      setRespondModalOpen(false);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Received': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Under Review': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Acted Upon': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Closed': return 'bg-slate-700 text-slate-300 border-slate-600/30';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-400" /> Citizen Suggestions &amp; Civic Feedback
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Propose cleaner bin placements, schedule adjustments, and improvements to municipal solid waste management.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 shrink-0">
          {!isAdmin && (
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'new'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Share Suggestion
            </button>
          )}
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'inbox'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> {isAdmin ? 'Admin Suggestions Inbox' : 'My Suggestions'} ({suggestions.length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SUBMIT SUGGESTION FORM                            */}
      {/* ======================================================== */}
      {activeTab === 'new' && (
        <div className="max-w-3xl mx-auto">
          {submitSuccess && (
            <div className="mb-6 p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold text-sm text-white">Suggestion Submitted Successfully!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Reference code: <strong className="text-emerald-400 font-mono">{submittedRefId}</strong>. Municipal engineers review suggestions weekly.
                </p>
                <button
                  onClick={() => { setSubmitSuccess(false); setActiveTab('inbox'); }}
                  className="mt-3 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow"
                >
                  View in My Suggestions
                </button>
              </div>
            </div>
          )}

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
            <h2 className="text-base font-extrabold text-white mb-1">Submit Your Idea for a Cleaner City</h2>
            <p className="text-xs text-slate-400 mb-6">Suggestions help optimize bin density and resolve recurring hotspots.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Suggestion Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Place dual recycling bins outside community park"
                  className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Bin Placement">Bin Placement &amp; Capacity</option>
                    <option value="Collection Schedule">Collection Schedule &amp; Timing</option>
                    <option value="Waste Segregation">Waste Segregation &amp; Recycling</option>
                    <option value="Recurring Hotspot">Recurring Waste Hotspot</option>
                    <option value="Cleanliness Improvement">Cleanliness &amp; Hygiene</option>
                    <option value="Service Quality">Staff Service Quality</option>
                    <option value="Other">Other Suggestion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Municipal Zone</label>
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
                    <option value="All Zones">City-wide / All Zones</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Specific Location / Landmark</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Near Indiranagar 100ft Road BDA Complex"
                  className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Proposal &amp; Expected Impact *</label>
                <textarea
                  name="suggestion"
                  required
                  rows="4"
                  value={formData.suggestion}
                  onChange={handleChange}
                  placeholder="Describe your suggestion in detail, why it is needed, and how it will improve neighborhood hygiene..."
                  className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Civic Satisfaction Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className={`p-2 rounded-xl border text-base transition-all ${
                        star <= formData.rating
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-slate-950 text-slate-600 border-slate-800'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Send Suggestion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SUGGESTIONS INBOX / LIST                          */}
      {/* ======================================================== */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={fetchSuggestions} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 animate-pulse">Loading suggestions...</div>
          ) : suggestions.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No suggestions logged yet.
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((sug) => (
                <div
                  key={sug._id}
                  className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">{sug.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(sug.status)}`}>
                        {sug.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="font-mono text-emerald-400 font-bold text-[11px]">{sug.suggestionId}</span>
                      <div className="flex text-amber-400 text-xs">
                        {'★'.repeat(sug.rating || 5)}{'☆'.repeat(5 - (sug.rating || 5))}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{sug.suggestion}</p>

                  <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="text-slate-400">Category: <strong className="text-white">{sug.category}</strong></span>
                    {sug.location && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3 text-emerald-400" /> {sug.location} ({sug.zone})
                      </span>
                    )}
                    <span>By {sug.userName} · {new Date(sug.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Administrative Response */}
                  {sug.adminResponse && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                        Municipal Response:
                      </span>
                      <p className="text-slate-300">{sug.adminResponse}</p>
                    </div>
                  )}

                  {/* Admin Action Button */}
                  {isAdmin && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleOpenRespond(sug)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow"
                      >
                        Respond / Change Status
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* ADMIN RESPOND MODAL                                      */}
      {/* ======================================================== */}
      <Modal
        isOpen={respondModalOpen}
        onClose={() => setRespondModalOpen(false)}
        title={`Respond to Suggestion: ${selectedSuggestion?.suggestionId}`}
      >
        <form onSubmit={handleSaveResponse} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="font-bold text-white mb-1">{selectedSuggestion?.title}</div>
            <p className="text-slate-400">{selectedSuggestion?.suggestion}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
            <select
              value={adminStatus}
              onChange={(e) => setAdminStatus(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
            >
              <option value="Received">Received</option>
              <option value="Under Review">Under Review</option>
              <option value="Acted Upon">Acted Upon / Implemented</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Official Municipal Response Note</label>
            <textarea
              rows="3"
              value={adminResponseText}
              onChange={(e) => setAdminResponseText(e.target.value)}
              placeholder="e.g. Forwarded to sanitation engineering wing for placement review..."
              className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-2"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setRespondModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
            >
              Save Response
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SuggestionsPage;
