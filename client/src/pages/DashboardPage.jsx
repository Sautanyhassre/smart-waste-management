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
  Lightbulb,
  Shield,
  Layers
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

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
const STAFF_COLORS = ['#f59e0b', '#6366f1', '#10b981'];
const CITIZEN_COLORS = ['#f59e0b', '#3b82f6', '#10b981'];

const MOCK_DATA = {
  kpis: {
    totalBins: 20,
    activeBins: 20,
    overflowingBins: 4,
    requiringAttentionBins: 7,
    todayCollectionsCount: 6,
    completedCollections: 4,
    pendingCollections: 2,
    totalVehicles: 5,
    availableVehicles: 3,
    vehiclesCurrentlyCollecting: 2,
    totalWasteCollectedKg: 3420,
    collectionEfficiency: 88,
    totalComplaints: 8,
    unassignedComplaints: 2,
    inProgressComplaints: 3,
    resolvedComplaints: 3,
    resolutionRate: 88,
    avgResolutionTimeHours: 4.2
  },
  charts: {
    collectionTrend: [
      { day: 'Mon', wasteKg: 420 },
      { day: 'Tue', wasteKg: 510 },
      { day: 'Wed', wasteKg: 480 },
      { day: 'Thu', wasteKg: 620 },
      { day: 'Fri', wasteKg: 590 },
      { day: 'Sat', wasteKg: 710 },
      { day: 'Sun', wasteKg: 840 }
    ],
    statusDistribution: { Empty: 6, Moderate: 5, High: 5, VeryHigh: 2, Critical: 2 },
    wasteCategoryDistribution: [
      { category: 'Organic', quantity: 1200 },
      { category: 'Plastic', quantity: 850 },
      { category: 'Paper', quantity: 540 },
      { category: 'Glass', quantity: 310 },
      { category: 'E-waste', quantity: 280 },
      { category: 'Metal', quantity: 240 }
    ],
    complaintCategories: [
      { category: 'Overflowing Bin', count: 4 },
      { category: 'Missed Pickup', count: 1 },
      { category: 'Damaged Bin', count: 1 },
      { category: 'Foul Odor', count: 1 },
      { category: 'Illegal Dumping', count: 1 }
    ],
    areaWiseWaste: [
      { zone: 'East Zone', quantity: 1450 },
      { zone: 'South Zone', quantity: 1200 },
      { zone: 'Central Zone', quantity: 980 },
      { zone: 'North Zone', quantity: 850 }
    ]
  }
};

