import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
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
  BarChart2
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

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [criticalBins, setCriticalBins] = useState([]);
  const [allBins, setAllBins] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, binsRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/bins')
      ]);

      if (analyticsRes.data.success) {
        setData(analyticsRes.data);
      }
      if (binsRes.data.success) {
        setAllBins(binsRes.data.data);
        const critical = binsRes.data.data.filter(b => b.fillLevel >= 75);
        setCriticalBins(critical);
      }
    } catch (err) {
      console.warn('Backend offline, loading mock dashboard dataset');
      // Mock Fallback Dataset
      setData({
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
          collectionEfficiency: 88
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
          collectionPerformance: { Completed: 12, Pending: 3, Missed: 1, Delayed: 2 },
          areaWiseWaste: [
            { zone: 'East Zone', quantity: 1450 },
            { zone: 'South Zone', quantity: 1200 },
            { zone: 'Central Zone', quantity: 980 },
            { zone: 'North Zone', quantity: 850 }
          ]
        }
      });
      setCriticalBins([
        { _id: 'b1', binId: 'BIN-101', name: 'Indiranagar 100ft Rd', location: '100 Feet Rd', fillLevel: 94, priorityLevel: 'Critical', zone: 'East Zone', latitude: 12.9784, longitude: 77.6408 },
        { _id: 'b2', binId: 'BIN-102', name: 'Koramangala 5th Block', location: 'Jyoti Nivas Rd', fillLevel: 92, priorityLevel: 'Critical', zone: 'South Zone', latitude: 12.9352, longitude: 77.6245 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loader text="Loading live municipal analytics..." />;

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};

  const statusPieData = [
    { name: 'Empty / Low (0-25%)', value: charts.statusDistribution?.Empty || 6, color: '#10b981' },
    { name: 'Moderate (26-50%)', value: charts.statusDistribution?.Moderate || 5, color: '#3b82f6' },
    { name: 'High (51-75%)', value: charts.statusDistribution?.High || 5, color: '#f59e0b' },
    { name: 'Very High (76-90%)', value: charts.statusDistribution?.VeryHigh || 2, color: '#f97316' },
    { name: 'Critical (>90%)', value: charts.statusDistribution?.Critical || 2, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Welcome back, {user?.name || 'Director'}</h1>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase">
              {user?.role || 'Admin'} Mode
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time municipal waste collection monitoring, IoT bin fill status, and dispatch analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/collections')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <CalendarCheck className="w-4 h-4" /> Schedule Collection
          </button>
          <button
            onClick={() => navigate('/monitoring')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-emerald-400" /> Bin Monitoring
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Bins" value={kpis.totalBins || 20} icon={Trash2} color="emerald" />
        <StatCard title="Critical Bins" value={kpis.overflowingBins || 4} icon={AlertTriangle} color="rose" critical={kpis.overflowingBins > 0} />
        <StatCard title="Needs Attention" value={kpis.requiringAttentionBins || 7} icon={Activity} color="amber" />
        <StatCard title="Today's Collections" value={kpis.todayCollectionsCount || 6} icon={CalendarCheck} color="cyan" />
        <StatCard title="Available Vehicles" value={`${kpis.availableVehicles || 3}/${kpis.totalVehicles || 5}`} icon={Truck} color="indigo" />
        <StatCard title="Efficiency" value={`${kpis.collectionEfficiency || 88}%`} icon={CheckCircle2} color="emerald" trend="up" trendValue="4%" />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Trend (Line Area Chart) */}
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
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="wasteKg" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWaste)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bin Status Distribution (Pie Chart) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-sm text-white">Bin Status Distribution</h3>
            </div>
          </div>

          <div className="h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px]">
            {statusPieData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-slate-300 truncate">{s.name}: <strong>{s.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category & Area Distribution Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Waste Generation by Category (kg)</h3>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.wasteCategoryDistribution || []}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="quantity" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Comparison Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">Area / Zone Waste Comparison (kg)</h3>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.areaWiseWaste || []}>
                <XAxis dataKey="zone" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="quantity" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Bins Alert Feed & GIS Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Bins List */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
              <h3 className="font-bold text-sm text-white">Critical Bins Needing Pickup</h3>
            </div>
            <button 
              onClick={() => navigate('/monitoring')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-80 pr-1">
            {criticalBins.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">All waste bins operating within safe limits.</div>
            ) : (
              criticalBins.map((bin) => (
                <div 
                  key={bin._id || bin.binId} 
                  className="p-3.5 rounded-xl bg-slate-800/60 border border-rose-500/30 flex items-center justify-between hover:border-rose-500/60 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{bin.binId}</span>
                      <Badge status={bin.fillLevel > 90 ? 'Critical' : 'High'}>{bin.fillLevel}%</Badge>
                    </div>
                    <p className="text-xs text-slate-300 font-medium mt-1 truncate max-w-[180px]">{bin.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{bin.location} ({bin.zone})</p>
                  </div>

                  <button
                    onClick={() => navigate('/collections', { state: { selectedBin: bin } })}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors shadow"
                  >
                    Dispatch
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* GIS Map Live Preview */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Live Municipal Waste Map Preview</h3>
            </div>
            <button 
              onClick={() => navigate('/map')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              Full GIS View <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 min-h-[300px]">
            <InteractiveWasteMap 
              bins={allBins} 
              onScheduleCollection={(bin) => navigate('/collections', { state: { selectedBin: bin } })}
              height="300px" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
