import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import InteractiveWasteMap from '../components/map/InteractiveWasteMap';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  AlertTriangle,
  CalendarCheck,
  Truck,
  CheckCircle2,
  Activity,
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon,
  BarChart2,
  Wifi,
  MessageSquare,
  PlusCircle,
  FileText,
  Clock,
  Sparkles,
  MapPin,
  Check,
  Lightbulb
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const MOCK_DATA = {
  kpis: {
    totalBins: 20, activeBins: 20, overflowingBins: 4, requiringAttentionBins: 7,
    todayCollectionsCount: 6, completedCollections: 4, pendingCollections: 2,
    totalVehicles: 5, availableVehicles: 3, vehiclesCurrentlyCollecting: 2,
    totalWasteCollectedKg: 3420, collectionEfficiency: 88,
    // Role-specific metrics
    totalComplaints: 8,
    unassignedComplaints: 2,
    inProgressComplaints: 3,
    resolvedComplaints: 3,
    resolutionRate: 88,
    avgResolutionTimeHours: 4.2
  },
  charts: {
    collectionTrend: [
      { day: 'Mon', wasteKg: 420 }, { day: 'Tue', wasteKg: 510 }, { day: 'Wed', wasteKg: 480 },
      { day: 'Thu', wasteKg: 620 }, { day: 'Fri', wasteKg: 590 }, { day: 'Sat', wasteKg: 710 }, { day: 'Sun', wasteKg: 840 }
    ],
    statusDistribution: { Empty: 6, Moderate: 5, High: 5, VeryHigh: 2, Critical: 2 },
    wasteCategoryDistribution: [
      { category: 'Organic', quantity: 1200 }, { category: 'Plastic', quantity: 850 },
      { category: 'Paper', quantity: 540 }, { category: 'Glass', quantity: 310 },
      { category: 'E-waste', quantity: 280 }, { category: 'Metal', quantity: 240 }
    ],
    complaintCategories: [
      { category: 'Overflowing Bin', count: 4 },
      { category: 'Missed Pickup', count: 1 },
      { category: 'Damaged Bin', count: 1 },
      { category: 'Foul Odor', count: 1 },
      { category: 'Illegal Dumping', count: 1 }
    ],
    areaWiseWaste: [
      { zone: 'East Zone', quantity: 1450 }, { zone: 'South Zone', quantity: 1200 },
      { zone: 'Central Zone', quantity: 980 }, { zone: 'North Zone', quantity: 850 }
    ]
  }
};