const DashboardPage = () => {
  const { user, isAdmin, isStaff, isViewer } = useContext(AuthContext);
  const navigate = useNavigate();

  const [data, setData] = useState(MOCK_DATA);
  const [criticalBins, setCriticalBins] = useState([]);
  const [allBins, setAllBins] = useState([]);
  const [complaintsList, setComplaintsList] = useState([]);
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
        setComplaintsList(complaintsRes.data.data);
      }
      setIsLive(true);
      setWaking(false);
    } catch (err) {
      setWaking(false);
      setComplaintsList([
        { _id: '1', complaintId: 'CMP-2001', userName: 'Dhivya Dharshini S', issueType: 'Overflowing Bin', location: 'Indiranagar 100ft Rd', priority: 'Critical', status: 'In Review', zone: 'East Zone' },
        { _id: '2', complaintId: 'CMP-2004', userName: 'Rithu Pavisha S', issueType: 'Foul Odor', location: 'HSR Layout 27th Main', priority: 'Critical', status: 'Assigned', zone: 'South Zone' },
        { _id: '3', complaintId: 'CMP-2005', userName: 'Sautanyhassre B T', issueType: 'Overflowing Bin', location: 'MG Road Metro', priority: 'High', status: 'Submitted', zone: 'Central Zone' },
        { _id: '4', complaintId: 'CMP-2002', userName: 'Divyadharshini K', issueType: 'Missed Pickup', location: 'Koramangala 4th Block', priority: 'High', status: 'In Progress', zone: 'South Zone' },
        { _id: '5', complaintId: 'CMP-2003', userName: 'Kavisurya B', issueType: 'Damaged Bin', location: 'Whitefield Main Rd', priority: 'Medium', status: 'Resolved', zone: 'East Zone' }
      ]);
      setAllBins([
        { _id: 'b1', binId: 'BIN-101', name: 'Indiranagar Metro Point', location: '100ft Road Indiranagar', zone: 'East Zone', wasteType: 'Organic', fillLevel: 88, status: 'Critical', priorityLevel: 'High' },
        { _id: 'b2', binId: 'BIN-102', name: 'Koramangala Commercial Hub', location: '80ft Road 4th Block', zone: 'South Zone', wasteType: 'Plastic', fillLevel: 92, status: 'Critical', priorityLevel: 'High' },
        { _id: 'b3', binId: 'BIN-103', name: 'MG Road Boulevard', location: 'MG Road Trinity Circle', zone: 'Central Zone', wasteType: 'General', fillLevel: 78, status: 'High', priorityLevel: 'Medium' },
        { _id: 'b4', binId: 'BIN-104', name: 'HSR Public Park', location: 'Sector 2 HSR Layout', zone: 'South Zone', wasteType: 'Recyclable', fillLevel: 45, status: 'Moderate', priorityLevel: 'Low' },
        { _id: 'b5', binId: 'BIN-105', name: 'Whitefield EPIP Plaza', location: 'ITPL Main Road', zone: 'East Zone', wasteType: 'Electronic', fillLevel: 30, status: 'Empty', priorityLevel: 'Low' }
      ]);
      setCriticalBins([
        { _id: 'b1', binId: 'BIN-101', name: 'Indiranagar Metro Point', location: '100ft Road Indiranagar', zone: 'East Zone', wasteType: 'Organic', fillLevel: 88, status: 'Critical', priorityLevel: 'High' },
        { _id: 'b2', binId: 'BIN-102', name: 'Koramangala Commercial Hub', location: '80ft Road 4th Block', zone: 'South Zone', wasteType: 'Plastic', fillLevel: 92, status: 'Critical', priorityLevel: 'High' },
        { _id: 'b3', binId: 'BIN-103', name: 'MG Road Boulevard', location: 'MG Road Trinity Circle', zone: 'Central Zone', wasteType: 'General', fillLevel: 78, status: 'High', priorityLevel: 'Medium' }
      ]);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const kpis = data?.kpis || MOCK_DATA.kpis;
  const charts = data?.charts || MOCK_DATA.charts;

  // Role Scoped Calculations for Staff
  const staffZone = user?.zone || 'Central Zone';
  const staffZoneBins = allBins.filter(b => b.zone === staffZone || (!user?.zone && b.fillLevel >= 70));
  const staffComplaints = complaintsList.filter(c => 
    c.assignedTo === user?.name || 
    c.assignedTo?._id === user?._id || 
    c.zone === staffZone
  );
  const staffPendingCount = staffComplaints.filter(c => c.status === 'Assigned' || c.status === 'Accepted').length || 2;
  const staffInProgressCount = staffComplaints.filter(c => c.status === 'In Progress').length || 1;
  const staffResolvedCount = staffComplaints.filter(c => c.status === 'Resolved').length || 4;

  const staffTaskBreakdown = [
    { name: 'Pending', value: staffPendingCount },
    { name: 'In Progress', value: staffInProgressCount },
    { name: 'Completed', value: staffResolvedCount }
  ];

  const staffZoneProgress = [
    { target: 'Organic Bins', scheduled: 5, collected: 4 },
    { target: 'Recyclables', scheduled: 4, collected: 3 },
    { target: 'Hazardous', scheduled: 2, collected: 2 }
  ];

  // Role Scoped Calculations for Viewer / Citizen
  const citizenComplaints = complaintsList;
  const citizenTotal = citizenComplaints.length || 3;
  const citizenUnderAction = citizenComplaints.filter(c => ['Submitted', 'Assigned', 'In Review', 'In Progress', 'Accepted'].includes(c.status)).length || 1;
  const citizenResolved = citizenComplaints.filter(c => c.status === 'Resolved').length || 2;

  const citizenStatusBreakdown = [
    { name: 'Under Review', value: citizenComplaints.filter(c => c.status === 'Submitted' || c.status === 'In Review').length || 1 },
    { name: 'Field Action', value: citizenComplaints.filter(c => ['Assigned', 'Accepted', 'In Progress'].includes(c.status)).length || 1 },
    { name: 'Resolved', value: citizenComplaints.filter(c => c.status === 'Resolved').length || 1 }
  ];

  const citizenRecyclingData = [
    { stream: 'Composted Wet Waste', kg: 140 },
    { stream: 'Recycled Dry Plastic', kg: 85 },
    { stream: 'Safe E-Waste Collected', kg: 25 }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Cold-start notification */}
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
                Full-city operational oversight: sensor telemetry, citizen grievance redressal, and route scheduling.
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
            <StatCard title="Total Grievances" value={kpis.totalComplaints || complaintsList.length || 8} icon={MessageSquare} color="emerald" />
            <StatCard title="Awaiting Assign" value={kpis.unassignedComplaints || 2} icon={AlertTriangle} color="amber" critical={kpis.unassignedComplaints > 0} />
            <StatCard title="Active In Progress" value={kpis.inProgressComplaints || 3} icon={Activity} color="indigo" />
            <StatCard title="Resolved Issues" value={kpis.resolvedComplaints || 3} icon={CheckCircle2} color="emerald" />
            <StatCard title="Critical Bins" value={criticalBins.length || 4} icon={Trash2} color="rose" critical={criticalBins.length > 0} />
            <StatCard title="Fleet Efficiency" value={`${kpis.collectionEfficiency || 88}%`} icon={Truck} color="cyan" trend="up" trendValue="4%" />
          </div>

          {/* Row 1: Daily Collection Trend & GIS Map Preview */}
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

          {/* Row 2: Charts - Waste Composition & Complaint Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Waste Composition Pie Chart */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-teal-400" />
                  <h3 className="font-bold text-sm text-white">Waste Category Composition</h3>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Tonnage</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.wasteCategoryDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="quantity"
                      nameKey="category"
                    >
                      {(charts.wasteCategoryDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grievance Categories Bar Chart */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">Grievance Issues by Type</h3>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Total Filed</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.complaintCategories || []} layout="vertical">
                    <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={10} tickLine={false} width={85} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Zone-Wise Waste Bar Chart */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-sm text-white">Zone Waste Generation (kg)</h3>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Regional</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.areaWiseWaste || []}>
                    <XAxis dataKey="zone" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="quantity" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 3: Critical Bins Requiring Urgent Action Table */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" /> Critical Waste Bins Requiring Dispatch
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Automated telemetry flags bins with &ge;75% fill level needing immediate collection.</p>
              </div>
              <button onClick={() => navigate('/bins')} className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
                Manage All Bins <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2.5 font-semibold">Bin ID / Name</th>
                    <th className="pb-2.5 font-semibold">Zone</th>
                    <th className="pb-2.5 font-semibold">Waste Category</th>
                    <th className="pb-2.5 font-semibold">Fill Level</th>
                    <th className="pb-2.5 font-semibold">Status</th>
                    <th className="pb-2.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {criticalBins.slice(0, 4).map((bin) => (
                    <tr key={bin._id || bin.binId} className="hover:bg-slate-800/40">
                      <td className="py-3">
                        <span className="font-bold text-white block">{bin.binId}</span>
                        <span className="text-[11px] text-slate-400">{bin.name || bin.location}</span>
                      </td>
                      <td className="py-3 text-slate-300">{bin.zone || 'Central Zone'}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
                          {bin.wasteType || 'General'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full ${bin.fillLevel >= 85 ? 'bg-rose-500' : 'bg-amber-400'}`}
                              style={{ width: `${Math.min(bin.fillLevel, 100)}%` }}
                            />
                          </div>
                          <span className="font-bold text-white text-[11px]">{bin.fillLevel}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant={bin.fillLevel >= 85 ? 'danger' : 'warning'}>
                          {bin.fillLevel >= 85 ? 'Critical' : 'Attention'}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => navigate('/collections', { state: { selectedBin: bin } })}
                          className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-semibold rounded-lg text-xs transition-all"
                        >
                          Dispatch
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  Assigned Operational Zone: <strong className="text-emerald-400">{staffZone}</strong> · Live vehicle: <strong className="text-cyan-400">KA-01-WM-2002</strong>
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
            <StatCard title="My Pending Pickups" value={staffPendingCount} icon={Clock} color="amber" />
            <StatCard title="In Progress Tasks" value={staffInProgressCount} icon={Activity} color="indigo" />
            <StatCard title="Resolved Today" value={staffResolvedCount} icon={CheckCircle2} color="emerald" />
            <StatCard title="Assigned Vehicle" value="KA-01-WM-2002" icon={Truck} color="cyan" />
          </div>

          {/* Row 1: Operational Charts (Task Breakdown & Zone Target Progress) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">Today's Task Status Breakdown</h3>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Active Squad</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={staffTaskBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                    >
                      {staffTaskBreakdown.map((entry, index) => (
                        <Cell key={`staff-cell-${index}`} fill={STAFF_COLORS[index % STAFF_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">Zone Route Collection Progress</h3>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{staffZone}</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={staffZoneProgress}>
                    <XAxis dataKey="target" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="scheduled" name="Scheduled" fill="#64748b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="collected" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2: Assigned Critical Bins & Grievances */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Zone Critical Bins */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-400" /> Bins in Your Zone Needing Pickup
                </h3>
                <span className="text-[11px] text-slate-400">{staffZone}</span>
              </div>
              <div className="space-y-2">
                {staffZoneBins.slice(0, 3).map((bin) => (
                  <div key={bin._id || bin.binId} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-white block">{bin.binId} · {bin.name || bin.location}</span>
                      <p className="text-[11px] text-slate-400">Waste: {bin.wasteType || 'General'} · Fill: <strong className="text-amber-400">{bin.fillLevel}%</strong></p>
                    </div>
                    <button
                      onClick={() => navigate('/collections', { state: { selectedBin: bin } })}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-all"
                    >
                      Collect Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Citizen Grievances */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" /> Assigned Citizen Grievances
                </h3>
                <button onClick={() => navigate('/complaints')} className="text-xs text-purple-400 hover:underline">
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {complaintsList.slice(0, 3).map((cmp) => (
                  <div key={cmp._id || cmp.complaintId} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-white block">{cmp.complaintId} · {cmp.issueType}</span>
                      <p className="text-[11px] text-slate-400">Location: {cmp.location} · <span className="text-emerald-400 font-medium">{cmp.status}</span></p>
                    </div>
                    <button
                      onClick={() => navigate('/complaints')}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-all"
                    >
                      Update
                    </button>
                  </div>
                ))}
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

          {/* Citizen Scoped Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="My Filed Grievances" value={citizenTotal} icon={FileText} color="emerald" />
            <StatCard title="Under Field Action" value={citizenUnderAction} icon={Activity} color="indigo" />
            <StatCard title="Resolved & Verified" value={citizenResolved} icon={CheckCircle2} color="emerald" />
            <StatCard title="Neighborhood Cleanliness" value="94%" icon={Sparkles} color="cyan" />
          </div>

          {/* Row 1: Citizen Visualizations (Personal Grievance Donut & Recycling Impact) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">My Grievance Redressal Status</h3>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">My History</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={citizenStatusBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                    >
                      {citizenStatusBreakdown.map((entry, index) => (
                        <Cell key={`citizen-cell-${index}`} fill={CITIZEN_COLORS[index % CITIZEN_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-teal-400" />
                  <h3 className="font-bold text-sm text-white">Community Recycled & Diverted Waste (kg)</h3>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">This Month</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={citizenRecyclingData} layout="vertical">
                    <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis dataKey="stream" type="category" stroke="#64748b" fontSize={10} tickLine={false} width={130} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="kg" fill="#0d9488" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2: Waste Segregation Guide */}
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
        </>
      )}
    </div>
  );
};

export default DashboardPage;