const DashboardPage = () => {
  const { user, isAdmin, isStaff, isViewer } = useContext(AuthContext);
  const navigate = useNavigate();

  const [data, setData] = useState(MOCK_DATA);
  const [criticalBins, setCriticalBins] = useState([]);
  const [allBins, setAllBins] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [waking, setWaking] = useState(true);

  const role = user?.role || 'viewer';

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, binsRes, complaintsRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/bins'),
        api.get('/complaints')
      ]);

      if (analyticsRes.data?.success) setData(analyticsRes.data);
      if (binsRes.data?.success) {
        setAllBins(binsRes.data.data);
        setCriticalBins(binsRes.data.data.filter(b => b.fillLevel >= 75));
      }
      if (complaintsRes.data?.success) {
        setRecentComplaints(complaintsRes.data.data.slice(0, 4));
      }
      setIsLive(true);
      setWaking(false);
    } catch (err) {
      setWaking(false);
      setRecentComplaints([
        { _id: '1', complaintId: 'CMP-2001', userName: 'Dhivya Dharshini S', issueType: 'Overflowing Bin', location: 'Indiranagar 100ft Rd', priority: 'Critical', status: 'In Review' },
        { _id: '2', complaintId: 'CMP-2004', userName: 'Rithu Pavisha S', issueType: 'Foul Odor', location: 'HSR Layout 27th Main', priority: 'Critical', status: 'Assigned' },
        { _id: '3', complaintId: 'CMP-2005', userName: 'Sautanyhassre B T', issueType: 'Overflowing Bin', location: 'MG Road Metro', priority: 'High', status: 'Submitted' }
      ]);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const kpis = data?.kpis || MOCK_DATA.kpis;
  const charts = data?.charts || MOCK_DATA.charts;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Wake-up banner if backend starting */}
      {waking && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-medium">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span>Connecting to municipal cloud cluster... Showing responsive operational cache.</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* ROLE 1: ADMIN EXECUTIVE DASHBOARD                        */}
      {/* ======================================================== */}
      {isAdmin && (
        <>
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold text-white">Municipal Command Center</h1>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                  Admin Authority
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Full-city operational oversight: IoT telemetry, citizen grievance redressal, and route scheduling.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/complaints')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> Manage Complaints
              </button>
              <button
                onClick={() => navigate('/collections')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <CalendarCheck className="w-4 h-4 text-emerald-400" /> Dispatch Route
              </button>
            </div>
          </div>

          {/* Admin KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Total Grievances" value={kpis.totalComplaints || 8} icon={MessageSquare} color="emerald" />
            <StatCard title="Awaiting Assign" value={kpis.unassignedComplaints || 2} icon={AlertTriangle} color="amber" critical={kpis.unassignedComplaints > 0} />
            <StatCard title="Active In Progress" value={kpis.inProgressComplaints || 3} icon={Activity} color="indigo" />
            <StatCard title="Resolved Issues" value={kpis.resolvedComplaints || 3} icon={CheckCircle2} color="emerald" />
            <StatCard title="Critical Bins" value={kpis.overflowingBins || 4} icon={Trash2} color="rose" critical={kpis.overflowingBins > 0} />
            <StatCard title="Fleet Efficiency" value={`${kpis.collectionEfficiency || 88}%`} icon={Truck} color="cyan" trend="up" trendValue="4%" />
          </div>

          {/* Main Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">Daily Waste Collection Trend (kg)</h3>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">Last 7 Days</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.collectionTrend || []}>
                    <defs>
                      <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="wasteKg" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWaste)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Live GIS Map Preview */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">GIS Map Telemetry</h3>
                </div>
                <button onClick={() => navigate('/map')} className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium">
                  Full View <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 min-h-[220px]">
                <InteractiveWasteMap bins={allBins} onScheduleCollection={(bin) => navigate('/collections', { state: { selectedBin: bin } })} height="220px" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* ROLE 2: STAFF FIELD OPERATIONS WORKSPACE                 */}
      {/* ======================================================== */}
      {isStaff && (
        <>
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 p-6 rounded-2xl border border-emerald-500/30 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Field Operations Workspace</span>
                <h1 className="text-xl md:text-2xl font-extrabold text-white mt-0.5">Welcome, {user?.name || 'Field Officer'} 👋</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Assigned Zone: <strong className="text-emerald-400">{user?.zone || 'Central Zone'}</strong> · Ready for route pickups and resolution updates.
                </p>
              </div>
              <button
                onClick={() => navigate('/collections')}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0"
              >
                <CalendarCheck className="w-4 h-4" /> Open My Tasks Portal
              </button>
            </div>
          </div>

          {/* Staff Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="My Pending Pickups" value="2" icon={Clock} color="amber" />
            <StatCard title="In Progress Work" value="1" icon={Activity} color="indigo" />
            <StatCard title="Resolved Today" value="4" icon={CheckCircle2} color="emerald" />
            <StatCard title="Assigned Vehicle" value="KA-01-WM-2002" icon={Truck} color="cyan" />
          </div>

          {/* Direct Action Hub */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-400" /> Immediate Scheduled Tasks
              </h3>
              <div className="space-y-2">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-white">COL-101 · Indiranagar 100ft Rd</span>
                    <p className="text-[11px] text-slate-400">Priority: High · Compactor Truck 2002</p>
                  </div>
                  <button onClick={() => navigate('/collections')} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg">
                    Update
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-white">COL-105 · Koramangala 5th Block</span>
                    <p className="text-[11px] text-slate-400">Scheduled: 10:00 AM · Organic Waste</p>
                  </div>
                  <button onClick={() => navigate('/collections')} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg">
                    View
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" /> Assigned Citizen Grievances
              </h3>
              <p className="text-xs text-slate-400">Grievances assigned to your squad requiring verification.</p>
              <div className="space-y-2">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/20 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-white">CMP-2004 · HSR Layout 27th Main</span>
                    <p className="text-[11px] text-purple-300">Foul Odor / Hazardous Overflow</p>
                  </div>
                  <button onClick={() => navigate('/complaints')} className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg">
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* ROLE 3: VIEWER / CITIZEN DASHBOARD                       */}
      {/* ======================================================== */}
      {isViewer && (
        <>
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Civic Cleanliness Portal</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome, {user?.name || 'Citizen'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Empowering residents to keep neighborhoods clean. Report overflowing bins, track resolution in real time, and discover nearest municipal waste sorting hubs.
              </p>
              <div className="pt-3 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/complaints')}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Report Waste Problem
                </button>
                <button
                  onClick={() => navigate('/my-complaints')}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-emerald-400" /> Track My Complaints
                </button>
                <button
                  onClick={() => navigate('/suggestions')}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition-all flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" /> Give Suggestions
                </button>
              </div>
            </div>
          </div>

          {/* Citizen Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="My Total Complaints" value="3" icon={FileText} color="emerald" />
            <StatCard title="Under Action" value="1" icon={Activity} color="indigo" />
            <StatCard title="Resolved Issues" value="2" icon={CheckCircle2} color="emerald" />
            <StatCard title="City Cleanliness Rate" value="94%" icon={Sparkles} color="cyan" />
          </div>

          {/* Waste Segregation Guide Banner */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Source Segregation Guide for Citizens
            </h3>
            <p className="text-xs text-slate-400">Sort household waste correctly to assist municipal processing and prevent toxic landfill fires:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
                <span className="font-extrabold text-emerald-400 block mb-1">🟢 Wet / Organic Waste</span>
                <p className="text-slate-300 text-[11px]">Vegetable peels, cooked food, fruit leftovers, tea bags, garden leaves.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs">
                <span className="font-extrabold text-blue-400 block mb-1">🔵 Dry / Recyclable Waste</span>
                <p className="text-slate-300 text-[11px]">Plastic bottles, clean cardboard, newspapers, milk packets, metal cans.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs">
                <span className="font-extrabold text-rose-400 block mb-1">🔴 Domestic Hazardous</span>
                <p className="text-slate-300 text-[11px]">Sanitary items, batteries, discarded medicines, paint cans, tube lights.</p>
              </div>
            </div>
          </div>

          {/* Nearby Bins Map Preview */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" /> Clean Municipal Bins in Your Area
                </h3>
                <p className="text-[11px] text-slate-400">Check bin fill levels before heading out to dispose of recyclables.</p>
              </div>
              <button onClick={() => navigate('/map')} className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium">
                Full Map View <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="h-64">
              <InteractiveWasteMap bins={allBins} onScheduleCollection={() => navigate('/complaints')} height="250px" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
